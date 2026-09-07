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
        stages = ''.join(f'<li class="creator-stage--{role}">{ui_icon("bot" if role == "agent" else "user-round")}<strong>{escape(title)}</strong><span>{"Agente" if role == "agent" else "Pessoa"}</span></li>' for role, title, _ in d['steps'])
        return f'''<div class="creator-studio creator-workflow segment-surface" aria-label="Exemplo de produção de vídeo em cinco etapas">
          <div class="surface-label"><span>Do roteiro à publicação</span><span>Exemplo de fluxo</span></div>
          <h2>Você em cena.<br>A edição com seu agente.</h2>
          <ol class="creator-stages">{stages}</ol>
          <p class="creator-edit-summary">Cortes · silêncios · cor · grafismos · som · legendas</p>
          <p class="surface-foot">O agente publica depois da sua aprovação.</p></div>'''
    if d['slug'] == 'empreendedores':
        return f'''<div class="founder-desk sector-surface segment-surface" aria-label="Exemplo de proposta comercial"><div class="surface-label"><span>Pedido → proposta → retorno</span><span>Exemplo de fluxo</span></div><h2>O pedido ganha<br>um próximo passo.</h2><div class="artifact-input">{icon('whatsapp')}<span>Pedido do cliente<br><strong>Necessidade e prazo reunidos</strong></span></div><dl class="proposal-fields"><div><dt>Escopo</dt><dd>Serviço e entregas da sua oferta</dd></div><div><dt>Condições</dt><dd>Preço e prazo — sua aprovação</dd></div><div><dt>Retorno</dt><dd>Mensagem e acompanhamento</dd></div></dl><p class="surface-foot">O agente prepara. Você aprova e negocia.</p></div>'''
    if d['slug'] == 'consultorias':
        return f'''<div class="consulting-memo sector-surface segment-surface" aria-label="Exemplo de matriz de evidências"><div class="surface-label"><span>Base para a recomendação</span><span>Exemplo ilustrativo</span></div><h2>Fonte. Evidência.<br>Sua análise.</h2><div class="evidence-sample"><div><span>Entrevista</span><strong>Tema + trecho</strong><small>Conferir na gravação</small></div><div><span>Planilha</span><strong>Dado + origem</strong><small>Conferir período e unidade</small></div><div><span>Documento</span><strong>Fato + referência</strong><small>Conferir no arquivo</small></div></div><div class="artifact-output">{icon('microsoftpowerpoint')}<span>Suas recomendações<br><strong>Em um entregável editável</strong></span></div><p class="surface-foot">O consultor analisa. O agente monta o material.</p></div>'''
    if d['slug'] == 'agencias':
        return f'''<div class="agency-board sector-surface segment-surface" aria-label="Exemplo de produção e ajuste de uma peça"><div class="surface-label"><span>Uma peça, suas versões</span><span>Exemplo ilustrativo</span></div><h2>O ajuste entra.<br>A peça avança.</h2><div class="piece-review"><div><span class="piece-label">Primeira rodada · agente</span><strong>Texto + peça no modelo da marca</strong></div><div class="piece-feedback">{ui_icon('pencil-ruler')}<span><b>Direção criativa · pessoa</b>“Trocar a chamada.”</span></div><div><span class="piece-label">Versão ajustada · agente</span><strong>Feedback aplicado à peça certa</strong></div></div><p class="surface-foot">Atendimento coordena. Criação dirige. Cliente aprova.</p></div>'''
    if d['slug'] == 'advocacia':
        return f'''<div class="legal-file sector-surface segment-surface" aria-label="Exemplo de preparação documental com minuta"><div class="surface-label"><span>Preparação documental</span><span>Exemplo com minuta</span></div><h2>Dos arquivos<br>à sua conferência.</h2><ol class="document-index"><li><span>01</span><div><strong>Índice e cronologia</strong><p>Registro → arquivo e localização disponível</p></div></li><li><span>02</span><div><strong>Pendências visíveis</strong><p>Lacunas e divergências para análise</p></div></li><li><span>03</span><div><strong>Minuta orientada</strong><p>Modelo + fatos + instruções do advogado</p></div></li></ol><div class="artifact-output">{icon('microsoftword')}<span>Documento editável<br><strong>Revisão e uso pelo advogado</strong></span></div></div>'''
    raise ValueError('Unknown segment: ' + d['slug'])

