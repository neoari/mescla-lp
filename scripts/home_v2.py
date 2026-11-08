"""Home v2 (nov/2026): diagnóstico gratuito, método da Mescla e time de IA.

Retorna o CSS escopado (prefixo v2-) e o conteúdo de <main>. O menu, o rodapé,
a medição e os links de contato continuam vindo de index.html e build-site.py.
"""
from html import escape
from urllib.parse import quote

PHOTO = 'https://andredemoraes.com/foto-hero.jpg'


def _wa(phone, text):
    return f'https://wa.me/{phone}?text={quote(text)}'


CSS = r"""
.v2{--v2-r:24px;overflow-x:clip}
.v2 section{padding:112px 0;position:relative}
.v2 .v2-eyebrow{font-family:'JetBrains Mono',monospace;font-size:13px;letter-spacing:.09em;text-transform:uppercase;color:var(--verde);margin:0 0 20px}
.v2 h2{font-size:clamp(36px,4.6vw,62px);max-width:860px}
.v2 h3{font-family:'Instrument Sans',sans-serif;font-size:20px;font-weight:600;line-height:1.3;letter-spacing:-.01em}
.v2 .v2-lead{font-size:clamp(18px,1.6vw,21px);line-height:1.6;max-width:640px;margin-top:26px;color:var(--noite)}
.v2 .v2-muted{color:var(--cinza)}
.v2 .v2-tag{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:12px;padding:4px 11px;border-radius:999px;background:var(--nevoa);color:var(--cinza)}
.v2 .v2-btn{display:inline-flex;align-items:center;gap:10px;padding:16px 26px;border-radius:999px;background:var(--verde);color:var(--branco);text-decoration:none;font-weight:600;font-size:16px;transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s}
.v2 .v2-btn:hover{transform:translateY(-2px);box-shadow:0 12px 28px -12px rgba(17,108,96,.55)}
.v2 .v2-btn.v2-ghost{background:transparent;color:var(--noite);box-shadow:inset 0 0 0 1.5px var(--noite)}
.v2 .v2-btn.v2-sun{background:var(--sol);color:var(--noite)}
.v2 .v2-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:38px}
.v2 .v2-card{background:#fff;border:1px solid var(--linha);border-radius:var(--v2-r);padding:30px;transition:transform .35s cubic-bezier(.16,1,.3,1),box-shadow .35s}
.v2 .v2-card:hover{transform:translateY(-3px);box-shadow:0 22px 44px -28px rgba(27,25,48,.35)}
.v2 .v2-card p{margin-top:10px;color:var(--cinza)}
.v2 .v2-grid{display:grid;gap:18px;margin-top:52px}
.v2 .v2-g3{grid-template-columns:repeat(3,1fr)}
@media(max-width:920px){.v2 .v2-g3{grid-template-columns:1fr}}
/* hero */
.v2 .v2-hero{padding:72px 0 104px;background:radial-gradient(1200px 520px at 85% 10%,rgba(111,217,201,.18),transparent 60%),radial-gradient(900px 480px at 100% 90%,rgba(242,184,75,.14),transparent 60%)}
.v2 .v2-hero-grid{display:grid;grid-template-columns:1.08fr .92fr;gap:40px;align-items:center}
@media(max-width:980px){.v2 .v2-hero-grid{grid-template-columns:1fr}}
.v2 .v2-hero h1{font-size:clamp(46px,6.2vw,90px)}
.v2 .v2-hero h1 span{display:block;color:var(--verde)}
.v2 .v2-assure{display:flex;gap:18px;flex-wrap:wrap;margin-top:30px;font-size:15px;color:var(--cinza)}
.v2 .v2-assure span::before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--mare);margin-right:8px;vertical-align:1px}
.v2 .v2-prism-art{width:100%;max-width:560px;margin-left:auto;display:block}
.v2 .v2-ray{stroke-dasharray:420;stroke-dashoffset:420;animation:v2-draw 1.3s cubic-bezier(.16,1,.3,1) forwards}
.v2 .v2-ray:nth-of-type(2){animation-delay:.12s}.v2 .v2-ray:nth-of-type(3){animation-delay:.24s}.v2 .v2-ray:nth-of-type(4){animation-delay:.36s}
.v2 .v2-beam{stroke-dasharray:300;stroke-dashoffset:300;animation:v2-draw 1s cubic-bezier(.16,1,.3,1) forwards}
.v2 .v2-chip{opacity:0;animation:v2-fade .6s cubic-bezier(.16,1,.3,1) forwards}
.v2 .v2-chip:nth-of-type(1){animation-delay:.9s}.v2 .v2-chip:nth-of-type(2){animation-delay:1s}.v2 .v2-chip:nth-of-type(3){animation-delay:1.1s}.v2 .v2-chip:nth-of-type(4){animation-delay:1.2s}
@keyframes v2-draw{to{stroke-dashoffset:0}}
@keyframes v2-fade{to{opacity:1}}
/* rotina */
.v2 .v2-day{display:grid;grid-template-columns:.9fr 1.1fr;gap:56px;align-items:start}
@media(max-width:920px){.v2 .v2-day{grid-template-columns:1fr}}
.v2 .v2-timeline{display:grid;gap:12px;position:relative}
.v2 .v2-step{display:grid;grid-template-columns:72px 1fr;gap:16px;padding:20px 22px;border-radius:18px;background:#fff;border:1px solid var(--linha)}
.v2 .v2-step b{font-family:'JetBrains Mono',monospace;font-weight:500;color:var(--verde);font-size:15px}
.v2 .v2-step.v2-night{background:var(--noite);color:var(--branco);border-color:var(--noite)}
.v2 .v2-step.v2-night b{color:var(--mare)}
/* contraste */
.v2 .v2-vs{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:52px}
@media(max-width:820px){.v2 .v2-vs{grid-template-columns:1fr}}
.v2 .v2-vs-col{border-radius:var(--v2-r);padding:32px}
.v2 .v2-vs-col h3{margin-bottom:18px}
.v2 .v2-vs-col ul{list-style:none;margin:0;padding:0;display:grid;gap:14px}
.v2 .v2-vs-col li{padding-left:30px;position:relative}
.v2 .v2-solo{background:var(--nevoa);color:var(--cinza)}
.v2 .v2-solo li::before{content:"–";position:absolute;left:6px;color:var(--cinza)}
.v2 .v2-team{background:var(--noite);color:var(--branco)}
.v2 .v2-team li::before{content:"";position:absolute;left:2px;top:7px;width:14px;height:14px;border-radius:50%;background:var(--mare)}
.v2 .v2-line{font-family:'Fraunces',serif;font-size:clamp(28px,3.2vw,42px);letter-spacing:-.035em;margin-top:52px}
.v2 .v2-line em{font-style:normal;background:linear-gradient(transparent 62%,rgba(242,184,75,.55) 62%)}
.v2 .v2-arch{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:56px;position:relative}
@media(max-width:920px){.v2 .v2-arch{grid-template-columns:1fr}}
.v2 .v2-arch .v2-card{background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.14);color:var(--branco)}
.v2 .v2-arch .v2-card p{color:#C9C7D6}
.v2 .v2-arch .v2-tag{background:rgba(111,217,201,.16);color:var(--mare)}
.v2 .v2-arch .v2-main{background:var(--branco);color:var(--noite)}
.v2 .v2-arch .v2-main p{color:var(--cinza)}
.v2 .v2-arch .v2-main .v2-tag{background:var(--sol);color:var(--noite)}
.v2 .v2-arch h3{margin-top:16px;font-size:24px}
/* diagnóstico */
.v2 .v2-diag{display:grid;grid-template-columns:1fr 1.1fr;gap:64px;align-items:center;margin-top:20px}
@media(max-width:980px){.v2 .v2-diag{grid-template-columns:1fr;gap:40px}}
.v2 .v2-list{list-style:none;padding:0;margin:28px 0 0;display:grid;gap:12px}
.v2 .v2-list li{display:flex;gap:14px;align-items:flex-start}
.v2 .v2-list li i{flex:0 0 28px;height:28px;border-radius:50%;background:var(--nevoa);color:var(--verde);font-style:normal;font-family:'JetBrains Mono',monospace;font-size:13px;display:grid;place-items:center}
.v2 .v2-matrix{display:grid;grid-template-columns:auto 1fr 1fr;grid-template-rows:1fr 1fr auto;gap:10px;max-width:540px;aspect-ratio:1.04/1}
.v2 .v2-q{border-radius:18px;padding:18px;display:flex;flex-direction:column;justify-content:space-between;font-size:14px;line-height:1.4}
.v2 .v2-q b{display:block;font-size:17px;margin-bottom:4px}
.v2 .v2-q small{font-size:13px;opacity:.8}
.v2 .v2-q1{background:var(--mare);grid-column:2;grid-row:1}
.v2 .v2-q2{background:var(--sol);grid-column:3;grid-row:1}
.v2 .v2-q3{background:var(--nevoa);grid-column:2;grid-row:2}
.v2 .v2-q4{background:#F5D9D3;grid-column:3;grid-row:2}
.v2 .v2-ax{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:var(--cinza)}
.v2 .v2-axy{grid-column:1;grid-row:1/3;writing-mode:vertical-rl;transform:rotate(180deg);text-align:center}
.v2 .v2-axx{grid-column:2/4;grid-row:3;text-align:center}
@media(max-width:520px){.v2 .v2-q{padding:12px;font-size:12px}.v2 .v2-q b{font-size:14px}.v2 .v2-q small{display:none}}
/* método */
.v2 .v2-method{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-top:52px;counter-reset:v2m}
@media(max-width:1080px){.v2 .v2-method{grid-template-columns:1fr 1fr}}
@media(max-width:620px){.v2 .v2-method{grid-template-columns:1fr}}
.v2 .v2-method .v2-card{padding:26px;border-radius:20px;display:flex;flex-direction:column}
.v2 .v2-method .v2-card::before{counter-increment:v2m;content:"0" counter(v2m);font-family:'JetBrains Mono',monospace;color:var(--verde);font-size:14px;margin-bottom:16px}
.v2 .v2-deliv{margin-top:auto!important;padding-top:16px;border-top:1px dashed var(--linha);font-size:14px;color:var(--noite)!important}
.v2 .v2-method p:not(.v2-deliv){margin-bottom:16px}
.v2 .v2-deliv span{display:block;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:var(--verde);margin-bottom:4px}
/* controle */
.v2 .v2-control{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start}
@media(max-width:920px){.v2 .v2-control{grid-template-columns:1fr}}
.v2 .v2-checks{list-style:none;padding:0;margin:0;display:grid;gap:12px}
.v2 .v2-checks li{padding:20px 22px 20px 58px;background:#fff;border:1px solid var(--linha);border-radius:18px;position:relative}
.v2 .v2-checks li::before{content:"✓";position:absolute;left:20px;top:19px;width:24px;height:24px;border-radius:50%;background:var(--verde);color:#fff;font-size:13px;display:grid;place-items:center}
/* dono */
.v2 .v2-own{background:linear-gradient(180deg,rgba(236,235,241,.6),rgba(236,235,241,0))}
.v2 .v2-dark{background:var(--verde);color:var(--branco);border-color:var(--verde)}
.v2 .v2-dark p{color:#D9F2EE}
/* quem */
.v2 .v2-who{display:grid;grid-template-columns:380px 1fr;gap:64px;align-items:center;margin-top:12px}
@media(max-width:900px){.v2 .v2-who{grid-template-columns:1fr;gap:36px}}
.v2 .v2-photo{border-radius:28px;overflow:hidden;aspect-ratio:4/5;background:var(--nevoa);position:relative}
.v2 .v2-photo img{width:100%;height:100%;object-fit:cover;object-position:50% 22%;display:block}
.v2 .v2-photo::after{content:"";position:absolute;inset:auto 0 0 0;height:8px;background:linear-gradient(90deg,var(--mare),var(--verde),var(--sol),var(--roma))}
.v2 .v2-quote{font-family:'Fraunces',serif;font-size:clamp(26px,2.8vw,36px);letter-spacing:-.03em;line-height:1.2;margin-top:26px}
/* áreas */
.v2 .v2-areas{display:flex;flex-wrap:wrap;gap:10px;margin-top:36px}
.v2 .v2-areas a{padding:12px 18px;border-radius:999px;border:1px solid var(--linha);background:#fff;text-decoration:none;font-weight:500;transition:border-color .2s,background .2s}
.v2 .v2-areas a:hover{border-color:var(--verde);background:rgba(111,217,201,.12)}
/* faq */
.v2 details{border-bottom:1px solid var(--linha);padding:22px 0;max-width:880px}
.v2 summary{cursor:pointer;font-weight:600;font-size:19px;list-style:none;display:flex;justify-content:space-between;gap:20px}
.v2 summary::-webkit-details-marker{display:none}
.v2 summary::after{content:"+";color:var(--verde);font-size:24px;line-height:1}
.v2 details[open] summary::after{content:"–"}
.v2 details p{margin-top:12px;color:var(--cinza);max-width:760px}
/* final */
.v2 .v2-final{background:var(--verde);color:var(--branco);text-align:center;overflow:hidden}
.v2 .v2-final h2{margin:0 auto;color:var(--branco)}
.v2 .v2-final .v2-actions{justify-content:center}
.v2 .v2-final .v2-ghost{color:var(--branco);box-shadow:inset 0 0 0 1.5px var(--branco)}
/* revelação */
.v2 [data-v2-reveal]{opacity:0;transform:translateY(18px);transition:opacity .42s cubic-bezier(.16,1,.3,1),transform .42s cubic-bezier(.16,1,.3,1)}
.v2 [data-v2-reveal].v2-in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.v2 [data-v2-reveal]{opacity:1;transform:none;transition:none}.v2 .v2-ray,.v2 .v2-beam{animation:none;stroke-dashoffset:0}.v2 .v2-chip{animation:none;opacity:1}.v2 .v2-btn,.v2 .v2-card{transition:none}}
@media(max-width:620px){.v2 section{padding:76px 0}.v2 .v2-hero{padding:44px 0 76px}}
"""

