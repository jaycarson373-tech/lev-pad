import { address,createNoopSigner,createTransactionMessage,setTransactionMessageFeePayer,setTransactionMessageLifetimeUsingBlockhash,
 appendTransactionMessageInstructions,compileTransaction,getBase64EncodedWireTransaction,getTransactionDecoder,getCompiledTransactionMessageDecoder,
 getU32Encoder,getU64Encoder,compressTransactionMessageUsingAddressLookupTables } from '@solana/kit';
import { findAssociatedTokenPda,getCreateAssociatedTokenIdempotentInstruction } from '@solana-program/token';
import { createHash } from 'node:crypto';
import * as sdk from '../clients/program.mjs';
import { launchConfig,validateLaunch,verifiedProtocol,verifiedDeployment,fetchAccount,decodeOwned,jsonSafe,runtimeSnapshot } from './deployment.mjs';
import { rpc,verifyPumpMint } from './mainnet-read.mjs';
import { managedQuoteInstructions,QUOTE_PROGRAM,ED25519_PROGRAM } from './oracle.mjs';
import { buildAirdrop } from './airdrop.mjs';
import { jupiterBuyback,creatorFeeInstructions,WSOL,CLASSIC_TOKEN } from './revenue.mjs';
import { loadLookupTables,resolvedMessageKeys } from './lookup-tables.mjs';
const COMPUTE='ComputeBudget111111111111111111111111111111';
const ATA='ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
const SYSTEM='11111111111111111111111111111111';
const MAX_U64=(1n<<64n)-1n;
export function baseUnits(input,decimals){
 if(typeof input!=='string'||input.length>60||!/^\d+(\.\d+)?$/.test(input)||!Number.isInteger(decimals)||decimals<0||decimals>18)throw new Error('Enter a positive decimal amount.');
 const [whole,fraction='']=input.split('.');if(fraction.length>decimals)throw new Error(`Maximum ${decimals} decimal places.`);
 const value=BigInt(whole+fraction.padEnd(decimals,'0'));if(value<=0n||value>MAX_U64)throw new Error('Amount is outside supported base-unit range.');return value;
}
const accountAddress=(who,mint,tokenProgram)=>findAssociatedTokenPda({owner:address(who),mint:address(mint),tokenProgram:address(tokenProgram)}).then(p=>p[0]);
const budget=units=>[
 {programAddress:address(COMPUTE),data:new Uint8Array([2,...getU32Encoder().encode(units)])},
 {programAddress:address(COMPUTE),data:new Uint8Array([3,...getU64Encoder().encode(1000n)])},
];
const checkAdmin=(wallet,config)=>{if(wallet!==config.admin)throw new Error('Connect the configured administrator wallet.');};
const cleanU64=value=>{if(typeof value!=='string'||!/^\d+$/.test(value))throw new Error('Use a base-unit integer string.');const n=BigInt(value);if(n>MAX_U64)throw new Error('Integer overflow.');return n;};
export async function buildAction(input,config=launchConfig(),read=rpc,services={}) {
 if(!input||typeof input!=='object'||typeof input.action!=='string')throw Object.assign(new Error('A transaction action and public wallet address are required.'),{status:400});
 const missing=validateLaunch(config);if(missing.length)throw Object.assign(new Error('Mainnet activation is incomplete: '+missing.join('; ')),{status:503});
 const wallet=address(input.wallet),signer=createNoopSigner(wallet),program={programAddress:address(config.programAddress)};
 const setup=input.action==='initialize';
 const live=setup?await verifiedDeployment(config,read):await verifiedProtocol(config,read);
 const protocol=live.protocolAddress,quoteMint=address(config.quoteMint),leverMint=address(config.leverMint);
 const ixs=[],effects=[],artifacts=[];let title=input.action,lookupTableAddresses=[];
 const push=ix=>ixs.push(ix);
 const ata=async(owner,mint,tokenProgram,create=false)=>{const account=await accountAddress(owner,mint,tokenProgram);if(create)push(getCreateAssociatedTokenIdempotentInstruction({payer:signer,ata:account,owner:address(owner),mint:address(mint),tokenProgram:address(tokenProgram)}));return account;};
 const margin=await sdk.findMarginPda({protocol,owner:wallet},program).then(p=>p[0]);
 const userVault=await sdk.findQuoteVaultPda({margin},program).then(p=>p[0]);
 const userQuote=setup?null:await ata(wallet,quoteMint,live.quoteProgram);
 const marketInfo=async()=>{const marketAddress=address(input.market);const m=decodeOwned(await fetchAccount(marketAddress,read),'Market',config.programAddress);if(m.protocol!==protocol||m.quoteMint!==quoteMint)throw new Error('Market does not belong to this protocol');return {marketAddress,m};};
 const reviewed=typeof config.securityReviewUrl==='string'&&config.securityReviewUrl.startsWith('https://')&&typeof config.acceptanceReportUrl==='string'&&config.acceptanceReportUrl.startsWith('https://');
 const custody=()=>{if(!config.custodyEnabled||!reviewed)throw new Error('Public funding is not activated: review and funded acceptance are required.');};
 switch(input.action){
  case 'collect-creator-fees':{
   const claim=await creatorFeeInstructions({wallet,source:input.source,config,live,read});ixs.push(...claim.ixs);effects.push(...claim.effects);title='Collect and route creator fees 50/50';break;
  }
  case 'buyback':{
   if(wallet!==live.protocol.policy.feeDestinations[2])throw Object.assign(new Error('Connect the configured buyback wallet. User collateral is never a buyback source.'),{status:422});
   if(!['xSOL','SOL','WSOL'].includes(input.asset))throw new Error('Choose xSOL, SOL or WSOL for the buyback.');
   const native=input.asset==='SOL',inputMint=address(input.asset==='xSOL'?quoteMint:WSOL),inputProgram=address(input.asset==='xSOL'?live.quoteProgram:CLASSIC_TOKEN);
   const amount=baseUnits(input.amount,input.asset==='xSOL'?live.quoteDecimals:9);
   const inputTokens=await ata(wallet,inputMint,inputProgram,native),leverTokens=await ata(wallet,leverMint,live.leverProgram,true);
   if(native)push(sdk.getWrapBuybackSolInstruction({authority:signer,protocol,wsolTokens:inputTokens,amount},program));
   const [revenue]=await sdk.findRevenuePda({protocol},program);
   const route=await jupiterBuyback({wallet,inputMint,outputMint:leverMint,inputAmount:amount,inputProgram,outputProgram:live.leverProgram,protocol,revenue,slippageBps:Number(input.slippageBps??50),request:services.request??fetch});
   ixs.push(...route.ixs);lookupTableAddresses=route.lookupTableAddresses;
   const burn=sdk.getExecuteBuybackInstruction({authority:signer,protocol,revenue,inputMint,inputTokens,leverMint,leverTokens,inputProgram,leverProgram:address(live.leverProgram),inputAmount:amount,minimumOutput:route.minimumOutput,swapData:route.swapData},program);
   push({...burn,accounts:[...burn.accounts,...route.remainingAccounts]});
   effects.push(`Spend exactly ${input.amount} ${input.asset} from buyback owner ${wallet}.`,`Jupiter routing: acquire at least ${route.minimumOutput} LeverMeme base units, then burn ALL newly acquired tokens atomically. Pre-existing LeverMeme holdings are not burned.`,`Slippage ${Number(input.slippageBps??50)} bps; quoted price impact must be at most 1%. Native rent/setup costs are separate and previewed. A failed swap or burn reverts the entire action.`);title='Atomic LeverMeme buyback & burn';break;
  }
  case 'initialize':{
   checkAdmin(wallet,config);if(await fetchAccount(protocol,read))throw new Error('Protocol is already initialized.');
   const policy={burnAmount:cleanU64(input.burnAmount),minSolLamports:cleanU64(input.minSolLamports),feeBps:Number(input.feeBps),feeShares:[7500,1000,500,1000],feeDestinations:input.feeDestinations?.map(address)};
   if(!policy.burnAmount||!policy.minSolLamports||!Number.isInteger(policy.feeBps)||policy.feeBps<0||policy.feeBps>100||policy.feeDestinations?.length!==3||new Set(policy.feeDestinations).size!==3)throw new Error('Review the burn, minimum liquidity, fee rate and three distinct recipient owners.');
   push(await sdk.getInitializeProtocolInstructionAsync({admin:signer,protocol,leverMint,quoteMint,policy},program));effects.push('Create protocol configuration, initially paused. Both token origins are verified on pump.fun. Recipient owners and policies become immutable.');break;
  }
  case 'pause':checkAdmin(wallet,config);push(sdk.getSetPausedInstruction({admin:signer,protocol,paused:input.paused===true},program));effects.push(input.paused?'Block new listing burns, deposits and positions; exits remain available.':'Allow admissions/deposits, subject to the independent website activation gates.');break;
  case 'open-margin':custody();push(await sdk.getOpenMarginAccountInstructionAsync({owner:signer,protocol,quoteMint,quoteProgram:address(live.quoteProgram)},program));effects.push('Create your segregated collateral account and vault.');break;
  case 'deposit':{
   custody();const amount=baseUnits(input.amount,live.quoteDecimals);
   if(!await fetchAccount(margin,read))push(await sdk.getOpenMarginAccountInstructionAsync({owner:signer,protocol,quoteMint,quoteProgram:address(live.quoteProgram)},program));
   push(sdk.getDepositInstruction({owner:signer,protocol,margin,quoteMint,source:userQuote,quoteVault:userVault,quoteProgram:address(live.quoteProgram),amount},program));effects.push(`Move ${input.amount} xSOL (${quoteMint}) to your collateral vault ${userVault}.`);break;
  }
  case 'withdraw':{
   const amount=baseUnits(input.amount,live.quoteDecimals);await ata(wallet,quoteMint,live.quoteProgram,true);
   push(sdk.getWithdrawInstruction({owner:signer,protocol,margin,quoteMint,destination:userQuote,quoteVault:userVault,quoteProgram:address(live.quoteProgram),amount},program));effects.push(`Return ${input.amount} available xSOL to your wallet. Locked position collateral cannot be withdrawn.`);break;
  }
  case 'permit':{
   checkAdmin(wallet,config);const verified=await verifyPumpMint(input.mint,read),lister=address(input.lister),baseMint=address(verified.mint);
   const [permit]=await sdk.findPermitPda({protocol,baseMint,lister},program);
   const until=BigInt(Math.floor(Date.now()/1000)+86400);
   if(await fetchAccount(permit,read))push(sdk.getSetListingPermitExpiryInstruction({admin:signer,protocol,permit,expiresAt:until},program));
   else push(await sdk.getApproveListingPermitInstructionAsync({admin:signer,protocol,baseMint,lister,expiresAt:until},program));
   effects.push(`Authorize ${lister} to request listing ${baseMint} for 24 hours. No user assets move.`);break;
  }
  case 'list':{
   custody();const verified=await verifyPumpMint(input.mint,read),baseMint=address(verified.mint),baseAccount=await fetchAccount(baseMint,read);
   const baseProgram=address(baseAccount.owner),baseSource=await ata(wallet,baseMint,baseProgram),leverSource=await ata(wallet,leverMint,live.leverProgram);
   const solLamports=baseUnits(input.sol,9),tokenAmount=baseUnits(input.tokens,verified.decimals);
   push(await sdk.getRequestListingInstructionAsync({lister:signer,protocol,baseMint,pumpCurve:address(verified.curve),leverMint,leverSource,baseSource,leverProgram:address(live.leverProgram),baseProgram,solLamports,tokenAmount},program));
   effects.push(`Permanently burn ${live.protocol.policy.burnAmount} LeverMeme base units.`, `Escrow ${input.sol} SOL and ${input.tokens} units of ${baseMint}.`, 'Requires your operator-issued listing permit. This request does not automatically open trading.');break;
  }
  case 'cancel-listing':{
   const listingAddress=address(input.listing),l=decodeOwned(await fetchAccount(listingAddress,read),'Listing',config.programAddress);
   if(l.protocol!==protocol||l.lister!==wallet)throw new Error('Only the recorded lister can cancel.');
   const mint=await fetchAccount(l.baseMint,read),destination=await ata(wallet,l.baseMint,mint.owner,true);
   push(sdk.getCancelListingInstruction({lister:signer,protocol,listing:listingAddress,baseMint:l.baseMint,baseVault:l.baseVault,baseDestination:destination,baseProgram:address(mint.owner)},program));effects.push('Reclaim recorded SOL/token escrow. Burned LeverMeme is not refunded. Active market escrow cannot be removed.');break;
  }
  case 'approve-listing':checkAdmin(wallet,config);push(sdk.getSetListingApprovedInstruction({admin:signer,protocol,listing:address(input.listing),approved:input.approved===true},program));effects.push('Change the funded listing review decision. This does not enable a market.');break;
  case 'create-market':{
   checkAdmin(wallet,config);const risk={...input.risk};for(const k of ['maxPriceAgeSlots','maxOpenInterest','maxPositionNotional','minimumMargin','minimumLiquidity','emergencyDelaySeconds'])risk[k]=cleanU64(String(risk[k]));
   for(const k of ['feedHash','twapHash']){if(!/^[0-9a-f]{64}$/i.test(risk[k]??''))throw new Error('Oracle feed hashes must be 32-byte hex.');risk[k]=new Uint8Array(Buffer.from(risk[k],'hex'));}risk.queue=address(risk.queue);
   push(await sdk.getCreateMarketInstructionAsync({admin:signer,protocol,listing:address(input.listing),quoteMint,quoteProgram:address(live.quoteProgram),risk},program));effects.push('Create a disabled market with immutable oracle identities, risk limits, payout cap and outage policy. No capital is deposited by this action.');break;
  }
  case 'market-enabled':case 'retire-market':{
   checkAdmin(wallet,config);const {marketAddress,m}=await marketInfo();
   push(input.action==='retire-market'?sdk.getRetireMarketInstruction({admin:signer,protocol,listing:m.listing,market:marketAddress},program):sdk.getSetMarketEnabledInstruction({admin:signer,protocol,listing:m.listing,market:marketAddress,enabled:input.enabled===true},program));effects.push(input.action==='retire-market'?'Permanently retire an empty, disabled market and release listing escrow.':'Change admission of new positions. Existing positions remain settleable.');break;
  }
  case 'fund-market':case 'withdraw-liquidity':{
   const {marketAddress,m}=await marketInfo();if(m.lister!==wallet)throw new Error('Only the recorded market lister can manage this liquidity.');
   const amount=baseUnits(input.amount,live.quoteDecimals);if(input.action==='withdraw-liquidity')await ata(wallet,quoteMint,live.quoteProgram,true);
   const accounts={lister:signer,protocol,market:marketAddress,quoteMint,marketVault:m.quoteVault,listerTokens:userQuote,quoteProgram:address(live.quoteProgram),amount};
   push(input.action==='fund-market'?sdk.getFundMarketInstruction(accounts,program):sdk.getWithdrawMarketLiquidityInstruction(accounts,program));effects.push(`${input.action==='fund-market'?'Add':'Withdraw unreserved'} ${input.amount} xSOL market liquidity. Reserved profit backing is never withdrawable.`);break;
  }
  case 'open-position':{
   custody();if(!config.tradingEnabled)throw new Error('Public trading is not activated.');
   const {marketAddress,m}=await marketInfo(),marginData=decodeOwned(await fetchAccount(margin,read),'MarginAccount',config.programAddress);
   const collateral=baseUnits(input.amount,live.quoteDecimals),leverage=Number(input.leverage),long=input.long===true;
   const shift=(m.price*BigInt(m.risk.spreadBps)+9999n)/10000n,expectedPrice=long?m.price+shift:(m.price>shift?m.price-shift:1n);
   const slippageBps=Number(input.slippageBps);if(!Number.isInteger(slippageBps)||slippageBps<0||slippageBps>100)throw new Error('Slippage must be 0–100 basis points.');
   const profit=(collateral*BigInt(m.risk.maxProfitBps)/10000n)<(collateral*BigInt(leverage))?(collateral*BigInt(m.risk.maxProfitBps)/10000n):(collateral*BigInt(leverage));
   push(await sdk.getOpenPositionInstructionAsync({owner:signer,protocol,listing:m.listing,market:marketAddress,margin,quoteMint,userVault,marketVault:m.quoteVault,quoteProgram:address(live.quoteProgram),id:marginData.nextPositionId,collateral,leverage,long,expectedPrice,slippageBps},program));
   effects.push(`${long?'Long':'Short'} ${leverage}×, isolated margin ${input.amount} xSOL.`,`Maximum profit ${profit} xSOL base units (before fees); total loss is capped at isolated margin plus paid fees.`,`Entry limit ${expectedPrice} / 10^12 xSOL per token, tolerance ${slippageBps} bps.`,`Outage settlement uses the last verified price after ${m.risk.emergencyDelaySeconds} seconds without an accepted update. No perpetual funding payments.`);break;
  }
  case 'settle-position':{
   const positionAddress=address(input.position),p=decodeOwned(await fetchAccount(positionAddress,read),'Position',config.programAddress);
   const m=decodeOwned(await fetchAccount(p.market,read),'Market',config.programAddress);if(m.protocol!==protocol)throw new Error('Position protocol mismatch');
   const marginState=decodeOwned(await fetchAccount(p.marginAccount,read),'MarginAccount',config.programAddress);
   const actorTokens=await ata(wallet,quoteMint,live.quoteProgram,true);
   const shift=(m.price*BigInt(m.risk.spreadBps)+9999n)/10000n,expectedPrice=p.long?(m.price>shift?m.price-shift:1n):m.price+shift;
   const reason=Number(input.reason??0);if(!Number.isInteger(reason)||reason<0||reason>3)throw new Error('Invalid settlement reason.');
   push(sdk.getSettlePositionInstruction({actor:signer,protocol,market:p.market,margin:p.marginAccount,position:positionAddress,quoteMint,userVault:marginState.vault,marketVault:m.quoteVault,actorTokens,quoteProgram:address(live.quoteProgram),reason,expectedPrice,slippageBps:Number(input.slippageBps??50)},program));
   effects.push(reason===0?'Close your position and return net settlement to your collateral vault.':reason===1?'Liquidate only if on-chain maintenance conditions are breached.':reason===2?'Settle only if the funded profit cap is reached.':'Settle at the last verified price only after the immutable oracle outage delay.');break;
  }
  case 'collect-fees':{
   const {marketAddress,m}=await marketInfo(),listing=decodeOwned(await fetchAccount(m.listing,read),'Listing',config.programAddress);
   const owners=[...live.protocol.policy.feeDestinations];const treasury=await ata(owners[0],quoteMint,live.quoteProgram,true),campaignFund=await ata(owners[1],quoteMint,live.quoteProgram,true),creator=await ata(listing.lister,quoteMint,live.quoteProgram,true),buybackFund=await ata(owners[2],quoteMint,live.quoteProgram,true);
   push(sdk.getCollectMarketFeesInstruction({protocol,listing:m.listing,market:marketAddress,quoteMint,marketVault:m.quoteVault,treasury,campaignFund,creator,buybackFund,quoteProgram:address(live.quoteProgram)},program));effects.push('Distribute actual accrued trading fees at 75/10/5/10 to the immutable recipient owners. A buyback allocation is not yet an executed swap/burn.');break;
  }
  case 'refresh-price':{
   const {marketAddress,m}=await marketInfo();
   const quote=await managedQuoteInstructions({risk:m.risk,payer:wallet,instructionIndex:2});
   ixs.push(...quote.instructions);
   push(sdk.getRefreshMarketPriceInstruction({protocol,market:marketAddress,queue:m.risk.queue,oracle:quote.oracle,slotHashes:address('SysvarS1otHashes111111111111111111111111111'),instructions:address('Sysvar1nstructions1111111111111111111111111')},program));
   effects.push('Verify enclave signatures in Solana’s Ed25519 precompile, publish a managed oracle quote and refresh the market only if quorum, feed identity, freshness and TWAP checks pass. Account creation rent may apply.');break;
  }
  case 'create-airdrop':{
   checkAdmin(wallet,config);const [campaign]=await sdk.findCampaignPda({protocol},program);
   const manifest=buildAirdrop(campaign,input.entries,String(live.protocol.initialSupply));
   const source=await ata(wallet,leverMint,live.leverProgram);
   const startsAt=BigInt(Math.floor(Date.now()/1000)+120),endsAt=startsAt+604800n;
   push(await sdk.getCreateAirdropInstructionAsync({admin:signer,protocol,leverMint,source,leverProgram:address(live.leverProgram),root:new Uint8Array(Buffer.from(manifest.root,'hex')),startsAt,endsAt},program));
   artifacts.push({name:'levermeme-airdrop-manifest.json',content:JSON.stringify({...manifest,startsAt:String(startsAt),endsAt:String(endsAt)},null,2)});
   effects.push(`Fund exactly ${manifest.total} LeverMeme base units (10% of the immutable initial supply checkpoint).`,`Claims open at ${new Date(Number(startsAt)*1000).toISOString()} for seven days. Publish the manifest. Unclaimed funds can be reclaimed only after expiry.`);break;
  }
  case 'claim-airdrop':{
   const [campaign]=await sdk.findCampaignPda({protocol},program),destination=await ata(wallet,leverMint,live.leverProgram,true);
   if(!Array.isArray(input.proof)||input.proof.length>24||input.proof.some(p=>! /^[0-9a-f]{64}$/i.test(p)))throw new Error('Invalid Merkle proof');
   push(await sdk.getClaimAirdropInstructionAsync({owner:signer,protocol,campaign,leverMint,destination,leverProgram:address(live.leverProgram),index:cleanU64(input.index),amount:cleanU64(input.amount),proof:input.proof.map(p=>new Uint8Array(Buffer.from(p,'hex')))},program));
   effects.push(`Claim ${input.amount} LeverMeme base units to your own token account. The funded root, claim window and one-claim-per-wallet rule are verified on chain.`);break;
  }
  case 'reclaim-airdrop':{
   checkAdmin(wallet,config);const [campaign]=await sdk.findCampaignPda({protocol},program),destination=await ata(wallet,leverMint,live.leverProgram,true);
   push(await sdk.getReclaimAirdropInstructionAsync({admin:signer,protocol,campaign,leverMint,destination,leverProgram:address(live.leverProgram)},program));effects.push('Reclaim unclaimed airdrop tokens only after the published campaign ends.');break;
  }
  default:throw new Error('Unsupported action.');
 }
 return {wallet,ixs,effects,title,config,protocolAddress:protocol,artifacts,lookupTableAddresses};
}
export async function prepareAction(input,config=launchConfig(),read=rpc,services={}) {
 const plan=await buildAction(input,config,read,services);
 const tables=await loadLookupTables(plan.lookupTableAddresses,read);
 const latest=await read('getLatestBlockhash',[{commitment:'confirmed'}]);
 if(!latest?.value?.blockhash||!Number.isSafeInteger(latest.value.lastValidBlockHeight))throw new Error('Invalid blockhash response');
 const make=units=>compileTransaction(compressTransactionMessageUsingAddressLookupTables(appendTransactionMessageInstructions([...budget(units),...plan.ixs],setTransactionMessageLifetimeUsingBlockhash({blockhash:latest.value.blockhash,lastValidBlockHeight:BigInt(latest.value.lastValidBlockHeight)},setTransactionMessageFeePayer(plan.wallet,createTransactionMessage({version:0})))),tables));
 let transaction=make(1200000),wire=getBase64EncodedWireTransaction(transaction);
 const before=await read('getBalance',[plan.wallet,{commitment:'confirmed'}]);
 const simulation=await read('simulateTransaction',[wire,{encoding:'base64',commitment:'confirmed',sigVerify:false,accounts:{encoding:'base64',addresses:[plan.wallet]}}]);
 if(simulation?.value?.err)throw Object.assign(new Error('Simulation rejected this action. No signature requested.'),{status:422,simulation:simulation.value});
 if(!Number.isSafeInteger(simulation?.value?.unitsConsumed)||simulation.value.unitsConsumed>1000000)throw new Error('Simulation compute budget unavailable or excessive');
 transaction=make(Math.max(100000,Math.ceil(simulation.value.unitsConsumed*1.25)));wire=getBase64EncodedWireTransaction(transaction);
 if(Buffer.from(wire,'base64').length>1232)throw new Error('Transaction is too large; split account setup from this action.');
 const fee=await read('getFeeForMessage',[Buffer.from(transaction.messageBytes).toString('base64'),{commitment:'confirmed'}]);
 if(!Number.isSafeInteger(fee?.value)||fee.value<0)throw new Error('Transaction fee estimate unavailable');
 const after=simulation.value.accounts?.[0]?.lamports;
 if(!Number.isSafeInteger(before?.value)||!Number.isSafeInteger(after)||before.value<0||after<0)throw new Error('Unable to preview native SOL costs and account rent');
 const debit=BigInt(Math.max(0,before.value-after))+BigInt(fee.value);
 return {network:'solana:mainnet',programAddress:config.programAddress,protocolAddress:plan.protocolAddress,wallet:plan.wallet,title:plan.title,effects:plan.effects,
  wire,lastValidBlockHeight:latest.value.lastValidBlockHeight,messageHash:createHash('sha256').update(transaction.messageBytes).digest('hex'),
  artifacts:plan.artifacts,estimatedWalletSolDebitLamports:String(debit),estimatedNetworkFeeLamports:String(fee.value),simulation:{err:null,unitsConsumed:simulation.value.unitsConsumed},warning:'Conservative SOL debit estimate includes simulated rent/funding and an extra network fee allowance. Simulation is not a guarantee of future execution.'};
}
export function inspectWire(wire,config,tables={}) {
 if(typeof wire!=='string'||wire.length>1800||!/^[A-Za-z0-9+/]+=*$/.test(wire))throw new Error('Invalid transaction encoding');
 const bytes=Buffer.from(wire,'base64');if(bytes.length>1232)throw new Error('Transaction too large');
 const tx=getTransactionDecoder().decode(bytes),message=getCompiledTransactionMessageDecoder().decode(tx.messageBytes);
 const keys=resolvedMessageKeys(message,tables),allowed=new Set([config.programAddress,COMPUTE,ATA]);let own=false;
 const crank=message.instructions.some(ix=>keys[ix.programAddressIndex]===config.programAddress&&ix.data&&Buffer.from(ix.data).subarray(0,8).equals(Buffer.from(sdk.REFRESH_MARKET_PRICE_DISCRIMINATOR)));
 if(crank){allowed.add(QUOTE_PROGRAM);allowed.add(ED25519_PROGRAM);}
 for(const ix of message.instructions){const program=keys[ix.programAddressIndex];if(!allowed.has(program))throw new Error('Transaction invokes an unapproved program');if(program===config.programAddress)own=true;}
 if(!own)throw new Error('Transaction does not invoke LeverMeme');
 return tx;
}
export async function submitTransaction(wire,config=launchConfig(),read=rpc) {
 const deployment=await verifiedDeployment(config,read);
 if(typeof wire!=='string'||wire.length>1800||!/^[A-Za-z0-9+/]+=*$/.test(wire))throw new Error('Invalid transaction encoding');
 const initial=getTransactionDecoder().decode(Buffer.from(wire,'base64')),message=getCompiledTransactionMessageDecoder().decode(initial.messageBytes);
 const tables=await loadLookupTables((message.addressTableLookups??[]).map(l=>l.lookupTableAddress),read);
 const tx=inspectWire(wire,config,tables),keys=resolvedMessageKeys(message,tables);
 for(const ix of message.instructions)if(keys[ix.programAddressIndex]===config.programAddress&&!Array.from(ix.accountIndices??[]).some(i=>keys[i]===deployment.protocolAddress))throw new Error('Transaction protocol namespace mismatch');
 if(Object.values(tx.signatures).some(sig=>!sig||sig.every(byte=>byte===0)))throw new Error('Missing wallet signature');
 const sim=await read('simulateTransaction',[wire,{encoding:'base64',sigVerify:true,commitment:'confirmed'}]);
 if(sim?.value?.err)throw Object.assign(new Error('Signed transaction simulation failed; it was not submitted.'),{status:422});
 return {signature:await read('sendTransaction',[wire,{encoding:'base64',skipPreflight:false,preflightCommitment:'confirmed',maxRetries:3}])};
}
