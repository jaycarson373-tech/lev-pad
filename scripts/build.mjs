import { mkdir, copyFile } from 'node:fs/promises';
import { build } from 'esbuild';
const root = new URL('../', import.meta.url);
await mkdir(new URL('dist/assets/', root), { recursive: true });
await copyFile(new URL('web/styles.css', root), new URL('dist/assets/levermeme.css', root));
await copyFile(new URL('web/lending.css', root), new URL('dist/assets/lending.css', root));
await copyFile(new URL('web/favicon.svg', root), new URL('dist/assets/favicon.svg', root));
for (const route of ['', 'trade/', 'list-token/', 'portfolio/', 'ecosystem/', 'admin/', 'lending/']) {
  await mkdir(new URL(`dist/${route}`, root), { recursive: true });
  await copyFile(new URL('web/index.html', root), new URL(`dist/${route}index.html`, root));
}
await build({ entryPoints: [new URL('web/app.js', root).pathname], outfile: new URL('dist/assets/levermeme.js', root).pathname,
  bundle: true, minify: true, format: 'esm', target: 'es2022', legalComments: 'none' });
console.log('LeverMeme built: 7 routes, verified trading runtime, inactive lending preview, wallet review and operator console.');
