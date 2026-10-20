import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { address, getAddressEncoder, getAddressDecoder, getProgramDerivedAddress, getBase58Decoder } from '@solana/kit';
import * as sdk from '../clients/program.mjs';
import { mainnetRpc, rpc, TOKEN_PROGRAMS } from './mainnet-read.mjs';
const LOADER='BPFLoaderUpgradeab1e11111111111111111111111';
const TEMPLATE='Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t';
const encoder=getAddressEncoder(),decoder=getAddressDecoder();
export const jsonSafe=value=>JSON.parse(JSON.stringify(value,(_,v)=>typeof v==='bigint'?String(v):v instanceof Uint8Array?Array.from(v):v));
export function launchConfig() {
  const input=process.env.LEVERMEME_LAUNCH_CONFIG;
  return input?JSON.parse(input):JSON.parse(readFileSync(new URL('../config/launch.json',import.meta.url),'utf8'));
}
export function validateLaunch(config) {
  const errors=[];
  if(config.network!=='solana:mainnet')errors.push('network must be solana:mainnet');
  for(const field of ['programAddress','admin','leverMint','quoteMint'])try{address(config[field]);}catch{errors.push(`${field} is not configured`);}
  if(config.programAddress===TEMPLATE)errors.push('Template program address is not a deployment');
  if(config.leverMint===config.quoteMint&&config.leverMint)errors.push('LeverMeme and xSOL must be distinct mints');
  if(!/^[a-f0-9]{64}$/.test(config.programSha256??''))errors.push('Reviewed program SHA-256 is missing');
  if(!Number.isSafeInteger(config.programSize)||config.programSize<100||config.programSize>2_000_000)errors.push('Reviewed artifact byte size is missing');
  if(config.upgradeAuthority!==null)try{address(config.upgradeAuthority);}catch{errors.push('Upgrade authority must be a public address or null for immutable');}
  for(const key of Object.keys(config))if(/private|secret|seed|keypair/i.test(key))errors.push('Private signing material is forbidden in launch configuration');
  return errors;
}
const accountBytes=account=>{
  if(!account||account.data?.[1]!=='base64')throw new Error('Expected a base64 on-chain account');
  return Buffer.from(account.data[0],'base64');
};
export function decodeOwned(account,type,program) {
  if(!account||account.executable||account.owner!==program)throw new Error(`Invalid ${type} account owner`);
  const data=accountBytes(account),disc=sdk[`${type.replace(/[A-Z]/g,(c,i)=>(i?'_':'')+c).toUpperCase()}_DISCRIMINATOR`];
  if(!disc||!data.subarray(0,disc.length).equals(Buffer.from(disc)))throw new Error(`Invalid ${type} discriminator`);
  return sdk[`get${type}Decoder`]().decode(data);
}
export async function fetchAccount(key,read=rpc) {
  const response=await read('getAccountInfo',[key,{encoding:'base64',commitment:'confirmed'}]);
  if(!Number.isSafeInteger(response?.context?.slot))throw new Error('Invalid RPC response slot');
  return response.value;
}
export async function verifiedDeployment(config=launchConfig(),read=rpc) {
  const errors=validateLaunch(config);if(errors.length)throw Object.assign(new Error(errors.join('; ')),{status:503});
  await mainnetRpc(read);
  const program=await fetchAccount(config.programAddress,read),programBytes=accountBytes(program);
  if(!program.executable||program.owner!==LOADER||programBytes.length!==36||programBytes.readUInt32LE(0)!==2)throw new Error('Program is not an upgradeable-loader deployment');
  const dataAddress=decoder.decode(programBytes.subarray(4,36));
  const [expectedData]=await getProgramDerivedAddress({programAddress:address(LOADER),seeds:[encoder.encode(address(config.programAddress))]});
  if(dataAddress!==expectedData)throw new Error('ProgramData address mismatch');
  const dataAccount=await fetchAccount(dataAddress,read),data=accountBytes(dataAccount);
  if(dataAccount.owner!==LOADER||dataAccount.executable||data.length<45+config.programSize||data.readUInt32LE(0)!==3||![0,1].includes(data[12]))throw new Error('Invalid ProgramData account');
  const authority=data[12]===1?decoder.decode(data.subarray(13,45)):null;
  if(authority!==config.upgradeAuthority)throw new Error('Program upgrade authority does not match launch policy');
  const digest=createHash('sha256').update(data.subarray(45,45+config.programSize)).digest('hex');
  if(digest!==config.programSha256||data.subarray(45+config.programSize).some(byte=>byte!==0))throw new Error('Deployed program bytecode does not match reviewed artifact');
  const [protocolAddress]=await sdk.findProtocolPda({admin:address(config.admin)},{programAddress:address(config.programAddress)});
  return {config,protocolAddress,programDataAddress:dataAddress,upgradeAuthority:authority,deployedSlot:data.readBigUInt64LE(4)};
}
export async function verifiedProtocol(config=launchConfig(),read=rpc) {
  const deployment=await verifiedDeployment(config,read);
  const protocol=decodeOwned(await fetchAccount(deployment.protocolAddress,read),'Protocol',config.programAddress);
  if(protocol.version!==3||protocol.admin!==config.admin||protocol.leverMint!==config.leverMint||protocol.quoteMint!==config.quoteMint
      ||protocol.policy.feeShares.join(',')!=='7500,1000,500,1000')throw new Error('Protocol identity/version/economics do not match configuration');
  const [lever,quote]=await Promise.all([fetchAccount(config.leverMint,read),fetchAccount(config.quoteMint,read)]);
  for(const mint of [lever,quote]){
    if(!TOKEN_PROGRAMS.has(mint?.owner)||mint.executable)throw new Error('Mint program rejected');
    const bytes=accountBytes(mint);
    if(bytes.length<82||bytes[45]!==1||bytes.readUInt32LE(0)!==0||bytes.readUInt32LE(46)!==0)throw new Error('Mint authority/freeze/initialization rejected');
    // Mirror the contract's metadata-only Token-2022 extension policy.
    if(bytes.length>82){
      if(bytes.length<166||bytes[165]!==1)throw new Error('Token-2022 mint layout rejected');
      let at=166;while(at+4<=bytes.length){const type=bytes.readUInt16LE(at),len=bytes.readUInt16LE(at+2);if(type===0)break;
        if(![18,19].includes(type)||at+4+len>bytes.length)throw new Error('Unsafe Token-2022 extension');at+=4+len;}
    }
  }
  return {...deployment,protocol,leverDecimals:accountBytes(lever)[44],quoteDecimals:accountBytes(quote)[44],leverProgram:lever.owner,quoteProgram:quote.owner};
}
export async function programAccounts(type,protocolAddress,programAddress,read=rpc) {
  const disc=sdk[`${type.replace(/[A-Z]/g,(c,i)=>(i?'_':'')+c).toUpperCase()}_DISCRIMINATOR`];
  const records=await read('getProgramAccounts',[programAddress,{encoding:'base64',commitment:'confirmed',filters:[
    {memcmp:{offset:0,bytes:getBase58Decoder().decode(disc)}},...(protocolAddress?[{memcmp:{offset:8,bytes:protocolAddress}}]:[])
  ]}]);
  if(!Array.isArray(records)||records.length>2000)throw new Error('Account index exceeds launch scan limit; configure a production indexer');
  return records.map(record=>({address:address(record.pubkey),...decodeOwned(record.account,type,programAddress)}));
}
export async function runtimeSnapshot(wallet,config=launchConfig(),read=rpc) {
  const errors=validateLaunch(config);
  if(errors.length)return {configured:false,network:'solana:mainnet',blockers:errors,markets:[],listings:[],positions:[],custodyEnabled:false,tradingEnabled:false};
  const deployment=await verifiedDeployment(config,read);
  if(!await fetchAccount(deployment.protocolAddress,read))return {configured:true,phase:'uninitialized',network:config.network,
    programAddress:config.programAddress,admin:config.admin,leverMint:config.leverMint,quoteMint:config.quoteMint,
    protocolAddress:deployment.protocolAddress,blockers:['Initialize the reviewed protocol from the configured operator wallet.'],
    markets:[],listings:[],positions:[],permits:[],custodyEnabled:false,tradingEnabled:false};
  const live=await verifiedProtocol(config,read),program=address(config.programAddress);
  const [listings,allMarkets,slot]=await Promise.all([programAccounts('Listing',live.protocolAddress,program,read),programAccounts('Market',live.protocolAddress,program,read),read('getSlot',[{commitment:'confirmed'}])]);
  if(!Number.isSafeInteger(slot))throw new Error('Invalid current slot');
  const listingMap=new Map(listings.map(l=>[l.address,l]));
  const markets=allMarkets.map(m=>{
    const listing=listingMap.get(m.listing);if(!listing||listing.lister!==m.lister||m.quoteMint!==config.quoteMint)throw new Error('Market registry binding mismatch');
    return {...m,baseMint:listing.baseMint,approved:listing.approved&&!listing.cancelled,
      priceFresh:m.price>0n&&m.priceSlot<=BigInt(slot)&&BigInt(slot)-m.priceSlot<=m.risk.maxPriceAgeSlots};
  });
  const [campaignAddress]=await sdk.findCampaignPda({protocol:live.protocolAddress},{programAddress:program});
  const campaignAccount=await fetchAccount(campaignAddress,read);
  const airdrop=campaignAccount?{address:campaignAddress,...decodeOwned(campaignAccount,'AirdropCampaign',program)}:null;
  if(airdrop&&airdrop.protocol!==live.protocolAddress)throw new Error('Airdrop namespace mismatch');
  const [revenueAddress]=await sdk.findRevenuePda({protocol:live.protocolAddress},{programAddress:program});
  const revenueAccount=await fetchAccount(revenueAddress,read);
  if(!revenueAccount)throw new Error('Protocol v3 revenue ledger is missing; state verification failed.');
  const revenue=revenueAccount?{address:revenueAddress,...decodeOwned(revenueAccount,'RevenueLedger',program)}:null;
  if(revenue&&revenue.protocol!==live.protocolAddress)throw new Error('Revenue namespace mismatch');
  let margin=null,positions=[],permits=[];
  if(wallet){
    const who=address(wallet);
    const [marginAddress]=await sdk.findMarginPda({protocol:live.protocolAddress,owner:who},{programAddress:program});
    const raw=await fetchAccount(marginAddress,read);
    if(raw){const data=decodeOwned(raw,'MarginAccount',program);if(data.owner!==who||data.protocol!==live.protocolAddress)throw new Error('Collateral owner mismatch');margin={address:marginAddress,...data};}
    const allPositions=await programAccounts('Position',null,program,read);
    positions=allPositions.filter(p=>p.owner===who&&(!margin||p.marginAccount===margin.address)&&markets.some(m=>m.address===p.market));
    permits=(await programAccounts('ListingPermit',live.protocolAddress,program,read)).filter(p=>p.lister===who);
  }
  const reviewed=typeof config.securityReviewUrl==='string'&&config.securityReviewUrl.startsWith('https://')&&typeof config.acceptanceReportUrl==='string'&&config.acceptanceReportUrl.startsWith('https://');
  return jsonSafe({configured:true,network:config.network,programAddress:program,protocolAddress:live.protocolAddress,admin:config.admin,
    leverMint:config.leverMint,quoteMint:config.quoteMint,leverDecimals:live.leverDecimals,quoteDecimals:live.quoteDecimals,
    artifact:{sha256:config.programSha256,byteLength:config.programSize,upgradeAuthority:config.upgradeAuthority},
    leverProgram:live.leverProgram,quoteProgram:live.quoteProgram,protocol:live.protocol,slot,
    custodyEnabled:config.custodyEnabled===true&&reviewed,tradingEnabled:config.tradingEnabled===true&&reviewed,
    blockers:reviewed?[]:['Security review and funded acceptance report are not recorded'],markets,listings,margin,positions,permits,airdrop,revenue});
}
