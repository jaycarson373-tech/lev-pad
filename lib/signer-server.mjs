// HTTP/durable-state boundary, separated from AWS so the real server lifecycle
// can be tested without keys, cloud credentials, or mainnet transactions.
import { createServer } from 'node:http';
import { timingSafeEqual } from 'node:crypto';
import { getBase64EncodedWireTransaction } from '@solana/kit';
import { reviewSignerRequest } from './signer-policy.mjs';
import { keeperState,reserveKeeperBudget } from './keeper-state.mjs';
import { durableState } from './durable-state.mjs';

export async function createSignerServer({token,policy,config,signer,directory,review=reviewSignerRequest,now=()=>new Date(),maxPending=4,bodyTimeoutMs=10000}){
 if(typeof token!=='string'||token.length<32||token.trim()!==token||/\s/.test(token))throw new Error('A strong, whitespace-free signing access token is required.');
 if(!Number.isInteger(maxPending)||maxPending<1||maxPending>16)throw new Error('Invalid signing queue capacity.');
 const context={wallet:policy.wallet,programAddress:config.programAddress,asset:policy.role+':'+policy.asset};
 let closing=false,pending=0,queue=Promise.resolve();
 const store=await durableState({directory,name:'signer',initialize:()=>keeperState(null,context),validate:value=>{
  const state=keeperState(value,context);
  if(!state.cache)state.cache={};
  if(typeof state.cache!=='object'||Array.isArray(state.cache)||Object.keys(state.cache).length>1000||Object.entries(state.cache).some(([hash,wire])=>! /^[a-f0-9]{64}$/.test(hash)||typeof wire!=='string'||wire.length>1800||! /^[A-Za-z0-9+/]+=*$/.test(wire)))throw new Error('Signer replay cache rejected.');
  return state;
 }});
 const {load,save}=store;
 const expected=Buffer.from('Bearer '+token);
 const server=createServer({maxHeaderSize:8192},async(req,res)=>{
  const respond=(status,body)=>{
   if(res.destroyed||res.writableEnded)return;
   res.writeHead(status,{'content-type':'application/json','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(body));
  };
  if(req.method==='GET'&&req.url==='/health'){
   try{await load();return respond(closing?503:200,{mode:'policy-bound-kms',state:closing?'stopping':'ready',role:policy.role,wallet:policy.wallet,programAddress:config.programAddress,pending});}
   catch{return respond(503,{mode:'policy-bound-kms',state:'durable-state-unavailable'});}
  }
  const supplied=Buffer.from(req.headers.authorization??'');
  if(supplied.length!==expected.length||!timingSafeEqual(supplied,expected))return respond(401,{error:'Unauthorized'});
  if(req.method!=='POST'||req.url!=='/sign')return respond(405,{error:'Only POST /sign is accepted'});
  if(closing||pending>=maxPending)return respond(503,{error:'Signer busy or stopping. No signing request was accepted.'});
  if(req.headers['content-type']?.split(';')[0]!=='application/json')return respond(415,{error:'Use application/json'});
  if(Number(req.headers['content-length']??0)>12000)return respond(413,{error:'Signing request too large'});
  // Reserve a slot BEFORE reading bodies, bounding slow-client/queue resource use.
  pending++;
  let timer;
  try{
   let body;
   try{
    const chunks=[];let size=0;
    timer=setTimeout(()=>{respond(408,{error:'Signing request body timed out'});req.destroy();},bodyTimeoutMs);timer.unref();
    for await(const chunk of req){size+=chunk.length;if(size>12000){respond(413,{error:'Signing request too large'});return;}chunks.push(chunk);}
    body=JSON.parse(Buffer.concat(chunks).toString('utf8'));
   }catch{return respond(400,{error:'Invalid signing request'});}
   finally{clearTimeout(timer);}
   if(req.aborted||res.destroyed||closing)return respond(503,{error:'Signer stopping. No signing request was accepted.'});
   const execute=async()=>{
    if(req.aborted||res.destroyed||closing)return respond(503,{error:'Signer stopping. No signing request was accepted.'});
    try{
     await load(); // Reject missing/corrupt state before RPC/KMS work.
     const checked=await review(body,{policy,config}),day=now().toISOString().slice(0,10);let state=await load();
     if(state.day&&day<state.day)throw new Error('Signer clock moved backwards.');
     // Cached requests still pass current chain/blockhash review first.
     if(state.cache[checked.messageHash])return respond(200,{wire:state.cache[checked.messageHash]});
     if(state.day!==day)state.cache={};
     if(Object.keys(state.cache).length>=1000)throw new Error('Signer daily capacity reached.');
     if(req.aborted||res.destroyed||closing)return respond(503,{error:'Signer stopping. No signing request was accepted.'});
     state=reserveKeeperBudget(state,{day,maxLamports:policy.maxLamports,dailyLamports:policy.dailyLamports,buybackUnits:checked.inputUnits,dailyBuybackUnits:policy.dailyInput});
     await save(state); // Unknown/failed KMS calls never refund this reservation.
     const signature=await signer.signMessage(checked.tx.messageBytes);
     const wire=getBase64EncodedWireTransaction({...checked.tx,signatures:{...checked.tx.signatures,[policy.wallet]:signature}});
     state.cache[checked.messageHash]=wire;await save(state);
     return respond(200,{wire}); // Never broadcast. Persist before returning.
    }catch{return respond(422,{error:'Signer policy, simulation, budget, durable state or signature verification rejected this request. No transaction was broadcast.'});}
   };
   queue=queue.then(execute,execute);await queue;
  }finally{clearTimeout(timer);pending--;}
 });
 server.requestTimeout=20000;server.headersTimeout=10000;server.keepAliveTimeout=1000;server.maxRequestsPerSocket=100;
 return {server,async close(){
  closing=true;
  if(server.listening)await new Promise((resolve,reject)=>server.close(error=>error?reject(error):resolve()));
  await queue;await store.close();
 }};
}
