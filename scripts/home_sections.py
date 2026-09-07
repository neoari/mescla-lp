"""Home narrative below the approved hero. Source for the static site builder."""
from html import escape
from urllib.parse import quote

from experience import SEGMENT_ICONS, SEGMENT_TOOLS, brand_icon, home_flow, platforms, tool_marks, ui_icon


def contact_link(phone, message, label, placement, description):
    url = 'https://wa.me/' + phone + '?text=' + quote(message)
    return f'<a class="btn" href="{url}" target="_blank" rel="noopener noreferrer" data-contact data-placement="{placement}" aria-describedby="{description}">{brand_icon("whatsapp")}<span>{label}</span></a>'


def comparison():
    rows = [
        ('network', 'Mais força para o time', 'Cada pessoa conduz suas conversas e repassa as respostas.', 'Pessoas pedem, contribuem e revisam com os mesmos agentes.'),
        ('book-open', 'Menos contexto repetido', 'Referências ficam entre conversas pessoais e arquivos.', 'Processos, referências e decisões reunidos numa memória do negócio.'),
        ('route', 'Mais continuidade', 'Quem assume a tarefa precisa reunir o histórico.', 'O time retoma com os registros do projeto e os acessos definidos.'),
    ]
    other = '<strong class="comparison-title">Com outras IAs</strong><span class="comparison-subtitle">No uso individual</span>'
    mescla = '<strong class="comparison-title">Com a Mescla</strong><span class="comparison-subtitle">Implantação para a equipe</span>'
    body = ''.join(f'<tr role="row"><th scope="row" role="rowheader"><span><span class="gain-icon">{ui_icon(icon)}</span>{gain}</span></th><td role="cell"><span class="comparison-mobile-label" aria-hidden="true">{other}</span><p>{before}</p></td><td role="cell"><span class="comparison-mobile-label" aria-hidden="true">{mescla}</span><p><strong>{after}</strong></p></td></tr>' for icon, gain, before, after in rows)
    return f'''<section class="section mescla-value" id="possibilidades" aria-labelledby="possibilities-title"><div class="wrap">
<div class="section-head"><div><p class="eyebrow">O que muda na prática</p><h2 id="possibilities-title">O trabalho avança.<br>O conhecimento fica.</h2></div><p class="lead">Organizamos agentes e referências para o trabalho continuar com contexto, com uma pessoa ou com a equipe.</p></div>
<table class="value-comparison" role="table" aria-labelledby="possibilities-title" aria-describedby="comparison-scope"><thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">O que você ganha</th><th scope="col" role="columnheader">{other}</th><th scope="col" role="columnheader"><span class="comparison-brand"><img src="/assets/mescla-logo.svg" width="43" height="35" alt="">{mescla}</span></th></tr></thead><tbody role="rowgroup">{body}</tbody></table>
<p class="comparison-scope" id="comparison-scope">A comparação considera o uso individual. Ferramentas e planos também podem oferecer recursos de equipe; a Mescla faz a implantação para a sua rotina.</p>
</div></section>'''


def implementation(phone):
    steps = [
        ('target', 'Escolher o trabalho', 'Escolhemos com você uma rotina, um objetivo e os limites do primeiro projeto.', 'Fluxo e entrega definidos'),
        ('network', 'Preparar o ambiente', 'Configuramos os agentes, as fontes de consulta e os acessos para esse trabalho.', 'Agentes, fontes e acessos prontos para teste'),
        ('file-check-2', 'Testar com a equipe', 'A equipe testa com materiais autorizados; definimos onde uma pessoa revisa ou aprova.', 'Critérios e revisões definidos'),
        ('user-round', 'Colocar em uso', 'Orientamos quem participa a direcionar, revisar e decidir no ambiente configurado.', 'Equipe orientada para o uso'),
    ]
    items = ''.join(f'<li class="delivery-step"><div class="delivery-number"><span aria-hidden="true">0{i + 1}</span>{ui_icon(icon)}</div><div class="delivery-copy"><h3>{title}</h3><p>{description}</p><p class="delivery-result"><span>Saída da etapa</span><strong>{result}</strong></p></div></li>' for i, (icon, title, description, result) in enumerate(steps))
    cta = contact_link(phone, 'Quero conversar sobre uma rotina que gostaria de melhorar com a Mescla.\n\nMinha atividade:\nA rotina que quero melhorar:', 'Conversar sobre minha rotina', 'implementation', 'implementation-contact-note')
    return f'''<section class="section home-implementation" id="como-funciona" aria-labelledby="implementation-title"><div class="wrap">
<div class="section-head"><div><p class="eyebrow">Do exemplo para a sua rotina</p><h2 id="implementation-title">Comece por um trabalho<br>que precisa andar.</h2></div><p class="lead">Escolhemos uma rotina, preparamos o ambiente com você e colocamos o primeiro fluxo em uso.</p></div>
<ol class="delivery-steps">{items}</ol>
<div class="delivery-finish"><div class="delivery-summary">{ui_icon('check')}<p>Uma rotina em uso, com <strong>agentes configurados, referências organizadas e pessoas orientadas</strong> para direcionar e revisar.</p></div><p class="delivery-observe">Combinamos o que observar nas primeiras entregas — por exemplo, tempo dedicado, retrabalho e critérios de qualidade.</p></div>
<div class="implementation-next"><div class="implementation-context"><p>Escopo, entregas e custos definidos em proposta. Suporte e evolução conforme o acompanhamento contratado.</p><a class="text-link" href="#segmentos">Ver aplicações para meu trabalho {ui_icon('arrow-right')}</a></div><div class="implementation-contact">{cta}<p class="contact-expectation" id="implementation-contact-note">Conte um trabalho que você quer melhorar.<br>A conversa começa no WhatsApp.</p></div></div>
</div></section>'''


