// Optional, independently deployed signing boundary. No wallet key loader and
// NO BROADCAST endpoint. KMS retains the private signing material.
import { KMSClient,GetPublicKeyCommand,SignCommand } from '@aws-sdk/client-kms';
import { address } from '@solana/kit';
import { kmsAdapter } from '../../lib/kms-adapter.mjs';
import { createSignerServer } from '../../lib/signer-server.mjs';
import { launchConfig,validateLaunch } from '../../lib/deployment.mjs';
if(process.env.SIGNER_ENABLE!=='I_ACCEPT_POLICY_BOUND_SIGNING')throw new Error('Signer disabled. Review policy and explicitly enable in its own environment.');
const policy={wallet:address(process.env.SIGNER_WALLET_ADDRESS||''),role:process.env.SIGNER_ROLE,maxLamports:BigInt(process.env.SIGNER_MAX_LAMPORTS_PER_TX||'0'),dailyLamports:BigInt(process.env.SIGNER_DAILY_LAMPORTS||'0'),asset:process.env.SIGNER_BUYBACK_ASSET||'none',maxInput:BigInt(process.env.SIGNER_BUYBACK_MAX_INPUT_BASE_UNITS||'0'),dailyInput:BigInt(process.env.SIGNER_BUYBACK_DAILY_INPUT_BASE_UNITS||'0')};
if(!['markets','creator-fees','buybacks'].includes(policy.role)||policy.maxLamports<=0n||policy.dailyLamports<policy.maxLamports||policy.role==='buybacks'&&(!['xSOL','SOL','WSOL'].includes(policy.asset)||policy.maxInput<=0n||policy.dailyInput<policy.maxInput))throw new Error('Signer spending/role policy is incomplete.');
const config=launchConfig();if(validateLaunch(config).length)throw new Error('Signer requires final public mainnet deployment configuration.');
const port=Number(process.env.SIGNER_PORT||8787),bind=process.env.SIGNER_BIND_ADDRESS||'127.0.0.1';
if(!Number.isInteger(port)||port<1024||port>65535||!['127.0.0.1','0.0.0.0'].includes(bind)||bind==='0.0.0.0'&&process.env.SIGNER_CONTAINER_NETWORK!=='private')throw new Error('Invalid port/bind. Non-loopback binding requires an explicitly private container network.');
const client=new KMSClient({region:process.env.AWS_REGION,maxAttempts:2});
let service;
try{
 const signer=await kmsAdapter({transport:{getPublicKey:input=>client.send(new GetPublicKeyCommand(input),{abortSignal:AbortSignal.timeout(15000)}),sign:input=>client.send(new SignCommand(input),{abortSignal:AbortSignal.timeout(15000)})},keyId:process.env.KMS_KEY_ARN||'',wallet:policy.wallet});
 service=await createSignerServer({token:process.env.SIGNER_AUTH_TOKEN,policy,config,signer,directory:new URL('../../.runtime/',import.meta.url)});
 await new Promise((resolve,reject)=>{service.server.once('error',reject);service.server.listen(port,bind,resolve);});
 console.log('Policy signer ready. Expose only through your authenticated HTTPS proxy; no transactions are broadcast by this service.');
}catch(error){await service?.close();client.destroy();throw error;}
let shuttingDown=false;
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{
 if(shuttingDown)return;shuttingDown=true;
 try{await service.close();}finally{client.destroy();}
});
