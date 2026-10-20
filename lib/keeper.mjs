const u64=value=>{const n=BigInt(value);if(n<0n||n>(1n<<64n)-1n)throw new Error('Keeper state outside u64');return n;};
const fee=(amount,bps)=>(amount*BigInt(bps)+9999n)/10000n;
export function settlementCandidate(position,market,feeBps,slot,nowSeconds){
 if(position.closed||position.market!==market.address)return null;
 const current=u64(slot),priceSlot=u64(market.priceSlot),price=u64(market.price);
 if(price===0n||priceSlot>current)return null;
 const stale=current-priceSlot>u64(market.risk.maxPriceAgeSlots);
 if(stale){return BigInt(nowSeconds)-BigInt(market.priceTimestamp)>=BigInt(market.risk.emergencyDelaySeconds)?{action:'settle-position',position:position.address,reason:3}:null;}
 if(priceSlot<u64(position.openedSlot))return null;
 const shift=fee(price,market.risk.spreadBps),mark=position.long?(price>shift?price-shift:1n):price+shift;
 const collateral=u64(position.collateral),notional=u64(position.notional),entry=u64(position.entryPrice),reserve=u64(position.reservedProfit);
 if(entry===0n)return null;
 let pnl=notional*(mark-entry)/entry;if(!position.long)pnl=-pnl;
 const maximum=collateral+reserve;let gross=collateral+pnl;gross=gross<0n?0n:gross>maximum?maximum:gross;
 const threshold=fee(notional,market.risk.maintenanceBps)+fee(notional,feeBps)+fee(notional,market.risk.liquidationBps);
 if(gross<=threshold)return {action:'settle-position',position:position.address,reason:1};
 return gross===maximum?{action:'settle-position',position:position.address,reason:2}:null;
}