APPLICATIONS = {
    'empreendedores': ('Uma ideia com próximos passos.', ['Ideia', 'Plano inicial', 'Sua decisão']),
    'creators': ('Você grava. Seu time de IA edita.', []),
    'consultorias': ('Mais espaço para analisar e orientar.', ['Evidências', 'Síntese e estrutura', 'Análise do time']),
    'agencias': ('Do briefing à criação com mais contexto.', ['Briefing', 'Primeiras versões', 'Sua direção criativa']),
    'advocacia': ('Mais tempo da equipe para a estratégia.', ['Documentos', 'Síntese e cronologia', 'Revisão profissional']),
}


def applications(segments):
    cards = []
    for data in segments:
        slug = data['slug']
        benefit, stages = APPLICATIONS[slug]
        flow = ''.join(f'<li><span class="case-step-number" aria-hidden="true">0{i + 1}</span><span>{escape(stage)}</span></li>' for i, stage in enumerate(stages))
        if slug == 'creators':
            flow = ''.join(f'<li class="case-stage--{role}"><span class="case-step-number" aria-hidden="true">0{i + 1}</span><span>{escape(stage)}</span><small class="case-actor">{ui_icon("bot" if role == "agent" else "user-round")}{"Agente" if role == "agent" else "Pessoa"}</small></li>' for i, (role, stage, _) in enumerate(data['steps']))
        cards.append(f'''<a class="application-card application-card--{slug}" href="/para/{slug}/" data-attribution-link data-segment-link="{slug}"><div class="case-intro"><p class="case-audience">{ui_icon(SEGMENT_ICONS[slug])}<span>{escape(data['label'])}</span></p><h3>{benefit}</h3></div><ol class="case-pipeline" aria-label="Fluxo ilustrativo para {escape(data['label'], quote=True)}">{flow}</ol><div class="case-destination">{tool_marks(SEGMENT_TOOLS[slug], True)}<span class="case-link">Ver aplicação {ui_icon('arrow-up-right')}</span></div></a>''')
    return f'''<section class="section home-applications" id="segmentos" aria-labelledby="segments-title"><div class="wrap"><div class="section-head"><div><p class="eyebrow">Aplicações para o seu negócio</p><h2 id="segments-title">Onde o trabalho<br>pode render mais?</h2></div><p class="lead">Para quem trabalha sozinho ou com uma equipe. Explore um exemplo próximo da sua rotina.</p></div><p class="applications-scope">Aplicações possíveis. As etapas e ferramentas são definidas em cada projeto.</p><div class="applications-list">{''.join(cards)}</div></div></section>'''


def technology():
    groups = [
        ('IAs', [('openai', 'ChatGPT'), ('claude', 'Claude'), ('googlegemini', 'Gemini')]),
        ('Conhecimento e gestão', [('googledrive', 'Drive'), ('notion', 'Notion'), ('microsoftword', 'Word'), ('trello', 'Trello')]),
        ('Conteúdo e canais', [('canva', 'Canva'), ('youtube', 'YouTube'), ('instagram', 'Instagram'), ('slack', 'Slack'), ('whatsapp', 'WhatsApp')]),
    ]
    marks = ''.join(f'<div class="home-tool-group"><h3>{title}</h3>{tool_marks(items, True)}</div>' for title, items in groups)
    return f'''<section class="section home-technology dark" aria-labelledby="technology-title"><div class="wrap">
<div class="section-head"><div><p class="eyebrow">A parte técnica fica com a Mescla</p><h2 id="technology-title">Você não precisa virar<br>especialista em IA.</h2></div><p class="lead">Você traz o conhecimento do negócio e revisa as entregas. A Mescla escolhe, conecta e configura a tecnologia prevista no projeto.</p></div>
<p class="technology-scope">Exemplos de ferramentas. Integrações, arquivos e permissões são avaliados por projeto.</p><div class="home-tool-groups">{marks}</div>
<p class="technical-vocabulary">RAG, MCP, APIs, tokens, parâmetros, ontologias e repositórios: a configuração fica com a Mescla.</p>
<details class="environment-options"><summary><span>{ui_icon('layers')}Ambientes que podemos avaliar</span></summary><div class="environment-content"><p>Você não precisa escolher uma plataforma antes. Avaliamos o ambiente conforme a equipe, o compartilhamento dos agentes, a memória, os acessos e os custos do projeto.</p>{platforms()}<p class="environment-note">Exemplos para avaliação. Os recursos e as condições variam por ambiente; os links abrem os sites das ferramentas.</p></div></details>
</div></section>'''


