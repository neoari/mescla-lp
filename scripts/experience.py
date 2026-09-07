"""Visual language shared by the Home and segment pages."""
from pathlib import Path
from html import escape
import re, json

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

def home_value():
    rows = [
        ('network', 'Agentes que trabalham com o time', 'Cada pessoa conduz suas tarefas em conversas separadas.', 'Várias pessoas trabalham com um ou mais agentes compartilhados, no ambiente escolhido para a equipe.'),
        ('book-open', 'Conhecimento que fica na empresa', 'Referências e decisões podem ficar dispersas entre contas pessoais e arquivos.', 'Organizamos uma memória corporativa: processos, referências e decisões registradas para uso da equipe e dos agentes.'),
        ('route', 'Continuidade entre pessoas', 'Ao passar uma tarefa, alguém precisa reunir e explicar o contexto de novo.', 'Outra pessoa pode retomar o trabalho com os registros e os agentes do projeto, conforme os acessos definidos.'),
    ]
    body = ''.join(f'<tr role="row"><th scope="row" role="rowheader"><span>{ui_icon(key)}{escape(gain)}</span></th><td role="cell"><span class="comparison-mobile-label" aria-hidden="true">Quando o uso fica individual</span>{escape(alone)}</td><td role="cell"><span class="comparison-mobile-label" aria-hidden="true">No ambiente do seu time</span>{escape(together)}</td></tr>' for key,gain,alone,together in rows)
    return f'''<section class="section mescla-value" id="possibilidades" aria-labelledby="possibilities-title"><div class="wrap"><div class="section-head"><div><p class="eyebrow">Já tenho uma IA. Por que a Mescla?</p><h2 id="possibilities-title">O conhecimento fica.<br>O time avança.</h2></div><div><p class="lead">A Mescla reúne pessoas, agentes compartilhados e a memória da empresa em um ambiente de trabalho. Para a equipe continuar as entregas com menos contexto perdido pelo caminho.</p>{tool_marks([('openai','ChatGPT'),('claude','Claude'),('googlegemini','Gemini')], True)}<p class="value-tools-note">As ferramentas que você já usa podem fazer parte desse ambiente.</p></div></div><table class="value-comparison" role="table" aria-label="Uso individual de IA e trabalho com agentes compartilhados"><thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">O que você ganha</th><th scope="col" role="columnheader">Quando o uso fica individual</th><th scope="col" role="columnheader">No ambiente do seu time</th></tr></thead><tbody role="rowgroup">{body}</tbody></table><div class="value-proof"><span class="value-proof-icon">{ui_icon('file-check-2')}</span><p><strong>A Mescla prepara esse jeito de trabalhar.</strong> Configuração, organização da memória e orientação da equipe. No primeiro projeto, avaliamos tempo gasto, revisão e qualidade das entregas.</p><a class="text-link" href="#como-funciona">Como começamos {ui_icon('arrow-up-right')}</a></div></div></section>'''

def ribbon_stage():
    return f'''<div class="ribbon-stage" aria-label="Pessoas e agentes conectados ao seu trabalho"><div class="ribbon-art" data-ribbon-scene><img class="ribbon-fallback" src="https://raw.githubusercontent.com/neoari/mescla-lp/main/assets/mescla-logo.svg" alt="" width="440" height="360" decoding="async"></div><span class="stage-label stage-label-human">{ui_icon('user-round')}<span>Sua equipe.</span></span><span class="stage-label stage-label-agent">{ui_icon('bot')}<span>Agentes do time.</span></span><div class="stage-tool stage-tool-one" aria-label="ChatGPT">{brand_icon('openai')}</div><div class="stage-tool stage-tool-two" aria-label="Google Drive">{brand_icon('googledrive')}</div><div class="stage-tool stage-tool-three" aria-label="Notion">{brand_icon('notion')}</div><p class="stage-caption">Inteligências diferentes.<br><strong>Trabalho em conjunto.</strong></p><button class="motion-toggle" type="button" data-motion-toggle aria-pressed="false" aria-label="Pausar animação" hidden>{ui_icon('pause')}</button></div>'''

def home_flow():
    entries = [('user-round', 'O comercial inicia', 'Registra o pedido do cliente.', 'human'), ('bot', 'O agente prepara', 'Consulta referências do negócio.', 'agent'), ('user-round', 'A operação continua', 'Revisa com o contexto do projeto.', 'result')]
    nodes = ''.join(f'<li class="flow-node flow-node--{role}"><span class="flow-emblem">{ui_icon(key)}</span><h3>{title}</h3><p>{text}</p></li>' for key,title,text,role in entries)
    fallback=f'<ol class="flow-line">{nodes}</ol><div class="shared-memory-base">{ui_icon("book-open")}<div><strong>Memória da empresa</strong><p>Processos, referências e decisões registradas.</p></div></div>'
    return f'''<section class="section home-flow" id="exemplo" aria-labelledby="example-title"><div class="wrap"><div class="section-head"><div><p class="eyebrow">Várias pessoas. Agentes compartilhados.</p><h2 id="example-title">Uma pessoa começa.<br>O time continua.</h2></div><p class="lead">Comercial e operação trabalham com o mesmo agente. O contexto registrado acompanha a tarefa, mesmo quando ela muda de mãos.</p></div>{motion_surface('home',fallback)}<p class="flow-foot">{ui_icon('route')}Exemplo de fluxo. A empresa define o que registrar e quem pode acessar.</p></div></section>'''


def motion_surface(slug, fallback):
    data=json.loads((ROOT/'content/motion-scenes.json').read_text())[slug]
    summary=' '.join(copy for title,copy in data['phases'])
    return f'<div class="animated-work" data-motion-scene="{slug}"><div class="motion-fallback">{fallback}</div><div class="motion-player" hidden></div><p class="motion-equivalent">{escape(data["label"])}. {escape(summary)} Exemplo ilustrativo; etapas definidas no projeto.</p></div>'

def reassurance():
    terms=''.join(f'<span>{term}</span>' for term in ['RAG','MCP','APIs','Tokens','Parâmetros','Ontologias','Repositórios'])
    return f'<section class="section reassurance" aria-labelledby="reassurance-title"><div class="wrap reassurance-grid"><div class="reassurance-copy"><p class="eyebrow">A parte técnica fica com a Mescla</p><h2 id="reassurance-title">Você não precisa virar<br>especialista em IA.</h2><p class="lead">Você conhece seu negócio e o que quer realizar. Nós escolhemos, conectamos e configuramos a tecnologia para o trabalho acontecer.</p><p class="reassurance-outcome">{ui_icon("user-round")}Você traz a direção. A gente prepara o caminho.</p></div><div class="technical-backstage"><div class="technical-terms" aria-label="Exemplos de termos técnicos">{terms}</div><div class="backstage-divider">{ui_icon("arrow-right")}</div><div class="backstage-result">{ui_icon("file-check-2")}<strong>Um time pronto<br>para trabalhar com você.</strong><p>Com orientação para usar<br>e revisar as entregas.</p></div></div></div></section>'
