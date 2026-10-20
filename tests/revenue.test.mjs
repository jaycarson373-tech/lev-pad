import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { findAssociatedTokenPda } from '@solana-program/token';
import { jupiterBuyback,JUPITER_PROGRAM,CLASSIC_TOKEN,creatorFeeInstructions } from '../lib/revenue.mjs';
import { buildAction } from '../lib/transactions.mjs';
import { fixture,key,account } from './helpers/protocol-fixture.mjs';
import { getAddressEncoder,getProgramDerivedAddress } from '@solana/kit';
import { PUMP_PROGRAM,CURVE_DISCRIMINATOR } from '../lib/mainnet-read.mjs';
async function routeFixture(){
 const wallet=key(33),inputMint=key(11),outputMint=key(10);
 const ata=async mint=>(await findAssociatedTokenPda({owner:wallet,mint,tokenProgram:CLASSIC_TOKEN}))[0];
 const response={inputMint,outputMint,inAmount:'100',outAmount:'200',otherAmountThreshold:'199',swapMode:'ExactIn',slippageBps:50,priceImpactPct:'0.001',routePlan:[{percent:100}],setupInstructions:[],otherInstructions:[],cleanupInstruction:null,tipInstruction:null,addressesByLookupTableAddress:{},swapInstruction:{programId:JUPITER_PROGRAM,data:Buffer.alloc(8,1).toString('base64'),accounts:[{pubkey:wallet,isSigner:true,isWritable:false},{pubkey:await ata(inputMint),isSigner:false,isWritable:true},{pubkey:await ata(outputMint),isSigner:false,isWritable:true},{pubkey:key(80),isSigner:false,isWritable:false}]}};
 const input={wallet,inputMint,outputMint,inputAmount:100n,inputProgram:CLASSIC_TOKEN,outputProgram:CLASSIC_TOKEN,protocol:key(50),revenue:key(51)};
 return {response,input,request:async()=>new Response(JSON.stringify(response),{headers:{'content-type':'application/json'}})};
}
test('Jupiter adapter binds assets, exact input, output floor, signer and side instructions',async()=>{
 const f=await routeFixture();const result=await jupiterBuyback({...f.input,request:f.request});assert.equal(result.minimumOutput,199n);assert.equal(result.remainingAccounts[0].address,f.input.wallet);
 for(const change of [{inputMint:key(12)},{inAmount:'101'},{otherAmountThreshold:'198'},{priceImpactPct:'0.02'},{swapMode:'ExactOut'},{tipInstruction:{}},{otherInstructions:[{}]},{swapInstruction:{...f.response.swapInstruction,programId:key(22)}},{swapInstruction:{...f.response.swapInstruction,accounts:[...f.response.swapInstruction.accounts,{pubkey:key(22),isSigner:true,isWritable:true}]}}]){
  await assert.rejects(()=>jupiterBuyback({...f.input,request:async()=>new Response(JSON.stringify({...f.response,...change}))}));
 }
});
test('buyback transaction action is restricted to the actual buyback owner',async()=>{
 const f=await fixture();await assert.rejects(()=>buildAction({action:'buyback',wallet:key(4),asset:'xSOL',amount:'1'},f.config,f.read),/buyback wallet/);
 const route=await routeFixture();route.response.inAmount='1000000';
 const result=await buildAction({action:'buyback',wallet:key(33),asset:'xSOL',amount:'1'},f.config,f.read,{request:route.request});
 assert.match(result.title,/Atomic/);assert.equal(result.ixs.at(-1).programAddress,f.config.programAddress);assert(result.effects.some(e=>e.includes('Pre-existing')));
});
test('creator collection derives the real LeverMeme creator and preserves new-fees-only scope',async()=>{
 const f=await fixture(),creator=key(4),[curve]=await getProgramDerivedAddress({programAddress:PUMP_PROGRAM,seeds:[new TextEncoder().encode('bonding-curve'),getAddressEncoder().encode(f.config.leverMint)]});
 const bytes=Buffer.alloc(150);bytes.set(CURVE_DISCRIMINATOR);bytes.set(getAddressEncoder().encode(creator),49);f.records.set(curve,account(PUMP_PROGRAM,bytes));
 const [vault]=await getProgramDerivedAddress({programAddress:PUMP_PROGRAM,seeds:[new TextEncoder().encode('creator-vault'),getAddressEncoder().encode(creator)]});f.records.set(vault,{...account('11111111111111111111111111111111',Buffer.alloc(0)),lamports:1001});
 const read=(m,p)=>m==='getMinimumBalanceForRentExemption'?100:f.read(m,p);
 const claim=await creatorFeeInstructions({wallet:creator,source:'bonding',config:f.config,live:{protocolAddress:f.protocol,protocol:f.protocolData},read});assert.equal(claim.ixs.length,1);assert(claim.effects.some(e=>e.includes('ALL coins')));
 await assert.rejects(()=>creatorFeeInstructions({wallet:key(5),source:'bonding',config:f.config,live:{protocolAddress:f.protocol,protocol:f.protocolData},read}),/actual LeverMeme creator/);
});
test('Rust fee discriminators and identity offsets match pinned official Pump IDLs',async()=>{
 const pump=JSON.parse(await readFile(new URL('../idl/external/pump.json',import.meta.url))),amm=JSON.parse(await readFile(new URL('../idl/external/pump_amm.json',import.meta.url))),rust=await readFile(new URL('../onchain/programs/levermeme/src/revenue.rs',import.meta.url),'utf8');
 for(const [name,idl,instruction] of [['COLLECT_NATIVE',pump,'collect_creator_fee'],['COLLECT_QUOTE',pump,'collect_creator_fee_v2'],['COLLECT_AMM',amm,'collect_coin_creator_fee']]){
  const value=rust.match(new RegExp('pub const '+name+'[^=]*=\\s*\\[([\\s\\S]*?)\\];'))?.[1];assert(value);assert.deepEqual(value.split(',').map(s=>s.trim()).filter(Boolean).map(Number),idl.instructions.find(x=>x.name===instruction).discriminator);
 }
 const offset=(idl,type,field)=>{let cursor=8;for(const f of idl.types.find(t=>t.name===type).type.fields){if(f.name===field)return cursor;cursor+=({u8:1,bool:1,u16:2,u64:8,i128:16,pubkey:32})[f.type];}throw new Error('Missing field');};
 assert.equal(offset(pump,'BondingCurve','creator'),49);assert.equal(offset(pump,'BondingCurve','quote_mint'),83);assert.equal(offset(amm,'Pool','coin_creator'),211);
});
