// Local health probe: intentionally sends no bearer token or signing request.
try{
 const response=await fetch('http://127.0.0.1:'+Number(process.env.SIGNER_PORT||8787)+'/health',{signal:AbortSignal.timeout(3000),redirect:'error'});
 const body=await response.json();
 if(!response.ok||body.mode!=='policy-bound-kms'||body.state!=='ready'||body.wallet!==process.env.SIGNER_WALLET_ADDRESS||body.role!==process.env.SIGNER_ROLE)throw new Error();
 console.log('Signer HTTP/state ready. This is not proof of KMS, oracle or mainnet acceptance.');
}catch{console.error('Signer unavailable or durable state unhealthy.');process.exitCode=1;}
