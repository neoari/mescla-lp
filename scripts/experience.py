"""Visual language shared by the Home and segment pages."""
from pathlib import Path
from html import escape
from urllib.parse import quote
import re, json

ROOT = Path(__file__).resolve().parents[1]
SEGMENT_ICONS = {'empreendedores': 'lightbulb', 'creators': 'clapperboard', 'consultorias': 'briefcase-business', 'agencias': 'megaphone', 'advocacia': 'scale'}
SEGMENT_TOOLS = {
    'empreendedores': [('whatsapp', 'WhatsApp'), ('googledocs', 'Docs'), ('trello', 'Trello')],
    'creators': [('remotion', 'Remotion'), ('capcut', 'CapCut'), ('davinciresolve', 'DaVinci Resolve'), ('youtube', 'YouTube'), ('tiktok', 'TikTok'), ('instagram', 'Instagram')],
    'consultorias': [('microsoftexcel', 'Excel'), ('microsoftpowerpoint', 'PowerPoint'), ('zoom', 'Zoom')],
    'agencias': [('trello', 'Trello'), ('slack', 'Slack'), ('canva', 'Canva')],
    'advocacia': [('microsoftword', 'Word'), ('adobeacrobatreader', 'Acrobat'), ('googledrive', 'Drive')],
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
        ('network', 'Mais força para o time', 'Cada pessoa na sua conversa.', 'Pedidos e respostas precisam ser repassados para o restante da equipe.', 'O time inteiro com os mesmos agentes.', 'Pessoas colaboram, pedem e revisam o trabalho com agentes compartilhados, no mesmo ambiente.'),
        ('book-open', 'Menos contexto repetido', 'O contexto fica espalhado.', 'Referências e decisões se dividem entre conversas pessoais e arquivos.', 'O negócio ganha memória.', 'Processos, referências e decisões organizados para a equipe e os agentes consultarem.'),
        ('route', 'Mais continuidade nas entregas', 'Para continuar, é preciso repassar.', 'Quem assume a tarefa precisa reunir o histórico e entender o que já foi decidido.', 'O trabalho muda de mãos. O contexto vai junto.', 'Outra pessoa retoma com os registros e os agentes do projeto, respeitando os acessos definidos.'),
    ]
    other_label = '<strong class="comparison-title">Com outras IAs</strong><span class="comparison-subtitle">No uso individual</span>'
    mescla_label = '<strong class="comparison-title">Com a Mescla</strong><span class="comparison-subtitle">Pessoas + agentes + memória da empresa</span>'
    body = ''.join(f'<tr role="row"><th scope="row" role="rowheader"><span><span class="gain-icon">{ui_icon(key)}</span>{escape(gain)}</span></th><td role="cell"><span class="comparison-mobile-label" aria-hidden="true">{other_label}</span><strong class="comparison-claim">{escape(alone_title)}</strong><p>{escape(alone)}</p></td><td role="cell"><span class="comparison-mobile-label" aria-hidden="true">{mescla_label}</span><strong class="comparison-claim">{escape(together_title)}</strong><p>{escape(together)}</p></td></tr>' for key,gain,alone_title,alone,together_title,together in rows)
    return f'''<section class="section mescla-value" id="possibilidades" aria-labelledby="possibilities-title"><div class="wrap"><div class="section-head"><div><p class="eyebrow">Já tenho uma IA. Por que a Mescla?</p><h2 id="possibilities-title">Menos recomeços.<br>Mais trabalho entregue.</h2></div><div><p class="lead">Sua equipe não precisa depender de quem tem a conversa certa aberta. Com agentes compartilhados e a memória da empresa, o trabalho pode continuar com o time.</p>{tool_marks([('openai','ChatGPT'),('claude','Claude'),('googlegemini','Gemini')], True)}<p class="value-tools-note">As IAs que você já usa podem fazer parte desse jeito de trabalhar.</p></div></div><table class="value-comparison" role="table" aria-describedby="comparison-scope" aria-label="Com outras IAs no uso individual e com a Mescla em um ambiente compartilhado"><thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">O ganho para o seu negócio</th><th scope="col" role="columnheader">{other_label}</th><th scope="col" role="columnheader"><span class="comparison-brand"><img src="/assets/mescla-logo.svg" width="43" height="35" alt="">{mescla_label}</span></th></tr></thead><tbody role="rowgroup">{body}</tbody></table><p class="comparison-scope" id="comparison-scope">O comparativo considera o uso individual de IA. Recursos de equipe variam conforme a ferramenta e o plano.</p><div class="value-proof"><span class="value-proof-icon">{ui_icon('file-check-2')}</span><p><strong>Você cuida da direção. A Mescla prepara o time.</strong> Mapeamos o trabalho, configuramos os agentes e organizamos a memória. Sua equipe aprende a usar, revisar e avançar.</p><a class="text-link" href="#como-funciona">Como começamos {ui_icon('arrow-up-right')}</a></div></div></section>'''

