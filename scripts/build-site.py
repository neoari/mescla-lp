#!/usr/bin/env python3
"""Build static segment pages and a reproducible deployment bundle. No dependencies."""
from pathlib import Path
from html import escape
from urllib.parse import quote
import gzip, io, json, re, tarfile
import sys
sys.dont_write_bytecode = True
from segment_visuals import hero_surface, value_section, tools_section, ai_section, pilot_section
ROOT=Path(__file__).resolve().parents[1]
home=(ROOT/'index.html').read_text()
segments=json.loads((ROOT/'content/segments.json').read_text())
details=json.loads((ROOT/'content/segment-details.json').read_text())
for segment in segments: segment.update(details[segment['slug']])
e=lambda s:escape(str(s),quote=True)
version='2026-09-v2'
phone='5561993973584'
logo='https://raw.githubusercontent.com/neoari/mescla-lp/main/assets/mescla-logo.svg'
css=re.search(r'<style>(.*?)</style>',home,re.S).group(1)
font=re.search(r'<link href="https://fonts.googleapis.com/css2[^>]+>',home).group(0)
brand=lambda href: f'<a class="brand" href="{href}" aria-label="Mescla, página principal"><img class="brand-mark" src="{logo}" width="44" height="36" alt="" decoding="async"><span class="brand-word">mescla</span></a>'
footer=f'''<footer class="footer"><div class="wrap footer-grid"><div>{brand('/')}<small>mescla.ai · neoari · brasília</small><div class="footer-links"><a href="/#segmentos" data-attribution-link>Outras aplicações</a><a href="/privacidade/" data-attribution-link>Privacidade</a></div></div><p class="definition"><em>mescla</em>, s.f.<br>Tecido feito de fios diferentes.</p></div></footer>'''
cards='\n'.join(f'''<a class="segment-card" href="/para/{d['slug']}/" data-attribution-link data-segment-link="{d['slug']}"><span class="section-no" aria-hidden="true">0{i+1}</span><h3>{e(d['label'])}</h3><p>{e(d['card'])}</p><span class="card-link">Ver aplicações <span aria-hidden="true">↗</span></span></a>''' for i,d in enumerate(segments))
block=f'''<!-- SEGMENTOS:INICIO -->
<section class="section segments" id="segmentos" aria-labelledby="segments-title"><div class="wrap"><div class="section-head"><div><p class="eyebrow">Encontre o seu próximo passo</p><h2 id="segments-title">Um time de IA para<br>o seu jeito de trabalhar.</h2></div><p class="lead">Veja como pessoas e agentes podem trabalhar juntos na sua rotina. Escolha uma aplicação para explorar.</p></div><div class="segment-grid">{cards}</div></div></section>
<!-- SEGMENTOS:FIM -->'''
if '<!-- SEGMENTOS:INICIO -->' in home:
    home=re.sub(r'<!-- SEGMENTOS:INICIO -->.*?<!-- SEGMENTOS:FIM -->',lambda _:block,home,flags=re.S)
else:
    home=home.replace('<section class="purpose dark"',block+'\n\n<section class="purpose dark"',1)
if '/assets/segments.css' not in home: home=home.replace('</head>','<link rel="stylesheet" href="/assets/segments.css">\n</head>')
if '/assets/measurement.js' not in home: home=home.replace('</body>','<script src="/assets/measurement-config.js"></script>\n<script src="/assets/measurement.js" defer></script>\n</body>')
home=re.sub(r'<body[^>]*>', lambda _: '<body data-segment="home" data-page-version="'+version+'">', home, count=1)
home=home.replace('<a href="#proposito">Por que existimos</a>','<a href="#segmentos">Para o seu negócio</a>')
# Existing contact links remain functional with JavaScript disabled.
home=re.sub(r'(<a\s+[^>]*href="https://wa.me/[^>]*)(>)',lambda m:m.group(1)+('' if 'data-contact' in m.group(1) else ' data-contact data-placement="home"')+m.group(2),home)
if 'href="/privacidade/"' not in home:
    home=home.replace('<small>mescla.ai · neoari · brasília</small>', '<small>mescla.ai · neoari · brasília</small><div class="footer-links"><a href="/privacidade/">Privacidade</a></div>')