REVEAL_JS = """<script>(()=>{const els=document.querySelectorAll('[data-v2-reveal]');if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){els.forEach(e=>e.classList.add('v2-in'));return}const io=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('v2-in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});els.forEach((e,i)=>{e.style.transitionDelay=(i%4)*90+'ms';io.observe(e)})})();</script>"""

PRISM_SVG = """<svg class="v2-prism-art" viewBox="0 0 560 440" role="img" aria-labelledby="v2-prism-t"><title id="v2-prism-t">Dois fios, pessoas e agentes de IA, se cruzam numa trama e saem em quatro caminhos: comece aqui, aposta, quando sobrar tempo e evitar por ora.</title>
<defs><mask id="v2-trama-gaps" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="white"/><path d="M59 21H75V25H59ZM59 41H75V45H59ZM25 55H41V59H25ZM25 75H41V79H25ZM21 25H25V41H21ZM41 25H45V41H41ZM55 59H59V75H55ZM75 59H79V75H75Z" fill="black"/></mask></defs>
<g fill="none" stroke-linecap="round">
<path class="v2-beam" d="M10 170 C90 170 120 196 170 204" stroke="#F2B84B" stroke-width="7"/>
<path class="v2-beam" d="M10 262 C90 262 120 232 170 224" stroke="#6FD9C9" stroke-width="7"/>
</g>
<g fill="none" stroke-width="10" stroke-linecap="round">
<path class="v2-ray" d="M292 196 C340 160 370 112 412 82" stroke="#6FD9C9"/>
<path class="v2-ray" d="M296 206 C340 196 378 178 420 168" stroke="#F2B84B"/>
<path class="v2-ray" d="M296 226 C340 240 378 258 420 268" stroke="#ECEBF1"/>
<path class="v2-ray" d="M292 236 C340 272 370 326 412 356" stroke="#CF3E27" stroke-opacity=".75"/>
</g>
<g transform="translate(166 150) scale(1.3)"><g mask="url(#v2-trama-gaps)"><rect x="25" y="10" width="16" height="80" rx="8" fill="#F2B84B"/><rect x="59" y="10" width="16" height="80" rx="8" fill="#F2B84B"/><rect x="10" y="25" width="80" height="16" rx="8" fill="#6FD9C9"/><rect x="10" y="59" width="80" height="16" rx="8" fill="#6FD9C9"/><rect x="25" y="22" width="16" height="22" fill="#F2B84B"/><rect x="59" y="56" width="16" height="22" fill="#F2B84B"/></g></g>
<g font-family="Instrument Sans, sans-serif" font-size="15" font-weight="600" fill="#1B1930">
<g class="v2-chip"><rect x="418" y="62" width="132" height="38" rx="19" fill="#6FD9C9"/><text x="484" y="86" text-anchor="middle">Comece aqui</text></g>
<g class="v2-chip"><rect x="426" y="149" width="116" height="38" rx="19" fill="#F2B84B"/><text x="484" y="173" text-anchor="middle">Aposta</text></g>
<g class="v2-chip"><rect x="426" y="249" width="126" height="38" rx="19" fill="#ECEBF1" stroke="#DDDAE5"/><text x="489" y="273" text-anchor="middle" font-size="13">Quando sobrar</text></g>
<g class="v2-chip"><rect x="418" y="337" width="132" height="38" rx="19" fill="#F5D9D3"/><text x="484" y="361" text-anchor="middle">Evitar por ora</text></g>
</g>
<g font-family="JetBrains Mono, monospace" font-size="12" letter-spacing="1.2" fill="#625F72"><text x="16" y="156">PESSOAS</text><text x="16" y="288">AGENTES DE IA</text></g>
</svg>"""