def ribbon_stage():
    participants = [('user-round', 'Você direciona', 'human'), ('bot', 'Agentes preparam', 'agent'), ('user-round', 'Pessoas revisam', 'human')]
    steps = ''.join(f'<li class="hero-participant hero-participant--{role}"><span class="hero-participant-icon">{ui_icon(key)}</span><span class="hero-participant-copy"><span class="hero-step-number" aria-hidden="true">0{i + 1}</span><strong>{label}</strong></span></li>' for i, (key, label, role) in enumerate(participants))
    return f'''<figure class="ribbon-stage hero-team-figure" aria-labelledby="hero-figure-title"><figcaption class="hero-figure-heading"><span id="hero-figure-title">Pessoas + agentes</span><span class="hero-example-label">Exemplo</span></figcaption><div class="hero-figure-work"><ol class="hero-participants" aria-label="Exemplo de trabalho em conjunto">{steps}</ol><div class="ribbon-art" data-ribbon-scene aria-hidden="true"><img class="ribbon-fallback" src="/assets/mescla-logo.svg" alt="" width="440" height="360" decoding="async"></div></div><div class="hero-shared-memory">{ui_icon('book-open')}<div><strong>Memória do negócio</strong><p>Processos · referências · decisões</p></div></div><button class="motion-toggle" type="button" data-motion-toggle aria-pressed="false" aria-label="Pausar animação" hidden>{ui_icon('pause')}</button></figure>'''


def home_hero():
    contact = 'https://wa.me/5561993973584?text=' + quote('Quero conversar sobre como a Mescla pode ampliar minha capacidade de entrega.\n\nMinha atividade:\nO trabalho que quero melhorar:')
    return f'''<section class="hero hero-team" aria-labelledby="hero-title"><div class="wrap"><div class="hero-grid"><div class="hero-copy"><p class="eyebrow">Implantação de IA para o seu negócio</p><h1 id="hero-title"><span class="hero-promise">Mais entregas.</span> <span class="hero-completion">Com IA no seu time.</span></h1><p class="lead">A Mescla implanta <strong>agentes compartilhados</strong> para você e quem trabalha com você. Com o <strong>conhecimento do negócio</strong> organizado, fica mais fácil continuar o trabalho.</p><p class="hero-reassurance">{ui_icon('check')}<span>A parte técnica fica com a Mescla.</span></p><div class="hero-actions"><a class="btn" href="{contact}" target="_blank" rel="noopener noreferrer" data-contact data-placement="hero" aria-describedby="hero-contact-note">{brand_icon('whatsapp')}<span>Conversar sobre meu negócio</span></a><a class="text-link" href="#exemplo">Ver um exemplo {ui_icon('arrow-right')}</a></div><p class="hero-contact-note" id="hero-contact-note">No WhatsApp. Para entender sua rotina.</p></div>{ribbon_stage()}</div></div></section>'''

def home_flow():
    entries = [('user-round', 'O comercial inicia', 'Registra o pedido do cliente.', 'human'), ('bot', 'O agente prepara', 'Consulta referências do negócio.', 'agent'), ('user-round', 'A operação continua', 'Revisa com o contexto do projeto.', 'result')]
    nodes = ''.join(f'<li class="flow-node flow-node--{role}"><span class="flow-emblem">{ui_icon(key)}</span><h3>{title}</h3><p>{text}</p></li>' for key,title,text,role in entries)
    fallback=f'<ol class="flow-line">{nodes}</ol><div class="shared-memory-base">{ui_icon("book-open")}<div><strong>Memória da empresa</strong><p>Processos, referências e decisões registradas.</p></div></div>'
    return f'''<section class="section home-flow" id="exemplo" aria-labelledby="example-title"><div class="wrap"><div class="section-head"><div><p class="eyebrow">Um exemplo no dia a dia</p><h2 id="example-title">Uma pessoa começa.<br>O time continua.</h2></div><p class="lead">Do pedido à proposta: o comercial traz o contexto, o agente prepara e a operação revisa.</p></div>{motion_surface('home',fallback)}<p class="flow-foot">{ui_icon('route')}Exemplo ilustrativo. A empresa define o que registrar e quem pode acessar.</p></div></section>'''


def motion_surface(slug, fallback):
    data=json.loads((ROOT/'content/motion-scenes.json').read_text())[slug]
    summary=' '.join(copy for title,copy in data['phases'])
    return f'<div class="animated-work" data-motion-scene="{slug}"><div class="motion-fallback">{fallback}</div><div class="motion-player" hidden></div><p class="motion-equivalent">{escape(data["label"])}. {escape(summary)} Exemplo ilustrativo; etapas definidas no projeto.</p></div>'

def reassurance():
    terms=''.join(f'<span>{term}</span>' for term in ['RAG','MCP','APIs','Tokens','Parâmetros','Ontologias','Repositórios'])
    return f'<section class="section reassurance" aria-labelledby="reassurance-title"><div class="wrap reassurance-grid"><div class="reassurance-copy"><p class="eyebrow">A parte técnica fica com a Mescla</p><h2 id="reassurance-title">Você não precisa virar<br>especialista em IA.</h2><p class="lead">Você conhece seu negócio e o que quer realizar. Nós escolhemos, conectamos e configuramos a tecnologia para o trabalho acontecer.</p><p class="reassurance-outcome">{ui_icon("user-round")}Você traz a direção. A gente prepara o caminho.</p></div><div class="technical-backstage"><div class="technical-terms" aria-label="Exemplos de termos técnicos">{terms}</div><div class="backstage-divider">{ui_icon("arrow-right")}</div><div class="backstage-result">{ui_icon("file-check-2")}<strong>Um time pronto<br>para trabalhar com você.</strong><p>Com orientação para usar<br>e revisar as entregas.</p></div></div></div></section>'
