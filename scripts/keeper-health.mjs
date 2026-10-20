import { readFile } from 'node:fs/promises';
try{
 const state=JSON.parse(await readFile(new URL('../.runtime/keeper-health.json',import.meta.url),'utf8'));
 const age=Date.now()-Date.parse(state.updatedAt);
 if(!Number.isFinite(age)||age<0||age>60000||state.phase==='degraded'||state.phase==='pending'&&(!state.pendingSince||Date.now()-Date.parse(state.pendingSince)>120000))throw new Error('Keeper is stale, degraded or has an unresolved transaction older than two minutes.');
 console.log(JSON.stringify({mode:state.mode,phase:state.phase,ageSeconds:Math.floor(age/1000)}));
}catch{console.error('Keeper health check failed. Inspect private operational logs and reconcile pending signatures.');process.exitCode=1;}
