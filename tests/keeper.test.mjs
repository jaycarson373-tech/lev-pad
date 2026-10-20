import test from 'node:test';import assert from 'node:assert/strict';
import {settlementCandidate} from '../lib/keeper.mjs';
const market={address:'market',price:'100000000000000',priceSlot:'100',priceTimestamp:'1000',risk:{spreadBps:10,maxPriceAgeSlots:'10',emergencyDelaySeconds:'3600',maintenanceBps:100,liquidationBps:25}};
const position={address:'position',market:'market',closed:false,long:true,collateral:'10000',notional:'100000',entryPrice:'100100000000000',reservedProfit:'30000',openedSlot:'100'};
test('keeper never liquidates a healthy position or a different market',()=>{assert.equal(settlementCandidate(position,market,30,100,1000),null);assert.equal(settlementCandidate({...position,market:'other'},market,30,100,1000),null);});
test('keeper identifies maintenance, cap and outage actions with exact integers',()=>{
 assert.equal(settlementCandidate(position,{...market,price:'91000000000000'},30,100,1000).reason,1);
 assert.equal(settlementCandidate(position,{...market,price:'200000000000000'},30,100,1000).reason,2);
 assert.equal(settlementCandidate(position,market,30,200,2000),null);
 assert.equal(settlementCandidate(position,market,30,200,4600).reason,3);
});
test('keeper rejects future prices and closed positions',()=>{assert.equal(settlementCandidate(position,market,30,99,1000),null);assert.equal(settlementCandidate({...position,closed:true},market,30,100,1000),null);});
