export function keeperState(value,{wallet,programAddress,asset='none'}){
 if(!value)return {version:1,wallet,programAddress,asset,day:'',reservedLamports:'0',reservedBuybackUnits:'0',pending:null};
 if(value.version!==1||value.wallet!==wallet||value.programAddress!==programAddress||value.asset!==asset||! /^(|\d{4}-\d{2}-\d{2})$/.test(value.day)||! /^\d{1,30}$/.test(value.reservedLamports)||! /^\d{1,30}$/.test(value.reservedBuybackUnits))throw new Error('Keeper state is corrupt or belongs to a different wallet/program/asset. Reconcile it before execution.');
 if(value.pending&&(! /^[1-9A-HJ-NP-Za-km-z]{80,90}$/.test(value.pending.signature??'')||! /^[a-f0-9]{64}$/.test(value.pending.messageHash??'')||!Number.isSafeInteger(value.pending.lastValidBlockHeight)||!Number.isFinite(Date.parse(value.pending.submittedAt))))throw new Error('Keeper pending signature record is corrupt. Manual reconciliation required.');
 return value;
}
export function reserveKeeperBudget(state,{day,maxLamports,dailyLamports,buybackUnits=0n,dailyBuybackUnits=0n}){
 if(maxLamports<=0n||dailyLamports<maxLamports||buybackUnits<0n)throw new Error('Invalid keeper budget');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||state.day&&day<state.day)throw new Error('Keeper clock moved backwards; reconcile before spending.');
 const today=state.day===day?state:{...state,day,reservedLamports:'0',reservedBuybackUnits:'0'};
 const sol=BigInt(today.reservedLamports)+maxLamports,token=BigInt(today.reservedBuybackUnits)+buybackUnits;
 if(sol>dailyLamports||buybackUnits>0n&&token>dailyBuybackUnits)throw new Error('Daily conservative SOL or buyback input reservation budget exhausted');
 return {...today,reservedLamports:String(sol),reservedBuybackUnits:String(token)};
}
