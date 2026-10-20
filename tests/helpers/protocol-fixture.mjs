import { createHash } from 'node:crypto';
import { getAddressDecoder,getAddressEncoder,getProgramDerivedAddress } from '@solana/kit';
import * as sdk from '../../clients/program.mjs';
import { validateLaunch,verifiedDeployment,verifiedProtocol,runtimeSnapshot,decodeOwned } from '../../lib/deployment.mjs';
import { MAINNET_GENESIS } from '../../lib/mainnet-read.mjs';
export const key=n=>getAddressDecoder().decode(new Uint8Array(32).fill(n));
export const loader='BPFLoaderUpgradeab1e11111111111111111111111',token='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
export const account=(owner,data,executable=false)=>({owner,data:[Buffer.from(data).toString('base64'),'base64'],executable});
export async function fixture(){
 const artifact=Buffer.alloc(128,7);artifact.set([127,69,76,70]);
 const config={network:'solana:mainnet',programAddress:key(2),admin:key(1),leverMint:key(10),quoteMint:key(11),programSha256:createHash('sha256').update(artifact).digest('hex'),programSize:artifact.length,upgradeAuthority:key(1),custodyEnabled:false,tradingEnabled:false};
 const [programData]=await getProgramDerivedAddress({programAddress:loader,seeds:[getAddressEncoder().encode(config.programAddress)]});
 const [protocol]=await sdk.findProtocolPda({admin:config.admin},{programAddress:config.programAddress});
 const rawProgram=Buffer.alloc(36);rawProgram.writeUInt32LE(2);rawProgram.set(getAddressEncoder().encode(programData),4);
 const rawData=Buffer.alloc(45+artifact.length+16);rawData.writeUInt32LE(3);rawData.writeBigUInt64LE(50n,4);rawData[12]=1;rawData.set(getAddressEncoder().encode(config.admin),13);rawData.set(artifact,45);
 const protocolData={version:3,admin:config.admin,leverMint:config.leverMint,quoteMint:config.quoteMint,policy:{burnAmount:100n,minSolLamports:1000n,feeBps:30,feeShares:[7500,1000,500,1000],feeDestinations:[key(30),key(31),key(33)]},paused:true,bump:255,totalBurned:0n,listingCount:0n,initialSupply:1000000n,platformRevenue:0n,tokenCreatorRevenue:0n};
 const mint=Buffer.alloc(82);mint[45]=1;mint[44]=6;mint.writeBigUInt64LE(1000000n,36);
 const records=new Map([[config.programAddress,account(loader,rawProgram,true)],[programData,account(loader,rawData)],[protocol,account(config.programAddress,sdk.getProtocolEncoder().encode(protocolData))],[config.leverMint,account(token,mint)],[config.quoteMint,account(token,mint)]]);
 const [revenue]=await sdk.findRevenuePda({protocol},{programAddress:config.programAddress});
 records.set(revenue,account(config.programAddress,sdk.getRevenueLedgerEncoder().encode({protocol,nativeCreatorCollected:0n,wsolCreatorCollected:0n,quoteCreatorCollected:0n,quoteBuybackSpent:0n,wsolBuybackSpent:0n,buybackBurned:0n})));
 const read=async(method,params)=>{if(method==='getGenesisHash')return MAINNET_GENESIS;if(method==='getAccountInfo')return {context:{slot:100},value:records.get(params[0])??null};if(method==='getProgramAccounts')return[];if(method==='getSlot')return 100;throw new Error(`Unexpected RPC ${method}`);};
 return {config,protocol,programData,rawData,protocolData,records,read};
}
