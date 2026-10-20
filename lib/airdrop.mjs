import { createHash } from 'node:crypto';
import { address, getAddressEncoder } from '@solana/kit';
const maxU64 = (1n << 64n) - 1n;
const hash = (...parts) => createHash('sha256').update(Buffer.concat(parts.map(p => Buffer.from(p)))).digest();
const publicKey = value => getAddressEncoder().encode(address(value));
const u64 = value => {
  if (typeof value !== 'bigint' && (typeof value !== 'string' || !/^\d+$/.test(value))) throw new Error('Use integer base-unit strings or BigInt.');
  const n = BigInt(value);
  if (n < 0n || n > maxU64) throw new Error('Amount exceeds u64.');
  const bytes = Buffer.alloc(8); bytes.writeBigUInt64LE(n); return bytes;
};
export function airdropLeaf(campaign, wallet, index, amount) {
  return hash(Buffer.from('levermeme:airdrop:v1'), publicKey(campaign), publicKey(wallet), u64(index), u64(amount));
}
function branch(a, b) {
  return hash(Buffer.from('levermeme:node:v1'), ...(Buffer.compare(a, b) <= 0 ? [a,b] : [b,a]));
}
export function verifyAirdropProof(leaf, proof, root) {
  if (proof.length > 24 || [leaf,root,...proof].some(p => p.length !== 32)) return false;
  return proof.reduce((node,sibling) => branch(node,sibling), Buffer.from(leaf)).equals(Buffer.from(root));
}
// One allocation per wallet matches the on-chain campaign+wallet replay guard.
export function buildAirdrop(campaign, entries, initialSupply) {
  publicKey(campaign); u64(initialSupply);
  if (!entries.length || entries.length > 100_000) throw new Error('Campaign must contain 1–100,000 wallets.');
  const wallets = new Set(); let total = 0n;
  const claims = entries.map((entry, i) => {
    publicKey(entry.wallet); u64(entry.amount);
    if (wallets.has(entry.wallet) || BigInt(entry.amount) === 0n) throw new Error('Duplicate wallet or zero allocation.');
    wallets.add(entry.wallet); total += BigInt(entry.amount);
    return { wallet: entry.wallet, index: String(i), amount: String(entry.amount) };
  });
  const budget = BigInt(initialSupply) / 10n;
  if (total !== budget) throw new Error('Published allocations must total the funded 10% supply reserve.');
  const levels = [claims.map(c => airdropLeaf(campaign,c.wallet,c.index,c.amount))];
  while (levels.at(-1).length > 1) {
    const row = levels.at(-1), next = [];
    for(let i=0;i<row.length;i+=2) next.push(branch(row[i], row[i+1] ?? row[i]));
    levels.push(next);
  }
  return { version:1, campaign, total: String(total), root: levels.at(-1)[0].toString('hex'),
    claims: claims.map((claim, index) => {
      const proof=[]; let at=index;
      for(const row of levels.slice(0,-1)) { proof.push((row[at ^ 1] ?? row[at]).toString('hex')); at=Math.floor(at/2); }
      return { ...claim, proof };
    }) };
}
