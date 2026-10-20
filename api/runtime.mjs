import { runtimeSnapshot } from '../lib/deployment.mjs';
import { send,errorResponse } from '../lib/mainnet-read.mjs';
export default async function handler(req,res){
  if(req.method!=='GET'){res.setHeader('Allow','GET');return send(res,405,{error:'Method not allowed'});}
  try {const wallet=new URL(req.url,'https://levermeme.invalid').searchParams.get('wallet');return send(res,200,await runtimeSnapshot(wallet));}
  catch(error){return errorResponse(res,error);}
}
