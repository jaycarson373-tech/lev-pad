import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp,readFile,writeFile,unlink,rm,access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { request } from 'node:http';
import { createTransactionMessage,setTransactionMessageFeePayer,setTransactionMessageLifetimeUsingBlockhash,compileTransaction } from '@solana/kit';
import { createSignerServer } from '../lib/signer-server.mjs';
import { key } from './helpers/protocol-fixture.mjs';

const token='public-test-token-not-a-real-credential-1234';
const policy={wallet:key(4),role:'markets',asset:'none',maxLamports:100n,dailyLamports:200n,dailyInput:0n};
const config={programAddress:key(2)};
// Deliberately injected test boundary: no RPC, AWS, real signature or broadcast.
function check(body){
 const tx=compileTransaction(setTransactionMessageLifetimeUsingBlockhash({blockhash:key(body?.nonce??80),lastValidBlockHeight:200n},setTransactionMessageFeePayer(policy.wallet,createTransactionMessage({version:0}))));
 return {tx,messageHash:createHash('sha256').update(tx.messageBytes).digest('hex'),inputUnits:0n};
}
async function start(t,options={}){
 const directory=pathToFileURL(await mkdtemp(join(tmpdir(),'levermeme-signer-test-'))+'/');
 const service=await createSignerServer({token,policy,config,directory,review:async body=>check(body),signer:{signMessage:async()=>{throw new Error('Test KMS unavailable');}},...options});
 await new Promise(resolve=>service.server.listen(0,'127.0.0.1',resolve));
 t.after(async()=>{await service.close();await rm(directory,{recursive:true,force:true});});
 const url='http://127.0.0.1:'+service.server.address().port;
 return {directory,service,url,post:(body={},headers={})=>fetch(url+'/sign',{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json',...headers},body:JSON.stringify(body)})};
}
test('real signer HTTP boundary authenticates, rejects malformed/oversized bodies and never calls KMS',async t=>{
 let signs=0,reviews=0;
 const f=await start(t,{review:async()=>{reviews++;throw new Error('Policy rejection');},signer:{signMessage:async()=>{signs++;}}});
 assert.equal((await fetch(f.url+'/sign',{method:'POST',body:'{}'})).status,401);
 assert.equal((await f.post({}, {'content-type':'text/plain'})).status,415);
 assert.equal((await f.post({data:'a'.repeat(12000)})).status,413);
 assert.equal((await fetch(f.url+'/sign',{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:'{'})).status,400);
 assert.equal((await f.post()).status,422);assert.equal(reviews,1);assert.equal(signs,0);
 const state=JSON.parse(await readFile(new URL('signer-state.json',f.directory),'utf8'));assert.equal(state.reservedLamports,'0');
});
test('KMS failures consume durable reservations and restart cannot reset the daily budget',async t=>{
 let signs=0;
 const signer={signMessage:async()=>{signs++;throw new Error('Test KMS failure');}};
 const f=await start(t,{signer});
 assert.equal((await f.post()).status,422);assert.equal((await f.post()).status,422);assert.equal((await f.post()).status,422);assert.equal(signs,2);
 assert.equal(JSON.parse(await readFile(new URL('signer-state.json',f.directory),'utf8')).reservedLamports,'200');
 await f.service.close();
 const restarted=await createSignerServer({token,policy,config,directory:f.directory,review:async()=>check({}),signer});
 try{
  await new Promise(resolve=>restarted.server.listen(0,'127.0.0.1',resolve));
  const res=await fetch('http://127.0.0.1:'+restarted.server.address().port+'/sign',{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:'{}'});
  assert.equal(res.status,422);assert.equal(signs,2);
 }finally{await restarted.close();}
});
test('missing/corrupt durable state fails health and refuses signing without recreating a fresh budget',async t=>{
 let signs=0;const f=await start(t,{signer:{signMessage:async()=>{signs++;}}});
 assert.equal((await fetch(f.url+'/health')).status,200);
 await unlink(new URL('signer-state.json',f.directory));
 assert.equal((await fetch(f.url+'/health')).status,503);assert.equal((await f.post()).status,422);assert.equal(signs,0);
 await writeFile(new URL('signer-state.json',f.directory),'corrupt test fixture');
 assert.equal((await fetch(f.url+'/health')).status,503);assert.equal((await f.post()).status,422);assert.equal(signs,0);
 await writeFile(new URL('signer-state.json',f.directory),'null');
 assert.equal((await fetch(f.url+'/health')).status,503);assert.equal((await f.post()).status,422);assert.equal(signs,0);
});
test('bounded signing queue rejects excess callers while preserving serial budgets',async t=>{
 let entered;const started=new Promise(resolve=>{entered=resolve;});let unblock;const gate=new Promise(resolve=>{unblock=resolve;});
 const f=await start(t,{maxPending:1,review:async()=>{entered();await gate;throw new Error('Rejected test policy');}});
 const first=f.post();await started;
 try{assert.equal((await f.post()).status,503);assert.equal((await fetch(f.url+'/health').then(r=>r.json())).pending,1);}
 finally{unblock();await first;}
 assert.equal((await fetch(f.url+'/health').then(r=>r.json())).pending,0);
});
test('shutdown waits for accepted work and releases the exclusive state lock',async t=>{
 let entered;const started=new Promise(resolve=>{entered=resolve;});let unblock;const gate=new Promise(resolve=>{unblock=resolve;});
 const f=await start(t,{review:async()=>{entered();await gate;throw new Error('Rejected test policy');}});
 const first=f.post();await started;let closed=false;const closing=f.service.close().then(()=>{closed=true;});
 await access(new URL('signer.lock',f.directory));assert.equal(closed,false);
 unblock();await first;await closing;await assert.rejects(()=>access(new URL('signer.lock',f.directory)),{code:'ENOENT'});
});
test('startup corruption releases its lock, while simultaneous processes cannot share budgets',async t=>{
 const f=await start(t);
 await assert.rejects(()=>createSignerServer({token,policy,config,directory:f.directory,signer:{}}),{code:'EEXIST'});
 await f.service.close();await writeFile(new URL('signer-state.json',f.directory),'broken');
 await assert.rejects(()=>createSignerServer({token,policy,config,directory:f.directory,signer:{}}),/corrupt/);
 await assert.rejects(()=>access(new URL('signer.lock',f.directory)),{code:'ENOENT'});
});
test('signer refuses whitespace tokens before creating any state or lock',async()=>{
 await assert.rejects(()=>createSignerServer({token:' '.repeat(40),policy,config,signer:{},directory:new URL('file:///not-used/')}),/token/);
});
test('loss of the initialized state file cannot reset budgets even after process restart',async t=>{
 const f=await start(t);await f.service.close();await unlink(new URL('signer-state.json',f.directory));
 await assert.rejects(()=>createSignerServer({token,policy,config,directory:f.directory,signer:{}}),/corrupt/);
 await assert.rejects(()=>access(new URL('signer-state.json',f.directory)),{code:'ENOENT'});
});
test('HTTP replay cache persists before reply and is re-reviewed without signing or spending twice',async t=>{
 let signs=0,reviews=0,allowed=true;
 const f=await start(t,{review:async body=>{reviews++;if(!allowed)throw new Error('Changed test chain');return check(body);},signer:{signMessage:async()=>{signs++;return new Uint8Array(64).fill(7);}}});
 // Mock-signature transport test only; KMS's separate crypto-verification tests
 // ensure such a synthetic signature can NEVER be returned by the real adapter.
 const first=await f.post();assert.equal(first.status,200);const body=await first.json();
 const persisted=JSON.parse(await readFile(new URL('signer-state.json',f.directory),'utf8'));
 assert.equal(persisted.cache[check({}).messageHash],body.wire);assert.equal(persisted.reservedLamports,'100');
 assert.deepEqual(await f.post().then(r=>r.json()),body);assert.equal(signs,1);assert.equal(reviews,2);
 allowed=false;assert.equal((await f.post()).status,422);assert.equal(signs,1);
});
test('slow incomplete request bodies time out, release queue capacity and never sign',async t=>{
 let signs=0;const f=await start(t,{maxPending:1,bodyTimeoutMs:50,signer:{signMessage:async()=>{signs++;}}});
 await new Promise((resolve,reject)=>{
  const req=request(f.url+'/sign',{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'}},res=>{assert.equal(res.statusCode,408);res.resume();res.on('end',resolve);});
  req.on('error',error=>error.code==='ECONNRESET'?resolve():reject(error));req.write('{');
 });
 assert.equal(signs,0);assert.equal((await fetch(f.url+'/health').then(r=>r.json())).pending,0);
});
