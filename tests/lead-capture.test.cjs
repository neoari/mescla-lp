'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { randomUUID } = require('node:crypto');
const { parseHTML } = require('linkedom');
const { buildLeadPayload, createLeadCapture } = require('../assets/measurement.js');
const ROOT = path.resolve(__dirname, '..');
const fields = { nome: 'Pessoa de Teste Local', telefone: '+55 11 90000-0000', interesse: 'outra_rotina', equipe: 'solo', trabalho: 'Exemplo local, nunca enviado.' };
function memory() { const m = new Map(); return { getItem:k=>m.get(k)||null, setItem:(k,v)=>m.set(k,v), removeItem:k=>m.delete(k) }; }
function payload(overrides = {}) { return buildLeadPayload({ ...fields, ...overrides }, 'consultorias', '/para/consultorias/', { values: { utm_source:'teste-local', utm_medium:'unitario', utm_campaign:'captacao', utm_content:'a', utm_term:'b', utm_id:'EXCLUIR', gclid:'EXCLUIR', fbclid:'EXCLUIR' } }); }
function response(status = 201, body = {ok:true, reference:'ref-local-123'}) { return { status, json: async()=>body }; }
function harness(fetch, extra = {}) {
 const calls = [], states = [];
 const capture = createLeadCapture({ fetch:async (url, options) => { assert.equal(url,'/api/lead'); calls.push({url,options,body:JSON.parse(options.body)}); return fetch(url,options); }, uuid:randomUUID, storage:memory(), storageKey:'local-test', AbortController, onState:s=>states.push(s), timeoutMs:50, ...extra });
 return {capture,calls,states};
}
test('contrato exato: obrigatórios, opcionais vazios omitidos e somente cinco UTMs', () => {
 const p = payload({trabalho:'   '});
 assert.deepEqual(Object.keys(p).sort(), ['nome','telefone','segmento','pagina','privacy_version','interesse','equipe','utm_source','utm_medium','utm_campaign','utm_content','utm_term'].sort());
 assert.equal(p.privacy_version,'2026-11-18');
 assert.equal(p.pagina,'/para/consultorias/');
 assert.throws(()=>payload({nome:' '}),/nome/);
 assert.throws(()=>payload({telefone:'abc'}),/WhatsApp/);
 assert.throws(()=>payload({trabalho:'x'.repeat(501)}),/tamanho/);
});
for (const status of [200,201]) test(`HTTP ${status} com confirmação válida: sucesso`, async () => {
 const h=harness(()=>response(status)); const result=await h.capture.submit(payload());
 assert.equal(result.ok,true); assert.equal(h.states.at(-1).status,'success');
 assert.match(h.calls[0].body.submission_id,/^[0-9a-f-]{36}$/);
 assert.equal(h.calls[0].options.method,'POST'); assert.equal(h.calls[0].options.credentials,'same-origin');
 assert.equal(h.calls[0].options.redirect,'error'); assert.equal(h.calls[0].options.headers['Content-Type'],'application/json');
});
for(const [label,status,body] of [
 ['ok false',201,{ok:false}], ['ok textual',200,{ok:'true',reference:'x'}], ['sem referência',201,{ok:true}],
 ['referência vazia',200,{ok:true,reference:' '}], ['referência numérica',200,{ok:true,reference:12}],
 ['referência com controle',201,{ok:true,reference:'abc\ndef'}], ['aceite sem persistência',202,{ok:true,reference:'x'}],
 ['erro de validação',422,{ok:false}], ['falha servidor',500,{ok:true,reference:'x'}]
]) test(`não confirma: ${label}`, async()=>{
 const h=harness(()=>response(status,body));assert.equal((await h.capture.submit(payload())).ok,false);
 assert.equal(h.states.some(s=>s.status==='success'),false);
});
test('JSON inválido e falha de rede não confirmam nem apagam o ID', async()=>{
 let n=0;const h=harness(()=>{ n++;if(n===1)return {status:201,json:async()=>{throw new SyntaxError('bad')}};if(n===2)throw new Error('offline');return response(); });
 await h.capture.submit(payload());await h.capture.submit(payload());await h.capture.submit(payload());
 assert.equal(new Set(h.calls.map(x=>x.body.submission_id)).size,1);
 assert.deepEqual(h.states.map(x=>x.status),['pending','error','pending','error','pending','success']);
});
test('bloqueia submit simultâneo e depois de sucesso; nova solicitação é explícita e tem outro UUID', async()=>{
 let resolve; const h=harness(()=>new Promise(r=>resolve=r));const first=h.capture.submit(payload());
 assert.equal((await h.capture.submit(payload())).ignored,true);assert.equal(h.capture.newRequest(),false);assert.equal(h.calls.length,1);
 resolve(response());await first;assert.equal((await h.capture.submit(payload())).ignored,true);
 assert.equal(h.capture.newRequest(),true);const second=h.capture.submit(payload());resolve(response(200,{ok:true,reference:'segunda'}));await second;
 assert.notEqual(h.calls[0].body.submission_id,h.calls[1].body.submission_id);
});
test('timeout cobre também leitura do JSON; resposta tardia não vira recebido; retry mantém UUID', async()=>{
 let finish,n=0;const h=harness(()=>{n++;return n===1?{status:201,json:()=>new Promise(r=>finish=r)}:response();},{timeoutMs:10});
 assert.equal((await h.capture.submit(payload())).ok,false);assert.equal(h.states.at(-1).reason,'timeout');assert.equal(h.calls[0].options.signal.aborted,true);
 finish({ok:true,reference:'tardia'});await new Promise(setImmediate);assert.equal(h.states.some(s=>s.status==='success'),false);
 await h.capture.submit(payload());assert.equal(h.calls[0].body.submission_id,h.calls[1].body.submission_id);
});
test('UUID de sessão é recuperado após remontar; storage indisponível mantém retry em memória',async()=>{
 const storage=memory(); const a=harness(()=>{throw new Error('offline')},{storage});await a.capture.submit(payload());
 const b=harness(()=>response(),{storage});await b.capture.submit(payload());assert.equal(a.calls[0].body.submission_id,b.calls[0].body.submission_id);
 let n=0;const c=harness(()=>{if(!n++)throw new Error('offline');return response();},{storage:{getItem(){throw Error()},setItem(){throw Error()}}});
 await c.capture.submit(payload());await c.capture.submit(payload());assert.equal(c.calls[0].body.submission_id,c.calls[1].body.submission_id);
});
function mount(segment, fetch, supports = true) {
 const html=fs.readFileSync(path.join(ROOT,'para',segment,'index.html'),'utf8');
 const {document,window:domWindow}=parseHTML(html);
 const form=document.querySelector('.qualifier');
 // Linkedom does not implement native form validity/reset; model only these native primitives.
 form.reportValidity=()=>[...form.querySelectorAll('[required]')].every(x=>Boolean(x.value));
 form.reset=()=>{for(const x of form.querySelectorAll('input,textarea'))x.value='';for(const select of form.querySelectorAll('select')){for(const o of select.querySelectorAll('option'))o.selected=false;select.querySelector('option[value=""]').selected=true;}};
 const storage=memory(); const calls=[];
 const browser={document,location:{pathname:`/para/${segment}/`,href:`https://local.invalid/para/${segment}/?utm_source=teste-local&gclid=EXCLUIR`,search:'?utm_source=teste-local&gclid=EXCLUIR'},sessionStorage:storage,crypto:{randomUUID},AbortController,MESCLA_CONFIG:{},fetch:supports?async(url,opts)=>{calls.push({url,opts,body:JSON.parse(opts.body)});return fetch(url,opts);}:null};
 vm.runInNewContext(fs.readFileSync(path.join(ROOT,'assets/measurement.js'),'utf8'),{window:browser,URL,URLSearchParams,setTimeout,clearTimeout,console});
 function fill(){document.querySelector('#lead-name').value=fields.nome;document.querySelector('#lead-phone').value=fields.telefone;document.querySelector('#goal').value=fields.trabalho;for(const [id,val] of [['team-size','solo'],['interest','outra_rotina']]){for(const o of document.querySelectorAll(`#${id} option`))o.selected=false;document.querySelector(`#${id} option[value="${val}"]`).selected=true;}}
 function submit(){return form.dispatchEvent(new domWindow.Event('submit',{bubbles:true,cancelable:true}));}
 return {document,form,browser,calls,fill,submit,click:el=>el.dispatchEvent(new domWindow.Event('click',{bubbles:true}))};
}
const settle=()=>new Promise(setImmediate);
for (const segment of ['empreendedores','creators','consultorias','agencias','advocacia']) test(`DOM gerado ${segment}: sucesso, referência, medição sem PII e nova solicitação`,async()=>{
 const h=mount(segment,()=>response());h.fill();assert.equal(h.form.hidden,false);assert.equal(h.document.querySelector('.contact-fallback').hidden,true);
 assert.equal(h.submit(),false);await settle();assert.equal(h.calls.length,1);assert.equal(h.calls[0].url,'/api/lead');assert.equal(h.calls[0].body.segmento,segment);
 assert.equal(h.form.dataset.state,'success');assert.match(h.document.querySelector('[data-lead-status]').textContent,/Pedido recebido/);
 const link=h.document.querySelector('[data-lead-whatsapp]');assert.equal(h.document.querySelector('[data-lead-success]').hidden,false);
 assert.equal(new URL(link.href).pathname,'/5511978221510');const msg=new URL(link.href).searchParams.get('text');assert.match(msg,/ref-local-123/);assert.ok(!msg.includes(fields.nome)&&!msg.includes(fields.telefone)&&!msg.includes(fields.trabalho));
 const events=h.browser.dataLayer;assert.equal(events.filter(x=>x.event==='mescla_lead_received').length,1);assert.equal(events.filter(x=>x.event==='mescla_whatsapp_open').length,0);
 const eventText=JSON.stringify(events);assert.ok(!eventText.includes(fields.nome)&&!eventText.includes(fields.telefone)&&!eventText.includes(fields.trabalho)&&!eventText.includes('ref-local-123'));
 h.click(link);assert.equal(events.filter(x=>x.event==='mescla_whatsapp_open').length,1);assert.equal(events.filter(x=>x.event==='mescla_lead_received').length,1);
 h.click(h.document.querySelector('[data-lead-new]'));assert.equal(h.form.dataset.state,'idle');assert.equal(h.document.querySelector('#lead-name').value,'');assert.equal(h.document.querySelector('[data-lead-success]').hidden,true);
});
test('DOM: falha preserva todos os campos, libera retry e fallback; retry mantém ID',async()=>{
 let n=0;const h=mount('consultorias',()=>++n===1?response(503,{ok:false}):response());h.fill();h.submit();await settle();
 assert.equal(h.form.dataset.state,'error');assert.equal(h.document.querySelector('#lead-name').value,fields.nome);assert.equal(h.document.querySelector('#lead-phone').value,fields.telefone);assert.equal(h.document.querySelector('#goal').value,fields.trabalho);
 assert.equal(h.document.querySelector('#team-size').value,'solo');assert.equal(h.document.querySelector('#interest').value,'outra_rotina');
 assert.equal(h.document.querySelector('[data-lead-submit]').disabled,false);assert.equal(h.document.querySelector('.contact-fallback').hidden,false);assert.equal(h.browser.dataLayer.some(x=>x.event==='mescla_lead_received'),false);
 h.submit();await settle();assert.equal(h.calls[0].body.submission_id,h.calls[1].body.submission_id);assert.equal(h.form.dataset.state,'success');
});
test('DOM: campo obrigatório vazio não dispara fetch; APIs ausentes deixam WhatsApp disponível',()=>{
 const a=mount('consultorias',()=>{throw new Error('must not call')});a.submit();assert.equal(a.calls.length,0);
 const b=mount('consultorias',()=>{throw new Error('must not call')},false);assert.equal(b.form.hidden,true);assert.equal(b.document.querySelector('.contact-fallback').hidden,false);
 const link=b.document.querySelector('.contact-fallback a');assert.equal(new URL(link.href).pathname,'/5511978221510');
});
test('HTML sem JavaScript: cinco formulários ocultos e fallback acessível; sem marketing opt-in',()=>{
 for(const s of ['empreendedores','creators','consultorias','agencias','advocacia']){
  const {document}=parseHTML(fs.readFileSync(path.join(ROOT,'para',s,'index.html'),'utf8'));
  assert.equal(document.querySelector('.qualifier').hidden,true);assert.equal(document.querySelector('.contact-fallback').hidden,false);
  assert.equal(document.querySelectorAll('input[type="checkbox"]').length,0);assert.equal(document.querySelector('#lead-name').hasAttribute('required'),true);assert.equal(document.querySelector('#lead-phone').hasAttribute('required'),true);
 }
});
