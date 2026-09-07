"""Editorial surfaces and tool marks for segment pages. All examples are illustrative."""
from pathlib import Path
from html import escape
import re
from experience import ui_icon, brand_icon, platforms

ROOT = Path(__file__).resolve().parents[1]

def icon(name):
    path = ROOT / 'assets' / 'icons' / (name + '.svg')
    if not path.is_file():
        return ''
    source = re.sub(r'<title>.*?</title>', '', path.read_text(), flags=re.S)
    return re.sub(r'<svg[^>]*>', '<svg class="tool-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">', source, count=1)

def hero_surface(d):
    if d['slug'] == 'creators':
        return f'''<div class="creator-studio segment-surface" aria-label="Exemplo de desdobramento de conteúdo">
          <div class="surface-label"><span>Da sua voz para o mundo</span><span>Exemplo de fluxo</span></div>
          <div class="source-record"><span class="record-dot" aria-hidden="true"></span><span>Uma conversa gravada</span><strong>Ideias que merecem circular.</strong><p>Seu repertório. Seus exemplos. Seu jeito de contar.</p></div>
          <div class="content-tracks"><div>{icon('youtube')}<span><strong>Cortes com contexto</strong><small>Trechos, gancho e indicação de tempo</small></span></div><div>{icon('instagram')}<span><strong>Uma ideia em carrossel</strong><small>Roteiro das telas para você aprovar</small></span></div><div>{icon('notion')}<span><strong>O próximo roteiro</strong><small>Pautas que nasceram da gravação</small></span></div></div>
          <p class="surface-foot">Você escolhe o que vale publicar.</p></div>'''
    if d['slug'] == 'empreendedores':
        return f'''<div class="founder-desk segment-surface" aria-label="Exemplo de organização da rotina"><div class="surface-label"><span>Sua próxima decisão</span><span>Exemplo de fluxo</span></div><h2>O negócio anda.<br>Você dá a direção.</h2><div class="desk-row">{icon('googledocs')}<div><strong>Proposta comercial</strong><span>Contexto reunido → primeira versão</span></div><b>Você revisa</b></div><div class="desk-row">{icon('googlesheets')}<div><strong>Pendências de clientes</strong><span>Informações organizadas → próximo passo</span></div><b>Você prioriza</b></div><div class="desk-row">{icon('notion')}<div><strong>Uma nova oferta</strong><span>Pesquisa → material para testar</span></div><b>Você decide</b></div><div class="desk-bottom"><span>Os agentes preparam o caminho.</span><strong>A decisão continua com você.</strong></div></div>'''
    if d['slug'] == 'consultorias':
        return f'''<div class="consulting-memo segment-surface" aria-label="Exemplo de preparação de um diagnóstico"><div class="surface-label"><span>Caderno de projeto</span><span>Exemplo ilustrativo</span></div><p class="memo-kicker">Diagnóstico comercial</p><h2>O que sabemos.<br>De onde veio.<br>O que investigar.</h2><div class="evidence-row"><span>01</span><div><strong>Tempo de resposta</strong><p>Conferir registros de atendimento.</p><small>{icon('googlesheets')} Fonte: planilha autorizada</small></div></div><div class="evidence-row"><span>02</span><div><strong>Passagem entre áreas</strong><p>Comparar relatos e processo descrito.</p><small>{icon('googledocs')} Fonte: entrevistas do projeto</small></div></div><div class="memo-signoff">Preparação dos agentes <span aria-hidden="true">→</span> análise dos consultores</div></div>'''
    if d['slug'] == 'agencias':
        return f'''<div class="agency-board segment-surface" aria-label="Exemplo de um pedido avançando pela agência"><div class="surface-label"><span>Da entrada à entrega</span><span>Exemplo de fluxo</span></div><div class="board-account"><span>Campanha de lançamento</span><strong>Uma marca.<br>Um contexto.</strong></div><div class="board-columns"><div><h3>Briefing</h3><article>{icon('trello')}<strong>Pedido organizado</strong><p>Objetivo, público e referências reunidos.</p><small>Atendimento + agente</small></article></div><div><h3>Produção</h3><article>{icon('googledocs')}<strong>Primeiras versões</strong><p>Texto e variações para a direção avaliar.</p><small>Agente + criação</small></article></div><div><h3>Revisão</h3><article>{icon('slack')}<strong>Escolha criativa</strong><p>Ajustes definidos por quem conhece a conta.</p><small>Sua equipe</small></article></div></div><p class="surface-foot">A marca ganha continuidade entre as etapas.</p></div>'''
    if d['slug'] == 'advocacia':
        return '''<div class="legal-file segment-surface" aria-label="Exemplo de índice documental para conferência"><div class="surface-label"><span>Preparação documental</span><span>Exemplo ilustrativo</span></div><div class="legal-heading"><span>Índice de trabalho</span><h2>Antes da tese,<br>clareza sobre os fatos.</h2></div><ol class="document-index"><li><span>01</span><div><strong>Documentos organizados</strong><p>Origem, tipo de arquivo e referências.</p></div></li><li><span>02</span><div><strong>Cronologia preliminar</strong><p>Cada registro ligado ao material de origem.</p></div></li><li><span>03</span><div><strong>Pontos para conferir</strong><p>Lacunas e divergências visíveis para a equipe.</p></div></li></ol><div class="review-stamp">Conferência e análise pelo advogado</div></div>'''
    raise ValueError('Unknown segment: ' + d['slug'])

