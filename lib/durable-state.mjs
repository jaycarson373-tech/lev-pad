import { mkdir,readFile,open,rename,unlink } from 'node:fs/promises';

// One process, one durable state volume. Atomic rename + file/directory fsync.
// A separate marker distinguishes first setup from a lost budget/pending file.
export async function durableState({directory,name,initialize,validate}){
 if(!/^[a-z][a-z-]{0,30}$/.test(name))throw new Error('Invalid durable state name.');
 const path=new URL(name+'-state.json',directory),lockPath=new URL(name+'.lock',directory),markerPath=new URL(name+'.initialized',directory);
 await mkdir(directory,{recursive:true});const lock=await open(lockPath,'wx',0o600);let released=false;
 const syncDirectory=async()=>{const dir=await open(directory,'r');try{await dir.sync();}finally{await dir.close();}};
 const close=async()=>{if(released)return;await lock.close();await unlink(lockPath);released=true;};
 async function load(initial=false){
  let value;
  try{value=JSON.parse(await readFile(path,'utf8'));}
  catch(error){if(error.code!=='ENOENT'||!initial)throw new Error('Durable state missing/unreadable/corrupt. Reconcile before restarting.');}
  if(value===undefined&&initial)return validate(initialize());
  if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Durable state corrupt. Reconcile before restarting.');
  return validate(value);
 }
 async function save(value){
  validate(value);
  const temp=new URL(name+'-state.tmp',directory),file=await open(temp,'w',0o600);
  try{await file.writeFile(JSON.stringify(value));await file.sync();}finally{await file.close();}
  await rename(temp,path);await syncDirectory();
 }
 try{
  await lock.writeFile(String(process.pid));
  let initialized=false;try{await readFile(markerPath);initialized=true;}catch(error){if(error.code!=='ENOENT')throw error;}
  await save(await load(!initialized));
  if(!initialized){
   const marker=await open(markerPath,'wx',0o600);
   try{await marker.writeFile('Durable state exists. Never remove this marker to reset budgets or pending signatures.\n');await marker.sync();}finally{await marker.close();}
   await syncDirectory();
  }
 }catch(error){await close();throw error;}
 return {load:()=>load(false),save,close};
}