def home_v2(segments, phone):
    diag = _wa(phone, 'Quero o diagnóstico gratuito da Mescla.\n\nMinha atividade:\nO trabalho que mais pesa hoje:')
    talk = _wa(phone, 'Quero conversar sobre um time de IA para o meu trabalho.')
    areas = ''.join(f'<a href="/para/{escape(d["slug"])}/" data-segment-link="{escape(d["slug"])}" data-attribution-link>{escape(d["label"])}</a>' for d in segments)
    return f'''<div class="v2">
<section class="v2-hero" aria-labelledby="hero-title"><div class="wrap v2-hero-grid">
<div>
<p class="v2-eyebrow">Consultoria e implantação de IA para pequenos negócios</p>
<h1 id="hero-title">Seu trabalho pode ir mais longe. <span>Com um time de IA.</span></h1>
<p class="v2-lead">A Mescla monta equipes de pessoas e agentes de IA para tirar tarefas do caminho, organizar o conhecimento e ampliar o que você consegue fazer, aproveitando sempre que possível as ferramentas que você já tem.</p>
<div class="v2-actions"><a class="v2-btn" href="#diagnostico">Fazer o diagnóstico gratuito <span aria-hidden="true">→</span></a><a class="v2-btn v2-ghost" href="#metodo">Ver como funciona <span aria-hidden="true">↓</span></a></div>
<p class="v2-assure"><span>Para pessoas e empresas</span><span>Diagnóstico gratuito</span><span>A parte técnica fica com a Mescla</span></p>
</div>
<div>{PRISM_SVG}</div>
</div></section>

<section aria-labelledby="v2-day-t"><div class="wrap v2-day">
<div data-v2-reveal><p class="v2-eyebrow">Uma rotina funcionando</p><h2 id="v2-day-t">Uma terça-feira com o seu time de IA.</h2><p class="v2-lead">O time adianta o que é repetitivo. Você entra onde o seu olhar faz diferença.</p><p style="margin-top:22px"><span class="v2-tag">exemplo ilustrativo</span></p></div>
<div class="v2-timeline">
<div class="v2-step" data-v2-reveal><b>08:00</b><span>O pedido chegou pelo WhatsApp. O agente comercial já reuniu o histórico do cliente.</span></div>
<div class="v2-step" data-v2-reveal><b>08:05</b><span>A primeira versão da proposta está pronta para você revisar.</span></div>
<div class="v2-step" data-v2-reveal><b>10:00</b><span>Você ajusta o preço. O agente aprende o critério para a próxima vez.</span></div>
<div class="v2-step" data-v2-reveal><b>18:00</b><span>O resumo do dia chega no seu e-mail, com decisões e pendências.</span></div>
<div class="v2-step v2-night" data-v2-reveal><b>03:00</b><span>Enquanto você dorme, o time organiza os documentos da semana.</span></div>
</div>
</div></section>

<section id="seu-time" aria-labelledby="v2-vs-t"><div class="wrap">
<div data-v2-reveal><p class="v2-eyebrow">A diferença</p><h2 id="v2-vs-t">Tem gente trabalhando sozinha. E tem gente trabalhando com um time de IA.</h2></div>
<div class="v2-vs">
<div class="v2-vs-col v2-solo" data-v2-reveal><h3>Trabalhando sozinho</h3><ul><li>Tarefas repetitivas toda semana, na mão</li><li>O conhecimento fica na cabeça de cada um</li><li>Quando alguém sai, o trabalho para</li><li>Crescer exige contratar</li><li>IA é um chat aberto de vez em quando</li></ul></div>
<div class="v2-vs-col v2-team" data-v2-reveal><h3>Com um time de IA</h3><ul><li>Os agentes adiantam e você revisa</li><li>O conhecimento fica organizado e disponível</li><li>Quando alguém sai, o time continua</li><li>Crescer é escolher o próximo trabalho</li><li>Agentes com papel, limites e revisão</li></ul></div>
</div>
<p class="v2-line" data-v2-reveal>O trabalho avança. <em>O conhecimento fica.</em></p>
</div></section>

<section aria-labelledby="v2-does-t"><div class="wrap">
<div data-v2-reveal><p class="v2-eyebrow">O que o seu time faz</p><h2 id="v2-does-t">Agentes com função, memória e agenda.</h2></div>
<div class="v2-grid v2-g3">
<div class="v2-card" data-v2-reveal><h3>Explique uma vez. O time lembra.</h3><p>Preferências, referências e decisões ficam guardadas.</p></div>
<div class="v2-card" data-v2-reveal><h3>Está onde você já conversa.</h3><p>WhatsApp, e-mail e as ferramentas da sua equipe.</p></div>
<div class="v2-card" data-v2-reveal><h3>Trabalha em equipe.</h3><p>Um agente passa o trabalho para o outro, sem você repetir o contexto.</p></div>
<div class="v2-card" data-v2-reveal><h3>Tem agenda.</h3><p>Relatórios, resumos e acompanhamentos no horário combinado.</p></div>
<div class="v2-card" data-v2-reveal><h3>Cada agente tem função e responsável.</h3><p>Você sabe quem faz o quê e quem responde por cada agente.</p></div>
<div class="v2-card" data-v2-reveal><h3>Aproveita o que você já tem.</h3><p>Na maioria dos casos, usamos o plano de IA e as ferramentas que você já paga.</p></div>
</div>
</div></section>


<section id="diagnostico" aria-labelledby="v2-diag-t"><div class="wrap">
<div class="v2-diag">
<div data-v2-reveal><p class="v2-eyebrow">Diagnóstico gratuito</p><h2 id="v2-diag-t">Descubra qual rotina melhorar primeiro.</h2>
<p class="v2-lead">Conte como é o seu trabalho. Analisamos a sua rotina e devolvemos:</p>
<ul class="v2-list"><li><i>1</i><span>a lista das suas rotinas e onde está o peso;</span></li><li><i>2</i><span>a <strong>matriz de prioridades</strong> do seu trabalho;</span></li><li><i>3</i><span>o primeiro trabalho recomendado, com o que ele exige e o próximo passo.</span></li></ul>
<div class="v2-actions"><a class="v2-btn" href="{diag}" target="_blank" rel="noopener noreferrer" data-contact data-contact-message="Quero o diagnóstico gratuito da Mescla." data-placement="diagnostico">Quero o meu diagnóstico</a></div></div>
<div data-v2-reveal>
<div class="v2-matrix" role="img" aria-label="Matriz de impacto por esforço, exemplo ilustrativo">
<span class="v2-ax v2-axy">impacto →</span>
<div class="v2-q v2-q1"><div><b>Comece aqui</b><small>Alto impacto, pouco esforço</small></div><span>Resumo diário de e-mails e reuniões</span></div>
<div class="v2-q v2-q2"><div><b>Aposta</b><small>Alto impacto, mais esforço</small></div><span>Atendimento com memória de cada cliente</span></div>
<div class="v2-q v2-q3"><div><b>Quando sobrar tempo</b><small>Pouco impacto, pouco esforço</small></div><span>Organizar arquivos antigos</span></div>
<div class="v2-q v2-q4"><div><b>Evitar por ora</b><small>Pouco impacto, muito esforço</small></div><span>Automatizar um processo que muda toda semana</span></div>
<span class="v2-ax v2-axx">esforço →</span>
</div>
<p style="margin-top:14px"><span class="v2-tag">exemplo ilustrativo · o seu diagnóstico usa as suas rotinas</span></p>
</div>
</div>
</div></section>

<section id="metodo" aria-labelledby="v2-method-t"><div class="wrap">
<div data-v2-reveal><p class="v2-eyebrow">Como a Mescla trabalha</p><h2 id="v2-method-t">Antes da ferramenta, a escolha do trabalho.</h2></div>
<div class="v2-method">
<div class="v2-card" data-v2-reveal><h3>Entendimento</h3><p>Diagnóstico e escolha do primeiro trabalho.</p><p class="v2-deliv"><span>Você recebe</span>Matriz de prioridades</p></div>
<div class="v2-card" data-v2-reveal><h3>Imersão</h3><p>Como a rotina acontece hoje, com os gargalos.</p><p class="v2-deliv"><span>Você recebe</span>Retrato da rotina e medida inicial de tempo ou retrabalho</p></div>
<div class="v2-card" data-v2-reveal><h3>Desenho</h3><p>Uma tarefa completa, do pedido à entrega.</p><p class="v2-deliv"><span>Você recebe</span>Demonstração do que cada agente faz e de onde você entra</p></div>
<div class="v2-card" data-v2-reveal><h3>Implantação</h3><p>O time funcionando na rotina real.</p><p class="v2-deliv"><span>Você recebe</span>Piloto com critérios de aceite combinados</p></div>
<div class="v2-card" data-v2-reveal><h3>Evolução</h3><p>Medir, ajustar e escolher a próxima melhoria.</p><p class="v2-deliv"><span>Você recebe</span>Comparação com o ponto de partida</p></div>
</div>
</div></section>

<section aria-labelledby="v2-ctrl-t"><div class="wrap v2-control">
<div data-v2-reveal><p class="v2-eyebrow">Autonomia com limites e recibo</p><h2 id="v2-ctrl-t">Os agentes fazem. Você decide o que sai para o mundo.</h2></div>
<ul class="v2-checks">
<li data-v2-reveal><strong>Mensagem a cliente, pagamento ou publicação passa por você.</strong> O resto o time adianta.</li>
<li data-v2-reveal><strong>Cada entrega tem recibo:</strong> o que foi feito, com que fonte e quanto custou.</li>
<li data-v2-reveal><strong>Cada correção vira aprendizado</strong> para o time.</li>
<li data-v2-reveal><strong>Acessos e limites de gasto</strong> definidos com a sua equipe.</li>
</ul>
</div></section>

<section class="v2-own" aria-labelledby="v2-own-t"><div class="wrap">
<div data-v2-reveal><p class="v2-eyebrow">Seu time, suas contas, seus dados</p><h2 id="v2-own-t">O que construímos fica com você.</h2></div>
<div class="v2-grid v2-g3">
<div class="v2-card" data-v2-reveal><h3>No seu nome</h3><p>Contas, documentação e conhecimento organizados em nome do cliente.</p></div>
<div class="v2-card" data-v2-reveal><h3>Se a ferramenta mudar, o time continua</h3><p>O conhecimento não fica preso a um fornecedor.</p></div>
<div class="v2-card v2-dark" data-v2-reveal><h3>A parte técnica fica com a Mescla</h3><p>Você não precisa virar especialista em IA.</p></div>
</div>
</div></section>

<section id="quem" aria-labelledby="v2-who-t"><div class="wrap v2-who">
<div class="v2-photo" data-v2-reveal><img src="{PHOTO}" alt="André de Moraes, fundador da Mescla" width="1067" height="1600" loading="lazy" decoding="async"></div>
<div data-v2-reveal><p class="v2-eyebrow">Quem está por trás</p><h2 id="v2-who-t">André de Moraes</h2>
<p class="v2-lead">Fundador da Mescla. Ex-CEO e fundador da Edoo. Constrói agentes de IA desde 2024 e trabalha todos os dias com o próprio time de agentes.</p>
<p class="v2-quote">“A Mescla usa no próprio trabalho tudo o que implanta para os clientes.”</p></div>
</div></section>

<section id="segmentos" aria-labelledby="v2-areas-t"><div class="wrap">
<div data-v2-reveal><p class="v2-eyebrow">Aplicações por área</p><h2 id="v2-areas-t">Veja como um time de IA funciona no seu tipo de trabalho.</h2></div>
<div class="v2-areas" data-v2-reveal>{areas}</div>
</div></section>

<section aria-labelledby="v2-faq-t"><div class="wrap">
<div data-v2-reveal><p class="v2-eyebrow">Perguntas</p><h2 id="v2-faq-t">Boas perguntas. Respostas diretas.</h2></div>
<div style="margin-top:36px">
<details><summary>O diagnóstico é gratuito mesmo?</summary><p>Sim. Você recebe a matriz de prioridades e a recomendação do primeiro trabalho, sem compromisso de contratar.</p></details>
<details><summary>Meus dados ficam seguros?</summary><p>Os acessos são definidos com você, e as contas e o conhecimento ficam no seu nome. Não compartilhe senhas ou documentos confidenciais no primeiro contato.</p></details>
<details><summary>Preciso trocar minhas ferramentas?</summary><p>Na maioria dos casos, não. Aproveitamos o que você já usa sempre que possível.</p></details>
<details><summary>E se a ferramenta mudar?</summary><p>O time e o conhecimento continuam, porque não ficam presos a um fornecedor.</p></details>
<details><summary>Quanto custa a implantação?</summary><p>Depende do trabalho escolhido. O valor sai do diagnóstico, em uma proposta.</p></details>
</div>
</div></section>

<section class="v2-final" id="conversar" aria-labelledby="v2-final-t"><div class="wrap">
<h2 id="v2-final-t">Qual trabalho, se andasse sozinho, faria você faturar mais?</h2>
<div class="v2-actions"><a class="v2-btn v2-sun" href="{diag}" target="_blank" rel="noopener noreferrer" data-contact data-contact-message="Quero o diagnóstico gratuito da Mescla." data-placement="diagnostico">Fazer o diagnóstico gratuito</a><a class="v2-btn v2-ghost" href="{talk}" target="_blank" rel="noopener noreferrer" data-contact data-contact-message="Quero conversar sobre funcionários digitais para o meu negócio." data-placement="fechamento">Conversar no WhatsApp</a></div>
</div></section>
</div>
{REVEAL_JS}'''
