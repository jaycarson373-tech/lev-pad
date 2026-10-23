import { readFile } from 'node:fs/promises';
import { checkEnvironment } from '../lib/environment-check.mjs';
const role=process.argv[2]||'web';
try{
 const config=JSON.parse(await readFile(new URL('../config/launch.json',import.meta.url),'utf8'));
 const report=checkEnvironment({role,env:process.env,config});
 console.log(JSON.stringify(report,null,2));if(!report.configurationValid)process.exitCode=1;
}catch{console.error('Environment check failed. Choose web, keeper or signer and supply valid configuration. No values are printed.');process.exitCode=1;}
