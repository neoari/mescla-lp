#!/usr/bin/env python3
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
import hashlib, json, subprocess, tarfile
from lxml import html
import re, sys
sys.dont_write_bytecode=True
from public_bundle import PUBLIC_FILES
ROOT=Path(__file__).resolve().parents[1]
THIRD_PARTY_PLATFORMS=('github.com/block/buzz','openclaw','hyperagent','hermes-agent','nousresearch')
DIAGNOSIS_MESSAGE='Quero o diagnóstico gratuito da Mescla.'
class Structure(HTMLParser):
    void={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
    def __init__(self):super().__init__();self.stack=[]
    def handle_starttag(self,tag,attrs):
        if tag not in self.void:self.stack.append(tag)
    def handle_startendtag(self,tag,attrs):pass
    def handle_endtag(self,tag):
        assert self.stack and self.stack[-1]==tag,(tag,self.stack)
        self.stack.pop()
segments=json.loads((ROOT/'content/segments.json').read_text())
paths=[ROOT/'index.html',ROOT/'privacidade/index.html',ROOT/'prisma/index.html']+[ROOT/'para'/d['slug']/'index.html' for d in segments]
canonicals=[]
for path in paths:
    source=path.read_text();c=Structure();c.feed(source);assert not c.stack,path
    root=html.fromstring(source);ids=root.xpath('//@id');assert len(ids)==len(set(ids)),path
    assert len(root.xpath('//h1'))==1,path
    canonical=root.xpath('//link[@rel="canonical"]/@href');assert len(canonical)==1;canonicals+=canonical
    for n in root.xpath('//*[@aria-labelledby]'):assert all(i in ids for i in n.get('aria-labelledby').split()),path
    for n in root.xpath('//*[@href or @src]'):
        value=n.get('href') or n.get('src');u=urlparse(value)
        if value.startswith('#'):assert u.fragment in ids,(path,value)
        elif value.startswith('/'):
            dest=ROOT/u.path.lstrip('/');dest=dest/'index.html' if u.path.endswith('/') else dest
            assert dest.is_file(),(path,value)
            if u.fragment and dest.suffix=='.html':assert u.fragment in html.fromstring(dest.read_text()).xpath('//@id'),(path,value)
        if n.get('target')=='_blank':assert {'noopener','noreferrer'}<=set(n.get('rel','').split()),path
    for css in root.xpath('//style/text()'):assert css.count('{')==css.count('}'),path
    # Every local asset a page loads is in the published bundle.
    for value in root.xpath('//@src|//link/@href'):
        if value.startswith('/assets/'):assert urlparse(value).path.lstrip('/') in PUBLIC_FILES,(path,value)
    if 'para' in path.parts:
        slug=path.parent.name
        assert root.xpath('//body/@data-segment')==[slug]
        assert len(root.xpath('//form[@class="qualifier"]'))==1
        form=root.xpath('//form')[0];assert form.get('action')=='https://wa.me/5561993973584'
        assert [n.get('name') for n in form.xpath('.//*[@name]')]==['text']
        assert len(form.xpath('.//select[@required]'))==2
        for label in form.xpath('.//label'):assert label.get('for') in ids
        assert root.xpath('//meta[@property="og:url"]/@content')==canonical
        assert root.xpath('//a[@data-contact]')
        assert root.xpath('//meta[@name="description"]/@content')
assert len(canonicals)==len(set(canonicals))
home=html.fromstring((ROOT/'index.html').read_text())
assert len(home.xpath('//a[@data-segment-link]'))==5
assert set(home.xpath('//a/@data-segment-link'))=={d['slug'] for d in segments}, 'Segment click events require a destination identifier'
assert {n.get('href') for n in home.xpath('//a[@data-segment-link]')}=={'/para/'+d['slug']+'/' for d in segments}
archive=ROOT/'site.tar.gz';before=hashlib.sha256(archive.read_bytes()).hexdigest()
subprocess.run(['python3',str(ROOT/'scripts/build-site.py')],check=True,cwd=ROOT,stdout=subprocess.DEVNULL)
assert before==hashlib.sha256(archive.read_bytes()).hexdigest(),'Build is not reproducible'
with tarfile.open(archive) as tar:
    assert sorted(tar.getnames())==sorted(PUBLIC_FILES), "Unexpected public bundle contents"
    for member in tar.getmembers():
        assert member.isfile() and not member.name.startswith('/') and '..' not in member.name
        assert tar.extractfile(member).read()==(ROOT/member.name).read_bytes(),member.name
        assert not any(x in member.name for x in ('.git','docs/','scripts/','content/','proposta'))
expected = re.search(r'^mescla_expected="([^"\n]+)"', (ROOT/'scripts/container-start.sh').read_text(), re.M).group(1).split()
assert expected==list(PUBLIC_FILES), 'Container allowlist differs from the built bundle'
# Home (nov/2026): template content/home.html via scripts/home_v3.py; sem cena 3D, sem infográfico Remotion.
home_source=(ROOT/'index.html').read_text()
assert home.xpath('//title/text()')==['Mescla · Mais faturamento. Mesma equipe. Com funcionários digitais.']
assert home.xpath('//body/@data-segment')==['home'] and home.xpath('//body/@data-page-version')
assert not home.xpath('//meta[@name="robots"]'),'Home must be indexable'
for anchor in ('principal','funcionando','diagnostico','metodo','regras','aplicacoes','quem','perguntas'):assert home.xpath(f'//*[@id="{anchor}"]'),anchor
for asset in ('home.css','fiandeiros.js','home.js','measurement-config.js','measurement.js'):
    assert len(home.xpath(f'//*[starts-with(@src,"/assets/{asset}?v=") or starts-with(@href,"/assets/{asset}?v=")]'))==1,asset
assert not home.xpath('//*[@data-ribbon-scene or @data-motion-scene]')
# Cada botão de WhatsApp leva a sua mensagem: measurement.js reescreve o link a partir de data-contact-message.
whatsapp=home.xpath('//a[starts-with(@href,"https://wa.me/")]')
assert len(whatsapp)>=9 and all(n.get('data-contact') is not None and n.get('data-contact-message') and n.get('data-placement') for n in whatsapp),'WhatsApp link without contact message'
diagnosis=[n for n in whatsapp if n.get('data-placement') in ('menu','topo','diagnostico','fechamento','fixo')]
assert len(diagnosis)==5 and all(n.get('data-contact-message')==DIAGNOSIS_MESSAGE for n in diagnosis)
# Um único mecanismo de consentimento (measurement.js), com o aviso compacto da página.
assert len(home.xpath('//*[@data-measurement-consent]'))==1 and len(home.xpath('//*[@data-measurement-consent]//button[@data-consent="yes"]'))==1 and len(home.xpath('//*[@data-measurement-consent]//button[@data-consent="no"]'))==1
assert len(home.xpath('//button[@data-measurement-manage]'))==1
assert 'data-cookie' not in home_source and '?tex=' not in home_source
# Marca só Mescla no que é publicado (o redirecionamento /prisma/ é a única exceção).
for public in PUBLIC_FILES:
    if public=='prisma/index.html' or not public.endswith(('.html','.css','.js')) or public=='assets/infographics.js':continue
    text=(ROOT/public).read_text()
    for banned in ('prisma','neoari','mescla.ai/prisma'):assert banned not in text.lower(),(public,banned)
    for banned in ('Mescla.AI','Mescla AI'):assert banned not in text,(public,banned)
for path in paths:
    root=html.fromstring(path.read_text())
    if path.parent.name not in ('privacidade','prisma') and 'para' in path.parts:
        assert len(root.xpath('//script[@type="module" and starts-with(@src,"/assets/experience.js?v=")]'))==1
        assert len(root.xpath('//link[starts-with(@href,"/assets/experience.css?v=")]'))==1
        # Nov/2026: as páginas não levam a ferramentas de terceiros nem mostram seus logos.
        assert not root.xpath('//img[contains(@src,"/assets/platforms/")]'),path
        assert len(root.xpath('//svg[contains(@class,"ui-icon")]'))>=10
    if path.parent.name not in ('privacidade','prisma') and 'para' in path.parts:
        assert len(root.xpath('//*[@data-motion-scene]'))==1
        assert root.xpath('//*[contains(@class,"motion-fallback")]')
        assert root.xpath('//*[contains(@class,"motion-equivalent")]')
        assert 'RAG' in path.read_text() and 'MCP' in path.read_text()
    if 'para' in path.parts:assert not root.xpath('//*[@data-ribbon-scene]')
    for href in root.xpath('//a/@href'):assert not any(x in href.lower() for x in THIRD_PARTY_PLATFORMS),(path,href)
    # Toda mensagem de contato das páginas /para começa pelo pedido do diagnóstico gratuito.
    if 'para' in path.parts:
        messages=root.xpath('//a[@data-contact]/@data-contact-message')+root.xpath('//form[@class="qualifier"]/@data-contact-message')
        assert len(messages)==2 and all(m.startswith(DIAGNOSIS_MESSAGE) for m in messages),(path,messages)
# All local JS module dependencies resolve inside the published allowlist.
for asset in PUBLIC_FILES:
    if asset.endswith('.js'):
        source=(ROOT/asset).read_text()
        for relative in re.findall(r"(?:from\s*|import\s*\(?)['\"](\.[^'\"]+)['\"]", source):
            dependency=((ROOT/asset).parent/relative.split('?')[0]).resolve().relative_to(ROOT).as_posix()
            assert dependency in PUBLIC_FILES,(asset,dependency)
print(f'Passed: 8 pages; links, forms, accessible IDs; Home contacts and consent; module assets; logos; reproducible {len(PUBLIC_FILES)}-file public bundle and matching deployment allowlist.')
