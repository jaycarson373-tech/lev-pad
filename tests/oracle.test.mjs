import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyOracleSignature,encodeQuote,managedQuoteInstructions } from '../lib/oracle.mjs';
import { key } from './helpers/protocol-fixture.mjs';
// Public RFC 8032 test vector. No private key is generated, loaded or used.
const publicKey=Buffer.from('d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a','hex');
const signature=Buffer.from('e5564300c360ac729086e2cc806e828a84877f1eb8e5d974d873e065224901555fb8821590a33bacc61e39701cf9b46bd25bf5f0595bbe24655141438e7a100b','hex');
test('oracle Ed25519 checks accept a public standard vector and reject alterations',()=>{
 assert(verifyOracleSignature(Buffer.alloc(0),publicKey,signature));const altered=Buffer.from(signature);altered[0]^=1;
 assert(!verifyOracleSignature(Buffer.alloc(0),publicKey,altered));assert(!verifyOracleSignature(Buffer.from([1]),publicKey,signature));
});
test('unsigned, substituted and under-quorum oracle API data cannot become a price update',()=>{
 const risk={feedHash:new Uint8Array(32).fill(1),twapHash:new Uint8Array(32).fill(2),minOracles:3,queue:key(7)};
 assert.throws(()=>encodeQuote({slot:10,recent_hash:key(8),oracle_responses:[]},risk),/quorum/);
 const response={slot:10,recent_hash:key(8),oracle_responses:[0,1,2].map(index=>({oracle_idx:index,ed25519_enclave_signer:publicKey.toString('hex'),signature:Buffer.alloc(64).toString('base64'),feed_responses:[1,2].map(n=>({feed_hash:Buffer.alloc(32,n).toString('hex'),success_value:'1000000000000000000',min_oracle_samples:3}))}))};
 assert.throws(()=>encodeQuote(response,risk),/signature verification failed/);
 const swapped=structuredClone(response);swapped.oracle_responses[0].feed_responses[0].feed_hash='03'.repeat(32);assert.throws(()=>encodeQuote(swapped,risk),/different feed/);
 const weak=structuredClone(response);weak.oracle_responses[0].feed_responses[0].min_oracle_samples=1;assert.throws(()=>encodeQuote(weak,risk),/quorum/);
});
test('oracle provider failures never fabricate an update',async()=>{
 await assert.rejects(()=>managedQuoteInstructions({risk:{feedHash:new Uint8Array(32),twapHash:new Uint8Array(32),minOracles:3,queue:key(1)},payer:key(2),request:async()=>new Response('offline',{status:503})}),/unavailable/);
});
test('configured gateway uses the current SDK protocol and cached public jobs without trusting prices',async()=>{
 const {fetchOracleQuote}=await import('../lib/oracle.mjs');
 const previousGateway=process.env.SWITCHBOARD_GATEWAY_URL,previousJobs=process.env.SWITCHBOARD_FEED_PROTOS;
 const feedHash=new Uint8Array(32).fill(1),twapHash=new Uint8Array(32).fill(2),risk={feedHash,twapHash,minOracles:3};
 process.env.SWITCHBOARD_GATEWAY_URL='https://gateway.example.invalid';process.env.SWITCHBOARD_FEED_PROTOS=JSON.stringify({[Buffer.from(feedHash).toString('hex')]:'AA==',[Buffer.from(twapHash).toString('hex')]:'AA=='});
 try{
  let calls=0;await fetchOracleQuote({risk,request:async(url,options)=>{calls++;assert.equal(url.origin,'https://gateway.example.invalid');assert.equal(url.pathname,'/gateway/api/v1/fetch_signatures_consensus');const body=JSON.parse(options.body);assert.equal(body.signature_scheme,'Ed25519');assert.equal(body.use_ed25519,true);assert.equal(body.use_timestamp,false);assert.equal(body.num_oracles,3);assert.equal(body.feed_requests.length,2);return new Response(JSON.stringify({oracle_responses:[]}));}});assert.equal(calls,1);
 }finally{if(previousGateway===undefined)delete process.env.SWITCHBOARD_GATEWAY_URL;else process.env.SWITCHBOARD_GATEWAY_URL=previousGateway;if(previousJobs===undefined)delete process.env.SWITCHBOARD_FEED_PROTOS;else process.env.SWITCHBOARD_FEED_PROTOS=previousJobs;}
});
