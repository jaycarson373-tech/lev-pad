import { address } from '@solana/kit';
import { ADDRESS_LOOKUP_TABLE_PROGRAM_ADDRESS,getAddressLookupTableDecoder } from '@solana-program/address-lookup-table';
import { fetchAccount } from './deployment.mjs';
import { rpc } from './mainnet-read.mjs';
export async function loadLookupTables(keys=[],read=rpc){
 if(!Array.isArray(keys)||keys.length>8||new Set(keys).size!==keys.length)throw new Error('Invalid lookup-table list');
 if(!keys.length)return {};
 const slot=await read('getSlot',[{commitment:'confirmed'}]);if(!Number.isSafeInteger(slot))throw new Error('Invalid lookup-table context slot');
 const entries=await Promise.all(keys.map(async key=>{
  address(key);const account=await fetchAccount(key,read);
  if(!account||account.executable||account.owner!==ADDRESS_LOOKUP_TABLE_PROGRAM_ADDRESS||account.data?.[1]!=='base64')throw new Error('Lookup-table owner rejected');
  const bytes=Buffer.from(account.data[0],'base64');if(bytes.length<56||(bytes.length-56)%32!==0||bytes.readUInt32LE(0)!==1)throw new Error('Lookup-table layout rejected');
  const data=getAddressLookupTableDecoder().decode(bytes);
  if(data.deactivationSlot!==(1n<<64n)-1n||data.lastExtendedSlot>=BigInt(slot)||data.addresses.length>256)throw new Error('Lookup table is inactive or its newest addresses are not usable yet');
  return [key,data.addresses];
 }));return Object.fromEntries(entries);
}
export function resolvedMessageKeys(message,tables={}){
 const writable=[],readonly=[];
 for(const lookup of message.addressTableLookups??[]){
  const addresses=tables[lookup.lookupTableAddress];if(!addresses)throw new Error('Verified lookup-table contents are required');
  for(const [indices,target] of [[lookup.writableIndexes,writable],[lookup.readonlyIndexes,readonly]])for(const index of indices){
   if(!Number.isInteger(index)||index<0||index>=addresses.length)throw new Error('Lookup-table address index rejected');target.push(addresses[index]);
  }
 }
 return [...message.staticAccounts,...writable,...readonly];
}
