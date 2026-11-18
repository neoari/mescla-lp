// Local-only fixture. Not in PUBLIC_FILES. Never calls CRM or a real endpoint.
const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');
const mock=`<script>
window.__leadLocal={calls:[]};
window.fetch=async function(url,options){
 if(url!=='/api/lead')throw new Error('Chamada bloqueada pelo teste local');
 window.__leadLocal.calls.push({url:url,body:JSON.parse(options.body)});
 var first=window.__leadLocal.calls.length===1;
 return new Response(JSON.stringify(first?{ok:false}:{ok:true,reference:'teste-local-ref-001'}),{status:first?503:201,headers:{'Content-Type':'application/json'}});
};
</script>`;
let html=fs.readFileSync(path.join(root,'para/consultorias/index.html'),'utf8');
html=html.replace('<script src="/assets/measurement-config.js',mock+'<script src="/assets/measurement-config.js');
if(!html.includes('window.__leadLocal'))throw Error('fixture não injetada');
fs.writeFileSync(path.join(__dirname,'browser-fixture.html'),html);
console.log('Fixture local preparada; fora da allowlist pública.');
