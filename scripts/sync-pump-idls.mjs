// Regenerate external reference fixtures from a pinned, official public commit.
// Downloads data only; no remote JavaScript is executed.
import { mkdir,writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const commit='639b87fb45c3adeffa6f7c4a1bf0cb85e392bf22';
const directory=new URL('../idl/external/',import.meta.url);await mkdir(directory,{recursive:true});
for(const [file,names] of [['pump.json',['collect_creator_fee','collect_creator_fee_v2']],['pump_amm.json',['collect_coin_creator_fee']]]){
 const source='https://raw.githubusercontent.com/pump-fun/pump-public-docs/'+commit+'/idl/'+file;
 const response=await fetch(source,{signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error('Official IDL download failed');
 const raw=await response.text(),idl=JSON.parse(raw);
 const selected={source,sourceSha256:createHash('sha256').update(raw).digest('hex'),address:idl.address,instructions:idl.instructions.filter(ix=>names.includes(ix.name)),accounts:idl.accounts.filter(a=>['BondingCurve','Pool'].includes(a.name)),types:idl.types.filter(t=>['BondingCurve','Pool'].includes(t.name))};
 if(selected.instructions.length!==names.length)throw new Error('External IDL instructions changed');
 await writeFile(new URL(file,directory),JSON.stringify(selected,null,2)+'\n');
}
console.log('Pinned Pump instruction/account reference data refreshed. Review changes before use.');
