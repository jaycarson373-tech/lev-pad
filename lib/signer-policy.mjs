import { createHash } from 'node:crypto';
import { getTransactionDecoder,getCompiledTransactionMessageDecoder } from '@solana/kit';
import * as sdk from '../clients/program.mjs';
import { verifiedProtocol } from './deployment.mjs';
import { inspectWire } from './transactions.mjs';
import { loadLookupTables,resolvedMessageKeys } from './lookup-tables.mjs';
import { rpc } from './mainnet-read.mjs';
import { WSOL } from './revenue.mjs';
const shapes=[
 ['RefreshMarketPrice','markets','refresh-price'],['SettlePosition','markets','settle-position'],['CollectMarketFees','markets','collect-fees'],
 ['CollectNativeCreatorFees','creator-fees','collect-creator-fees'],['CollectQuoteCreatorFees','creator-fees','collect-creator-fees'],
 ['WrapBuybackSol','buybacks','buyback'],['ExecuteBuyback','buybacks','buyback'],
];
const constant=name=>name.replace(/[A-Z]/g,(c,i)=>(i?'_':'')+c).toUpperCase()+'_DISCRIMINATOR';
export async function reviewSignerRequest(body,{policy,config,read=rpc}){
 if(!body||body.network!=='solana:mainnet'||body.wallet!==policy.wallet||body.programAddress!==config.programAddress||typeof body.wire!=='string'||body.wire.length>1800||! /^[A-Za-z0-9+/]+=*$/.test(body.wire))throw new Error('Signing request identity/encoding rejected.');
 const tx=getTransactionDecoder().decode(Buffer.from(body.wire,'base64')),message=getCompiledTransactionMessageDecoder().decode(tx.messageBytes);
 const hash=createHash('sha256').update(tx.messageBytes).digest('hex');if(hash!==body.messageHash)throw new Error('Signing request message hash mismatch.');
 if(message.header.numSignerAccounts!==1||message.staticAccounts[0]!==policy.wallet||Object.values(tx.signatures).some(s=>s&&s.some(b=>b!==0)))throw new Error('Signer accepts only its own unsigned, single-payer transactions.');
 const live=await verifiedProtocol(config,read),tables=await loadLookupTables((message.addressTableLookups??[]).map(l=>l.lookupTableAddress),read);
 inspectWire(body.wire,config,tables);const keys=resolvedMessageKeys(message,tables),own=[];
 for(const instruction of message.instructions){
  if(keys[instruction.programAddressIndex]!==config.programAddress)continue;
  const bytes=Buffer.from(instruction.data??[]),shape=shapes.find(([name])=>bytes.subarray(0,8).equals(Buffer.from(sdk[constant(name)])));
  if(!shape||shape[1]!==policy.role||shape[2]!==body.action)throw new Error('Signer role/action does not allow this instruction.');
  const parsed=sdk['parse'+shape[0]+'Instruction']({programAddress:config.programAddress,data:instruction.data,accounts:Array.from(instruction.accountIndices??[]).map(index=>({address:keys[index],role:0}))});
  if(parsed.accounts.protocol.address!==live.protocolAddress)throw new Error('Signer protocol namespace rejected.');
  for(const name of shape[1]==='creator-fees'?['creator']:['actor','authority'])if(parsed.accounts[name]&&parsed.accounts[name].address!==policy.wallet)throw new Error('Signer authority substitution rejected.');
  if(shape[0]==='SettlePosition'&&![1,2,3].includes(parsed.data.reason))throw new Error('Market keeper cannot voluntarily close a user position.');
  own.push({name:shape[0],...parsed});
 }
 if(!own.length||policy.role!=='buybacks'&&own.length!==1)throw new Error('Signer instruction count rejected.');
 let inputUnits=0n;
 if(policy.role==='buybacks'){
  const swaps=own.filter(x=>x.name==='ExecuteBuyback'),wraps=own.filter(x=>x.name==='WrapBuybackSol');
  if(swaps.length!==1||wraps.length>1||own.length!==swaps.length+wraps.length)throw new Error('Buyback signer requires exactly one atomic swap-and-burn.');
  const swap=swaps[0],expectedMint=policy.asset==='xSOL'?config.quoteMint:WSOL;inputUnits=swap.data.inputAmount;
  if(policy.wallet!==live.protocol.policy.feeDestinations[2]||swap.accounts.inputMint.address!==expectedMint||inputUnits<=0n||inputUnits>policy.maxInput||swap.data.minimumOutput<=0n)throw new Error('Buyback signer input policy rejected.');
  if(policy.asset==='SOL'?(wraps.length!==1||wraps[0].data.amount!==inputUnits||wraps[0].accounts.wsolTokens.address!==swap.accounts.inputTokens.address):wraps.length!==0)throw new Error('Native wrapping does not match the permitted buyback input.');
 }
 const valid=await read('isBlockhashValid',[message.lifetimeToken,{commitment:'confirmed'}]);if(valid?.value!==true)throw new Error('Signing blockhash is stale.');
 const [balance,simulation,fee]=await Promise.all([
  read('getBalance',[policy.wallet,{commitment:'confirmed'}]),
  read('simulateTransaction',[body.wire,{encoding:'base64',commitment:'confirmed',sigVerify:false,accounts:{encoding:'base64',addresses:[policy.wallet]}}]),
  read('getFeeForMessage',[Buffer.from(tx.messageBytes).toString('base64'),{commitment:'confirmed'}]),
 ]);
 const before=balance?.value,after=simulation?.value?.accounts?.[0]?.lamports;
 if(simulation?.value?.err!==null||!Number.isSafeInteger(simulation?.value?.unitsConsumed)||simulation.value.unitsConsumed>1000000||![before,after,fee?.value].every(n=>Number.isSafeInteger(n)&&n>=0))throw new Error('Independent signer simulation/fee preview failed.');
 const native=BigInt(Math.max(0,before-after))+BigInt(fee.value);
 if(native>policy.maxLamports||typeof body.maximumTotalSolDebitLamports!=='string'||! /^\d{1,20}$/.test(body.maximumTotalSolDebitLamports)||native>BigInt(body.maximumTotalSolDebitLamports))throw new Error('Independent signer SOL budget exceeded.');
 if(inputUnits>0n&&(typeof body.maximumBuybackInputBaseUnits!=='string'||! /^\d{1,20}$/.test(body.maximumBuybackInputBaseUnits)||inputUnits>BigInt(body.maximumBuybackInputBaseUnits)))throw new Error('Caller buyback input limit exceeded.');
 return {tx,messageHash:hash,inputUnits,nativeDebitLamports:native,role:policy.role};
}
