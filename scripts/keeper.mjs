// Default: read/simulate only. Execute requires an explicit command, bounded
// spending policy and an independently configured user-controlled remote signer.
import { mkdir,readFile,writeFile,rename,open,unlink } from 'node:fs/promises';
import { getTransactionDecoder,getBase64EncodedWireTransaction } from '@solana/kit';
import { launchConfig,verifiedProtocol,runtimeSnapshot,programAccounts } from '../lib/deployment.mjs';
import { prepareAction,submitTransaction } from '../lib/transactions.mjs';
import { settlementCandidate } from '../lib/keeper.mjs';
import { rpc } from '../lib/mainnet-read.mjs';
const execute=process.argv.includes('--execute'),once=process.argv.includes('--once');
const wallet=process.env.KEEPER_WALLET_ADDRESS;
if(!wallet)throw new Error('Set KEEPER_WALLET_ADDRESS to a public wallet address. Never use a private key.');
const maxTx=BigInt(process.env.KEEPER_MAX_LAMPORTS_PER_TX||'0'),daily=BigInt(process.env.KEEPER_DAILY_LAMPORTS||'0');
const signerUrl=process.env.KEEPER_REMOTE_SIGNER_URL;
const interval=Number(process.env.KEEPER_INTERVAL_MS||'2000');
if(!Number.isInteger(interval)||interval<1000||interval>30000)throw new Error('KEEPER_INTERVAL_MS must be an integer from 1000 to 30000.');
if(execute&&(!signerUrl||new URL(signerUrl).protocol!=='https:'||maxTx<=0n||daily<maxTx))throw new Error('Execution requires an HTTPS managed signer and explicit per-transaction/daily SOL budgets.');
const root=new URL('../.runtime/',import.meta.url),statePath=new URL('keeper-state.json',root),lockPath=new URL('keeper.lock',root);
let lock;
if(execute){
 await mkdir(root,{recursive:true});
 try{lock=await open(lockPath,'wx',0o600);}catch{throw new Error('Keeper lock exists. Verify no keeper is running before removing the stale lock.');}
 await lock.writeFile(String(process.pid));
}
async function loadState(){try{return JSON.parse(await readFile(statePath,'utf8'));}catch{return {day:'',reservedLamports:'0',pending:null};}}
async function saveState(state){const temp=new URL('keeper-state.tmp',root);await writeFile(temp,JSON.stringify(state),{mode:0o600});await rename(temp,statePath);}
async function tick(){
 const config=launchConfig(),live=await verifiedProtocol(config),snapshot=await runtimeSnapshot(null,config);
 const positions=await programAccounts('Position',null,config.programAddress);
 const settlements=[],refreshes=[],collections=[];
 for(const market of snapshot.markets.filter(m=>!m.closed)){
  const age=BigInt(snapshot.slot)-BigInt(market.priceSlot);
  if((market.enabled||BigInt(market.openInterest)>0n)&&(BigInt(market.price)===0n||age>BigInt(market.risk.maxPriceAgeSlots)/3n))refreshes.push({action:'refresh-price',market:market.address});
  for(const position of positions){const candidate=settlementCandidate(position,market,live.protocol.policy.feeBps,snapshot.slot,Math.floor(Date.now()/1000));if(candidate)settlements.push(candidate);}
  const minimum=BigInt(process.env.KEEPER_MIN_FEE_DISTRIBUTION_BASE_UNITS||'1000000');
  if(BigInt(market.accruedFees)>=minimum)collections.push({action:'collect-fees',market:market.address});
 }
 // Never let routine refresh/fee collection displace an actionable settlement.
 // Rotate markets so a large registry cannot starve later oracle jobs.
 const offset=refreshes.length?Math.floor(Date.now()/interval)%refreshes.length:0;
 const rotated=[...refreshes.slice(offset),...refreshes.slice(0,offset)];
 const routine=Math.floor(Date.now()/interval)%5===0?[...collections,...rotated]:[...rotated,...collections];
 const candidates=[...settlements,...routine];
 let state=execute?await loadState():null;
 if(state?.pending){
  const status=await rpc('getSignatureStatuses',[[state.pending.signature],{searchTransactionHistory:true}]);
  const result=status?.value?.[0];
  if(!result||!result.err&&!['confirmed','finalized'].includes(result.confirmationStatus)){console.log('Keeper paused: prior transaction is not resolved. Check its stored signature before restarting.');return;}
  state.pending=null;await saveState(state);
 }
 for(const candidate of candidates.slice(0,3)){
  try{
   const plan=await prepareAction({...candidate,wallet},config);
   console.log(JSON.stringify({mode:execute?'managed-execution':'dry-run',action:candidate.action,market:candidate.market,position:candidate.position,messageHash:plan.messageHash,estimatedSolDebitLamports:plan.estimatedWalletSolDebitLamports}));
   if(!execute)continue;
   if(BigInt(plan.estimatedWalletSolDebitLamports)>maxTx)throw new Error('Simulated total SOL debit exceeds configured per-transaction budget');
   const day=new Date().toISOString().slice(0,10);if(state.day!==day){state.day=day;state.reservedLamports='0';}
   const next=BigInt(state.reservedLamports)+maxTx;if(next>daily)throw new Error('Daily conservative SOL reservation budget exhausted');
   state.reservedLamports=String(next);await saveState(state);
   const response=await fetch(signerUrl,{method:'POST',headers:{'content-type':'application/json',...(process.env.KEEPER_REMOTE_SIGNER_TOKEN?{authorization:`Bearer ${process.env.KEEPER_REMOTE_SIGNER_TOKEN}`}:{})},body:JSON.stringify({network:'solana:mainnet',wallet,wire:plan.wire,messageHash:plan.messageHash,programAddress:config.programAddress,action:candidate.action,maximumTotalSolDebitLamports:String(maxTx)}),signal:AbortSignal.timeout(15000),redirect:'error'});
   if(!response.ok)throw new Error('Managed signer refused the keeper action');
   const signed=await response.json();if(typeof signed.wire!=='string'||signed.wire.length>1800)throw new Error('Invalid managed signer response');
   const before=getTransactionDecoder().decode(Buffer.from(plan.wire,'base64')),after=getTransactionDecoder().decode(Buffer.from(signed.wire,'base64'));
   if(!Buffer.from(before.messageBytes).equals(Buffer.from(after.messageBytes)))throw new Error('Managed signer changed the reviewed transaction');
   // Persist the signature before sending, so a restart cannot blindly resend.
   const {getSignatureFromTransaction}=await import('@solana/kit');
   state.pending={signature:getSignatureFromTransaction(after),messageHash:plan.messageHash,lastValidBlockHeight:plan.lastValidBlockHeight};await saveState(state);
   await submitTransaction(getBase64EncodedWireTransaction(after),config);return;
  }catch(error){console.error(JSON.stringify({action:candidate.action,error:error.message}));if(execute)return;}
 }
}
try{
 do{try{await tick();}catch(error){console.error(JSON.stringify({error:error.message}));if(once)process.exitCode=1;}
  if(!once)await new Promise(resolve=>setTimeout(resolve,interval));
 }while(!once);
}finally{if(lock){await lock.close();await unlink(lockPath).catch(()=>{});}}
