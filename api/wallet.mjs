import { validAddress, mainnetRpc, rpc, send, errorResponse } from '../lib/mainnet-read.mjs';
export default async function handler(req,res){
  if(req.method!=='GET'){res.setHeader('Allow','GET');return send(res,405,{error:'Method not allowed'});}
  try{const address=validAddress(new URL(req.url,'https://levermeme.invalid').searchParams.get('address'));await mainnetRpc();const result=await rpc('getBalance',[address,{commitment:'finalized'}]);if(!Number.isSafeInteger(result?.value)||result.value<0)throw new Error('Invalid balance');return send(res,200,{lamports:String(result.value),slot:result.context.slot,network:'mainnet-beta'});}catch(error){return errorResponse(res,error);}
}
