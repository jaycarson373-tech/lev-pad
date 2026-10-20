import test from 'node:test';
import assert from 'node:assert/strict';
import { publicConfig } from '../lib/public-config.mjs';
import { activationReport } from '../lib/activation.mjs';
import { keeperState,reserveKeeperBudget } from '../lib/keeper-state.mjs';
import { key } from './helpers/protocol-fixture.mjs';
test('setup drafts accept deferred public values and cannot enable funding accidentally',()=>{
 const draft=publicConfig({admin:key(1),custodyEnabled:true,tradingEnabled:true},{disableFunding:true});
 assert.equal(draft.admin,key(1));assert.equal(draft.leverMint,null);assert.equal(draft.custodyEnabled,false);assert.equal(draft.tradingEnabled,false);
 assert.throws(()=>publicConfig(draft,{draft:false}),/required/);
});
test('setup rejects key fields, invalid identities, template, mixed assets and unsafe URLs',()=>{
 for(const input of [{privateKey:'not-a-real-key'},{nested:{}},{admin:'not-an-address'},{programAddress:'Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t'},{leverMint:key(10),quoteMint:key(10)},{securityReviewUrl:'http://example.invalid'},{custodyEnabled:'true'}])assert.throws(()=>publicConfig(input));
});
test('unconfigured activation report explains a safe next step without RPC or writes',async()=>{
 const result=await activationReport({}, {read:()=>{throw new Error('No RPC expected');},productionRpc:false});
 assert.equal(result.phase,'waiting_for_final_setup');assert.equal(result.publicTradingEnabled,false);assert.equal(result.activeMarkets,0);assert.equal(result.checks.find(c=>c.id==='release').state,'locked');
});
test('keeper state corruption and wallet/program/asset substitutions cannot reset budgets',()=>{
 const context={wallet:key(1),programAddress:key(2),asset:'xSOL'},state=keeperState(null,context);
 assert.deepEqual(keeperState(state,context),state);
 for(const change of [{wallet:key(3)},{programAddress:key(3)},{asset:'SOL'},{reservedLamports:'oops'},{pending:{signature:'invalid'}}])assert.throws(()=>keeperState({...state,...change},context),/corrupt|different/);
});
test('keeper reserves SOL and token budgets before signing, including failures',()=>{
 let state=keeperState(null,{wallet:key(1),programAddress:key(2)}),policy={day:'2026-10-20',maxLamports:100n,dailyLamports:200n,buybackUnits:50n,dailyBuybackUnits:75n};
 state=reserveKeeperBudget(state,policy);assert.equal(state.reservedLamports,'100');assert.equal(state.reservedBuybackUnits,'50');
 assert.throws(()=>reserveKeeperBudget(state,policy),/budget exhausted/);
 assert.throws(()=>reserveKeeperBudget(state,{...policy,day:'2026-10-19'}),/backwards/);
 assert.equal(reserveKeeperBudget(state,{...policy,day:'2026-10-21'}).reservedBuybackUnits,'50');
});
