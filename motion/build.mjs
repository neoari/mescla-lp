import {build} from 'esbuild';
import {readFile,writeFile} from 'node:fs/promises';
await build({entryPoints:['src/player.tsx'],bundle:true,format:'esm',target:['es2022'],minify:true,legalComments:'linked',outfile:'../assets/infographics.js',define:{'process.env.NODE_ENV':'"production"'},jsx:'automatic'});
const notices=[];
for(const name of ['remotion','@remotion/player','react','react-dom']) {
  let license;
  for(const file of ['LICENSE.md','LICENSE','LICENSE.txt']) {
    try {license=await readFile(`node_modules/${name}/${file}`,'utf8');break;} catch {}
  }
  if(!license)throw new Error('Missing license for '+name);
  const info=JSON.parse(await readFile(`node_modules/${name}/package.json`,'utf8'));
  notices.push(`${name} ${info.version}\n${license}`);
}
await writeFile('../assets/infographics-LICENSE.txt',notices.join('\n\n--------------------\n\n'));
