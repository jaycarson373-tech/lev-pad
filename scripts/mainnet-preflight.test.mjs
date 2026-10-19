import test from 'node:test';
import assert from 'node:assert/strict';
import { validateConfig, decodeAddress, inspectMint, inspectVault, preflight, TOKEN_PROGRAM } from './mainnet-preflight.mjs';
const encode = bytes => ({ owner: TOKEN_PROGRAM, executable: false, data: [bytes.toString('base64'), 'base64'] });
test('rejects unconfigured release before calling RPC', async () => {
  const result = await preflight({}, () => { throw new Error('must not call'); });
  assert.equal(result.ready, false); assert.equal(result.errors.length, 6);
});
test('validates actual address byte length', () => {
  assert.equal(decodeAddress(TOKEN_PROGRAM).length, 32);
  assert.throws(() => decodeAddress('fake')); assert.throws(() => decodeAddress('0'.repeat(44)));
  assert.equal(validateConfig({}).length, 6);
});
test('rejects mint account substitutions and unsafe authorities', () => {
  const data = Buffer.alloc(82); data[45] = 1; data[44] = 6;
  assert.equal(inspectMint(encode(data)).decimals, 6);
  assert.throws(() => inspectMint({ ...encode(data), owner: 'wrong' }));
  data.writeUInt32LE(1, 46); assert.throws(() => inspectMint(encode(data)), /freeze authority/);
});
test('rejects empty collateral vault and wrong quote token', () => {
  const data = Buffer.alloc(165); data[108] = 1;
  const config = { quoteMint: '11111111111111111111111111111111', vaultAuthority: '11111111111111111111111111111111' };
  assert.throws(() => inspectVault(encode(data), config), /unfunded/);
  data.writeBigUInt64LE(1n, 64); assert.equal(inspectVault(encode(data), config).collateralBaseUnits, '1');
  assert.throws(() => inspectVault(encode(data), { ...config, quoteMint: TOKEN_PROGRAM }), /mint mismatch/);
});
test('rejects wrong network before fetching accounts', async () => {
  const address = '11111111111111111111111111111111';
  const config = Object.fromEntries(['quoteMint', 'perpsProgram', 'collateralVault', 'vaultAuthority', 'oracleAccount', 'oracleProgram'].map(k => [k, address]));
  await assert.rejects(() => preflight(config, async () => 'devnet'), /not Solana mainnet/);
});
