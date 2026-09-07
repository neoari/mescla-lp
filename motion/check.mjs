import {build} from 'esbuild';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
const temp=await mkdtemp(join(tmpdir(),'mescla-infographic-check-'));
try {
  const outfile=join(temp,'check.cjs');
  await build({entryPoints:['src/check.tsx'],bundle:true,platform:'node',format:'cjs',target:'node22',outfile,jsx:'automatic'});
  execFileSync(process.execPath,[outfile],{stdio:'inherit'});
} finally {await rm(temp,{recursive:true,force:true});}
