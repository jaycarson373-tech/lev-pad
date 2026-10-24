// UX preflight only. On-chain permits, burn, ownership and pause checks remain
// authoritative; this model never authorizes or submits a transaction.
export function listingReadiness({runtime,address,mint,verified,sol,tokens,now=Math.floor(Date.now()/1000)}){
 const checks=[];
 const add=(id,label,pass,detail)=>checks.push({id,label,pass:Boolean(pass),detail});
 const base=(value,decimals)=>{
  if(!Number.isInteger(decimals)||decimals<0||decimals>18||typeof value!=='string'||value.length>64||!/^\d+(\.\d+)?$/.test(value))return null;
  const [whole,fraction='']=value.split('.');if(fraction.length>decimals)return null;
  const amount=BigInt(whole+fraction.padEnd(decimals,'0'));return amount>0n&&amount<=(1n<<64n)-1n?amount:null;
 };
 const protocol=runtime?.protocol,verifiedMint=verified?.mint===mint&&Boolean(mint);
 add('mint','pump.fun origin',verifiedMint,verifiedMint?'Origin verified on Solana mainnet.':'Verify the exact mint before continuing.');
 add('wallet','Lister wallet',address, address?'This connected wallet will own the request and receive its market royalty.':'Connect the wallet that will list and fund this market.');
 add('release','Admission availability',runtime?.custodyEnabled&&protocol&&!protocol.paused,protocol?.paused?'New admissions are paused.':'Admission opens after deployment, review and release activation.');
 const existing=runtime?.listings?.find(l=>l.baseMint===mint);
 add('unique','New market request',runtime?.configured&&!existing,existing?'This mint already has a lifetime request. Manage it in Portfolio.':'One lifetime admission request per mint, checked against the verified deployment.');
 const permit=runtime?.permits?.find(p=>p.protocol===runtime.protocolAddress&&p.baseMint===mint&&p.lister===address);
 let validPermit=false;try{validPermit=Boolean(permit&&permit.consumed===false&&BigInt(permit.expiresAt)>BigInt(now));}catch{}
 add('permit','Operator permit',validPermit,validPermit?'An unused, unexpired permit matches this wallet and mint.':'The operator must approve this exact wallet and mint before any burn.');
 const solUnits=base(sol,9),tokenUnits=base(tokens,verified?.decimals);
 let enoughSol=false;try{enoughSol=solUnits!==null&&protocol&&solUnits>=BigInt(protocol.policy.minSolLamports);}catch{}
 add('funding','Escrow amounts',enoughSol&&tokenUnits!==null,'Enter positive, exact-unit token amounts and meet the configured SOL minimum.');
 return {ready:checks.every(c=>c.pass),checks,firstBlocker:checks.find(c=>!c.pass)?.detail??null};
}
