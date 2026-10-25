// Transaction-construction fixtures only. Real token movement is tested in LiteSVM.
import test from 'node:test';
import assert from 'node:assert/strict';
import { getCompiledTransactionMessageDecoder,getTransactionDecoder,getBase64EncodedWireTransaction } from '@solana/kit';
import { baseUnits,buildAction,prepareAction,inspectWire,submitTransaction } from '../lib/transactions.mjs';
import * as sdk from '../clients/program.mjs';
import { fixture,key,account } from './helpers/protocol-fixture.mjs';
async function setup(){
 const f=await fixture(),program={programAddress:f.config.programAddress};
 Object.assign(f.config,{custodyEnabled:true,tradingEnabled:true,securityReviewUrl:'https://review.invalid/fixture',acceptanceReportUrl:'https://acceptance.invalid/fixture'});
 const wallet=key(4),[margin]=await sdk.findMarginPda({protocol:f.protocol,owner:wallet},program),[vault]=await sdk.findQuoteVaultPda({margin},program);
 f.records.set(margin,account(f.config.programAddress,sdk.getMarginAccountEncoder().encode({protocol:f.protocol,owner:wallet,vault,balance:1000000n,locked:0n,nextPositionId:0n,bump:255})));
 const read=async(method,params)=>{
  if(method==='getLatestBlockhash')return {value:{blockhash:key(3),lastValidBlockHeight:100}};
  if(method==='getBalance')return {value:1000000000};
  if(method==='simulateTransaction')return {value:{err:null,unitsConsumed:30000,logs:[],accounts:[{lamports:999990000}]}};
  if(method==='getFeeForMessage')return {value:5100};return f.read(method,params);
 };
 return {...f,wallet,margin,vault,read};
}
test('base-unit conversion rejects decimals, unsafe units and integer overflow',()=>{
 assert.equal(baseUnits('1.25',6),1250000n);assert.equal(baseUnits('0.000000001',9),1n);
 for(const bad of ['-1','1e9','NaN','0','1.0000001','18446744073709551616'])assert.throws(()=>baseUnits(bad,6));
});
test('deposit and withdrawal build generated instructions for the pinned protocol',async()=>{
 const f=await setup();
 for(const action of ['deposit','withdraw']){
  const plan=await prepareAction({action,wallet:f.wallet,amount:'1.25'},f.config,f.read);
  assert.equal(plan.network,'solana:mainnet');assert.equal(plan.simulation.err,null);assert.equal(plan.protocolAddress,f.protocol);
  const tx=inspectWire(plan.wire,f.config),message=getCompiledTransactionMessageDecoder().decode(tx.messageBytes);
  assert.equal(message.staticAccounts[0],f.wallet);assert(message.staticAccounts.includes(f.protocol));assert(message.staticAccounts.includes(f.vault));
  const own=message.instructions.find(ix=>message.staticAccounts[ix.programAddressIndex]===f.config.programAddress);
  const decoded=(action==='deposit'?sdk.getDepositInstructionDataDecoder():sdk.getWithdrawInstructionDataDecoder()).decode(own.data);assert.equal(decoded.amount,1250000n);
 }
});
test('simulation failure prevents a prepared wallet request',async()=>{
 const f=await setup();await assert.rejects(()=>prepareAction({action:'deposit',wallet:f.wallet,amount:'1'},f.config,(method,params)=>method==='simulateTransaction'?{value:{err:{InstructionError:[0,1]}}}:f.read(method,params)),/Simulation rejected/);
});
test('missing simulation success cannot reach review or the relay broadcast',async()=>{
 const f=await setup();
 const plan=await prepareAction({action:'withdraw',wallet:f.wallet,amount:'1'},f.config,f.read);
 const tx=getTransactionDecoder().decode(Buffer.from(plan.wire,'base64'));
 // Synthetic nonzero signatures exercise rejection before any send; never submitted.
 const wire=getBase64EncodedWireTransaction({...tx,signatures:Object.fromEntries(Object.keys(tx.signatures).map(k=>[k,new Uint8Array(64).fill(1)]))});
 for(const result of [null,{}, {value:null},{value:{unitsConsumed:30000,accounts:[{lamports:999990000}]}},{value:{err:false}}]){
  let sends=0;
  const read=(m,p)=>{if(m==='simulateTransaction')return result;if(m==='sendTransaction'){sends++;throw Error('must not broadcast');}return f.read(m,p);};
  await assert.rejects(prepareAction({action:'withdraw',wallet:f.wallet,amount:'1'},f.config,read),/Simulation rejected/);
  await assert.rejects(submitTransaction(wire,f.config,read),/simulation failed/);
  assert.equal(sends,0);
 }
});
test('unreviewed funding is denied while owner exits remain constructible',async()=>{
 const f=await setup();const config={...f.config,custodyEnabled:false,tradingEnabled:false};
 await assert.rejects(()=>buildAction({action:'deposit',wallet:f.wallet,amount:'1'},config,f.read),/not activated/);
 const withdrawal=await buildAction({action:'withdraw',wallet:f.wallet,amount:'1'},config,f.read);assert(withdrawal.ixs.length>0);
});
test('initialization uses generated origin PDA derivation and refuses the wrong administrator',async()=>{
 const f=await setup();f.records.delete(f.protocol);
 const input={action:'initialize',wallet:f.config.admin,burnAmount:'100',minSolLamports:'1000000',feeBps:30,feeDestinations:[key(30),key(31),key(33)]};
 const result=await prepareAction(input,f.config,f.read);assert(result.effects.some(e=>e.includes('pump.fun')));
 await assert.rejects(()=>buildAction({...input,wallet:key(7)},f.config,f.read),/administrator/);
});
test('relay does not accept an unrelated program or an invalid wire encoding',async()=>{
 const f=await setup();const plan=await prepareAction({action:'withdraw',wallet:f.wallet,amount:'1'},f.config,f.read);
 assert.throws(()=>inspectWire(plan.wire,{...f.config,programAddress:key(22)}),/unapproved/);
 assert.throws(()=>inspectWire('not base64',f.config));assert(getTransactionDecoder().decode(Buffer.from(plan.wire,'base64')).messageBytes.length);
});
