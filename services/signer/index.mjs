// Optional, independently deployed signing boundary. No wallet key loader and
// NO BROADCAST endpoint. KMS retains the private signing material.
import { createServer } from 'node:http';
import { timingSafeEqual } from 'node:crypto';
import { mkdir,readFile,open,rename,unlink } from 'node:fs/promises';
import { KMSClient,GetPublicKeyCommand,SignCommand } from '@aws-sdk/client-kms';
import { address,getBase64EncodedWireTransaction } from '@solana/kit';
import { kmsAdapter } from '../../lib/kms-adapter.mjs';
import { reviewSignerRequest } from '../../lib/signer-policy.mjs';
import { keeperState,reserveKeeperBudget } from '../../lib/keeper-state.mjs';
import { launchConfig } from '../../lib/deployment.mjs';
if(process.env.SIGNER_ENABLE!=='I_ACCEPT_POLICY_BOUND_SIGNING')throw new Error('Signer disabled. Review policy and explicitly enable in its own environment.');
const token=process.env.SIGNER_AUTH_TOKEN;if(!token||token.length<32)throw new Error('Signer requires a strong access token supplied through its secret manager.');
const policy={wallet:address(process.env.SIGNER_WALLET_ADDRESS||''),role:process.env.SIGNER_ROLE,maxLamports:BigInt(process.env.SIGNER_MAX_LAMPORTS_PER_TX||'0'),dailyLamports:BigInt(process.env.SIGNER_DAILY_LAMPORTS||'0'),asset:process.env.SIGNER_BUYBACK_ASSET||'none',maxInput:BigInt(process.env.SIGNER_BUYBACK_MAX_INPUT_BASE_UNITS||'0'),dailyInput:BigInt(process.env.SIGNER_BUYBACK_DAILY_INPUT_BASE_UNITS||'0')};
if(!['markets','creator-fees','buybacks'].includes(policy.role)||policy.maxLamports<=0n||policy.dailyLamports<policy.maxLamports||policy.role==='buybacks'&&(!['xSOL','SOL','WSOL'].includes(policy.asset)||policy.maxInput<=0n||policy.dailyInput<policy.maxInput))throw new Error('Signer spending/role policy is incomplete.');
const config=launchConfig(),client=new KMSClient({region:process.env.AWS_REGION,maxAttempts:2});
const signer=await kmsAdapter({transport:{getPublicKey:input=>client.send(new GetPublicKeyCommand(input)),sign:input=>client.send(new SignCommand(input))},keyId:process.env.KMS_KEY_ARN||'',wallet:policy.wallet});
const directory=new URL('../../.runtime/',import.meta.url),path=new URL('signer-state.json',directory),lockPath=new URL('signer.lock',directory);
await mkdir(directory,{recursive:true});const lock=await open(lockPath,'wx',0o600);await lock.writeFile(String(process.pid));
const context={wallet:policy.wallet,programAddress:config.programAddress,asset:policy.role+':'+policy.asset};
async function load(){let value;try{value=JSON.parse(await readFile(path,'utf8'));}catch(error){if(error.code!=='ENOENT')throw new Error('Signer state is unreadable/corrupt. Reconcile before restarting.');}const state=keeperState(value,context);if(!state.cache)state.cache={};if(typeof state.cache!=='object'||Array.isArray(state.cache)||Object.keys(state.cache).length>1000)throw new Error('Signer replay cache rejected.');return state;}
async function save(state){const temp=new URL('signer-state.tmp',directory),file=await open(temp,'w',0o600);try{await file.writeFile(JSON.stringify(state));await file.sync();}finally{await file.close();}await rename(temp,path);}
await load();let queue=Promise.resolve();
const server=createServer(async(req,res)=>{
 const respond=(status,body)=>{res.writeHead(status,{'content-type':'application/json','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(body));};
 if(req.method==='GET'&&req.url==='/health')return respond(200,{mode:'policy-bound-kms',role:policy.role,wallet:policy.wallet,programAddress:config.programAddress});
 const supplied=Buffer.from(req.headers.authorization??''),expected=Buffer.from('Bearer '+token);
 if(supplied.length!==expected.length||!timingSafeEqual(supplied,expected))return respond(401,{error:'Unauthorized'});
 if(req.method!=='POST'||req.url!=='/sign')return respond(405,{error:'Only POST /sign is accepted'});
 let body;try{let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>12000)throw new Error();}body=JSON.parse(raw);}catch{return respond(400,{error:'Invalid signing request'});}
 const execute=async()=>{
  try{
   const review=await reviewSignerRequest(body,{policy,config}),day=new Date().toISOString().slice(0,10);let state=await load();
   if(state.cache[review.messageHash])return respond(200,{wire:state.cache[review.messageHash]});
   if(state.day!==day)state.cache={};if(Object.keys(state.cache).length>=1000)throw new Error('Signer daily capacity reached.');
   state=reserveKeeperBudget(state,{day,maxLamports:policy.maxLamports,dailyLamports:policy.dailyLamports,buybackUnits:review.inputUnits,dailyBuybackUnits:policy.dailyInput});await save(state);
   const signature=await signer.signMessage(review.tx.messageBytes),wire=getBase64EncodedWireTransaction({...review.tx,signatures:{...review.tx.signatures,[policy.wallet]:signature}});
   state.cache[review.messageHash]=wire;await save(state);return respond(200,{wire});
  }catch{return respond(422,{error:'Signer policy, simulation, budget or signature verification rejected this request. No transaction was broadcast.'});}
 };
 queue=queue.then(execute,execute);await queue;
});
server.requestTimeout=20000;server.headersTimeout=10000;
const port=Number(process.env.SIGNER_PORT||8787);if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('Invalid signer port.');
server.listen(port,'127.0.0.1',()=>console.log('KMS policy signer listening on loopback. Put behind an authenticated HTTPS reverse proxy; never expose the raw port.'));
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>server.close(async()=>{await queue;await lock.close();await unlink(lockPath).catch(()=>{});client.destroy();}));
