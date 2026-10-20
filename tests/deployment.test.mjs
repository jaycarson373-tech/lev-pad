import test from 'node:test';
import assert from 'node:assert/strict';
import * as sdk from '../clients/program.mjs';
import {validateLaunch,verifiedDeployment,verifiedProtocol,runtimeSnapshot,decodeOwned} from '../lib/deployment.mjs';
import {fixture,key,account,loader} from './helpers/protocol-fixture.mjs';
test('unconfigured launch fails closed without network writes or invented markets',async()=>{
 const result=await runtimeSnapshot(null,{},()=>{throw new Error('RPC must not run');});assert.equal(result.configured,false);assert.equal(result.tradingEnabled,false);assert.deepEqual(result.markets,[]);
 assert(validateLaunch({programAddress:'Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t'}).some(e=>e.includes('Template')));
});
test('deployed artifact hash, loader PDA and upgrade authority must match',async()=>{
 const f=await fixture();const result=await verifiedDeployment(f.config,f.read);assert.equal(result.protocolAddress,f.protocol);
 await assert.rejects(()=>verifiedDeployment({...f.config,programSha256:'0'.repeat(64)},f.read),/bytecode/);
 await assert.rejects(()=>verifiedDeployment({...f.config,upgradeAuthority:key(3)},f.read),/authority/);
 const altered=Buffer.from(f.rawData);altered[45]^=1;f.records.set(f.programData,account(loader,altered));await assert.rejects(()=>verifiedDeployment(f.config,f.read),/bytecode/);
});
test('protocol version, mint identity, discriminator and owner substitutions are rejected',async()=>{
 const f=await fixture();await verifiedProtocol(f.config,f.read);
 for(const override of [{version:1},{quoteMint:key(20)},{admin:key(20)}]){
  f.records.set(f.protocol,account(f.config.programAddress,sdk.getProtocolEncoder().encode({...f.protocolData,...override})));
  await assert.rejects(()=>verifiedProtocol(f.config,f.read),/identity/);
 }
 assert.throws(()=>decodeOwned(account(key(22),Buffer.alloc(300)),'Protocol',f.config.programAddress),/owner/);
 assert.throws(()=>decodeOwned(account(f.config.programAddress,Buffer.alloc(300)),'Protocol',f.config.programAddress),/discriminator/);
});
test('website funding gates require reports and never override on-chain pause',async()=>{
 const f=await fixture();const result=await runtimeSnapshot(null,{...f.config,custodyEnabled:true,tradingEnabled:true},f.read);
 assert.equal(result.configured,true);assert.equal(result.custodyEnabled,false);assert.equal(result.tradingEnabled,false);assert.equal(result.protocol.paused,true);
});
test('verified deployment can expose initialization state without inventing a protocol',async()=>{
 const f=await fixture();f.records.delete(f.protocol);const result=await runtimeSnapshot(null,f.config,f.read);assert.equal(result.phase,'uninitialized');assert.equal(result.custodyEnabled,false);assert.equal(result.protocol,undefined);
});