def questions():
    entries = [
        ('Já tenho ChatGPT, Claude ou Gemini. O que a Mescla acrescenta?', ['Se o seu uso atual já resolve o trabalho, ele pode ser suficiente. A Mescla entra para implantar uma rotina com agentes compartilhados, referências do negócio e revisão pela equipe. Avaliamos com você se esse trabalho de implantação faz sentido.']),
        ('Funciona para quem trabalha sozinho?', ['Sim. Podemos começar com uma pessoa e uma rotina. Se você pretende ampliar a equipe, consideramos o compartilhamento dos agentes e dos registros na escolha do ambiente.']),
        ('Quem pode acessar a memória do negócio?', ['Definimos fontes, responsáveis pela atualização e acessos por equipe ou projeto. Entram os processos, referências e decisões que você autoriza registrar. Conversas pessoais e documentos de outros clientes não entram automaticamente.', 'Onde os dados ficam e quais fornecedores participam são definidos antes de conectar suas informações.']),
        ('Quem revisa o trabalho dos agentes?', ['As pessoas responsáveis por cada etapa. Saídas de IA podem conter erros; por isso, configuramos limites e pontos de revisão ou aprovação. A equipe orienta, confere as informações e decide antes das ações que exigem autorização.']),
        ('Como funciona o investimento?', ['A proposta separa implantação, acompanhamento e custos de ferramentas. Licenças, infraestrutura e consumo de IA são esclarecidos antes de começar, incluindo o que entra no serviço e o que você contrata diretamente.']),
        ('O que acontece depois da implantação?', ['O processo entra em uso com orientação para a equipe. Suporte, ajustes dos agentes e novas integrações dependem do acompanhamento contratado. A evolução começa pela avaliação das entregas.']),
    ]
    faq = ''.join(f'<details{" open" if i == 0 else ""}><summary>{escape(question)}</summary><div class="home-answer">{"".join("<p>" + escape(p) + "</p>" for p in paragraphs)}</div></details>' for i, (question, paragraphs) in enumerate(entries))
    return f'<section class="section home-questions" id="perguntas" aria-labelledby="faq-title"><div class="wrap faq-grid"><div><p class="eyebrow">Antes de começar</p><h2 id="faq-title">Boas perguntas.<br>Respostas diretas.</h2></div><div class="faq-list">{faq}</div></div></section>'


def purpose():
    return '''<section class="home-purpose" id="proposito" aria-labelledby="purpose-title"><div class="wrap"><div><p class="eyebrow">Por que existimos</p><h2 id="purpose-title">Ampliar o possível<br>para cada pessoa.</h2></div><p>Aproximamos pessoas e inteligência artificial para dar mais alcance ao que cada um sabe, imagina e quer realizar.</p></div></section>'''


def closing(phone):
    cta = contact_link(phone, 'Quero conversar sobre como a Mescla pode ajudar meu negócio.\n\nMinha atividade:\nO trabalho que quero melhorar:', 'Conversar sobre meu negócio', 'footer', 'closing-contact-note')
    return f'''<section class="contact home-closing" id="conversar" aria-labelledby="contact-title"><div class="wrap contact-grid"><div><p class="eyebrow">Vamos começar pelo seu trabalho</p><h2 id="contact-title">Qual trabalho está tomando<br>o tempo do seu negócio?</h2></div><div><p>Conte uma rotina que você quer melhorar. Vamos entender o que faria diferença e avaliar um primeiro projeto.</p>{cta}<p class="contact-expectation" id="closing-contact-note">O botão abre o WhatsApp.<br>Você revisa e envia a mensagem.</p></div></div></section>'''


def home_story(segments, phone):
    return '<div class="home-story">' + '\n'.join([comparison(), home_flow(), implementation(phone), applications(segments), technology(), questions(), purpose(), closing(phone)]) + '</div>'
