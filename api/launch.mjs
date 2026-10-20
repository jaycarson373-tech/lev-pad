import { activationReport } from '../lib/activation.mjs';
import { launchConfig } from '../lib/deployment.mjs';
import { send,errorResponse } from '../lib/mainnet-read.mjs';
export default async function handler(req,res){
 if(!['GET','POST'].includes(req.method)){res.setHeader('Allow','GET, POST');return send(res,405,{error:'Method not allowed'});}
 try{
  if(Number(req.headers?.['content-length']??0)>12000)return send(res,413,{error:'Request too large'});
  if(req.method==='GET')return send(res,200,await activationReport(launchConfig()));
  const body=typeof req.body==='string'?JSON.parse(req.body):req.body;
  if(!body||JSON.stringify(body).length>12000)return send(res,400,{error:'Invalid public setup request'});
  let report;try{report=await activationReport(body.config);}catch(error){return send(res,400,{error:error.message});}
  return send(res,200,report);
 }catch(error){return errorResponse(res,error);}
}
