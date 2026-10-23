import { address } from '@solana/kit';
import { publicConfig } from './public-config.mjs';
import { validateLaunch } from './deployment.mjs';

// Presence/shape validation only. Never returns configuration values, URLs,
// tokens, IAM credentials, signing material, or a claim of live acceptance.
export function checkEnvironment({role,env,config}){
 if(!['web','keeper','signer'].includes(role))throw new Error('Choose web, keeper or signer.');
 const issues=[],checks=[];
 const check=(name,valid,requirement)=>{checks.push({name,state:valid?'pass':'missing-or-invalid'});if(!valid)issues.push({name,requirement});};
 const https=(value,{origin=false}={})=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.hash&&(!origin||u.pathname==='/'&&!u.search);}catch{return false;}};
 const validAddress=value=>{try{address(value);return value!=='11111111111111111111111111111111';}catch{return false;}};
 const token=value=>typeof value==='string'&&value.length>=32&&!/\s/.test(value);
 const integer=value=>typeof value==='string'&&/^\d{1,20}$/.test(value)&&BigInt(value)>0n&&BigInt(value)<=(1n<<64n)-1n;
 const budgets=(prefix)=>{
  const per=env[prefix+'_MAX_LAMPORTS_PER_TX'],daily=env[prefix+'_DAILY_LAMPORTS'];
  check(prefix+'_MAX_LAMPORTS_PER_TX',integer(per),'Positive operator-approved per-action lamport cap.');
  check(prefix+'_DAILY_LAMPORTS',integer(daily)&&integer(per)&&BigInt(daily)>=BigInt(per),'Daily reservation cap at least equal to one per-action cap.');
 };
 let launch;
 try{launch=publicConfig(env.LEVERMEME_LAUNCH_CONFIG?JSON.parse(env.LEVERMEME_LAUNCH_CONFIG):config);}
 catch{check('LEVERMEME_LAUNCH_CONFIG',false,'Valid public-only launch JSON; values are not printed.');}
 if(launch)check('LEVERMEME_LAUNCH_CONFIG',validateLaunch(launch).length===0,'Complete final public identities, artifact digest/size and expected upgrade authority.');
 check('SOLANA_RPC_URL',https(env.SOLANA_RPC_URL),'Your project-specific server-side HTTPS mainnet RPC; not the shared development proxy.');
 for(const name of ['PRIVATE_KEY','SOLANA_PRIVATE_KEY','WALLET_PRIVATE_KEY','OPERATOR_PRIVATE_KEY','SOLANA_KEYPAIR','SEED_PHRASE'])if(env[name])check(name,false,'Remove wallet signing material. Wallets/KMS retain keys.');
 if(role==='web'||role==='keeper'){
  const cached=env.SWITCHBOARD_FEED_PROTOS;let jobs=false;
  if(cached)try{const entries=Object.entries(JSON.parse(cached));jobs=entries.length>=2&&entries.length<=128&&entries.every(([hash,data])=>/^[a-f0-9]{64}$/i.test(hash)&&typeof data==='string'&&data.length>0&&data.length<=64000&&/^[A-Za-z0-9+/]+=*$/.test(data));}catch{}
  check('SWITCHBOARD_GATEWAY_URL',https(env.SWITCHBOARD_GATEWAY_URL,{origin:true}),'Reviewed explicit HTTPS gateway origin for signed oracle responses.');
  check('SWITCHBOARD_CROSSBAR_URL or SWITCHBOARD_FEED_PROTOS',https(env.SWITCHBOARD_CROSSBAR_URL,{origin:true})||jobs,'Reviewed Crossbar origin OR cached spot/TWAP public job protobufs.');
 }
 let mode='configuration-only';
 if(role==='keeper'){
  mode=env.KEEPER_MODE_FLAG||'--dry-run';
  check('KEEPER_MODE_FLAG',['--dry-run','--execute'].includes(mode),'Use --dry-run first; --execute requires explicit operating approval.');
  check('KEEPER_WALLET_ADDRESS',validAddress(env.KEEPER_WALLET_ADDRESS),'Public managed signer wallet used to pay keeper transaction fees.');
  check('KEEPER_TASKS',(env.KEEPER_TASKS||'markets').split(',').every(t=>['markets','creator-fees','buybacks'].includes(t)),'markets for the initial trading keeper.');
  const interval=Number(env.KEEPER_INTERVAL_MS||2000);check('KEEPER_INTERVAL_MS',Number.isInteger(interval)&&interval>=1000&&interval<=30000,'1000–30000 ms; choose cadence compatible with approved oracle freshness.');
  if(mode==='--execute'){
   let signingEndpoint=false;try{const url=new URL(env.KEEPER_REMOTE_SIGNER_URL);signingEndpoint=https(url)&&url.pathname==='/sign'&&!url.search;}catch{}
   check('KEEPER_REMOTE_SIGNER_URL',signingEndpoint,'Authenticated HTTPS signing endpoint ending in /sign, without a query string.');
   check('KEEPER_REMOTE_SIGNER_TOKEN',token(env.KEEPER_REMOTE_SIGNER_TOKEN),'Match the signing service access token (>=32 whitespace-free characters).');budgets('KEEPER');
  }
 }
 if(role==='signer'){
  mode=env.SIGNER_ENABLE==='I_ACCEPT_POLICY_BOUND_SIGNING'?'enabled':'disabled';
  check('SIGNER_ENABLE',mode==='enabled','Explicit I_ACCEPT_POLICY_BOUND_SIGNING opt-in for starting the reviewed signer.');
  check('SIGNER_WALLET_ADDRESS',validAddress(env.SIGNER_WALLET_ADDRESS),'Public key of the existing KMS Ed25519 key.');
  check('SIGNER_ROLE',['markets','creator-fees','buybacks'].includes(env.SIGNER_ROLE),'markets for the initial trading keeper.');
  check('SIGNER_AUTH_TOKEN',token(env.SIGNER_AUTH_TOKEN),'Strong access token matching the keeper token; no whitespace.');budgets('SIGNER');
  const arn=/^arn:aws(?:-[a-z-]+)?:kms:([a-z0-9-]+):\d{12}:key\/[A-Za-z0-9-]+$/.exec(env.KMS_KEY_ARN||'');
  check('AWS_REGION / KMS_KEY_ARN',Boolean(arn&&arn[1]===env.AWS_REGION),'Pin the full existing key ARN and matching region, not an alias.');
  const port=Number(env.SIGNER_HOST_PORT||8787);check('SIGNER_HOST_PORT',Number.isInteger(port)&&port>=1024&&port<=65535,'Unprivileged host port 1024–65535, bound to loopback only by Compose.');
 }
 // Revenue automation has additional input budgets, independent of SOL fees.
 const buyback=role==='signer'?env.SIGNER_ROLE==='buybacks':role==='keeper'&&(env.KEEPER_TASKS||'markets').split(',').includes('buybacks');
 if(buyback){
  const prefix=role==='signer'?'SIGNER':'KEEPER',asset=env[prefix+'_BUYBACK_ASSET'],per=env[prefix+'_BUYBACK_MAX_INPUT_BASE_UNITS'],daily=env[prefix+'_BUYBACK_DAILY_INPUT_BASE_UNITS'];
  check(prefix+'_BUYBACK_ASSET',['xSOL','SOL','WSOL'].includes(asset),'One pinned input asset for this separate revenue worker.');
  check(prefix+'_BUYBACK_MAX_INPUT_BASE_UNITS',integer(per),'Positive per-buyback token input cap.');
  check(prefix+'_BUYBACK_DAILY_INPUT_BASE_UNITS',integer(daily)&&integer(per)&&BigInt(daily)>=BigInt(per),'Daily input cap at least equal to per-action input cap.');
  if(role==='keeper'){const min=env.KEEPER_BUYBACK_MIN_INPUT_BASE_UNITS||'1';check('KEEPER_BUYBACK_MIN_INPUT_BASE_UNITS',integer(min)&&integer(per)&&BigInt(min)<=BigInt(per),'Positive threshold no greater than the per-action cap.');}
 }
 return {role,mode,configurationValid:issues.length===0,checks,issues,scope:'Static environment validation only. Does not connect to KMS, simulate, sign, broadcast, unpause, enable funding or prove operational readiness.'};
}
