// Dry-run by default. Real execution requires explicit CLI mode, bounded policy
// and an independently secured signer that NEVER broadcasts by itself.
import { mkdir,rename,open } from 'node:fs/promises';
import { address,getTransactionDecoder,getBase64EncodedWireTransaction,getSignatureFromTransaction } from '@solana/kit';
import { findAssociatedTokenPda } from '@solana-program/token';
import { launchConfig,validateLaunch,verifiedProtocol,runtimeSnapshot,programAccounts,fetchAccount } from '../lib/deployment.mjs';
import { prepareAction,submitTransaction } from '../lib/transactions.mjs';
import { settlementCandidate } from '../lib/keeper.mjs';
import { keeperState,reserveKeeperBudget } from '../lib/keeper-state.mjs';
import { durableState } from '../lib/durable-state.mjs';
import { boundedProviderJson,WSOL,CLASSIC_TOKEN } from '../lib/revenue.mjs';
import { rpc } from '../lib/mainnet-read.mjs';
const execute=process.argv.includes('--execute'),once=process.argv.includes('--once');
const wallet=address(process.env.KEEPER_WALLET_ADDRESS||'');
const tasks=new Set((process.env.KEEPER_TASKS||'markets').split(','));
if([...tasks].some(t=>!['markets','creator-fees','buybacks'].includes(t)))throw new Error('Unknown keeper task. Choose markets, creator-fees or buybacks.');
const maxTx=BigInt(process.env.KEEPER_MAX_LAMPORTS_PER_TX||'0'),daily=BigInt(process.env.KEEPER_DAILY_LAMPORTS||'0');
const signerUrl=process.env.KEEPER_REMOTE_SIGNER_URL;
const interval=Number(process.env.KEEPER_INTERVAL_MS||'2000');
const asset=tasks.has('buybacks')?(process.env.KEEPER_BUYBACK_ASSET||'xSOL'):'none';
const maxInput=BigInt(process.env.KEEPER_BUYBACK_MAX_INPUT_BASE_UNITS||'0'),dailyInput=BigInt(process.env.KEEPER_BUYBACK_DAILY_INPUT_BASE_UNITS||'0'),minInput=BigInt(process.env.KEEPER_BUYBACK_MIN_INPUT_BASE_UNITS||'1');
if(!Number.isInteger(interval)||interval<1000||interval>30000)throw new Error('KEEPER_INTERVAL_MS must be 1000–30000.');
if(tasks.has('buybacks')&&(!['SOL','WSOL','xSOL'].includes(asset)||maxInput<minInput||minInput<=0n||execute&&dailyInput<maxInput))throw new Error('Buybacks require explicit positive per-action and daily token/SOL input limits.');
if(execute&&(!signerUrl||new URL(signerUrl).protocol!=='https:'||new URL(signerUrl).username||new URL(signerUrl).password||maxTx<=0n||daily<maxTx))throw new Error('Execution requires an HTTPS managed signer and explicit SOL budgets.');
const root=new URL('../.runtime/',import.meta.url),healthPath=new URL('keeper-health.json',root);
await mkdir(root,{recursive:true});const stop=new AbortController();let stopping=false,stateStore;
for(const event of ['SIGTERM','SIGINT'])process.once(event,()=>{stopping=true;stop.abort();});
const read=(method,params)=>rpc(method,params,{signal:stop.signal});
if(execute){
 const config=launchConfig();if(validateLaunch(config).length)throw new Error('Executing keeper requires final public deployment configuration.');
 const context={wallet,programAddress:config.programAddress,asset};
 stateStore=await durableState({directory:root,name:'keeper',initialize:()=>keeperState(null,context),validate:state=>keeperState(state,context)});
}
async function atomicFile(path,value){const temp=new URL(path.pathname+'.tmp','file:');const file=await open(temp,'w',0o600);try{await file.writeFile(JSON.stringify(value));await file.sync();}finally{await file.close();}await rename(temp,path);}
async function loadState(config){return keeperState(await stateStore.load(),{wallet,programAddress:config.programAddress,asset});}
const saveState=state=>stateStore.save(state);
const displayUnits=(n,decimals)=>{const scale=10n**BigInt(decimals);return String(n/scale)+'.'+String(n%scale).padStart(decimals,'0');};
async function tick(){
 const config=launchConfig(),live=await verifiedProtocol(config,read);
 let state=execute?await loadState(config):null;
 if(state?.pending){
  const status=await read('getSignatureStatuses',[[state.pending.signature],{searchTransactionHistory:true}]),result=status?.value?.[0];
  if(!result||!result.err&&!['confirmed','finalized'].includes(result.confirmationStatus))return {phase:'pending',signature:state.pending.signature,pendingSince:state.pending.submittedAt};
  state.pending=null;await saveState(state);
 }
 const candidates=[];
 if(tasks.has('markets')){
  const snapshot=await runtimeSnapshot(null,config,read),positions=await programAccounts('Position',null,config.programAddress,read);
  const settlements=[],refreshes=[],collections=[];
  for(const market of snapshot.markets.filter(m=>!m.closed)){
   const age=BigInt(snapshot.slot)-BigInt(market.priceSlot);
   if((market.enabled||BigInt(market.openInterest)>0n)&&(BigInt(market.price)===0n||age>BigInt(market.risk.maxPriceAgeSlots)/3n))refreshes.push({action:'refresh-price',market:market.address});
   for(const position of positions){const candidate=settlementCandidate(position,market,live.protocol.policy.feeBps,snapshot.slot,Math.floor(Date.now()/1000));if(candidate)settlements.push(candidate);}
   if(BigInt(market.accruedFees)>=BigInt(process.env.KEEPER_MIN_FEE_DISTRIBUTION_BASE_UNITS||'1000000'))collections.push({action:'collect-fees',market:market.address});
  }
  const offset=refreshes.length?Math.floor(Date.now()/interval)%refreshes.length:0,rotated=[...refreshes.slice(offset),...refreshes.slice(0,offset)];
  candidates.push(...settlements,...(Math.floor(Date.now()/interval)%5===0?[...collections,...rotated]:[...rotated,...collections]));
 }
 if(tasks.has('creator-fees'))candidates.push({action:'collect-creator-fees',source:'bonding'},{action:'collect-creator-fees',source:'amm'});
 if(tasks.has('buybacks')){
  if(wallet!==live.protocol.policy.feeDestinations[2])throw new Error('Buyback worker wallet is not the fixed buyback owner.');
  let balance;
  if(asset==='SOL'){const value=await read('getBalance',[wallet,{commitment:'confirmed'}]);balance=BigInt(value.value)-BigInt(process.env.KEEPER_SOL_RESERVE_LAMPORTS||'50000000');}
  else{const mint=asset==='xSOL'?config.quoteMint:WSOL,tokenProgram=asset==='xSOL'?live.quoteProgram:CLASSIC_TOKEN;const [ata]=await findAssociatedTokenPda({owner:wallet,mint:address(mint),tokenProgram:address(tokenProgram)});const account=await fetchAccount(ata,read);balance=account?.owner===tokenProgram&&account.data?.[1]==='base64'&&Buffer.from(account.data[0],'base64').length>=165?Buffer.from(account.data[0],'base64').readBigUInt64LE(64):0n;}
  const n=balance>maxInput?maxInput:balance;if(n>=minInput)candidates.push({action:'buyback',asset,amount:displayUnits(n,asset==='xSOL'?live.quoteDecimals:9),inputUnits:n});
 }
 let planned=0,failures=0;
 for(const candidate of candidates.slice(0,3)){
  if(stopping)break;
  try{
   const {inputUnits,...action}=candidate,plan=await prepareAction({...action,wallet},config,read);planned++;
   console.log(JSON.stringify({mode:execute?'managed-execution':'dry-run',action:candidate.action,messageHash:plan.messageHash,estimatedSolDebitLamports:plan.estimatedWalletSolDebitLamports}));
   if(!execute)continue;
   if(stopping)break;
   if(BigInt(plan.estimatedWalletSolDebitLamports)>maxTx)throw new Error('Simulated total SOL debit exceeds per-action policy.');
   state=reserveKeeperBudget(state,{day:new Date().toISOString().slice(0,10),maxLamports:maxTx,dailyLamports:daily,buybackUnits:inputUnits??0n,dailyBuybackUnits:dailyInput});await saveState(state);
   const response=await fetch(signerUrl,{method:'POST',headers:{'content-type':'application/json',...(process.env.KEEPER_REMOTE_SIGNER_TOKEN?{authorization:'Bearer '+process.env.KEEPER_REMOTE_SIGNER_TOKEN}:{})},body:JSON.stringify({network:'solana:mainnet',wallet,wire:plan.wire,messageHash:plan.messageHash,programAddress:config.programAddress,action:candidate.action,maximumTotalSolDebitLamports:String(maxTx),maximumBuybackInputBaseUnits:String(inputUnits??0n)}),signal:AbortSignal.any([stop.signal,AbortSignal.timeout(15000)]),redirect:'error'});
   const signed=await boundedProviderJson(response,12000);if(typeof signed.wire!=='string'||signed.wire.length>1800)throw new Error('Invalid managed signer response.');
   const before=getTransactionDecoder().decode(Buffer.from(plan.wire,'base64')),after=getTransactionDecoder().decode(Buffer.from(signed.wire,'base64'));
   if(!Buffer.from(before.messageBytes).equals(Buffer.from(after.messageBytes))||Object.values(after.signatures).some(s=>!s||s.every(b=>b===0)))throw new Error('Managed signer changed the message or did not provide all signatures.');
   state.pending={signature:getSignatureFromTransaction(after),messageHash:plan.messageHash,lastValidBlockHeight:plan.lastValidBlockHeight,submittedAt:new Date().toISOString()};await saveState(state);
   if(!stopping)await submitTransaction(getBase64EncodedWireTransaction(after),config,read);
   return {phase:'pending',signature:state.pending.signature,pendingSince:state.pending.submittedAt};
  }catch(error){if(error.status===409)continue;failures++;console.error(JSON.stringify({action:candidate.action,error:error.message}));if(execute)return {phase:'degraded',failures};}
 }
 return {phase:failures?'degraded':execute?'idle':'dry-run',planned,failures};
}
try{
 do{
  let health;try{health=await tick();}catch(error){health={phase:'degraded',error:error.message};console.error(JSON.stringify({error:error.message}));if(once)process.exitCode=1;}
  await atomicFile(healthPath,{...health,mode:execute?'execute':'dry-run',wallet,programAddress:launchConfig().programAddress,tasks:[...tasks],updatedAt:new Date().toISOString()});
  if(once&&health.phase==='degraded')process.exitCode=1;
  if(!once&&!stopping)await new Promise(resolve=>{const done=()=>{clearTimeout(timer);stop.signal.removeEventListener('abort',done);resolve();};const timer=setTimeout(done,interval);stop.signal.addEventListener('abort',done,{once:true});});
 }while(!once&&!stopping);
}finally{await stateStore?.close();}
