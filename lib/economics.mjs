import policy from '../config/economics.json' with { type: 'json' };
export { policy };
export function allocateRevenue(amount, shares) {
  const raw=BigInt(amount);
  if(raw<0n||raw>18446744073709551615n)throw new Error('Amount outside u64');
  const entries=Object.entries(shares);
  if(!entries.length||entries.some(([,bps])=>!Number.isInteger(bps)||bps<0||bps>10000)||entries.reduce((sum,[,bps])=>sum+bps,0)!==10000)throw new Error('Shares must sum to 10000 basis points');
  const result=Object.fromEntries(entries.map(([key,bps])=>[key,raw*BigInt(bps)/10000n]));
  const dust=raw-Object.values(result).reduce((sum,x)=>sum+x,0n);
  const largest=entries.reduce((best,item)=>item[1]>best[1]?item:best);
  result[largest[0]]+=dust;
  return result;
}
export function airdropBudget(supply) {const raw=BigInt(supply);if(raw<0n||raw>18446744073709551615n)throw new Error('Supply outside u64');return raw*BigInt(policy.airdropSupplyBps)/10000n;}
