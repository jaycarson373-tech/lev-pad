import { verifyPumpMint, send, errorResponse } from '../lib/mainnet-read.mjs';
export default async function handler(req,res){
  if(req.method!=='GET'){res.setHeader('Allow','GET');return send(res,405,{error:'Method not allowed'});}
  try{const mint=new URL(req.url,'https://levermeme.invalid').searchParams.get('mint');return send(res,200,await verifyPumpMint(mint));}catch(error){return errorResponse(res,error);}
}
