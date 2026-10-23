// Build only. Does not generate, open or use signing keys, deploy or send transactions.
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve, join } from 'node:path';
import { spawn } from 'node:child_process';
import { copyFile,readFile,rename } from 'node:fs/promises';
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
child.on('close', async code => {
  // LLVM can emit fatal-for-SVM stack diagnostics even when Cargo returns 0.
  const stackFailure = /Stack offset .*exceeded max offset|Estimated function frame size/i.test(diagnostics);
  if (stackFailure) console.error('Rejected: SBF stack violations must be fixed before release.');
  // null also means failure (for example, a signal-killed compiler); never
  // post-process or advertise a stale artifact after an interrupted build.
  process.exitCode = code===0&&!stackFailure?0:1;
  if(process.exitCode)return;
  try{
    // Same release post-processing used by official cargo-build-sbf. Retain a
    // local diagnostic copy, but hash/test/deploy only the stripped canonical .so.
    const objcopy=join(toolchain,'../llvm/bin/llvm-objcopy');
    if(!existsSync(objcopy))throw new Error('Official SBF llvm-objcopy is missing; release post-processing refused.');
    for(const name of ['levermeme','execution_fixture']){
      const artifact=join(root,'onchain/target/sbf-solana-solana/release',name+'.so'),temporary=artifact+'.stripped';
      const before=(await readFile(artifact)).length;
      await copyFile(artifact,artifact+'.unstripped');
      await new Promise((resolve,reject)=>{
        const strip=spawn(objcopy,['--strip-all',artifact,temporary],{stdio:'inherit'});
        strip.once('error',reject);strip.once('close',status=>status===0?resolve():reject(new Error('SBF release stripping failed.')));
      });
      const after=await readFile(temporary);
      if(after.length>before||!after.subarray(0,4).equals(Buffer.from([127,69,76,70])))throw new Error('Invalid stripped SBF artifact.');
      await rename(temporary,artifact);
      console.log(`${name}: ${before} → ${after.length} bytes. ${name==='execution_fixture'?'TEST ONLY: never deploy.':'Canonical release artifact; rerun SVM tests before deployment.'}`);
    }
  }catch(error){console.error(error.message);process.exitCode=1;}
});
