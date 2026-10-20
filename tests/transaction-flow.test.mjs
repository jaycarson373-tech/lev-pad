import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createTransactionMessage,setTransactionMessageFeePayer,setTransactionMessageLifetimeUsingBlockhash,compileTransaction,getBase64EncodedWireTransaction,getAddressDecoder,getTransactionDecoder } from '@solana/kit';
import { signPreparedPlan,awaitConfirmation } from '../web/transaction-flow.js';
const key=n=>getAddressDecoder().decode(new Uint8Array(32).fill(n));
const transaction=compileTransaction(setTransactionMessageLifetimeUsingBlockhash({blockhash:key(3),lastValidBlockHeight:100n},setTransactionMessageFeePayer(key(1),createTransactionMessage({version:0}))));
const plan={network:'solana:mainnet',wallet:key(1),wire:getBase64EncodedWireTransaction(transaction),messageHash:createHash('sha256').update(transaction.messageBytes).digest('hex'),simulation:{err:null}};
const signer={address:key(1),modifyAndSignTransactions:async txs=>txs.map(tx=>({...tx,signatures:{[key(1)]:new Uint8Array(64).fill(1)}}))};
test('reviewed transaction is signed without changing its message',async()=>{const signed=await signPreparedPlan(plan,signer);assert(signed.signature);assert.deepEqual([...getTransactionDecoder().decode(Buffer.from(signed.wire,'base64')).messageBytes],[...transaction.messageBytes]);});
test('wrong wallet, failed simulation and preview tampering never request a signature',async()=>{
 let calls=0;const watch={...signer,modifyAndSignTransactions:async()=>{calls++;return[];}};
 for(const invalid of [{...plan,wallet:key(2)},{...plan,simulation:{err:'failed'}},{...plan,messageHash:'0'.repeat(64)},{...plan,network:'solana:devnet'}])await assert.rejects(()=>signPreparedPlan(invalid,watch));assert.equal(calls,0);
});
test('wallet rejection is not broadcast and changed messages are refused',async()=>{
 await assert.rejects(()=>signPreparedPlan(plan,{...signer,modifyAndSignTransactions:async()=>{throw new Error('Rejected');}}),/Rejected/);
 await assert.rejects(()=>signPreparedPlan(plan,{...signer,modifyAndSignTransactions:async txs=>txs.map(tx=>({...tx,messageBytes:new Uint8Array([1])}))}),/changed/);
});
test('confirmation requires confirmed status, not merely processed',async()=>{
 let calls=0;const status=await awaitConfirmation('sig',100,{wait:async()=>{},request:async()=>({status:{confirmationStatus:++calls===1?'processed':'confirmed'},blockHeight:99})});assert.equal(calls,2);assert.equal(status.confirmationStatus,'confirmed');
});
test('onchain failure, expiry and unconfirmed timeout remain failures',async()=>{
 for(const result of [{status:{err:{InstructionError:[0,1]}},blockHeight:99},{status:null,blockHeight:101},{status:null,blockHeight:99}])await assert.rejects(()=>awaitConfirmation('sig',100,{attempts:2,wait:async()=>{},request:async()=>result}));
});
