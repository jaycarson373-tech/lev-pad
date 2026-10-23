import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { checkEnvironment } from '../lib/environment-check.mjs';
import { fixture,key } from './helpers/protocol-fixture.mjs';
const web=()=>({SOLANA_RPC_URL:'https://rpc.example.invalid/private-path?token=test-only-not-a-credential',SWITCHBOARD_GATEWAY_URL:'https://gateway.example.invalid',SWITCHBOARD_CROSSBAR_URL:'https://crossbar.example.invalid'});
const keeper=()=>({...web(),KEEPER_WALLET_ADDRESS:key(50),KEEPER_MODE_FLAG:'--dry-run',KEEPER_TASKS:'markets',KEEPER_INTERVAL_MS:'2000'});
const signer=()=>({SOLANA_RPC_URL:web().SOLANA_RPC_URL,SIGNER_ENABLE:'I_ACCEPT_POLICY_BOUND_SIGNING',SIGNER_AUTH_TOKEN:'test-only-auth-value-not-a-real-secret',SIGNER_WALLET_ADDRESS:key(50),SIGNER_ROLE:'markets',SIGNER_MAX_LAMPORTS_PER_TX:'50000',SIGNER_DAILY_LAMPORTS:'100000',AWS_REGION:'us-east-1',KMS_KEY_ARN:'arn:aws:kms:us-east-1:123456789012:key/test-only-key'});
test('web environment validation accepts complete public identities while preserving disabled release flags',async()=>{
 const {config}=await fixture(),before=structuredClone(config);const result=checkEnvironment({role:'web',env:web(),config});
 assert.equal(result.configurationValid,true);assert.deepEqual(config,before);assert.match(result.scope,/Static/);assert.equal(config.custodyEnabled,false);
});
test('environment errors never print secret values, URLs, JSON parser input or key material',async()=>{
 const {config}=await fixture(),sentinel='DO-NOT-ECHO-THIS-TEST-SENTINEL';
 for(const env of [{SOLANA_RPC_URL:'http://'+sentinel,PRIVATE_KEY:sentinel,LEVERMEME_LAUNCH_CONFIG:sentinel},{...web(),LEVERMEME_LAUNCH_CONFIG:JSON.stringify({...config,privateKey:sentinel})},{...signer(),SIGNER_AUTH_TOKEN:sentinel,KMS_KEY_ARN:sentinel}]){
  const result=checkEnvironment({role:'signer',env,config});assert.equal(result.configurationValid,false);assert(!JSON.stringify(result).includes(sentinel));assert(!JSON.stringify(result).includes(web().SOLANA_RPC_URL));
 }
});
test('cached public oracle jobs can replace Crossbar but not the explicit gateway',async()=>{
 const {config}=await fixture(),env={...web(),SWITCHBOARD_CROSSBAR_URL:'',SWITCHBOARD_FEED_PROTOS:JSON.stringify({['a'.repeat(64)]:'dGVzdA==',['b'.repeat(64)]:'dGVzdA=='})};
 assert.equal(checkEnvironment({role:'web',env,config}).configurationValid,true);
 assert.equal(checkEnvironment({role:'web',env:{...env,SWITCHBOARD_GATEWAY_URL:''},config}).configurationValid,false);
 assert.equal(checkEnvironment({role:'web',env:{...env,SWITCHBOARD_FEED_PROTOS:'{}'},config}).configurationValid,false);
});
test('dry-run keeper needs no signer credentials; execution requires explicit caps and /sign endpoint',async()=>{
 const {config}=await fixture(),env=keeper();assert.equal(checkEnvironment({role:'keeper',env,config}).configurationValid,true);
 env.KEEPER_MODE_FLAG='--execute';assert.equal(checkEnvironment({role:'keeper',env,config}).configurationValid,false);
 Object.assign(env,{KEEPER_REMOTE_SIGNER_URL:'https://signer.example.invalid/sign',KEEPER_REMOTE_SIGNER_TOKEN:signer().SIGNER_AUTH_TOKEN,KEEPER_MAX_LAMPORTS_PER_TX:'50000',KEEPER_DAILY_LAMPORTS:'100000'});
 assert.equal(checkEnvironment({role:'keeper',env,config}).configurationValid,true);
 for(const change of [{KEEPER_REMOTE_SIGNER_URL:'https://signer.example.invalid/health'},{KEEPER_REMOTE_SIGNER_URL:'https://user:pass@signer.example.invalid/sign'},{KEEPER_REMOTE_SIGNER_URL:'https://signer.example.invalid/sign?token=test'},{KEEPER_MAX_LAMPORTS_PER_TX:'0'},{KEEPER_DAILY_LAMPORTS:'49999'},{KEEPER_MAX_LAMPORTS_PER_TX:'18446744073709551616'},{KEEPER_INTERVAL_MS:'999'},{KEEPER_TASKS:'unknown'}])assert.equal(checkEnvironment({role:'keeper',env:{...env,...change},config}).configurationValid,false);
});
test('signer checks explicit opt-in, full KMS region binding, role and independent fee budgets',async()=>{
 const {config}=await fixture(),env=signer();assert.equal(checkEnvironment({role:'signer',env,config}).configurationValid,true);
 for(const change of [{SIGNER_ENABLE:''},{AWS_REGION:'us-west-2'},{KMS_KEY_ARN:'alias/test-only'},{SIGNER_ROLE:'admin'},{SIGNER_AUTH_TOKEN:'short'},{SIGNER_DAILY_LAMPORTS:'49999'},{SIGNER_HOST_PORT:'80'},{SIGNER_WALLET_ADDRESS:'not-a-key'}])assert.equal(checkEnvironment({role:'signer',env:{...env,...change},config}).configurationValid,false);
});
test('buybacks require separate pinned asset/input budgets and consistent minimum threshold',async()=>{
 const {config}=await fixture(),env={...keeper(),KEEPER_TASKS:'buybacks',KEEPER_BUYBACK_ASSET:'xSOL',KEEPER_BUYBACK_MAX_INPUT_BASE_UNITS:'100',KEEPER_BUYBACK_DAILY_INPUT_BASE_UNITS:'200'};
 assert.equal(checkEnvironment({role:'keeper',env,config}).configurationValid,true);
 for(const change of [{KEEPER_BUYBACK_ASSET:'any'},{KEEPER_BUYBACK_MAX_INPUT_BASE_UNITS:'0'},{KEEPER_BUYBACK_DAILY_INPUT_BASE_UNITS:'99'},{KEEPER_BUYBACK_MIN_INPUT_BASE_UNITS:'101'}])assert.equal(checkEnvironment({role:'keeper',env:{...env,...change},config}).configurationValid,false);
});
test('launch JSON overrides the committed draft and rejects unknown roles',async()=>{
 const {config}=await fixture();assert.equal(checkEnvironment({role:'web',env:{...web(),LEVERMEME_LAUNCH_CONFIG:JSON.stringify(config)},config:{}}).configurationValid,true);
 assert.equal(checkEnvironment({role:'web',env:web(),config:{}}).configurationValid,false);
 assert.throws(()=>checkEnvironment({role:'deploy',env:web(),config}),/Choose web/);
});
test('check-env CLI exits nonzero without echoing invalid launch JSON',()=>{
 const sentinel='DO-NOT-ECHO-CLI-TEST';const result=spawnSync(process.execPath,['scripts/check-env.mjs','web'],{cwd:new URL('../',import.meta.url),env:{...process.env,LEVERMEME_LAUNCH_CONFIG:sentinel},encoding:'utf8'});
 assert.equal(result.status,1);assert(!result.stdout.includes(sentinel));assert(!result.stderr.includes(sentinel));assert.equal(JSON.parse(result.stdout).configurationValid,false);
});
