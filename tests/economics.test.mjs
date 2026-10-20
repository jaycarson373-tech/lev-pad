import {test} from 'node:test';
import assert from 'node:assert/strict';
import {allocateRevenue,airdropBudget,policy} from '../lib/economics.mjs';
test('latest platform policy conserves fees at 75/10/5/10',()=>{assert.deepEqual(allocateRevenue(10000n,policy.platformRevenueBps),{liquidityAndInsurance:7500n,userCampaigns:1000n,marketCreator:500n,buybackAndBurn:1000n});});
test('creator revenue is 50/50 and odd-unit dust stays in treasury',()=>{assert.deepEqual(allocateRevenue(101n,policy.leverMemeCreatorRevenueBps),{treasuryAndInsurance:51n,buybackAndBurn:50n});});
test('airdrop allocation is separate and capped at 10% of supply',()=>{assert.equal(airdropBudget(1000000000n),100000000n);assert.equal(airdropBudget(9n),0n);});
test('no money is lost across fee distributions',()=>{for(let i=0n;i<10000n;i++){const split=allocateRevenue(i,policy.platformRevenueBps);assert.equal(Object.values(split).reduce((sum,x)=>sum+x,0n),i);}});
test('invalid fee shares, negative amounts and u64 overflow fail',()=>{assert.throws(()=>allocateRevenue(1n,{a:1}));assert.throws(()=>allocateRevenue(-1n,{a:10000}));assert.throws(()=>allocateRevenue(18446744073709551616n,{a:10000}));});
