import { address, getAddressEncoder, getProgramDerivedAddress } from '@solana/kit';
import { createHash } from 'node:crypto';
export const PUMP_PROGRAM = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';
export const MAINNET_GENESIS = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d';
export const TOKEN_PROGRAMS = new Set(['TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb']);
export const CURVE_DISCRIMINATOR = createHash('sha256').update('account:BondingCurve').digest().subarray(0,8);
export function validAddress(value){try{return address(value);}catch{throw Object.assign(new Error('Enter a valid full Solana mint address.'),{status:400});}}
export async function rpc(method, params, {signal}={}){
  const endpoint=process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
  if(new URL(endpoint).protocol!=='https:')throw new Error('RPC configuration invalid');
  const r=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params}),signal:signal?AbortSignal.any([signal,AbortSignal.timeout(8000)]):AbortSignal.timeout(8000)});
  if(!r.ok)throw new Error('RPC unavailable');const b=await r.json();if(b.error||!Object.hasOwn(b,'result'))throw new Error('RPC rejected read');return b.result;
}
export async function mainnetRpc(read=rpc){if(await read('getGenesisHash',[])!==MAINNET_GENESIS)throw new Error('RPC network mismatch');}
export function inspectCurve(account){
  if(!account||account.executable||account.owner!==PUMP_PROGRAM||account.data?.[1]!=='base64')throw Object.assign(new Error('This mint has no verified pump.fun bonding-curve account.'),{status:422});
  const data=Buffer.from(account.data[0],'base64');
  if(data.length<49||!data.subarray(0,8).equals(CURVE_DISCRIMINATOR)||![0,1].includes(data[48]))throw Object.assign(new Error('The pump.fun account layout could not be verified.'),{status:422});
  return {graduated:data[48]===1};
}
export async function verifyPumpMint(mint,read=rpc){
  const validated=validAddress(mint);await mainnetRpc(read);
  const [curve]=await getProgramDerivedAddress({programAddress:address(PUMP_PROGRAM),seeds:[new TextEncoder().encode('bonding-curve'),getAddressEncoder().encode(validated)]});
  const [mintResponse,curveResponse]=await Promise.all([
    read('getAccountInfo',[validated,{encoding:'jsonParsed',commitment:'finalized'}]),
    read('getAccountInfo',[curve,{encoding:'base64',commitment:'finalized'}])
  ]);
  const mintAccount=mintResponse?.value;const parsed=mintAccount?.data?.parsed;
  if(!TOKEN_PROGRAMS.has(mintAccount?.owner)||mintAccount.executable||parsed?.type!=='mint'||parsed.info?.isInitialized!==true||!Number.isInteger(parsed.info.decimals)||parsed.info.decimals<0||parsed.info.decimals>18)throw Object.assign(new Error('The address is not an initialized supported token mint.'),{status:422});
  const inspected=inspectCurve(curveResponse?.value);
  if(!Number.isSafeInteger(curveResponse?.context?.slot))throw new Error('Invalid RPC slot');
  return {mint:validated,decimals:parsed.info.decimals,curve,slot:curveResponse.context.slot,...inspected};
}
export function send(res,status,body){res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');return res.status(status).json(body);}
export function errorResponse(res,error){return send(res,error.status||503,{error:error.status?error.message:'Solana mainnet reads are temporarily unavailable. Please retry shortly.'});}
