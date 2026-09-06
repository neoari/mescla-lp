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
paths=[ROOT/'index.html',ROOT/'privacidade/index.html']+[ROOT/'para'/d['slug']/'index.html' for d in segments]
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
    css=root.xpath('//style/text()')[0];assert css.count('{')==css.count('}')
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
# Motion is Home-only; every other page has an independent, usable static surface.
assert len(home.xpath('//*[@data-ribbon-scene]'))==1
assert len(home.xpath('//button[@data-motion-toggle and @hidden]'))==1
for path in paths:
    root=html.fromstring(path.read_text())
    if path.parent.name!='privacidade':
        assert len(root.xpath('//script[@type="module" and starts-with(@src,"/assets/experience.js?v=")]'))==1
        assert len(root.xpath('//link[starts-with(@href,"/assets/experience.css?v=")]'))==1
        assert len(root.xpath('//img[contains(@src,"/assets/platforms/")]'))==4
        assert len(root.xpath('//svg[contains(@class,"ui-icon")]'))>=10
    if 'para' in path.parts:assert not root.xpath('//*[@data-ribbon-scene]')
# All local JS module dependencies resolve inside the published allowlist.
for asset in PUBLIC_FILES:
    if asset.endswith('.js'):
        source=(ROOT/asset).read_text()
        for relative in re.findall(r"(?:from\s*|import\s*\(?)['\"](\.[^'\"]+)['\"]", source):
            dependency=((ROOT/asset).parent/relative.split('?')[0]).resolve().relative_to(ROOT).as_posix()
            assert dependency in PUBLIC_FILES,(asset,dependency)
print(f'Passed: 7 pages; links, forms, accessible IDs; module assets; logos; reproducible {len(PUBLIC_FILES)}-file public bundle and matching deployment allowlist.')
