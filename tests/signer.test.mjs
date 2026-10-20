import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createNoopSigner,createTransactionMessage,setTransactionMessageFeePayer,setTransactionMessageLifetimeUsingBlockhash,appendTransactionMessageInstructions,compileTransaction,getBase64EncodedWireTransaction,getAddressDecoder } from '@solana/kit';
import { kmsAdapter } from '../lib/kms-adapter.mjs';
import { reviewSignerRequest } from '../lib/signer-policy.mjs';
import * as sdk from '../clients/program.mjs';
import { fixture,key } from './helpers/protocol-fixture.mjs';
const token='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
test('KMS adapter verifies public identity and pure Ed25519 signatures using a public RFC vector',async()=>{
 const pub=Buffer.from('d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a','hex'),signature=Buffer.from('e5564300c360ac729086e2cc806e828a84877f1eb8e5d974d873e065224901555fb8821590a33bacc61e39701cf9b46bd25bf5f0595bbe24655141438e7a100b','hex');
 const keyId='arn:aws:kms:us-east-1:123456789012:key/public-fixture',wallet=getAddressDecoder().decode(pub),publicInfo={KeyId:keyId,KeySpec:'ECC_NIST_EDWARDS25519',KeyUsage:'SIGN_VERIFY',SigningAlgorithms:['ED25519_SHA_512'],PublicKey:Buffer.concat([Buffer.from('302a300506032b6570032100','hex'),pub])};
 const transport={getPublicKey:async()=>publicInfo,sign:async input=>{assert.equal(input.MessageType,'RAW');assert.equal(input.SigningAlgorithm,'ED25519_SHA_512');return {KeyId:keyId,SigningAlgorithm:'ED25519_SHA_512',Signature:signature};}};
 const signer=await kmsAdapter({transport,keyId,wallet});assert.deepEqual(Buffer.from(await signer.signMessage(new Uint8Array())),signature);
 await assert.rejects(()=>signer.signMessage(new Uint8Array([1])),/verification/);
 await assert.rejects(()=>kmsAdapter({transport,keyId,wallet:key(1)}),/match/);
 await assert.rejects(()=>kmsAdapter({transport,keyId:'alias/mutable',wallet}),/ARN/);
});
function request(wallet,ixs,programAddress,action){
 const tx=compileTransaction(appendTransactionMessageInstructions(ixs,setTransactionMessageLifetimeUsingBlockhash({blockhash:key(80),lastValidBlockHeight:200n},setTransactionMessageFeePayer(wallet,createTransactionMessage({version:0})))));
 return {network:'solana:mainnet',wallet,programAddress,action,wire:getBase64EncodedWireTransaction(tx),messageHash:createHash('sha256').update(tx.messageBytes).digest('hex'),maximumTotalSolDebitLamports:'10000',maximumBuybackInputBaseUnits:'100'};
}
test('independent signer allows fee collection but rejects namespace, role, payer and SOL-cap substitutions',async()=>{
 const f=await fixture(),wallet=key(4),policy={wallet,role:'markets',maxLamports:10000n};
 const make=protocol=>sdk.getCollectMarketFeesInstruction({protocol,listing:key(6),market:key(7),quoteMint:f.config.quoteMint,marketVault:key(8),treasury:key(30),campaignFund:key(31),creator:key(32),buybackFund:key(33),quoteProgram:token},{programAddress:f.config.programAddress});
 const read=async(m,p)=>m==='isBlockhashValid'?{value:true}:m==='getBalance'?{value:1000000}:m==='simulateTransaction'?{value:{err:null,unitsConsumed:10000,accounts:[{lamports:995000}]}}:m==='getFeeForMessage'?{value:5000}:f.read(m,p);
 const body=request(wallet,[make(f.protocol)],f.config.programAddress,'collect-fees');assert.equal((await reviewSignerRequest(body,{policy,config:f.config,read})).nativeDebitLamports,10000n);
 await assert.rejects(()=>reviewSignerRequest({...body,action:'buyback'},{policy,config:f.config,read}),/role/);
 await assert.rejects(()=>reviewSignerRequest(request(wallet,[make(key(9))],f.config.programAddress,'collect-fees'),{policy,config:f.config,read}),/namespace/);
 await assert.rejects(()=>reviewSignerRequest(body,{policy:{...policy,wallet:key(5)},config:f.config,read}),/identity/);
 await assert.rejects(()=>reviewSignerRequest(body,{policy:{...policy,maxLamports:9999n},config:f.config,read}),/budget/);
});
test('market signer cannot voluntarily close a user position',async()=>{
 const f=await fixture(),wallet=key(4),ix=sdk.getSettlePositionInstruction({actor:createNoopSigner(wallet),protocol:f.protocol,market:key(7),margin:key(8),position:key(9),quoteMint:f.config.quoteMint,userVault:key(12),marketVault:key(13),actorTokens:key(14),quoteProgram:token,reason:0,expectedPrice:1n,slippageBps:0},{programAddress:f.config.programAddress});
 await assert.rejects(()=>reviewSignerRequest(request(wallet,[ix],f.config.programAddress,'settle-position'),{policy:{wallet,role:'markets',maxLamports:10000n},config:f.config,read:f.read}),/voluntarily/);
});
