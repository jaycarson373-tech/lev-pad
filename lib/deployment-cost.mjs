import { mainnetRpc,rpc } from './mainnet-read.mjs';
import { getProtocolSize,getRevenueLedgerSize } from '../clients/program.mjs';
const sol=n=>{const v=BigInt(n);return String(v/1000000000n)+'.'+String(v%1000000000n).padStart(9,'0');};
// Live, read-only rent quote. No assumed lamports-per-byte constant and no keys.
export async function deploymentCost({programSize,capacityBytes=programSize,read=rpc}){
 if(!Number.isSafeInteger(programSize)||programSize<64||!Number.isSafeInteger(capacityBytes)||capacityBytes<programSize||capacityBytes>10485760-45)throw new Error('Invalid program byte size/capacity.');
 await mainnetRpc(read);
 const sizes={program:36,programData:capacityBytes+45,temporaryBuffer:programSize+37,protocol:getProtocolSize(),revenueLedger:getRevenueLedgerSize()};
 const quoted=await Promise.all(Object.entries(sizes).map(async([name,size])=>{
  const rent=await read('getMinimumBalanceForRentExemption',[size,{commitment:'finalized'}]);
  if(!Number.isSafeInteger(rent)||rent<=0)throw new Error('RPC returned invalid rent.');
  return [name,{bytes:size,lamports:String(rent),sol:sol(rent)}];
 }));
 const accounts=Object.fromEntries(quoted),retained=BigInt(accounts.program.lamports)+BigInt(accounts.programData.lamports),initialization=BigInt(accounts.protocol.lamports)+BigInt(accounts.revenueLedger.lamports);
 return {network:'solana:mainnet',checkedAt:new Date().toISOString(),programSize,capacityBytes,accounts,retainedProgramRentSol:sol(retained),initializationRentSol:sol(initialization),standardLoaderV3ReusedBufferStorageFundingSol:sol(retained),storageIncludingInitializationSol:sol(retained+initialization),conservativeBufferPlusProgramHeadroomSol:sol(retained+BigInt(accounts.temporaryBuffer.lamports)),
  sources:{loaderV3:'https://github.com/anza-xyz/agave/blob/master/programs/bpf_loader/src/lib.rs'},
  notes:['Rent is locked account storage, not all a non-refundable transaction fee. Closing a program affects its availability and is not a routine refund path.','Standard loader-v3 fresh deployment drains the buffer to its payer BEFORE creating ProgramData, reusing storage funding. Do not automatically add buffer rent twice. A deployment provider may reserve more headroom; review its actual plan.','Transaction/priority fees, failed retries, mint creation, market accounts, oracle usage, liquidity, audits, hosting and lending capital are NOT included.','Use exact final artifact length as --max-len; do not reserve unused double-sized space. Later growth may require more rent.','The quoted binary is a build candidate. Rebuild for final public identities and re-quote before deployment.']};
}
