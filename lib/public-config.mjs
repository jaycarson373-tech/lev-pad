// Shared browser/server schema: public setup only. No secret-key input exists.
import { address } from '@solana/kit';
export const PUBLIC_FIELDS=['network','programAddress','admin','leverMint','quoteMint','programSha256','programSize','upgradeAuthority','custodyEnabled','tradingEnabled','securityReviewUrl','acceptanceReportUrl'];
export const TEMPLATE_PROGRAM='Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t';
const ZERO='11111111111111111111111111111111';
export function publicConfig(input,{draft=true,disableFunding=false}={}){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Enter public launch settings.');
 for(const key of Object.keys(input))if(!PUBLIC_FIELDS.includes(key))throw new Error(/private|secret|seed|keypair|password/i.test(key)?'Signing keys are not accepted. Connect a wallet or secure signer instead.':'Unknown launch setting.');
 const config={network:'solana:mainnet',programAddress:null,admin:null,leverMint:null,quoteMint:null,programSha256:null,programSize:null,upgradeAuthority:null,custodyEnabled:false,tradingEnabled:false,securityReviewUrl:null,acceptanceReportUrl:null,...input};
 if(config.network!=='solana:mainnet')throw new Error('This launch profile is Solana mainnet only.');
 for(const key of ['programAddress','admin','leverMint','quoteMint','upgradeAuthority']){
  if(config[key]===null||config[key]===''){config[key]=null;if(!draft&&key!=='upgradeAuthority')throw new Error(key+' is required.');continue;}
  if(typeof config[key]!=='string'||config[key].length>44)throw new Error(key+' must be a public Solana address, never a key.');
  try{address(config[key]);}catch{throw new Error(key+' must be a valid public Solana address.');}
  if(config[key]===ZERO)throw new Error(key+' cannot be the System Program address.');
 }
 if(config.programAddress===TEMPLATE_PROGRAM)throw new Error('The template program is for local tests. Choose the secure deployment’s public program identity.');
 if(config.leverMint&&config.leverMint===config.quoteMint)throw new Error('LeverMeme and xSOL must have different mint addresses.');
 if(config.programSha256!==null&&config.programSha256!==''&&!/^[a-f0-9]{64}$/.test(config.programSha256))throw new Error('Program digest must be a SHA-256 hex value.');
 config.programSha256=config.programSha256||null;
 if(config.programSize!==null&&config.programSize!==''&&(!Number.isSafeInteger(config.programSize)||config.programSize<100||config.programSize>2000000))throw new Error('Program size must be 100–2,000,000 bytes.');
 config.programSize=config.programSize||null;
 for(const key of ['custodyEnabled','tradingEnabled'])if(typeof config[key]!=='boolean')throw new Error('Release toggles must be true or false.');
 for(const key of ['securityReviewUrl','acceptanceReportUrl']){
  if(!config[key]){config[key]=null;continue;}
  try{const url=new URL(config[key]);if(typeof config[key]!=='string'||config[key].length>2048||url.protocol!=='https:'||url.username||url.password)throw new Error();}catch{throw new Error(key+' must be a public HTTPS report URL.');}
 }
 if(disableFunding){config.custodyEnabled=false;config.tradingEnabled=false;}
 return config;
}