def value_section(d):
    esc = escape
    slug = d['slug']
    cards = d['value_cards']
    value_icons = {'empreendedores': ['file-text', 'layers', 'lightbulb'], 'consultorias': ['search', 'presentation', 'book-open'], 'agencias': ['briefcase-business', 'pencil-ruler', 'route'], 'advocacia': ['file-text', 'search', 'file-check-2']}.get(slug)
    if slug == 'empreendedores':
        body = '<div class="value-ledger">' + ''.join(f'<article><h3>{ui_icon(value_icons[i])}{esc(title)}</h3><div><span class="value-label">Onde trava</span><p>{esc(before)}</p></div><div><span class="value-label">Com apoio dos agentes</span><p>{esc(after)}</p></div></article>' for i,(title,before,after) in enumerate(cards)) + '</div>'
    elif slug == 'creators':
        icons = ['youtube', 'instagram', 'notion']
        body = '<div class="format-shelf">' + ''.join(f'<article>{icon(icons[i])}<h3>{esc(title)}</h3><p>{esc(after)}</p><div class="format-origin">A partir do seu conteúdo</div></article>' for i,(title,before,after) in enumerate(cards)) + '</div>'
    elif slug == 'consultorias':
        body = '<div class="consulting-findings">' + ''.join(f'<article><span class="finding-number">{ui_icon(value_icons[i])}</span><div><h3>{esc(title)}</h3><p>{esc(after)}</p></div><aside>{esc(before)}</aside></article>' for i,(title,before,after) in enumerate(cards)) + '</div>'
    elif slug == 'agencias':
        body = '<div class="agency-lanes">' + ''.join(f'<article><div class="lane-title"><span>{ui_icon(value_icons[i])}</span><h3>{esc(title)}</h3></div><p class="lane-friction">{esc(before)}</p><p>{esc(after)}</p></article>' for i,(title,before,after) in enumerate(cards)) + '</div>'
    else:
        body = '<div class="legal-briefs">' + ''.join(f'<article><span class="brief-no">{ui_icon(value_icons[i])}</span><h3>{esc(title)}</h3><p>{esc(after)}</p><div class="legal-duty">Revisão e validação pelo escritório</div></article>' for i,(title,before,after) in enumerate(cards)) + '</div>'
    return f'<section class="section segment-value" aria-labelledby="outcomes-title"><div class="wrap"><div class="section-head"><div><p class="eyebrow">O valor no seu dia a dia</p><h2 id="outcomes-title">{esc(d["value_title"])}</h2></div><p class="lead">{esc(d["value_intro"])}</p></div>{body}</div></section>'

def tools_section(d):
    cards = ''.join(f'<article class="stack-tool"><div>{brand_icon(key)}<h3>{escape(name)}</h3></div><p>{escape(text)}</p></article>' for key,name,text in d['tools'])
    note = f'<p class="stack-note">{escape(d["tools_note"])}</p>' if d.get('tools_note') else ''
    return f'''<section class="section tool-section" id="ferramentas" aria-labelledby="stack-title"><div class="wrap"><div class="section-head"><div><p class="eyebrow">Ferramentas que podem participar do fluxo</p><h2 id="stack-title">{escape(d['tools_title'])}</h2></div><p class="lead">{escape(d['tools_intro'])}</p></div><div class="stack-grid">{cards}</div>{note}<p class="integration-note">Conexões por integração ou troca de arquivos, conforme o projeto. Validamos acesso, planos e recursos disponíveis antes de definir o escopo.</p></div></section>'''

def ai_section(d):
    badges = ''.join(f'<span class="ai-tool">{icon(key)}{escape(name)}</span>' for key,name in d['ai_tools'])
    gains = ''.join(f'<li>{ui_icon(key)}<div><h3>{escape(title)}</h3><p>{escape(text)}</p></div></li>' for key,title,text in d['ai_gains'])
    return f'''<section class="section ai-section" aria-labelledby="ai-title"><div class="wrap ai-layout"><div class="ai-badges">{badges}<span class="ai-caption">A IA que você já usa pode fazer parte do projeto.</span></div><div><p class="eyebrow">Já uso IA. O que ganho com a Mescla?</p><h2 id="ai-title">{escape(d['ai_title'])}</h2><p class="lead">{escape(d['ai_text'])}</p><ul class="ai-gains">{gains}</ul><div class="platform-note"><strong>Um processo preparado para entrar em uso.</strong><p>Configuramos, testamos com seus materiais e orientamos sua equipe. Suporte e evolução são definidos na proposta.</p>{platforms()}</div></div></div></section>'''

def pilot_section(d):
    items = ''.join(f'<li>{ui_icon("check")}{escape(x)}</li>' for i,x in enumerate(d['deliverables']))
    return f'''<section class="section pilot-section" aria-labelledby="method-title"><div class="wrap pilot-grid"><div><p class="eyebrow">Um primeiro trabalho, bem definido</p><h2 id="method-title">{escape(d['pilot_title'])}</h2><p class="lead">{escape(d['pilot_text'])}</p></div><div><ul class="pilot-deliverables">{items}</ul><p class="measure-note">{escape(d['measure'])}</p></div></div></section>'''
