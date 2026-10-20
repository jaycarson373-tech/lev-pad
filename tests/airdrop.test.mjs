import test from 'node:test';
import assert from 'node:assert/strict';
import { getAddressDecoder } from '@solana/kit';
import { airdropLeaf, buildAirdrop, verifyAirdropProof } from '../lib/airdrop.mjs';
const key = n => getAddressDecoder().decode(new Uint8Array(32).fill(n));
test('airdrop leaf matches the Rust contract fixture',()=>{
 assert.deepEqual([...airdropLeaf(key(4),key(1),'0','10')],
 [34,180,176,111,125,226,105,141,114,40,81,99,75,199,216,167,208,192,255,75,116,2,225,19,97,225,1,235,145,207,191,143]);
});
test('airdrop proof binds campaign, wallet, index and amount for an odd tree',()=>{
 const output=buildAirdrop(key(4),[{wallet:key(1),amount:'10'},{wallet:key(2),amount:'20'},{wallet:key(3),amount:'70'}],'1000');
 for(const claim of output.claims){
  const proof=claim.proof.map(p=>Buffer.from(p,'hex')), root=Buffer.from(output.root,'hex');
  assert(verifyAirdropProof(airdropLeaf(key(4),claim.wallet,claim.index,claim.amount),proof,root));
  assert(!verifyAirdropProof(airdropLeaf(key(4),claim.wallet,claim.index,'1'),proof,root));
  assert(!verifyAirdropProof(airdropLeaf(key(5),claim.wallet,claim.index,claim.amount),proof,root));
 }
});
test('airdrop allocation rejects duplicates, missing budget and unsafe numeric units',()=>{
 assert.throws(()=>buildAirdrop(key(4),[{wallet:key(1),amount:'5'},{wallet:key(1),amount:'5'}],'100'));
 assert.throws(()=>buildAirdrop(key(4),[{wallet:key(1),amount:'9'}],'100'));
 assert.throws(()=>airdropLeaf(key(4),key(1),'0',Number.MAX_SAFE_INTEGER));
 assert.throws(()=>airdropLeaf(key(4),key(1),'0',String(1n<<64n)));
});
