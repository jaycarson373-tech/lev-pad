import test from 'node:test';
import assert from 'node:assert/strict';
import { getAddressLookupTableEncoder,ADDRESS_LOOKUP_TABLE_PROGRAM_ADDRESS } from '@solana-program/address-lookup-table';
import { loadLookupTables,resolvedMessageKeys } from '../lib/lookup-tables.mjs';
import { fixture,key,account } from './helpers/protocol-fixture.mjs';
test('lookup table owner, state, age and activation are verified from chain, not router mappings',async()=>{
 const f=await fixture(),table=key(70),state={deactivationSlot:(1n<<64n)-1n,lastExtendedSlot:50n,lastExtendedSlotStartIndex:0,authority:null,addresses:[key(71),key(72)]};
 f.records.set(table,account(ADDRESS_LOOKUP_TABLE_PROGRAM_ADDRESS,getAddressLookupTableEncoder().encode(state)));
 const tables=await loadLookupTables([table],f.read);assert.deepEqual(tables[table],state.addresses);
 const message={staticAccounts:[key(1)],addressTableLookups:[{lookupTableAddress:table,writableIndexes:[1],readonlyIndexes:[0]}]};assert.deepEqual(resolvedMessageKeys(message,tables),[key(1),key(72),key(71)]);
 assert.throws(()=>resolvedMessageKeys(message),/Verified/);
 assert.throws(()=>resolvedMessageKeys({...message,addressTableLookups:[{lookupTableAddress:table,writableIndexes:[2],readonlyIndexes:[]}]},tables),/index/);
 for(const changed of [{...state,lastExtendedSlot:100n},{...state,deactivationSlot:90n}]){f.records.set(table,account(ADDRESS_LOOKUP_TABLE_PROGRAM_ADDRESS,getAddressLookupTableEncoder().encode(changed)));await assert.rejects(()=>loadLookupTables([table],f.read),/inactive|usable/);}
 f.records.set(table,account(key(22),getAddressLookupTableEncoder().encode(state)));await assert.rejects(()=>loadLookupTables([table],f.read),/owner/);
});
