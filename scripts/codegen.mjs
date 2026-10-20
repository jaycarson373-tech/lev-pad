import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createFromRoot } from 'codama';
import { rootNodeFromAnchor } from '@codama/nodes-from-anchor';
import { renderVisitor } from '@codama/renderers-js';
import { build } from 'esbuild';
const root = resolve(import.meta.dirname, '..');
const idl = JSON.parse(readFileSync(resolve(root, 'idl/levermeme.json'), 'utf8'));
await createFromRoot(rootNodeFromAnchor(idl)).accept(renderVisitor(resolve(root, 'clients'), {
  generatedFolder: 'generated', syncPackageJson: false, kitImportStrategy: 'rootOnly',
}));
await build({ entryPoints: [resolve(root, 'clients/generated/index.ts')],
  outfile: resolve(root, 'clients/program.mjs'), bundle: true, format: 'esm',
  platform: 'neutral', packages: 'external', target: 'es2022' });
console.log('Generated Kit-native client from the Anchor IDL. Template program address is not deployable configuration.');
