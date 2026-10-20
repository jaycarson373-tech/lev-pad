// Official references: idl/external/pump*.json and Jupiter Swap API V2 /build.
// HTTP quotes are untrusted: the deployed consumer enforces actual token deltas.
import { address,createNoopSigner,getAddressEncoder,getAddressDecoder,getProgramDerivedAddress } from '@solana/kit';
import { findAssociatedTokenPda,getCreateAssociatedTokenIdempotentInstruction } from '@solana-program/token';
import * as sdk from '../clients/program.mjs';
import { fetchAccount } from './deployment.mjs';
import { rpc,PUMP_PROGRAM,TOKEN_PROGRAMS,CURVE_DISCRIMINATOR } from './mainnet-read.mjs';
export const JUPITER_PROGRAM='JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4';
export const PUMP_AMM_PROGRAM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';
export const WSOL='So11111111111111111111111111111111111111112';
export const CLASSIC_TOKEN='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
const SYSTEM='11111111111111111111111111111111',ATA='ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
const enc=getAddressEncoder(),dec=getAddressDecoder(),u64max=(1n<<64n)-1n;
const units=value=>{if(typeof value!=='string'||!/^\d{1,20}$/.test(value))throw new Error('Invalid router token units');const n=BigInt(value);if(n<=0n||n>u64max)throw new Error('Router amount outside u64');return n;};
const pda=(program,seeds)=>getProgramDerivedAddress({programAddress:address(program),seeds}).then(x=>x[0]);
const seed=text=>new TextEncoder().encode(text);
const ata=(owner,mint,tokenProgram)=>findAssociatedTokenPda({owner:address(owner),mint:address(mint),tokenProgram:address(tokenProgram)}).then(x=>x[0]);
const raw=(account,owner,min)=>{if(!account||account.owner!==owner||account.executable||account.data?.[1]!=='base64')throw new Error('External account owner rejected');const b=Buffer.from(account.data[0],'base64');if(b.length<min)throw new Error('External account layout rejected');return b;};
export async function boundedProviderJson(response,maximum=256000){
 if(!response.ok)throw Object.assign(new Error('Swap/oracle provider unavailable. No signature requested.'),{status:503});
 const reader=response.body.getReader();let size=0;const chunks=[];
 try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>maximum)throw new Error('Provider response too large');chunks.push(Buffer.from(value));}}finally{await reader.cancel().catch(()=>{});}
 return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
