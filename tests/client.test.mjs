import test from 'node:test';
import assert from 'node:assert/strict';
import { getAddressDecoder } from '@solana/kit';
import { getProtocolEncoder, getProtocolDecoder,
  getRequestListingInstructionDataEncoder, getRequestListingInstructionDataDecoder,
  getDepositInstructionDataEncoder, getWithdrawInstructionDataEncoder } from '../clients/program.mjs';
const key = n => getAddressDecoder().decode(new Uint8Array(32).fill(n));
test('IDL-generated custody client preserves u64 values without floating-point coercion',()=>{
 const max=(1n<<64n)-1n;
 const bytes=getRequestListingInstructionDataEncoder().encode({solLamports:max,tokenAmount:max});
 const decoded=getRequestListingInstructionDataDecoder().decode(bytes);
 assert.equal(decoded.solLamports,max); assert.equal(decoded.tokenAmount,max);
 assert.notDeepEqual(getDepositInstructionDataEncoder().encode({amount:1n}).slice(0,8),getWithdrawInstructionDataEncoder().encode({amount:1n}).slice(0,8));
});
test('generated protocol codec roundtrips the published fee policy and counters',()=>{
 const state={version:1,admin:key(1),leverMint:key(10),quoteMint:key(11),
 policy:{burnAmount:100n,minSolLamports:1000000n,feeBps:30,feeShares:[7500,1000,500,1000],feeDestinations:[key(30),key(31),key(33)]},
 paused:true,bump:255,totalBurned:100n,listingCount:1n,initialSupply:1000000n,platformRevenue:10000n,tokenCreatorRevenue:10000n};
 const result=getProtocolDecoder().decode(getProtocolEncoder().encode(state));
 const {discriminator,...rest}=result; assert.equal(discriminator.length,8); assert.deepEqual(rest,state);
});
