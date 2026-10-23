import test from 'node:test';
import assert from 'node:assert/strict';
import { lendingPreview,solUnits } from '../lib/lending-preview.mjs';
import policy from '../config/lending.json' with {type:'json'};
test('proposed 25% LTV uses exact SOL units and never enables lending',()=>{
 const loan=lendingPreview('10');assert.equal(loan.maximumPrincipalLamports,2500000000n);assert.equal(solUnits(loan.maximumPrincipalLamports),'2.5');assert.equal(loan.enabled,false);assert.equal(loan.illustrationOnly,true);
 assert.equal(lendingPreview('1.000000001').maximumPrincipalLamports,250000000n);
});
test('lending illustration refuses malformed, negative, excessive and unsafe valuations',()=>{
 for(const value of ['0','-1','1e9','Infinity','1.1234567891','9'.repeat(41),'18446744073.709551616',1])assert.throws(()=>lendingPreview(value));
});
test('loan terms and deployment stay unapproved and separate from the trading protocol',()=>{
 assert.equal(policy.enabled,false);assert.equal(policy.termsApproved,false);assert.equal(policy.programAddress,null);assert.equal(policy.interestBps,null);assert.equal(policy.termDays,null);
});
