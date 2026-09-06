"""Visual language shared by the Home and segment pages."""
from pathlib import Path
from html import escape
import re

ROOT = Path(__file__).resolve().parents[1]
SEGMENT_ICONS = {'empreendedores': 'lightbulb', 'creators': 'clapperboard', 'consultorias': 'briefcase-business', 'agencias': 'megaphone', 'advocacia': 'scale'}
SEGMENT_TOOLS = {
    'empreendedores': [('whatsapp', 'WhatsApp'), ('googlesheets', 'Sheets'), ('openai', 'ChatGPT')],
    'creators': [('youtube', 'YouTube'), ('instagram', 'Instagram'), ('canva', 'Canva')],
    'consultorias': [('microsoftpowerpoint', 'PowerPoint'), ('googledrive', 'Drive'), ('claude', 'Claude')],
    'agencias': [('trello', 'Trello'), ('slack', 'Slack'), ('canva', 'Canva')],
    'advocacia': [('microsoftword', 'Word'), ('adobeacrobatreader', 'Acrobat'), ('openai', 'ChatGPT')],
}

def ui_icon(name):
    source = (ROOT / 'assets/icons/lucide' / (name + '.svg')).read_text()
    source = re.sub(r'<!--.*?-->', '', source, flags=re.S).strip()
    source = re.sub(r'class="[^"]*"', 'class="ui-icon"', source, count=1)
    return source.replace('<svg', '<svg aria-hidden="true" focusable="false"', 1)

def brand_icon(name):
    source = (ROOT / 'assets/icons' / (name + '.svg')).read_text()
    source = re.sub(r'<title>.*?</title>', '', source, flags=re.S)
    source = re.sub(r'<svg[^>]*>', '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">', source, count=1)
    return f'<span class="brand-symbol brand-symbol--{name}">{source}</span>'

def tool_marks(items, compact=False):
    return '<div class="tool-marks' + (' compact' if compact else '') + '">' + ''.join(f'<span class="tool-mark">{brand_icon(key)}<span>{escape(label)}</span></span>' for key, label in items) + '</div>'

def segment_card(d):
    slug = d['slug']
    return f'''<a class="segment-card segment-card--{slug}" href="/para/{slug}/" data-attribution-link data-segment-link="{slug}"><div class="segment-card-top"><span class="segment-emblem">{ui_icon(SEGMENT_ICONS[slug])}</span>{ui_icon('arrow-up-right')}</div><h3>{escape(d['label'])}</h3><p>{escape(d['card'])}</p>{tool_marks(SEGMENT_TOOLS[slug], True)}<span class="card-link">Explorar possibilidades</span></a>'''

def platforms():
    entries = [('buzz', 'Buzz', 'https://github.com/block/buzz'), ('openclaw', 'OpenClaw', 'https://docs.openclaw.ai/start/teams'), ('hyperagent', 'Hyperagent', 'https://www.hyperagent.com/'), ('hermes', 'Hermes', 'https://hermes-agent.nousresearch.com/')]
    return '<div class="platform-grid">' + ''.join(f'<a class="platform-item" href="{url}" target="_blank" rel="noopener noreferrer"><span class="platform-mark"><img src="/assets/platforms/{key}.{("png" if key == "hermes" else "svg")}" width="44" height="44" alt="" loading="lazy" decoding="async"></span><span>{label}</span>{ui_icon("arrow-up-right")}</a>' for key,label,url in entries) + '</div>'

def home_tools():
    items = [('openai', 'ChatGPT'), ('claude', 'Claude'), ('googlegemini', 'Gemini'), ('googledrive', 'Google Drive'), ('notion', 'Notion'), ('slack', 'Slack'), ('whatsapp', 'WhatsApp'), ('canva', 'Canva'), ('youtube', 'YouTube'), ('instagram', 'Instagram'), ('microsoftword', 'Word'), ('trello', 'Trello')]
    return f'''<section class="tool-gallery" aria-labelledby="tool-gallery-title"><div class="wrap"><div class="tool-gallery-heading"><h2 id="tool-gallery-title">O trabalho já está<br>nas suas ferramentas.</h2><p>Conectamos o que faz sentido para a sua rotina.</p></div>{tool_marks(items)}<p class="gallery-note">Integrações e troca de arquivos conforme o projeto. Cada conexão é avaliada antes da implantação.</p></div></section>'''

def ribbon_stage():
    return f'''<div class="ribbon-stage" aria-label="Pessoas e agentes conectados ao seu trabalho"><div class="ribbon-art" data-ribbon-scene><img class="ribbon-fallback" src="https://raw.githubusercontent.com/neoari/mescla-lp/main/assets/mescla-logo.svg" alt="" width="440" height="360" decoding="async"></div><span class="stage-label stage-label-human">{ui_icon('user-round')}<span>Seu olhar.</span></span><span class="stage-label stage-label-agent">{ui_icon('bot')}<span>Novas possibilidades.</span></span><div class="stage-tool stage-tool-one" aria-label="ChatGPT">{brand_icon('openai')}</div><div class="stage-tool stage-tool-two" aria-label="Google Drive">{brand_icon('googledrive')}</div><div class="stage-tool stage-tool-three" aria-label="Notion">{brand_icon('notion')}</div><p class="stage-caption">Inteligências diferentes.<br><strong>Trabalho em conjunto.</strong></p><button class="motion-toggle" type="button" data-motion-toggle aria-pressed="false" aria-label="Pausar animação" hidden>{ui_icon('pause')}<span>Pausar</span></button></div>'''

def home_flow():
    entries = [('user-round', 'Você dá a direção', 'Objetivo, referências e critérios.', 'human'), ('bot', 'Os agentes preparam', 'Pesquisa, organização e primeiras versões.', 'agent'), ('file-check-2', 'O trabalho avança', 'Sua revisão orienta a próxima entrega.', 'result')]
    nodes = ''.join(f'<li class="flow-node flow-node--{role}"><span class="flow-emblem">{ui_icon(key)}</span><h3>{title}</h3><p>{text}</p></li>' for key,title,text,role in entries)
    return f'''<section class="section home-flow" id="exemplo" aria-labelledby="example-title"><div class="wrap"><div class="section-head"><div><p class="eyebrow">Pessoas e agentes em colaboração</p><h2 id="example-title">Sua ideia encontra<br>quem faz com você.</h2></div><p class="lead">Seu repertório orienta. Os agentes executam etapas. Você acompanha e aprova.</p></div><ol class="flow-line">{nodes}</ol><p class="flow-foot">{ui_icon('route')}Um exemplo de fluxo. As entregas e revisões são definidas com você.</p></div></section>'''
