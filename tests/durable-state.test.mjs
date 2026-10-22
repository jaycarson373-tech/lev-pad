import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp,rm,writeFile,unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { durableState } from '../lib/durable-state.mjs';
import { keeperState,reserveKeeperBudget } from '../lib/keeper-state.mjs';
import { key } from './helpers/protocol-fixture.mjs';
const context={wallet:key(1),programAddress:key(2),asset:'xSOL'};
async function setup(t){
 const directory=pathToFileURL(await mkdtemp(join(tmpdir(),'levermeme-state-test-'))+'/');
 const options={directory,name:'keeper',initialize:()=>keeperState(null,context),validate:value=>keeperState(value,context)};
 const store=await durableState(options);
 t.after(async()=>{await store.close();await rm(directory,{recursive:true,force:true});});
 return {directory,options,store};
}
test('actual keeper durable store preserves budget and unresolved signature across restart',async t=>{
 const f=await setup(t);let state=reserveKeeperBudget(await f.store.load(),{day:'2026-10-22',maxLamports:100n,dailyLamports:200n,buybackUnits:10n,dailyBuybackUnits:20n});
 state.pending={signature:'2'.repeat(88),messageHash:'ab'.repeat(32),lastValidBlockHeight:200,submittedAt:'2026-10-22T12:00:00Z'};
 await f.store.save(state);await f.store.close();const reopened=await durableState(f.options);
 try{assert.deepEqual(await reopened.load(),state);}finally{await reopened.close();}
});
test('initialized keeper cannot silently discard an unresolved signature when its state is lost',async t=>{
 const f=await setup(t);await unlink(new URL('keeper-state.json',f.directory));
 await assert.rejects(()=>f.store.load(),/missing/);await f.store.close();
 await assert.rejects(()=>durableState(f.options),/missing/);
});
test('JSON null, empty objects and wrong namespace are corruption, not first-run keeper state',async t=>{
 const f=await setup(t);
 for(const value of [null,{},[],{...keeperState(null,context),wallet:key(3)}]){
  await writeFile(new URL('keeper-state.json',f.directory),JSON.stringify(value));
  await assert.rejects(()=>f.store.load(),/corrupt|different/);
 }
});
