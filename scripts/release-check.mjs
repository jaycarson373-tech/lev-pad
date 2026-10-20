import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { launchConfig,validateLaunch,runtimeSnapshot } from '../lib/deployment.mjs';

// Read-only mainnet activation gate; never loads keys or sends transactions.
const config=launchConfig(),blockers=validateLaunch(config);
const report={network:config.network,checkedAt:new Date().toISOString(),ready:false,blockers};
if(!blockers.length){
 try{
  const idl=JSON.parse(await readFile(new URL('../idl/levermeme.json',import.meta.url),'utf8'));
  if(idl.address!==config.programAddress)blockers.push('Regenerate IDL and client for the chosen program identity.');
  const artifact=await readFile(new URL('../onchain/target/sbf-solana-solana/release/levermeme.so',import.meta.url));
  if(artifact.length!==config.programSize||createHash('sha256').update(artifact).digest('hex')!==config.programSha256)blockers.push('Local SBF artifact differs from configured release hash/size.');
  const live=await runtimeSnapshot(null,config);
  report.programAddress=live.programAddress;report.markets=live.markets.length;
  if(!live.protocol)blockers.push('Protocol has not been initialized.');
  if(live.protocol?.paused)blockers.push('Protocol is paused.');
  if(!live.custodyEnabled||!live.tradingEnabled)blockers.push('Website release flags/review report references are incomplete.');
  if(!live.markets.some(m=>m.enabled&&m.priceFresh&&m.approved&&BigInt(m.liquidity)>=BigInt(m.risk.minimumLiquidity)))blockers.push('No approved, enabled market with fresh oracle and minimum liquidity.');
  if(!process.env.SOLANA_RPC_URL)blockers.push('Production RPC endpoint has not been configured.');
 }catch(error){blockers.push(error.message);}
}
report.ready=blockers.length===0;
report.scope='Operational identity/configuration checks only. Report URLs are references, not proof of an audit. Independent economic/security review, real oracle acceptance, secure signer/keeper deployment and funded acceptance remain human release requirements.';
console.log(JSON.stringify(report,null,2));
if(!report.ready)process.exitCode=1;
