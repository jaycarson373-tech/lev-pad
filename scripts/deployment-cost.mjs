import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { deploymentCost } from '../lib/deployment-cost.mjs';
const artifact=await readFile(new URL('../onchain/target/sbf-solana-solana/release/levermeme.so',import.meta.url));
console.log(JSON.stringify({...await deploymentCost({programSize:artifact.length}),artifactSha256:createHash('sha256').update(artifact).digest('hex')},null,2));
