import { publicConfig } from './public-config.mjs';
import { validateLaunch,verifiedDeployment,runtimeSnapshot } from './deployment.mjs';
import { verifyPumpMint,rpc } from './mainnet-read.mjs';
import * as sdk from '../clients/program.mjs';
export async function activationReport(input,{read=rpc,productionRpc=Boolean(process.env.SOLANA_RPC_URL)}={}){
 const config=publicConfig(input),checks=[];
 const check=(id,label,state,detail)=>checks.push({id,label,state,detail});
 const missing=validateLaunch(config);
 check('public-settings','Public addresses & artifact',missing.length?'pending':'pass',missing.length?missing.join('; '):'Public identities, artifact digest and size are supplied.');
 check('compiled-identity','Release built for this program',config.programAddress&&config.programAddress===sdk.LEVERMEME_PROGRAM_ADDRESS?'pass':'pending','Run npm run setup -- --config <downloaded-file> to rebuild the program/IDL/client and compute the artifact digest without keys.');
 for(const [key,label] of [['leverMint','LeverMeme pump.fun origin'],['quoteMint','xSOL pump.fun origin']]){
  if(!config[key]){check(key,label,'pending','Add the final public mint address.');continue;}
  try{const mint=await verifyPumpMint(config[key],read);check(key,label,'pass','Canonical pump.fun curve verified at finalized slot '+mint.slot+'. Token symbol alone is never used.');}catch{check(key,label,'fail','Mint/origin verification failed or the mainnet RPC could not answer.');}
 }
 let live=null;
 if(missing.length){check('deployment','Deployed program & authority','pending','Apply the final public setup, rebuild, then deploy the exact artifact with your secure signer.');}
 else try{
  await verifiedDeployment(config,read);check('deployment','Deployed program & authority','pass','Mainnet genesis, executable owner, ProgramData PDA, bytecode digest and upgrade authority match.');
  live=await runtimeSnapshot(null,config,read);
 }catch{check('deployment','Deployed program & authority','fail','The exact deployed artifact/authority/protocol could not be verified. No funding is enabled by this check.');}
 check('initialization','Initialize paused protocol',live?.protocol?'pass':'pending',live?.protocol?'Protocol v3 and token identities verified.':'After deploying, connect the configured operator in this console and review initialization.');
 const active=live?.markets?.filter(m=>!m.closed&&m.enabled&&m.approved&&m.priceFresh&&BigInt(m.liquidity)>=BigInt(m.risk.minimumLiquidity)).length??0;
 check('markets','Real reserves & verified oracle',active?'pass':'pending',active?active+' enabled market(s) have fresh verified marks and minimum xSOL capital.':'The initial registry stays empty. Each admitted market needs actual xSOL capital, pinned oracle jobs and explicit activation.');
 check('rpc','Production RPC',productionRpc?'configured':'pending',productionRpc?'Server RPC is configured; availability is checked during on-chain reads.':'Set a server-side mainnet RPC endpoint for reliable production traffic.');
 check('review','Review & funded acceptance',config.securityReviewUrl&&config.acceptanceReportUrl?'recorded':'pending','Report references are not proof of a review. Publish real independent review and confirmed funded acceptance receipts before enabling public funding.');
 check('release','Public funding switch',live?.custodyEnabled&&live?.tradingEnabled&&!live?.protocol?.paused?'pass':'locked','Checking/exporting setup never enables deposits, unpauses contracts, signs or sends a transaction.');
 return {network:config.network,checkedAt:new Date().toISOString(),phase:missing.length?'waiting_for_final_setup':live?.protocol?'protocol_verified':'waiting_for_deployment',checks,activeMarkets:active,publicTradingEnabled:Boolean(live?.tradingEnabled&&!live?.protocol?.paused),next:missing.length?'Save the setup draft now; add the final public addresses when you have them.':'Follow the next pending step in the operator console. Wallet approval is required for every write.'};
}
