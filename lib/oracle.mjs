// Kit-native Switchboard managed quote adapter. Protocol references:
// switchboard-xyz/solana-sdk (0.13.0) and on-demand (3.10.6), MIT.
// Does not use legacy wallet/keypair APIs or interpret unverified API prices.
import { address,getAddressEncoder,getProgramDerivedAddress } from '@solana/kit';
import { createPublicKey,verify } from 'node:crypto';
export const QUOTE_PROGRAM='orac1eFjzWL5R3RbbdMV68K9H6TaCVVcL6LjvQQWAbz';
export const ED25519_PROGRAM='Ed25519SigVerify111111111111111111111111111';
const encoder=getAddressEncoder();
const field=(object,snake,camel)=>object[snake]??object[camel];
const hex32=value=>{if(typeof value!=='string'||! /^(0x)?[0-9a-fA-F]{64}$/.test(value))throw new Error('Invalid oracle hash');return Buffer.from(value.replace(/^0x/,''),'hex');};
const b64=(value,size)=>{if(typeof value!=='string'||value.length>size*2||!/^[A-Za-z0-9+/]+=*$/.test(value))throw new Error('Invalid oracle signature encoding');const b=Buffer.from(value,'base64');if(b.length!==size)throw new Error('Invalid oracle signature size');return b;};
export function verifyOracleSignature(message,publicKey,signature){
 if(publicKey.length!==32||signature.length!==64)return false;
 const key=createPublicKey({key:Buffer.concat([Buffer.from('302a300506032b6570032100','hex'),Buffer.from(publicKey)]),format:'der',type:'spki'});
 return verify(null,Buffer.from(message),key,Buffer.from(signature));
}
function feedBytes(feed){
 const hash=hex32(field(feed,'feed_hash','feedHash'));
 const raw=field(feed,'success_value','successValue')??feed.value;
 if(typeof raw!=='string'||!/^\d{1,39}$/.test(raw))throw new Error('Oracle values must use positive i128 integer strings');
 let value=BigInt(raw);if(value<=0n||value>=(1n<<127n))throw new Error('Oracle value range rejected');
 const samples=field(feed,'min_oracle_samples','minOracleSamples');
 if(!Number.isInteger(samples)||samples<3||samples>30)throw new Error('Oracle feed quorum metadata rejected');
 const bytes=Buffer.alloc(49);hash.copy(bytes);for(let i=0;i<16;i++){bytes[32+i]=Number(value&255n);value>>=8n;}bytes[48]=samples;
 return bytes;
}
export function encodeQuote(response,risk,instructionIndex=65535){
 if(!Number.isInteger(instructionIndex)||instructionIndex<0||instructionIndex>65535)throw new Error('Invalid instruction index');
 const count=risk.minOracles;if(!Number.isInteger(count)||count<3||count>4)throw new Error('The launch transaction format supports 3–4 oracle signatures');
 const slot=response.slot;if(!Number.isSafeInteger(slot)||slot<0)throw new Error('Invalid oracle slot');
 const recentHash=field(response,'recent_hash','recentHash');const hash=Buffer.from(encoder.encode(address(recentHash)));
 const records=field(response,'oracle_responses','oracleResponses');if(!Array.isArray(records)||records.length<count||records.length>30)throw new Error('Oracle quorum unavailable');
 const wanted=[Buffer.from(risk.feedHash).toString('hex'),Buffer.from(risk.twapHash).toString('hex')].sort();
 const seen=new Set(),seenKeys=new Set();let common;
 const signatures=records.map(record=>{
  const index=field(record,'oracle_idx','oracleIdx')??record.oracleId;
  if(!Number.isInteger(index)||index<0||index>=30||seen.has(index))throw new Error('Duplicate or invalid oracle index');seen.add(index);
  const feeds=field(record,'feed_responses','feedResponses');if(!Array.isArray(feeds)||feeds.length!==2)throw new Error('Expected exactly spot and independent TWAP feeds');
  const parts=feeds.map(feedBytes);
  if(parts.map(p=>p.subarray(0,32).toString('hex')).sort().join(',')!==wanted.join(','))throw new Error('Oracle response contains a different feed');
  if(parts.some(p=>p[48]<count||p[48]>count))throw new Error('Feed quorum does not match the requested signature count');
  const message=Buffer.concat([hash,...parts]);if(common&&!message.equals(common))throw new Error('Oracle responses do not agree on the signed message');common=message;
  const keyHex=field(record,'ed25519_enclave_signer','ed25519EnclaveSigner');
  if(typeof keyHex!=='string'||! /^(?:[0-9a-f]{64}|[0-9a-f]{128})$/i.test(keyHex))throw new Error('Missing Ed25519 enclave signing identity');
  const publicKey=Buffer.from(keyHex.slice(0,64),'hex'),signature=b64(record.signature,64);
  if(seenKeys.has(keyHex.slice(0,64)))throw new Error('Repeated oracle signing identity');seenKeys.add(keyHex.slice(0,64));
  if(!verifyOracleSignature(message,publicKey,signature))throw new Error('Oracle Ed25519 signature verification failed');
  return {index,publicKey,signature};
 }).sort((a,b)=>a.index-b.index).slice(0,count);
 const signatureStart=2+14*count,keyStart=signatureStart+64*count,messageStart=keyStart+32*count;
 const suffixStart=messageStart+common.length;
 const data=Buffer.alloc(suffixStart+count+13);data[0]=count;
 for(let i=0;i<count;i++){
  const fields=[signatureStart+64*i,instructionIndex,keyStart+32*i,instructionIndex,messageStart,common.length,instructionIndex];
  fields.forEach((n,j)=>data.writeUInt16LE(n,2+14*i+2*j));signatures[i].signature.copy(data,signatureStart+64*i);signatures[i].publicKey.copy(data,keyStart+32*i);data[suffixStart+i]=signatures[i].index;
 }
 common.copy(data,messageStart);data.writeBigUInt64LE(BigInt(slot),suffixStart+count);data[suffixStart+count+8]=0;data.write('SBOD',suffixStart+count+9);
 return {data,slot,feedOrder:[common.subarray(32,64),common.subarray(81,113)]};
}
async function boundedJson(response){
 if(!response.ok)throw new Error('Oracle provider unavailable');
 const reader=response.body.getReader();let size=0;const chunks=[];
 try{for(;;){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>128000)throw new Error('Oracle response exceeds limit');chunks.push(Buffer.from(value));}}
 finally{await reader.cancel().catch(()=>{});}
 return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