export async function jupiterBuyback({wallet,inputMint,outputMint,inputAmount,inputProgram,outputProgram,protocol,revenue,slippageBps=50,request=fetch}){
 address(wallet);address(inputMint);address(outputMint);
 if(!Number.isInteger(slippageBps)||slippageBps<1||slippageBps>100||inputAmount<=0n||inputAmount>u64max)throw new Error('Buyback amount or slippage rejected');
 const inputTokens=await ata(wallet,inputMint,inputProgram),outputTokens=await ata(wallet,outputMint,outputProgram),signer=createNoopSigner(address(wallet));
 const url=new URL('https://api.jup.ag/swap/v2/build');url.search=new URLSearchParams({inputMint,outputMint,amount:String(inputAmount),taker:wallet,slippageBps:String(slippageBps),wrapAndUnwrapSol:'false',destinationTokenAccount:outputTokens,maxAccounts:'32',transactionVersion:'0'}).toString();
 const response=await boundedProviderJson(await request(url,{headers:process.env.JUPITER_API_KEY?{'x-api-key':process.env.JUPITER_API_KEY}:{},signal:AbortSignal.timeout(12000),redirect:'error'}));
 if(response.inputMint!==inputMint||response.outputMint!==outputMint||response.inAmount!==String(inputAmount)||response.swapMode!=='ExactIn'||response.slippageBps!==slippageBps)throw new Error('Router substituted the requested swap');
 const out=units(response.outAmount),minimum=units(response.otherAmountThreshold);
 if(minimum>out||minimum<out*BigInt(10000-slippageBps)/10000n)throw new Error('Router weakened minimum output');
 if(typeof response.priceImpactPct!=='string'||! /^-?\d+(\.\d+)?$/.test(response.priceImpactPct)||response.priceImpactPct.length>30||Math.abs(Number(response.priceImpactPct))>0.01)throw new Error('Buyback price impact exceeds 1%');
 if(!Array.isArray(response.routePlan)||response.routePlan.length<1||response.routePlan.length>4||response.cleanupInstruction||response.tipInstruction||response.otherInstructions?.length)throw new Error('Unsupported router side instructions');
 const swap=response.swapInstruction;
 if(swap?.programId!==JUPITER_PROGRAM||!Array.isArray(swap.accounts)||swap.accounts.length<4||swap.accounts.length>64||typeof swap.data!=='string'||! /^[A-Za-z0-9+/]+=*$/.test(swap.data))throw new Error('Router instruction rejected');
 const swapData=Buffer.from(swap.data,'base64');if(swapData.length<8||swapData.length>1024)throw new Error('Router instruction data size rejected');
 const addresses=new Set(swap.accounts.map(a=>address(a.pubkey)));
 if(![wallet,inputTokens,outputTokens].every(a=>addresses.has(a)))throw new Error('Router token accounts do not match buyback wallet');
 for(const a of swap.accounts)if(typeof a.isSigner!=='boolean'||typeof a.isWritable!=='boolean'||a.isSigner&&a.pubkey!==wallet||a.pubkey===protocol||a.pubkey===revenue)throw new Error('Router requested unexpected authority or protocol state');
 const ixs=[];const setup=response.setupInstructions??[];
 if(!Array.isArray(setup)||setup.length>4)throw new Error('Excessive swap account setup');
 for(const ix of setup){
  const a=ix.accounts;
  if(ix.programId!==ATA||Buffer.from(ix.data??'','base64').toString('hex')!=='01'||!Array.isArray(a)||a.length!==6||a[0].pubkey!==wallet||a[4].pubkey!==SYSTEM||!TOKEN_PROGRAMS.has(a[5].pubkey)||a.some((x,i)=>i!==0&&x.isSigner)||!addresses.has(a[1].pubkey))throw new Error('Router account setup rejected');
  if(await ata(a[2].pubkey,a[3].pubkey,a[5].pubkey)!==a[1].pubkey)throw new Error('Router ATA address is not canonical');
  ixs.push(getCreateAssociatedTokenIdempotentInstruction({payer:signer,ata:address(a[1].pubkey),owner:address(a[2].pubkey),mint:address(a[3].pubkey),tokenProgram:address(a[5].pubkey)}));
 }
 const tableKeys=Object.keys(response.addressesByLookupTableAddress??{});if(tableKeys.length>8)throw new Error('Too many router lookup tables');tableKeys.forEach(address);
 return {ixs,swapData:new Uint8Array(swapData),remainingAccounts:swap.accounts.map(a=>({address:address(a.pubkey),role:a.isSigner?(a.isWritable?3:2):(a.isWritable?1:0)})),minimumOutput:minimum,expectedOutput:out,inputTokens,outputTokens,lookupTableAddresses:tableKeys};
}
export async function creatorFeeInstructions({wallet,source,config,live,read=rpc}){
 const signer=createNoopSigner(address(wallet)),program={programAddress:address(config.programAddress)};
 const protocol=live.protocolAddress,[revenue]=await sdk.findRevenuePda({protocol},program);
 const curve=await pda(PUMP_PROGRAM,[seed('bonding-curve'),enc.encode(config.leverMint)]),curveBytes=raw(await fetchAccount(curve,read),PUMP_PROGRAM,81);
 if(!curveBytes.subarray(0,8).equals(CURVE_DISCRIMINATOR)||dec.decode(curveBytes.subarray(49,81))!==wallet)throw Object.assign(new Error('Connect the actual LeverMeme creator wallet; shared/fee-sharing authorities require their own signing workflow.'),{status:422});
 const quote=curveBytes.length>=115?dec.decode(curveBytes.subarray(83,115)):SYSTEM;
 const native=source==='bonding'&&quote===SYSTEM,feeProgram=source==='amm'?PUMP_AMM_PROGRAM:PUMP_PROGRAM;
 if(!['bonding','amm'].includes(source))throw new Error('Choose bonding or amm creator fees');
 const inputMint=quote===SYSTEM?WSOL:quote;
 if(!native&&![config.quoteMint,WSOL].includes(inputMint))throw new Error('Creator fee quote is not xSOL or wrapped SOL');
 let origin=curve;
 if(source==='amm'){
  const authority=await pda(PUMP_PROGRAM,[seed('pool-authority'),enc.encode(config.leverMint)]);
  origin=await pda(PUMP_AMM_PROGRAM,[seed('pool'),new Uint8Array([0,0]),enc.encode(authority),enc.encode(config.leverMint),enc.encode(inputMint)]);
  const poolAccount=await fetchAccount(origin,read);if(!poolAccount)throw Object.assign(new Error('No canonical PumpSwap creator fees are available yet.'),{status:409});
  const pool=raw(poolAccount,PUMP_AMM_PROGRAM,243);
  if(!pool.subarray(0,8).equals(Buffer.from([241,154,109,4,17,177,109,188]))||dec.decode(pool.subarray(211,243))!==wallet)throw new Error('Canonical PumpSwap pool creator does not match');
 }
 const vaultAuthority=await pda(feeProgram,[seed(source==='amm'?'creator_vault':'creator-vault'),enc.encode(wallet)]),eventAuthority=await pda(feeProgram,[seed('__event_authority')]);
 const [treasury,buyback]=[live.protocol.policy.feeDestinations[0],live.protocol.policy.feeDestinations[2]],ixs=[];
 if(native){
  const vault=await fetchAccount(vaultAuthority,read);
  const rent=await read('getMinimumBalanceForRentExemption',[0,{commitment:'confirmed'}]);
  if(!vault||!Number.isSafeInteger(vault.lamports)||!Number.isSafeInteger(rent)||vault.lamports<=rent)throw Object.assign(new Error('No creator fees are currently available.'),{status:409});
  ixs.push(sdk.getCollectNativeCreatorFeesInstruction({creator:signer,protocol,revenue,origin,creatorVault:vaultAuthority,treasury:address(treasury),buybackFund:address(buyback),eventAuthority,pumpProgram:address(PUMP_PROGRAM)},program));
 }else{
  const mintAccount=await fetchAccount(inputMint,read);if(!TOKEN_PROGRAMS.has(mintAccount?.owner))throw new Error('Creator quote token program rejected');
  const inputProgram=address(mintAccount.owner),creatorTokens=await ata(wallet,inputMint,inputProgram),feeVault=await ata(vaultAuthority,inputMint,inputProgram),treasuryTokens=await ata(treasury,inputMint,inputProgram),buybackTokens=await ata(buyback,inputMint,inputProgram);
  const vault=await fetchAccount(feeVault,read);
  if(!vault)throw Object.assign(new Error('No creator fees are currently available.'),{status:409});
  if(raw(vault,inputProgram,165).readBigUInt64LE(64)===0n)throw Object.assign(new Error('No creator fees are currently available.'),{status:409});
  for(const [owner,account] of [[wallet,creatorTokens],[treasury,treasuryTokens],[buyback,buybackTokens]])ixs.push(getCreateAssociatedTokenIdempotentInstruction({payer:signer,ata:account,owner:address(owner),mint:address(inputMint),tokenProgram:inputProgram}));
  ixs.push(sdk.getCollectQuoteCreatorFeesInstruction({creator:signer,protocol,revenue,origin,inputMint:address(inputMint),creatorTokens,vaultAuthority,feeVault,treasury:treasuryTokens,buybackFund:buybackTokens,feeProgram:address(feeProgram),eventAuthority,inputProgram,sourceKind:source==='amm'?1:0},program));
 }
 return {ixs,effects:[`Collect ${source==='amm'?'canonical PumpSwap':'pump.fun bonding'} creator-vault fees. The vault aggregates ALL coins using this creator identity; amounts cannot be attributed to LeverMeme alone.`,`Atomically send 50% of newly received ${native?'native SOL':inputMint===WSOL?'wrapped SOL':'xSOL'} to treasury ${treasury} and 50% to buyback owner ${buyback}. Odd-unit dust goes to treasury. Your pre-existing holdings are preserved.`]};
}
