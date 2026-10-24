import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { listingReadiness } from '../lib/listing-readiness.mjs';
import { icon,leverageArtwork } from '../web/icons.js';
import { renderListing } from '../web/listing.js';
import { key } from './helpers/protocol-fixture.mjs';
function fixture(){
 const address=key(1),mint=key(2),protocol=key(3),now=1000;
 const runtime={configured:true,protocolAddress:protocol,custodyEnabled:true,protocol:{paused:false,policy:{minSolLamports:'1000000',burnAmount:'1000000'}},leverDecimals:6,permits:[{protocol,baseMint:mint,lister:address,expiresAt:'1001',consumed:false}],listings:[]};
 return {runtime,address,mint,verified:{mint,decimals:6,slot:50},sol:'0.001',tokens:'0.000001',now};
}
test('listing preflight accepts exact-unit funding and a matching unused live permit without mutating state',()=>{
 const input=fixture(),before=structuredClone(input),result=listingReadiness(input);
 assert.equal(result.ready,true);assert.equal(result.firstBlocker,null);assert.equal(result.checks.length,6);assert.deepEqual(input,before);
});
test('listing preflight blocks paused, unreleased, disconnected, unverified and already-requested mints',()=>{
 const f=fixture();for(const input of [{...f,address:null},{...f,verified:{...f.verified,mint:key(9)}},{...f,runtime:{...f.runtime,custodyEnabled:false}},{...f,runtime:{...f.runtime,protocol:{...f.runtime.protocol,paused:true}}},{...f,runtime:{...f.runtime,listings:[{baseMint:f.mint,cancelled:true}]}}])assert.equal(listingReadiness(input).ready,false);
 assert.equal(listingReadiness({mint:f.mint}).ready,false);
});
test('listing permits cannot be reused, expired, substituted or taken from another namespace',()=>{
 const f=fixture(),permit=f.runtime.permits[0];
 for(const change of [{consumed:true},{expiresAt:'1000'},{expiresAt:'bad'},{lister:key(8)},{baseMint:key(8)},{protocol:key(8)}])assert.equal(listingReadiness({...f,runtime:{...f.runtime,permits:[{...permit,...change}]}}).ready,false);
 assert.equal(listingReadiness({...f,runtime:{...f.runtime,permits:[]}}).ready,false);
});
test('listing preflight rejects too little SOL, precision loss, exponent notation and u64 overflow',()=>{
 const f=fixture();for(const change of [{sol:'0.000999999'},{sol:'0'},{sol:'1e3'},{sol:'18446744074'},{sol:'0.0000000001'},{tokens:'0'},{tokens:'0.0000001'},{tokens:'1e6'},{tokens:'18446744073710'},{tokens:'9'.repeat(65)}])assert.equal(listingReadiness({...f,...change}).ready,false);
});
test('custom SVG icons are fixed, hidden from assistive technology and reject arbitrary names',()=>{
 assert.match(icon('wallet'),/aria-hidden="true"/);assert.match(icon('shield'),/data-icon="shield"/);assert.throws(()=>icon('<script>'));
 assert.match(leverageArtwork(),/role="img"/);assert.match(leverageArtwork(),/aria-label=/);
});
test('listing review escapes saved values, distinguishes escrow from reserves and blocks unapproved burns',()=>{
 const html=renderListing({step:3,draft:{mint:'<img src=x onerror=1>',sol:'<script>1</script>',tokens:'2'},runtime:null,address:null});
 assert(!html.includes('<script>'));assert(html.includes('&lt;script&gt;'));assert.match(html,/5% of platform trading fees/);assert.match(html,/Separate xSOL reserves/);assert.match(html,/Burn & request review · opening soon/);
});
test('product UI source does not reintroduce emoji or decorative Unicode placeholders',async()=>{
 for(const path of ['app.js','live.js','setup.js','listing.js','ecosystem.js','lending.js','index.html']){
  const source=await readFile(new URL('../web/'+path,import.meta.url),'utf8');
  assert(!/[\p{Extended_Pictographic}↗↘→←↓↑⊗⇄⌕⌗✓½]/u.test(source),'Decorative icon placeholder in '+path);
 }
});
