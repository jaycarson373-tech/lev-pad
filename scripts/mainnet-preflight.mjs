import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const MAINNET_GENESIS = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d';
export const TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export function decodeAddress(value) {
  if (typeof value !== 'string' || !value.length || value.length > 44) throw new Error('Invalid address');
  let number = 0n;
  for (const char of value) {
    const digit = ALPHABET.indexOf(char);
    if (digit < 0) throw new Error('Invalid address');
    number = number * 58n + BigInt(digit);
  }
  const bytes = [];
  while (number) { bytes.unshift(Number(number & 255n)); number >>= 8n; }
  const leading = value.match(/^1*/)[0].length;
  const result = Buffer.concat([Buffer.alloc(leading), Buffer.from(bytes)]);
  if (result.length !== 32) throw new Error('Address must decode to 32 bytes');
  return result;
}

export function validateConfig(config) {
  const fields = ['quoteMint', 'perpsProgram', 'collateralVault', 'vaultAuthority', 'oracleAccount', 'oracleProgram'];
  const errors = [];
  for (const field of fields) {
    try { decodeAddress(config?.[field]); } catch { errors.push(`${field}: missing or invalid Solana address`); }
  }
  if (config?.perpsProgram === TOKEN_PROGRAM) errors.push('perpsProgram: cannot be the SPL Token program');
  return errors;
}

function bytesOf(account) {
  if (!account || account.data?.[1] !== 'base64') throw new Error('Expected a base64 account');
  return Buffer.from(account.data[0], 'base64');
}

export function inspectMint(account) {
  if (account?.owner !== TOKEN_PROGRAM || account.executable) throw new Error('xSOL must be a standard SPL Token mint; Token-2022 requires extension-specific review');
  const bytes = bytesOf(account);
  if (bytes.length !== 82 || bytes[45] !== 1) throw new Error('Invalid or uninitialized SPL mint');
  const mintAuthority = bytes.readUInt32LE(0);
  const freezeAuthority = bytes.readUInt32LE(46);
  if (![0, 1].includes(mintAuthority) || ![0, 1].includes(freezeAuthority)) throw new Error('Invalid mint authority flags');
  if (freezeAuthority) throw new Error('Collateral mint has a freeze authority; explicit collateral risk review required');
  if (mintAuthority) throw new Error('Collateral mint has a mint authority; explicit collateral risk review required');
  return { decimals: bytes[44], supplyBaseUnits: bytes.readBigUInt64LE(36).toString() };
}

export function inspectVault(account, config) {
  if (account?.owner !== TOKEN_PROGRAM || account.executable) throw new Error('Vault is not owned by SPL Token');
  const bytes = bytesOf(account);
  if (bytes.length !== 165 || bytes[108] !== 1) throw new Error('Invalid, frozen, or uninitialized collateral vault');
  if (!bytes.subarray(0, 32).equals(decodeAddress(config.quoteMint))) throw new Error('Collateral vault mint mismatch');
  if (!bytes.subarray(32, 64).equals(decodeAddress(config.vaultAuthority))) throw new Error('Collateral vault authority mismatch');
  if (bytes.readUInt32LE(72) !== 0 || bytes.readUInt32LE(129) !== 0) throw new Error('Collateral vault has a delegate or close authority');
  const amount = bytes.readBigUInt64LE(64);
  if (amount === 0n) throw new Error('Collateral vault is unfunded');
  return { collateralBaseUnits: amount.toString() };
}

export async function preflight(config, rpc) {
  const errors = validateConfig(config);
  if (errors.length) return { ready: false, errors };
  if (await rpc('getGenesisHash', []) !== MAINNET_GENESIS) throw new Error('RPC is not Solana mainnet-beta');
  const addresses = [config.quoteMint, config.perpsProgram, config.collateralVault, config.oracleAccount];
  const response = await rpc('getMultipleAccounts', [addresses, { encoding: 'base64', commitment: 'finalized' }]);
  if (!Number.isSafeInteger(response?.context?.slot) || !Array.isArray(response.value) || response.value.length !== 4) throw new Error('Invalid RPC account response');
  const [mint, program, vault, oracle] = response.value;
  const checks = {};
  const check = (name, fn) => { try { checks[name] = fn(); } catch (error) { errors.push(`${name}: ${error.message}`); } };
  check('quoteMint', () => inspectMint(mint));
  check('perpsProgram', () => {
    const loaders = ['BPFLoaderUpgradeab1e11111111111111111111111', 'BPFLoader2111111111111111111111111111111111', 'LoaderV411111111111111111111111111111111111'];
    if (!program?.executable || !loaders.includes(program.owner)) throw new Error('Expected a deployed executable Solana program');
    return { owner: program.owner };
  });
  check('collateralVault', () => inspectVault(vault, config));
  check('oracle', () => {
    if (!oracle || oracle.executable || oracle.owner !== config.oracleProgram || bytesOf(oracle).length === 0) throw new Error('Oracle missing or owned by a different program');
    return { owner: oracle.owner };
  });
  return { ready: false, accountChecksPassed: errors.length === 0, slot: response.context.slot, checks, errors,
    remaining: ['Verify market state binds this mint, oracle, and vault to the derivatives program', 'Verify oracle feed identity, freshness, confidence, and manipulation limits', 'Verify vault PDA derivation and program upgrade authority', 'Pass open/close/withdraw/liquidation tests and funded mainnet acceptance'] };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const config = JSON.parse(await readFile(process.argv[2] || 'mainnet.config.json', 'utf8'));
    const rpcUrl = process.env.SOLANA_RPC_URL;
    const configErrors = validateConfig(config);
    if (configErrors.length) { console.log(JSON.stringify({ ready: false, errors: configErrors }, null, 2)); process.exitCode = 1; }
    else {
      if (!rpcUrl || new URL(rpcUrl).protocol !== 'https:') throw new Error('SOLANA_RPC_URL must be an HTTPS mainnet RPC endpoint');
      const rpc = async (method, params) => {
        const response = await fetch(rpcUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }), signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error(`RPC HTTP ${response.status}`);
        const body = await response.json();
        if (body.error || !Object.hasOwn(body, 'result')) throw new Error('RPC returned an error or missing result');
        return body.result;
      };
      console.log(JSON.stringify(await preflight(config, rpc), null, 2));
      process.exitCode = 1; // Account checks alone never establish full launch readiness.
    }
  } catch (error) { console.error(JSON.stringify({ ready: false, error: error.code === 'ENOENT' ? 'Create mainnet.config.json from mainnet.config.example.json' : 'Preflight failed: check configuration and RPC availability' })); process.exitCode = 1; }
}
