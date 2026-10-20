// Build only. Does not generate, open or use signing keys, deploy or send transactions.
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve, join } from 'node:path';
import { spawn } from 'node:child_process';
const root = resolve(import.meta.dirname, '..');
const cache = join(homedir(), '.cache/solana');
const candidates = process.env.SBF_RUST_HOME ? [process.env.SBF_RUST_HOME] :
  (existsSync(cache) ? readdirSync(cache).sort().reverse().map(v => join(cache, v, 'platform-tools/rust')) : []);
const toolchain = candidates.find(dir => existsSync(join(dir, 'bin/rustc')) && existsSync(join(dir, 'bin/cargo')));
if (!toolchain) throw new Error('Install Solana platform-tools, or set SBF_RUST_HOME to its rust directory. No wallet is required.');
const child = spawn(join(toolchain, 'bin/cargo'), [
  'build', '--manifest-path', 'onchain/Cargo.toml', '--locked', '--release', '--target', 'sbf-solana-solana', '--lib',
], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, NO_DNA: '1', RUSTC: join(toolchain, 'bin/rustc') } });
let diagnostics = '';
for (const [stream, output] of [[child.stdout, process.stdout], [child.stderr, process.stderr]]) {
  stream.on('data', chunk => { output.write(chunk); diagnostics += chunk.toString(); });
}
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('close', code => {
  // LLVM can emit fatal-for-SVM stack diagnostics even when Cargo returns 0.
  const stackFailure = /Stack offset .*exceeded max offset|Estimated function frame size/i.test(diagnostics);
  if (stackFailure) console.error('Rejected: SBF stack violations must be fixed before release.');
  process.exitCode = code || (stackFailure ? 1 : 0);
});