(ROOT/'index.html').write_text(home)
for d in segments:
    slug=d['slug'];url=f'https://mescla.ai/para/{slug}/';title=f"Mescla para {d['label']} · {' '.join(d['headline'])}"
    message=f"Quero conversar sobre um time de IA para {d['short']}.\nSegmento: {d['label']}\nMinha equipe:\nO trabalho que quero melhorar:"
    wa='https://wa.me/'+phone+'?text='+quote(message)
    rows=''.join(f'<article class="routine"><span class="section-no" aria-hidden="true">0{i+1}</span><h3>{e(t)}</h3><p>{e(p)}</p></article>' for i,(t,p) in enumerate(d['outcomes']))
    steps=''.join(f'<li><div><p class="process-meta {"agent" if role=="agent" else ""}">{"Agentes de IA e ferramentas" if role=="agent" else "Você e sua equipe"}</p><h3>{e(t)}</h3><p>{e(p)}</p></div></li>' for role,t,p in d['steps'])
    options=''.join(f'<option value="{e(key)}">{e(label)}</option>' for key,label in d['interests'])
    faq=d['faq']+[(d['question'],d['answer']),('Como começamos?',d['pilot_text']+' Na conversa, definimos entregas, ferramentas e condições antes da implantação.')]
    faq_html=''.join(f'<details><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q,a in faq)
    content=f'''<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#FBFAFD"><title>{e(title)}</title><meta name="description" content="{e(d['description'])}"><link rel="canonical" href="{url}"><meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(d['description'])}"><meta property="og:url" content="{url}"><link rel="icon" type="image/svg+xml" href="{logo}#escuro"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>{font}<style>{css}</style><link rel="stylesheet" href="/assets/segments.css"></head>
<body data-segment="{slug}" data-segment-label="{e(d['label'])}" data-page-version="{version}">
<a class="skip" href="#principal">Pular para o conteúdo</a>
<header class="nav lp-nav"><div class="wrap nav-inner">{brand('/')}<a class="back-home" href="/#segmentos" data-attribution-link>Conhecer a Mescla</a><a class="nav-contact" href="#conversar">Vamos conversar <span aria-hidden="true">↗</span></a></div></header>
<main id="principal">
<section class="hero lp-hero" aria-labelledby="hero-title"><div class="wrap hero-grid"><div class="hero-copy"><p class="eyebrow">{e(d['intro'])}</p><h1 id="hero-title"><span>{e(d['headline'][0])}</span> <em>{e(d['headline'][1])}</em></h1><p class="lead">{e(d['lead'])}</p><div class="hero-actions"><a class="btn" href="#conversar" data-intent>{e(d['cta'])} <span class="arrow" aria-hidden="true">↗</span></a><a class="text-link" href="#aplicacao">Ver uma aplicação <span aria-hidden="true">↓</span></a></div><p class="audience">{e(d['context'])}</p></div>{hero_surface(d)}</div></section>
{value_section(d)}
{tools_section(d)}
<section class="section example" id="aplicacao" aria-labelledby="example-title"><div class="wrap example-layout"><div class="example-copy"><p class="eyebrow">Uma aplicação possível</p><h2 id="example-title">{e(d['example'])}</h2><p class="lead">{e(d['example_intro'])}</p><p class="example-label">Exemplo ilustrativo · escopo definido por projeto</p></div><ol class="process-list">{steps}</ol></div></section>
{ai_section(d)}
{pilot_section(d)}
<section class="section lp-faq" aria-labelledby="faq-title"><div class="wrap faq-grid"><div><p class="eyebrow">Antes de começar</p><h2 id="faq-title">O que vale<br>esclarecer primeiro.</h2></div><div class="faq-list">{faq_html}</div></div></section>
<section class="contact lp-cta" id="conversar" aria-labelledby="contact-title"><div class="wrap contact-grid"><div><p class="eyebrow">Uma conversa sobre o seu trabalho</p><h2 id="contact-title">{e(d['contact_title'])}</h2><p>{e(d['contact_text'])}</p><span class="contact-note">Combinamos o melhor horário para conversar pelo WhatsApp.</span></div><div><div class="contact-fallback"><a class="btn" href="{wa}" target="_blank" rel="noopener noreferrer" data-contact data-placement="landing">Conversar com a Mescla <span class="arrow" aria-hidden="true">↗</span></a></div>
<form class="qualifier" action="https://wa.me/{phone}" method="get" target="_blank" rel="noopener noreferrer" hidden><div class="field"><label for="team-size">Quantas pessoas participam do trabalho?</label><select id="team-size" required><option value="">Selecione</option><option value="solo">Só eu</option><option value="2-5">2 a 5 pessoas</option><option value="6-15">6 a 15 pessoas</option><option value="16+">16 pessoas ou mais</option></select></div><div class="field"><label for="interest">Onde você mais precisa de apoio?</label><select id="interest" required><option value="">Selecione</option>{options}<option value="outra_rotina">Em outra parte do trabalho</option></select></div><div class="field"><label for="goal">O que você quer conseguir? <span class="muted">(opcional)</span></label><textarea id="goal" maxlength="500" placeholder="Conte o resultado que faria diferença para você."></textarea></div><input type="hidden" name="text" value="{e(message)}"><button class="btn" type="submit">Continuar no WhatsApp <span class="arrow" aria-hidden="true">↗</span></button><p class="form-note">Ao continuar, você abre uma mensagem para revisar e enviar à Mescla. <a href="/privacidade/">Como usamos essas informações</a>.</p></form></div></div></section>
</main>{footer}<script src="/assets/measurement-config.js"></script><script src="/assets/measurement.js" defer></script></body></html>'''
    out=ROOT/'para'/slug/'index.html';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(content)
# Public data-use notice describes the actual contact behavior; no legal or compliance claims.
privacy=f'''<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mescla · Uso das informações</title><meta name="description" content="Como a Mescla usa as informações de contato e a origem das campanhas."><link rel="canonical" href="https://mescla.ai/privacidade/">{font}<style>{css}</style><link rel="stylesheet" href="/assets/segments.css"></head><body data-segment="privacidade" data-page-version="{version}"><header class="nav"><div class="wrap nav-inner">{brand('/')}<a class="back-home" href="/">Página principal</a></div></header><main class="section" id="principal"><div class="wrap" style="max-width:800px"><p class="eyebrow">Uso das informações · atualizado em setembro de 2026</p><h1 style="font-size:54px;margin:24px 0">Uma conversa começa com clareza.</h1><p class="lead">A Mescla usa as informações que você compartilha para entender sua rotina, responder ao contato e avaliar um projeto com você.</p><h2 style="font-size:32px;margin:36px 0 15px">O que você informa</h2><p>Nas páginas de aplicações, você pode indicar o tamanho da equipe, a área de interesse e o resultado desejado. Ao continuar, essas respostas compõem uma mensagem no WhatsApp. Você pode revisar a mensagem antes de enviá-la. O formulário não grava suas respostas em um banco de dados do site.</p><h2 style="font-size:32px;margin:36px 0 15px">De onde veio o contato</h2><p>O endereço que trouxe você ao site pode conter identificadores de campanha, como origem, anúncio e público. Essas referências podem acompanhar a mensagem para ajudar a Mescla a entender quais aplicações despertam interesse. O navegador pode manter essas referências durante a sessão para preservar a origem entre as páginas.</p><h2 style="font-size:32px;margin:36px 0 15px">Serviços envolvidos</h2><p>O site é servido com apoio de serviços de hospedagem e distribuição de conteúdo, que podem registrar dados técnicos de acesso. Os links de conversa abrem o WhatsApp, sujeito às condições e políticas do próprio serviço. Não compartilhe senhas, documentos de clientes ou informações confidenciais no primeiro contato.</p><h2 style="font-size:32px;margin:36px 0 15px">Suas informações</h2><p>Para conversar sobre o uso das suas informações, pedir correção ou solicitar exclusão dos dados que compartilhou com a Mescla, entre em contato pelo <a href="https://wa.me/{phone}?text=Quero%20conversar%20sobre%20o%20uso%20das%20minhas%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer">WhatsApp da Mescla</a>.</p><p style="margin-top:30px"><a href="/">Voltar para a página principal</a></p></div></main>{footer}</body></html>'''
(ROOT/'privacidade').mkdir(exist_ok=True);(ROOT/'privacidade/index.html').write_text(privacy)
# This explicit list prevents docs, raw leads, local configuration or repository files entering the web root.
files=['index.html','privacidade/index.html','assets/segments.css','assets/measurement.js','assets/measurement-config.js']+[f"para/{d['slug']}/index.html" for d in segments]
if all((ROOT/f).is_file() for f in files):
    stream=io.BytesIO()
    with tarfile.open(fileobj=stream,mode='w',format=tarfile.USTAR_FORMAT) as tar:
        for f in sorted(files):
            b=(ROOT/f).read_bytes();info=tarfile.TarInfo(f);info.size=len(b);info.mode=0o644;info.mtime=0;tar.addfile(info,io.BytesIO(b))
    (ROOT/'site.tar.gz').write_bytes(gzip.compress(stream.getvalue(),mtime=0))
    print(f'Built Home + 5 landing pages + privacy; deployment bundle: {(ROOT/"site.tar.gz").stat().st_size} bytes.')
else:print('Pages built. Bundle waits for measurement assets.')