def value_section(d):
    esc = escape
    slug = d['slug']
    if slug == 'creators':
        cards = d['value_cards']
        body = '<div class="editing-services">' + ''.join(f'<article><span class="editing-icon">{ui_icon(key)}</span><h3>{esc(title)}</h3><p>{esc(description)}</p></article>' for title, key, description in cards) + '</div>'
        body += f'<div class="editing-delivery">{ui_icon("file-check-2")}<p><strong>O próximo passo é a sua aprovação.</strong> {esc(d["editing_result"])}</p></div>'
    else:
        def task(item, i):
            return f'<article class="agent-task"><div class="task-heading"><span class="task-symbol">{ui_icon(item["icon"])}</span><span class="task-number" aria-hidden="true">0{i+1}</span><h3>{esc(item["title"])}</h3></div><p class="task-action">{esc(item["action"])}</p><div class="task-output"><span>O que fica pronto</span><strong>{esc(item["output"])}</strong></div></article>'
        if slug in ('consultorias', 'agencias'):
            groups = ''.join(f'<div class="task-chapter"><h3 class="chapter-title"><span aria-hidden="true">0{i+1}</span>{esc(title)}</h3>{"".join(task(item, i*2+j) for j,item in enumerate(d["tasks"][i*2:i*2+2]))}</div>' for i,title in enumerate(d['task_groups']))
            body = f'<div class="task-chapters task-chapters--{slug}">{groups}</div>'
        else:
            body = f'<div class="task-ledger task-ledger--{slug}">' + ''.join(task(item,i) for i,item in enumerate(d['tasks'])) + '</div>'
        body += f'<div class="task-delivery">{ui_icon("file-check-2")}<div><h3>{esc(d["delivery_title"])}</h3><p>{esc(d["delivery_text"])}</p></div></div>'
    return f'<section class="section segment-value" aria-labelledby="outcomes-title"><div class="wrap"><div class="section-head"><div><p class="eyebrow">O valor no seu dia a dia</p><h2 id="outcomes-title">{esc(d["value_title"])}</h2></div><p class="lead">{esc(d["value_intro"])}</p></div>{body}</div></section>'

def tools_section(d):
    def tool_cards(items):
        return ''.join(f'<article class="stack-tool"><div>{brand_icon(key)}<h3>{escape(name)}</h3></div><p>{escape(text)}</p></article>' for key,name,text in items)
    body = '<div class="stack-grid">' + tool_cards(d['tools']) + '</div>'
    if d['slug'] == 'creators':
        body = ''.join(f'<div class="creator-tool-group"><h3>{title}</h3><div class="stack-grid">{tool_cards(items)}</div></div>' for title, items in [('Edição e produção', d['tools'][:3]), ('Publicação após sua aprovação', d['tools'][3:])])
    elif d['slug'] == 'agencias':
        body = ''.join(f'<div class="sector-tool-group"><h3>{title}</h3><div class="stack-grid">{tool_cards(items)}</div></div>' for title, items in [('Produção e gestão da rodada', d['tools'][:4]), ('Formatos de destino', d['tools'][4:])])
    note = f'<p class="stack-note">{escape(d["tools_note"])}</p>' if d.get('tools_note') else ''
    return f'''<section class="section tool-section" id="ferramentas" aria-labelledby="stack-title"><div class="wrap"><div class="section-head"><div><p class="eyebrow">Ferramentas que podem participar do fluxo</p><h2 id="stack-title">{escape(d['tools_title'])}</h2></div><p class="lead">{escape(d['tools_intro'])}</p></div>{body}{note}<p class="integration-note">Conexões por integração ou troca de arquivos, conforme o projeto. Validamos acesso, planos e recursos disponíveis antes de definir o escopo.</p></div></section>'''

def ai_section(d):
    badges = ''.join(f'<span class="ai-tool">{icon(key)}{escape(name)}</span>' for key,name in d['ai_tools'])
    gains = ''.join(f'<li>{ui_icon(key)}<div><h3>{escape(title)}</h3><p>{escape(text)}</p></div></li>' for key,title,text in d['ai_gains'])
    return f'''<section class="section ai-section" aria-labelledby="ai-title"><div class="wrap ai-layout"><div class="ai-badges">{badges}<span class="ai-caption">A IA que você já usa pode fazer parte do projeto.</span></div><div><p class="eyebrow">Já uso IA. O que ganho com a Mescla?</p><h2 id="ai-title">{escape(d['ai_title'])}</h2><p class="lead">{escape(d['ai_text'])}</p><ul class="ai-gains">{gains}</ul><div class="platform-note"><strong>Pessoas, agentes e memória no mesmo trabalho.</strong><p>Escolhemos um ambiente que comporte o compartilhamento necessário. Configuramos agentes, memória e acessos e orientamos sua equipe. Suporte e evolução são definidos na proposta.</p>{platforms()}</div></div></div></section>'''

def pilot_section(d):
    items = ''.join(f'<li>{ui_icon("check")}{escape(x)}</li>' for i,x in enumerate(d['deliverables']))
    inputs = '<div class="pilot-inputs"><h3>Você traz</h3><ul>' + ''.join(f'<li>{escape(x)}</li>' for x in d['pilot_inputs']) + '</ul></div>' if d.get('pilot_inputs') else ''
    result_title = '<h3 class="pilot-result-title">O primeiro trabalho entrega</h3>' if inputs else ''
    return f'''<section class="section pilot-section" aria-labelledby="method-title"><div class="wrap pilot-grid"><div><p class="eyebrow">Um primeiro trabalho, bem definido</p><h2 id="method-title">{escape(d['pilot_title'])}</h2><p class="lead">{escape(d['pilot_text'])}</p>{inputs}</div><div>{result_title}<ul class="pilot-deliverables">{items}</ul><p class="measure-note">{escape(d['measure'])}</p></div></div></section>'''
