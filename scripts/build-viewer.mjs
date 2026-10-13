import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../',import.meta.url));
await build({
  absWorkingDir:root,
  entryPoints:['robot/viewer-source.js'],
  outfile:'robot/viewer.js',
  bundle:true,
  minify:true,
  format:'esm',
  target:['es2022'],
  supported:{'template-literal':false},
  legalComments:'external'
});
