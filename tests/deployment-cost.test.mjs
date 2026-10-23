import test from 'node:test';
import assert from 'node:assert/strict';
import { deploymentCost } from '../lib/deployment-cost.mjs';
import { MAINNET_GENESIS } from '../lib/mainnet-read.mjs';
test('deployment estimate queries actual mainnet rent for exact capacity without signing',async()=>{
 const calls=[];
 const read=async(method,params)=>{calls.push([method,params]);if(method==='getGenesisHash')return MAINNET_GENESIS;assert.equal(method,'getMinimumBalanceForRentExemption');return params[0]*10;};
 const result=await deploymentCost({programSize:1000000,read});
 assert.equal(result.accounts.programData.bytes,1000045);assert.equal(result.accounts.temporaryBuffer.bytes,1000037);assert.equal(result.retainedProgramRentSol,'0.010000810');
 assert.equal(calls.length,6);assert(result.notes.some(x=>x.includes('NOT included')));
});
test('cost estimate refuses the wrong chain, unsafe sizes and invalid RPC rent',async()=>{
 await assert.rejects(()=>deploymentCost({programSize:64,read:async()=> 'devnet'}),/network/);
 for(const input of [{programSize:0},{programSize:100,capacityBytes:99},{programSize:10485760}])await assert.rejects(()=>deploymentCost(input),/size/);
 await assert.rejects(()=>deploymentCost({programSize:64,read:async m=>m==='getGenesisHash'?MAINNET_GENESIS:NaN}),/invalid rent/);
});
