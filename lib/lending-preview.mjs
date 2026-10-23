// Illustration only: a user-entered valuation is NEVER an oracle or loan offer.
// This module cannot deposit collateral, approve a mint, sign or transfer funds.
export function lendingPreview(value){
 if(typeof value!=='string'||value.length>40||! /^\d+(\.\d{1,9})?$/.test(value))throw new Error('Enter a positive SOL valuation with at most 9 decimal places.');
 const [whole,fraction='']=value.split('.'),collateralLamports=BigInt(whole+fraction.padEnd(9,'0'));
 if(collateralLamports<=0n||collateralLamports>(1n<<64n)-1n)throw new Error('Illustrative valuation is outside the supported range.');
 return {illustrationOnly:true,enabled:false,ltvBps:2500,collateralLamports,maximumPrincipalLamports:collateralLamports*2500n/10000n};
}
export function solUnits(value){const n=BigInt(value),fraction=String(n%1000000000n).padStart(9,'0').replace(/0+$/,'');return String(n/1000000000n)+(fraction?'.'+fraction:'');}
