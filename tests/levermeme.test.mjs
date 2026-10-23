import { test } from 'node:test';
import assert from 'node:assert/strict';
import { positiveDecimal, positionSize, routeFor, escapeHtml } from '../web/domain.js';
import { inspectCurve, CURVE_DISCRIMINATOR, PUMP_PROGRAM, verifyPumpMint, MAINNET_GENESIS } from '../lib/mainnet-read.mjs';
test('10x sizing uses exact integer units and rejects invalid margin',()=>{
  assert.equal(positionSize('0.000000001',10),'0.00000001');assert.equal(positionSize('1.25',10),'12.5');
  for(const value of ['-1','NaN','Infinity','1e2','0','0.0000000001',''])assert.equal(positionSize(value,10),null);
  assert.equal(positionSize('1',11),null);assert.equal(positiveDecimal('1.001',2),false);
});
test('routes preserve trading, listing, portfolio and ecosystem',()=>{
  assert.equal(routeFor('/trade/'),'trade');assert.equal(routeFor('/list-token/'),'launch');assert.equal(routeFor('/portfolio/'),'account');assert.equal(routeFor('/ecosystem/'),'ecosystem');assert.equal(routeFor('/lending/'),'lending');
});
test('untrusted text is HTML escaped',()=>{assert.equal(escapeHtml('<img onerror="x">'), '&lt;img onerror=&quot;x&quot;&gt;');});
test('pump origin rejects account owner and discriminator substitutions',()=>{
  const bytes=Buffer.alloc(49);CURVE_DISCRIMINATOR.copy(bytes);bytes[48]=1;
  const account={owner:PUMP_PROGRAM,executable:false,data:[bytes.toString('base64'),'base64']};
  assert.equal(inspectCurve(account).graduated,true);
  assert.throws(()=>inspectCurve({...account,owner:'other'}));
  bytes[0]^=255;assert.throws(()=>inspectCurve({...account,data:[bytes.toString('base64'),'base64']}));
});
test('mint verification refuses a devnet RPC',async()=>{
  await assert.rejects(()=>verifyPumpMint(PUMP_PROGRAM,async()=>'devnet'),/network mismatch/);
});
test('full mainnet genesis and valid pump-owned curve pass the read-only checks',async()=>{
  assert.equal(MAINNET_GENESIS,'5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d');
  const bytes=Buffer.alloc(49);CURVE_DISCRIMINATOR.copy(bytes);bytes[48]=1;
  const result=await verifyPumpMint(PUMP_PROGRAM,async(method,params)=>{
    if(method==='getGenesisHash')return MAINNET_GENESIS;
    if(params[1].encoding==='jsonParsed')return {value:{owner:'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',executable:false,data:{parsed:{type:'mint',info:{isInitialized:true,decimals:6}}}}};
    return {context:{slot:123},value:{owner:PUMP_PROGRAM,executable:false,data:[bytes.toString('base64'),'base64']}};
  });
  assert.equal(result.graduated,true);assert.equal(result.decimals,6);assert.equal(result.slot,123);
});