export async function managedQuoteInstructions({risk,payer,instructionIndex=2,request=fetch}){
 const host=new URL(process.env.SWITCHBOARD_CROSSBAR_URL||'https://crossbar.switchboard.xyz');
 if(host.protocol!=='https:'||host.username||host.password||host.search||host.hash)throw new Error('Oracle provider must be a configured HTTPS origin');
 const hashes=[Buffer.from(risk.feedHash).toString('hex'),Buffer.from(risk.twapHash).toString('hex')];
 const url=new URL(`/v2/update/${hashes.join(',')}`,host);url.search=new URLSearchParams({network:'mainnet',signature_scheme:'Ed25519',hash_scheme:'Sha256',num_oracles:String(risk.minOracles),use_timestamp:'false',chain:'solana'}).toString();
 const response=await boundedJson(await request(url,{signal:AbortSignal.timeout(12000),redirect:'error'}));
 const quote=encodeQuote(response,risk); // Solana precompile and quote program verify again.
 const [oracle,bump]=await getProgramDerivedAddress({programAddress:address(QUOTE_PROGRAM),seeds:[encoder.encode(address(risk.queue)),...quote.feedOrder]});
 const readOnly=key=>({address:address(key),role:0});
 return {oracle,slot:quote.slot,instructions:[
  {programAddress:address(ED25519_PROGRAM),data:new Uint8Array(quote.data),accounts:[]},
  {programAddress:address(QUOTE_PROGRAM),data:new Uint8Array([0,instructionIndex,bump]),accounts:[readOnly(risk.queue),{address:oracle,role:1},readOnly('Sysvar1nstructions1111111111111111111111111'),readOnly('SysvarS1otHashes111111111111111111111111111'),readOnly('SysvarC1ock11111111111111111111111111111111'),{address:address(payer),role:3},readOnly('11111111111111111111111111111111')]},
 ]};
}
