import { prepareAction,submitTransaction } from '../lib/transactions.mjs';
import { send,rpc,errorResponse } from '../lib/mainnet-read.mjs';
export default async function handler(req,res){
 if(req.method!=='POST'){res.setHeader('Allow','POST');return send(res,405,{error:'Method not allowed'});}
 try {
  if(Number(req.headers?.['content-length']??0)>12000)return send(res,413,{error:'Request too large'});
  const body=typeof req.body==='string'?JSON.parse(req.body):req.body;
  if(!body||JSON.stringify(body).length>12000)throw Object.assign(new Error('Invalid request'),{status:400});
  if(body.operation==='prepare')return send(res,200,await prepareAction(body.input));
  if(body.operation==='submit')return send(res,200,await submitTransaction(body.wire));
  if(body.operation==='status'){
   if(typeof body.signature!=='string'||! /^[1-9A-HJ-NP-Za-km-z]{80,90}$/.test(body.signature))throw Object.assign(new Error('Invalid signature'),{status:400});
   const [status,height]=await Promise.all([rpc('getSignatureStatuses',[[body.signature],{searchTransactionHistory:true}]),rpc('getBlockHeight',[{commitment:'confirmed'}])]);
   return send(res,200,{status:status?.value?.[0]??null,blockHeight:height});
  }
  return send(res,400,{error:'Unsupported operation'});
 }catch(error){if(error.status===422)return send(res,422,{error:error.message});return errorResponse(res,error);}
}
