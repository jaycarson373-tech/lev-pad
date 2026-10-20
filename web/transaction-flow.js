import { getTransactionDecoder,getBase64EncodedWireTransaction,getSignatureFromTransaction } from '@solana/kit';
const bytes=base64=>Uint8Array.from(atob(base64),c=>c.charCodeAt(0));
const same=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
export async function signPreparedPlan(plan,signer){
 if(plan.network!=='solana:mainnet'||plan.simulation?.err!==null||!plan.messageHash)throw new Error('A successful mainnet simulation is required before signing.');
 if(signer?.address!==plan.wallet)throw new Error('The connected wallet changed. Prepare this action again.');
 const tx=getTransactionDecoder().decode(bytes(plan.wire));
 const digest=new Uint8Array(await crypto.subtle.digest('SHA-256',tx.messageBytes));
 if([...digest].map(b=>b.toString(16).padStart(2,'0')).join('')!==plan.messageHash)throw new Error('Transaction preview integrity check failed.');
 let signed;
 if(typeof signer.modifyAndSignTransactions==='function') [signed]=await signer.modifyAndSignTransactions([tx]);
 else if(typeof signer.signTransactions==='function') {
  const [signatures]=await signer.signTransactions([tx]);signed={...tx,signatures:{...tx.signatures,...signatures}};
 } else throw new Error('Use a wallet that supports signTransaction, not a watch-only or send-only wallet.');
 if(!signed||!same(signed.messageBytes,tx.messageBytes))throw new Error('Wallet changed the reviewed transaction. Prepare a fresh preview.');
 if(Object.values(signed.signatures).some(sig=>!sig||sig.every(b=>b===0)))throw new Error('The wallet did not sign every required account.');
 return {wire:getBase64EncodedWireTransaction(signed),signature:getSignatureFromTransaction(signed)};
}
export async function awaitConfirmation(signature,lastValidBlockHeight,{request,wait=ms=>new Promise(r=>setTimeout(r,ms)),onStatus=()=>{},attempts=90}={}){
 for(let i=0;i<attempts;i++){
  let result;try{result=await request({operation:'status',signature});}catch{onStatus('Confirmation read unavailable; checking again.');await wait(1200);continue;}
  if(result.status?.err)throw new Error('Transaction failed on chain. No success has been recorded.');
  if(['confirmed','finalized'].includes(result.status?.confirmationStatus))return result.status;
  if(!result.status&&result.blockHeight>lastValidBlockHeight)throw new Error('Blockhash expired without a confirmed result. Check the signature before retrying.');
  onStatus(result.status?'Transaction processed; waiting for confirmation…':'Submitted; waiting for Solana confirmation…');await wait(1200);
 }
 throw new Error('Confirmation is still pending. Track the signature; do not submit the same action again yet.');
}
export async function transactionRequest(body){
 const response=await fetch('/api/transaction',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(25000)});
 const result=await response.json();if(!response.ok)throw new Error(result.error||'Transaction service unavailable.');return result;
}
