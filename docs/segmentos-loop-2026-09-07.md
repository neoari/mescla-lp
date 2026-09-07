# Mescla — looping das quatro landing pages

Início: 7 de setembro de 2026. Base publicada: `24e4438`.

## Método e escopo

Pedido: pesquisar problemas reais dos outros quatro segmentos, usar a página de
Creators como referência de concretude e repetir o looping adversarial.
Crítico: **GPT-5.6 Sol**, agente `segments_sol_adversarial`. Pelo menos cinco
rodadas sequenciais, registradas antes de implementar. A página de Creators e
a primeira dobra da Home são preservadas. Os quatro cards da Home acompanham a
nova promessa de seus destinos. A pesquisa orienta hipóteses comerciais; não
substitui entrevistas, validação do ICP ou teste de conversão.

Treze fontes de produto foram copiadas e tiveram SHA-256 registrados antes da
R1. Ao encerrar as rodadas, serão comparadas com essa baseline. As avaliações
usam fontes, conteúdo e especificações; não houve teste visual em navegador.

## Critérios fixos

Notas de 0 a 5. Total: soma(nota × peso / 5).

| Critério | Peso | Pergunta |
|---|---:|---|
| Problema real/evidência | 15 | O recorte corresponde a um problema documentado, com limites da pesquisa claros? |
| Valor/venda | 20 | O visitante sabe qual trabalho recebe, o que pode fazer com ele e como começa? |
| Copy | 15 | Verbos, objetos e ganhos específicos substituem abstrações? |
| Conversão | 15 | Há um próximo passo claro e compatível com o contato real por WhatsApp? |
| UX | 15 | Sequência, revisão humana, mobile e fallback facilitam a decisão? |
| UI | 10 | A composição evidencia o trabalho e difere dos outros públicos? |
| Branding | 10 | Preserva Mescla, agentes compartilhados e memória com contexto do negócio? |

Não inventar resultados, clientes, números de produtividade ou integrações.
As tarefas descrevem o serviço a implantar, não recursos já instalados no cliente.
As operações externas e os acessos dependem do escopo. Nenhum clique no WhatsApp
vira reunião agendada, venda ou lead qualificado por definição.

## Pesquisa e limites

Fontes consultadas em 7/9/2026:

- **Sebrae, vendas digitais (2026):** WhatsApp é canal central para pequenos
  negócios. Sustenta a escolha de uma entrada reconhecível; não comprova que
  todos perdem propostas. Hipótese Mescla: pedidos e retornos comerciais precisam
  continuar quando o dono está atendendo ou entregando.
  https://agenciasebrae.com.br/dados/whatsapp-se-consolida-nas-vendas-on-line-enquanto-facebook-e-lojas-proprias-perdem-folego/
- **RD Station, maturidade em vendas (2026):** contexto de operação comercial,
  registros e acompanhamento de contatos. A amostra não representa apenas
  pequenos negócios. https://www.rdstation.com/pesquisas/panorama-marketing-vendas/edicao-2026/vendas/maturidade-operacional/
- **RD Station, agências e consultorias de marketing (edição 2026, dados de
  2025):** aquisição de clientes, processos, projetos e retrabalho aparecem
  como dificuldades. Hipótese escolhida: produção recorrente presa em refações.
  Não afirmar que é o maior problema de todas as agências, nem generalizar a
  pesquisa para toda consultoria de gestão.
  https://www.rdstation.com/pesquisas/panorama-marketing-vendas/edicao-2026/agencias-consultorias/cenario/
- **Harvest, State of Professional Services 2025:** rentabilidade e gestão de
  projetos em serviços profissionais. Fonte de fornecedor, amostra multissetorial,
  sem recorte brasileiro identificado no material consultado. Hipótese Mescla para consultorias pequenas: preparação
  recorrente de evidências, planilhas e apresentações disputa tempo com análise.
  https://www.getharvest.com/2025-state-of-professional-services-report
  https://www.getharvest.com/hubfs/downloads/harvest-the-state-of-professional-services-2025.pdf
- **Clio, Solo and Small Firms 2025:** restrições de recursos, entrada de
  clientes e investimento seletivo em automação documental. Estudo de fornecedor
  com contexto norte-americano; não usar seus percentuais como estatística
  brasileira. Hipótese Mescla: reduzir preparação documental repetitiva.
  https://www.clio.com/about/press/legal-trends-solo-small-law-firms-2025/
- **OAB, encontro sobre IA (28/8/2026):** supervisão, exame crítico de fontes,
  proteção de dados e decisão profissional. Define limites da proposta jurídica,
  não prova demanda comercial por ela.
  https://www.oab.org.br/noticia/64540/oab-debate-limites-eticos-do-uso-da-inteligencia-artificial-na-advocacia-no-ultimo-dia-da-jornada-sobre-ia

## Rodada 1 — diagnóstico das páginas atuais

Concluída antes de implementar. Sol identificou uma oferta mais concreta em
Creators e excesso de arquitetura abstrata nos outros públicos: agentes,
memória e continuidade aparecem antes do trabalho que o comprador recebe.
Os pilotos descrevem configuração interna, mas deixam o entregável indefinido.

| Público | Evidência | Valor | Copy | Conversão | UX | UI | Marca | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Empreendedores | 2 | 2 | 3 | 2 | 3,5 | 3,5 | 4 | 54,5 |
| Consultorias | 2,5 | 3 | 3,5 | 2,5 | 4 | 4 | 4 | 65,5 |
| Agências | 3 | 3 | 3,5 | 3 | 4 | 4 | 4 | 68,5 |
| Advocacia | 3 | 3 | 3,5 | 2,5 | 4 | 4 | 4 | 67,0 |

**Decisões:** escolher um trabalho principal por LP; mostrar tarefas com saídas,
matéria-prima, papéis e término do piloto; trazer memória e compartilhamento
como sustentação desse trabalho. Preservar linguagem comercial forte sem
prometer receita, precisão ou integração irrestritas. A proposta deve ir além
de simples resumo: arquivos editáveis, registros e trabalho preparado para a
pessoa revisar. Não copiar uma grade de seis cards para todos os públicos.

### Proposta enviada à rodada 2

Uma dor central, um exemplo concreto e seis tarefas por página. A promessa é
comercial, com critérios de qualidade e escopo definidos no primeiro projeto.
Os exemplos visuais são ilustrativos, identificados como tal, sem números de
clientes, performance ou telas falsas de plataformas. Ordem: hero → tarefas e
entrega → fluxo com responsáveis → ferramentas → time e memória → piloto → FAQ
→ contato. CTA intermediário direciona ao mesmo contato existente.

**Empreendedores — orçamento e retorno comercial**

- Hero: “Seu próximo cliente não pode ficar esperando.”
- Apoio: “Enquanto você atende e entrega, seu time de IA organiza pedidos,
  prepara propostas e acompanha os retornos. Você define as condições e fecha
  o negócio.” Contexto: para quem vende serviços e ainda concentra o comercial.
- Tarefas: qualificar o pedido; reunir histórico autorizado; apontar informações
  faltantes; montar proposta com oferta e preços fornecidos; preparar mensagem
  de retorno; registrar próximo passo e passagem para a entrega.
- Entrega principal: proposta editável + resumo do pedido + próximo retorno.
- Fluxo: Pedido (Pessoa) → Proposta (Agente) → Condições e aprovação (Pessoa)
  → Retorno (Agente) → Negociação (Pessoa). Retornos enviados apenas nas regras
  e canais autorizados; proposta não inventa preço ou desconto.
- Visual: percurso do pedido à proposta, com campos “O cliente precisa”,
  “Escopo”, “Condições a conferir”, “Próximo retorno”. Tarefas em lista comercial
  de três pares, cada uma com saída curta, em vez de cards iguais aos Creators.
- Ferramentas: WhatsApp, Google Docs, Sheets, Drive, Trello; CRM existente citado
  na nota de integração. Memória: ofertas, propostas aprovadas e histórico por
  cliente. O compartilhamento permite que outra pessoa continue o atendimento.
- CTA: “Quero dar retorno aos meus clientes”. Piloto: um tipo de serviço e um
  percurso de pedido até proposta e retorno. Avaliar demora da proposta,
  pendências sem responsável e correções nas condições. Sem garantir vendas.

**Consultorias — material bruto até entregável para o cliente**

- Hero: “Seu tempo na análise. Seu time de IA no trabalho de base.”
- Apoio: “Entrevistas, documentos e planilhas viram uma base de evidências e uma
  apresentação editável. Seus consultores conferem as fontes, formulam a
  recomendação e conduzem a conversa com o cliente.”
- Tarefas: organizar entrevistas autorizadas por tema; indexar fontes e trechos;
  consolidar planilhas com unidades e períodos; agrupar evidências pelas
  perguntas do método; sinalizar divergências e informações faltantes;
  montar relatório ou apresentação com conclusões revisadas pelo consultor.
- Entrega principal: matriz de evidências + apresentação ou relatório editável.
- Fluxo: Pergunta e método (Pessoa) → Evidências (Agente) → Análise (Pessoa)
  → Apresentação (Agente) → Entrega ao cliente (Pessoa).
- Visual: matriz com colunas pergunta/fonte/o que conferir, seguida de uma folha
  de apresentação. Seis tarefas em três blocos: ouvir, cruzar, apresentar.
- Ferramentas: Zoom, Drive, Excel/Sheets, PowerPoint, Word, Notion. Memória:
  método e modelos da consultoria, com materiais dos clientes separados.
- CTA: “Quero acelerar meu próximo entregável”. Piloto: um tipo de diagnóstico,
  fontes autorizadas e um formato final. Avaliar horas de preparação, esforço
  de conferência e rodadas de revisão; sem prometer reduzir equipe.

**Agências — campanha presa em briefing, versões e refações**

- Hero: “Mais campanhas na rua. Menos idas e vindas.”
- Apoio: “Seu time de IA organiza o briefing, prepara textos e variações e
  incorpora os ajustes da criação. A agência dá a direção; o cliente aprova.”
- Tarefas: conferir briefing e sinalizar lacunas; recuperar tom e referências
  da conta; criar copies e roteiros em um formato escolhido; desdobrar textos
  em canais e formatos; reunir feedbacks por peça/versão e incorporar ajustes;
  organizar versão final, legenda, link e pendências de aprovação.
- Entrega principal: primeira rodada de campanha com briefing, copies,
  variações e checklist de aprovação. Artes seguem os modelos e ferramentas
  definidos na implantação; não prometer criação irrestrita por qualquer app.
- Fluxo: Briefing (Pessoa) → Primeira rodada (Agente) → Direção criativa (Pessoa)
  → Ajustes (Agente) → Aprovação do cliente (Pessoa).
- Visual: quadro de produção com linhas por peça, onde cada ajuste pertence a
  uma versão. Tarefas em três faixas: entrada, produção, aprovação. Exemplo
  explícito de campanha de lançamento, sem cliente inventado.
- Ferramentas: Trello, Slack, Drive, Canva, Meta Ads e Google Ads (referências
  ou formatos; ações de mídia não fazem parte do exemplo). Memória por marca
  com voz, decisões e versões. Atendimento e criação usam os mesmos agentes.
- CTA: “Quero reduzir as refações”. Piloto: uma conta, uma campanha, um formato
  e o percurso até a aprovação. Avaliar rodadas, horas de produção e pedidos
  parados. A dor comercial também será perguntada nas entrevistas.

**Advocacia — documentos dispersos até caso pronto para análise**

- Hero: “Menos tempo procurando. Mais tempo para conduzir o caso.”
- Apoio: “Seu time de IA organiza documentos, reconstrói a cronologia e prepara
  minutas com os modelos do escritório. Cada informação volta à fonte;
  o advogado confere e decide.”
- Tarefas: catalogar arquivos e versões; extrair partes, datas e acontecimentos;
  organizar cronologia ligada à origem; comparar documentos e destacar
  divergências; montar checklist de documentos pendentes; preencher estrutura
  de minuta com fatos e orientações fornecidos pelo advogado.
- Entrega principal: índice documental + cronologia com fontes + minuta inicial
  editável, se escolhida no escopo. Exemplos de fonte são campos ilustrativos,
  não jurisprudência ou fatos de cliente.
- Fluxo: Documentos e orientação (Pessoa) → Organização (Agente) → Análise
  jurídica (Pessoa) → Minuta (Agente) → Revisão e uso (Pessoa).
- Visual: dossiê com índice e referência arquivo/página, com diferenças e
  pendências visíveis; seis tarefas em pares de documento, conferência, minuta.
- Ferramentas: Word, PDF/Acrobat, Drive, Sheets; Astrea e pesquisa jurídica
  existente como contextos a avaliar, sem sugerir acesso nativo ou protocolo.
- CTA: “Quero agilizar a preparação dos casos”. Piloto: rotina documental,
  conjunto autorizado, índice e cronologia; minuta conforme escopo. Avaliar
  localização da informação, correspondência com fontes e esforço de revisão.
  Contato pede descrição, sem documentos sigilosos. Estratégia, prazos, revisão
  e protocolo continuam com o escritório.

## Rodada 2 — oferta, evidência e limites

Concluída antes de implementar. Sol reconheceu entregáveis mais compráveis,
mas apontou generalização de ICP em Empreendedores; pesquisa ainda indireta
para Consultorias; promessa de veiculação indevida em “campanhas na rua”; e
rastreabilidade absoluta demais em Advocacia. Pediu piloto com configuração,
execução real e saída revisável, não só setup ou amostra isolada.

| Público | Evidência | Valor | Copy | Conversão | UX | UI | Marca | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Empreendedores | 3 | 4 | 4 | 3,5 | 4 | 4 | 4,5 | 76,5 |
| Consultorias | 2,5 | 4,5 | 4,5 | 4 | 4,5 | 4 | 4,5 | 81,5 |
| Agências | 3,5 | 4 | 4 | 4 | 4,5 | 4 | 4,5 | 81,0 |
| Advocacia | 3,5 | 4,5 | 4 | 4 | 4,5 | 4 | 4,5 | 83,0 |

**Decisões:** acolher insumos e término do piloto explícitos; qualificar dados e
referências conforme origem; retirar veiculação da promessa da agência. O
serviço da agência incluirá textos **e adaptação de peças a modelos aprovados**,
com um formato escolhido no piloto. Não reduzir tudo a resumos: propostas,
apresentações, peças e minutas devem ser arquivos úteis e revisáveis.

### Proposta enviada à rodada 3 — copy e composição

**Empreendedores**
- Etiqueta: “Para quem vende serviços e concentra o comercial”.
- H1: “O pedido chegou. Faça a proposta andar.”
- Lead: “Seu time de IA reúne o pedido, monta a proposta com suas ofertas e
  prepara o retorno ao cliente. Você confere preço, prazo e condições e conduz
  a negociação.”
- CTA: “Quero agilizar minhas propostas”. Apoio: “Conte onde o orçamento trava.
  A conversa começa no WhatsApp.” Secundário: “Ver o pedido virar proposta”.
- Tarefas (título → saída): Organizar o pedido → resumo com necessidade e prazo;
  Consultar suas ofertas → serviços e modelos pertinentes; Identificar lacunas
  → perguntas antes de orçar; Montar a proposta → documento editável com escopo
  e condições fornecidas; Preparar o retorno → mensagem vinculada à proposta;
  Registrar o próximo passo → responsável e acompanhamento combinados.
- Entrega em destaque: “Uma proposta para revisar. Um retorno para continuar.”
- Piloto: oferta/modelo + critérios comerciais + pedido autorizado → agentes
  configurados + proposta editável + mensagem e tarefa de retorno. Envio sob
  regra autorizada; negociação com a pessoa. Não há promessa de venda.
- Visual: ficha do pedido ligada a documento de proposta com escopo, preço a
  conferir e próximo passo. Lista de seis tarefas com coluna “O que fica pronto”.

**Consultorias**
- Etiqueta: “Para consultorias com equipes enxutas”.
- H1: “Mais tempo para analisar. Menos horas montando a entrega.”
- Lead: “Seu time de IA organiza entrevistas, cruza planilhas e monta relatórios
  e apresentações editáveis. Os consultores conferem as evidências, formulam as
  recomendações e conduzem a entrega ao cliente.”
- CTA: “Quero agilizar meu próximo entregável”. Apoio: “Conte qual relatório ou
  apresentação se repete nos projetos. A conversa começa no WhatsApp.”
- Tarefas: Organizar entrevistas → temas e trechos de registros autorizados;
  Localizar evidências → referência ao arquivo e trecho, página ou célula quando
  disponível; Consolidar planilhas → dados por período/unidade, com diferenças
  para conferir; Cruzar fontes → matriz por pergunta do método; Apontar lacunas
  → divergências e questões em aberto; Montar a entrega → Word ou PowerPoint no
  template, com conclusões formuladas ou aprovadas pelo consultor.
- Entrega: “Da matriz de evidências ao material que você apresenta.”
- Piloto: um tipo de diagnóstico + fontes autorizadas + modelo → matriz e um
  entregável editável. Registrar esforço de preparação e conferência para
  avaliar o ganho. A proposta é caso de uso, não diagnóstico universal.
- Visual: três colunas temáticas (Ouvir / Cruzar / Apresentar), duas tarefas em
  cada. Exemplo de matriz contém pergunta, fonte/localização e conferência, com
  texto ilustrativo curto; documento de apresentação mostra conclusão humana.

**Agências**
- Etiqueta: “Para agências com produção recorrente”.
- H1: “Do briefing às peças. Sem recomeçar a cada ajuste.”
- Lead: “Seu time de IA prepara textos, adapta peças aos modelos da agência e
  incorpora feedbacks por versão. Criação dá a direção; atendimento e cliente
  aprovam o que segue para uso.”
- CTA: “Quero destravar as entregas”. Apoio: “Conte qual peça volta mais vezes
  para ajuste. A conversa começa no WhatsApp.”
- Tarefas: Conferir briefing → pedido e lacunas visíveis; Recuperar a marca →
  tom e referências da conta; Criar textos e roteiros → primeira rodada no
  formato escolhido; Desdobrar peças → textos e artes em modelos e dimensões
  definidos; Aplicar feedbacks → alterações vinculadas à peça e à versão;
  Preparar aprovação → arquivos, legendas e pendências da rodada.
- Entrega: “Uma rodada de peças para aprovar. Com cada ajuste no lugar.”
- Piloto: uma conta + uma entrega recorrente (ex.: anúncio estático) + modelo
  visual → primeira rodada com texto e peça adaptada, ajustes e versão para
  aprovação. Sem quantidade fixa, mídia paga ou publicação implícitas.
- Visual: três faixas Entrada / Produção / Aprovação, duas tarefas por faixa.
  Exemplo de peça, feedback “Trocar a chamada” e versão atualizada, identificados
  como exemplo; nada parece um cliente real ou uma tela de plataforma.
- Ferramentas: Trello, Slack, Drive, Canva; Meta Ads e Google Ads em grupo
  “Formatos de destino” (veiculação exige escopo próprio).

**Advocacia**
- Etiqueta: “Para escritórios com rotina documental intensa”.
- H1: “Seu tempo na estratégia. Seus agentes nos documentos.”
- Lead: “Seu time de IA organiza o acervo, monta cronologias com referências e
  prepara minutas a partir das orientações do advogado. O escritório confere as
  fontes, define a estratégia e aprova o uso.”
- CTA: “Quero agilizar a preparação dos casos”. Apoio: “Descreva a rotina, sem
  enviar documentos de clientes. A conversa começa no WhatsApp.”
- Tarefas: Catalogar arquivos → índice por tipo e versão; Extrair fatos →
  partes, datas e eventos ligados ao material; Montar a cronologia → registros
  com origem e localização quando disponível; Comparar documentos → trechos
  divergentes para conferir; Apontar o que falta → checklist de pendências;
  Preparar a minuta → estrutura editável com modelo, fatos e instruções do
  advogado, para revisão antes do uso.
- Entrega: “Índice, cronologia e minuta. Prontos para a conferência do advogado.”
- Piloto: conjunto autorizado + perguntas + modelo → índice/cronologia e tipo
  de minuta escolhido. Acordar fornecedores, armazenamento, retenção e acessos
  antes de processar materiais; sinalizar limitações de leitura e origem.
- Visual: documento editorial com seis entradas numeradas e ligações a
  arquivo/página/pendência, sem martelo, tribunal decorativo ou jurisprudência
  inventada. Estados de conferência são exemplos, não garantias de precisão.
- Word, Acrobat, Drive, Sheets; Astrea e Jusbrasil apenas citados como contexto
  existente a avaliar, com nenhuma integração presumida.

**Regras comuns de execução visual:** texto principal ≥16px, rótulos ≥14px;
sem elipses, alturas fixas em texto ou informação exclusiva do hover. Tarefas
em composições distintas; cinco etapas explícitas nos infográficos com papéis
humanos/agentes, legenda equivalente e fallback. Ritmo de 70 frames por etapa,
controle discreto de movimento e respeito à redução de movimento já existentes.

## Rodada 3 — precisão comercial e texto final

Concluída antes de implementar. Sol considerou as quatro ofertas específicas e
com trabalho substantivo, e pediu ajustes de abrangência: critérios comerciais
em propostas; distinção entre consolidar dados e formular conclusões; criação,
atendimento e cliente com funções diferentes; documentos autorizados no jurídico.

| Público | Evidência | Valor | Copy | Conversão | UX | UI | Marca | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Empreendedores | 3 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 85,5 |
| Consultorias | 2,5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 84,0 |
| Agências | 3,5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 87,0 |
| Advocacia | 3,5 | 4,5 | 4,5 | 4 | 4,5 | 4,5 | 4,5 | 85,5 |

**Decisões:** incorporar critérios comerciais e documentos autorizados; separar
criação, coordenação e aprovação; explicitar autoria das recomendações.
Rejeitar alongar todos os títulos com linguagem abstrata como “o contexto
acompanhando”: prejudicaria a leitura e repetiria o problema original. Ganhos
desejados podem aparecer como proposta de valor, sem garantia numérica. Trocar
“sem recomeçar” por “menos idas e vindas”; retirar “menos horas” da consultoria.
Manter CTAs curtos. Nenhuma nota de evidência será elevada por polimento de copy.

### Proposta enviada à rodada 4 — especificação de implementação

Títulos finais:

- Empreendedores: **“O pedido chegou. Faça a proposta andar.”** CTA “Quero
  agilizar minhas propostas”. Lead inclui ofertas **e critérios comerciais**.
- Consultorias: **“Da entrevista à apresentação. Com a sua análise no centro.”**
  CTA “Quero agilizar meu próximo entregável”. Lead: agentes organizam
  entrevistas, consolidam dados e montam apresentações; consultores conferem,
  formulam recomendações e entregam.
- Agências: **“Do briefing às peças. Com menos idas e vindas.”** CTA “Quero
  destravar as entregas”. Lead: agentes preparam textos, adaptam peças aos
  modelos e aplicam feedbacks; criação dirige, atendimento coordena, cliente
  aprova.
- Advocacia: **“Documentos em ordem. Mais tempo para a estratégia.”** CTA “Quero
  agilizar uma rotina documental”. Lead limita documentos autorizados e deixa
  minuta orientada, fontes conferidas e uso aprovado pelo escritório.

#### Papéis e saídas nas cinco etapas

| Página | Etapa 1 | Etapa 2 | Etapa 3 | Etapa 4 | Etapa 5 |
|---|---|---|---|---|---|
| Empreendedores | Pedido — Pessoa | Proposta — Agente | Aprovação — Pessoa | Retorno — Agente | Negociação — Pessoa |
| Consultorias | Método — Pessoa | Evidências — Agente | Análise — Pessoa | Apresentação — Agente | Entrega — Pessoa |
| Agências | Briefing — Pessoa | Produção — Agente | Direção — Pessoa | Ajustes — Agente | Aprovação — Pessoa |
| Advocacia | Documentos — Pessoa | Organização — Agente | Análise — Pessoa | Minuta — Agente | Revisão — Pessoa |

Em Agências, etapa 1 inclui atendimento/cliente; etapa 3, criação; etapa 5,
aprovação interna e do cliente prevista para aquela entrega. No jurídico,
a etapa de minuta é do exemplo com esse entregável escolhido. Na consultoria,
apresentação usa conclusões formuladas ou aprovadas na análise. Todos os fluxos
repetem as mesmas etapas na animação, no texto e no fallback. O agente não
negocia preços, formula estratégia jurídica ou veicula anúncios neste exemplo.

#### Hierarquia e densidade

- Hero: etiqueta de público, H1, lead de até 45 palavras, CTA específico e
  secundário para o exemplo. Uma linha explica que o contato começa no WhatsApp.
- Valor: seis tarefas, cada qual com ícone, título, ação curta e saída visível.
  Um bloco de entrega reúne os arquivos que a pessoa receberá para revisar.
- Fluxo: cinco etapas com papel + verbo + saída; um único CTA intermediário
  “Conversar sobre esse fluxo”, apontando para o contato existente.
- Ferramentas: logos com nomes legíveis e uma frase funcional. Na agência,
  separar produção/gestão de formatos de destino; veiculação tem escopo próprio.
- Time/memória: explicar com nomes de papéis e registros de cada público,
  reduzindo repetição do texto institucional. Preservar ambientes disponíveis.
- Piloto: “Você traz” (até três insumos) e “O primeiro trabalho entrega” (até
  quatro resultados, incluindo configuração + execução + arquivo revisável).
- FAQ: quatro perguntas próprias, mais termos técnicos e memória já existentes.
  Reunir duplicatas; investimento sem preço inventado; não oferecer teste grátis.
- Contato: pergunta específica de gargalo e opções de interesse próprias,
  preservando os códigos existentes de campanha; mensagem só vai após envio do
  visitante no WhatsApp. Não ativar integrações analíticas ou agendamento.

#### Composições próprias

**Empreendedores:** lista editorial em duas colunas ação/saída, com uma ficha de
proposta no infográfico. Sol no fundo; Maré para execução; aprovação comercial
em Sol. Campos de exemplo sem preços fictícios.

**Consultorias:** três capítulos “Ouvir / Cruzar / Apresentar”, duas tarefas em
cada, com ligações verticais. A animação reúne fontes, mostra matriz e termina
em apresentação das recomendações humanas. Sem gráficos com métricas fictícias.

**Agências:** faixas Entrada / Produção / Aprovação, peças e feedback vinculados
à versão. Textos e adaptação de modelos são entregas; não mero “rascunho”. A
animação destaca a passagem produção → direção → ajustes → aprovação.

**Advocacia:** índice documental numerado, referências e pendências no exemplo;
minuta segue orientação do advogado. Animação de documentos → organização →
análise → minuta → revisão. Sem prazos, casos reais ou citações jurídicas falsas.

#### Responsividade e movimento

Grades viram uma coluna até 650px; nenhuma largura mínima impõe rolagem
horizontal. Corpo 16px+, rótulos 14px+, CTAs com altura mínima de 44px. Elementos
visuais são acompanhados por texto acessível e fallback sem JS. Movimento
continua rápido (70 frames/etapa), com cinco fases e botões para selecioná-las;
redução de movimento e pausa por visibilidade já existentes são preservadas.
A marca e Creators não mudam. Na Home, apenas os quatro cards correspondentes
recebem o benefício e o fluxo corretos; primeira dobra e demais seções intactas.

## Rodada 4 — coerência entre tarefa, etapa e entrega

Concluída antes de implementar. Sol considerou a especificação pronta com
ajustes: resumir as tarefas concentradas nas fases de agente; manter ação e
saída juntas no mobile; preservar títulos dos grupos; indicar “exemplo com
minuta” no jurídico; assegurar alvo de toque de 44px também nos controles.

| Público | Evidência | Valor | Copy | Conversão | UX | UI | Marca | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Empreendedores | 3 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 85,5 |
| Consultorias | 2,5 | 5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 86,0 |
| Agências | 3,5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 87,0 |
| Advocacia | 3,5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 87,0 |

Total de Consultorias recalculado pela fórmula fixa: 86,0 (o crítico havia
informado 86,5). As notas individuais foram preservadas.

**Decisões:** incorporar os ajustes. Manter nomes curtos nos botões e explicar
resumo/lacunas/proposta e matriz/consolidação/lacunas nas legendas. Apresentar
Word **ou** PowerPoint como escolha do piloto. Jurídico identifica o exemplo
com minuta e a entrega opcional. Agência explicita modelo definido na produção
com aprovação interna e do cliente conforme o processo.

### Material enviado à rodada 5

Copy completa preparada em arquivo de revisão separado do produto, com todas
as seções das quatro páginas: hero, seis tarefas e saídas, cinco etapas,
ferramentas, memória, insumos do piloto, entregáveis, critérios de avaliação,
FAQ e contato. A proposta segue a especificação R4. Não há mudança de fonte
pública até terminar essa crítica.

A revisão final deve buscar contradições ou falhas concretas de expectativa,
sem transformar benefícios em avisos repetidos. A implementação deverá manter
os pares tarefa/saída e os grupos no mobile, usar a mesma sequência nas três
representações do fluxo e preservar a página de Creators.

## Rodada 5 — revisão do texto completo

Concluída antes de implementar. Sol aprovou estrutura e conceito e encontrou
duas inconsistências: referências comerciais poderiam sugerir reaproveitamento
irrestrito de propostas; duas tarefas da consultoria pareciam prometer Word e
PowerPoint juntos. No jurídico, pediu separar checklist de modelo opcional.

| Público | Evidência | Valor | Copy | Conversão | UX | UI | Marca | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Empreendedores | 3 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 85,5 |
| Consultorias | 2,5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 84,0 |
| Agências | 3,5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 87,0 |
| Advocacia | 3,5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 87,0 |

**Correções aceitas e registradas antes da implementação:**

1. Empreendedores: “ofertas, modelos e referências comerciais autorizadas”.
   Memória diferencia referências reutilizáveis de históricos/condições por cliente.
2. Consultorias: tarefas finais “Estruturar a narrativa” e “Montar o entregável
   escolhido”, com Word **ou** PowerPoint conforme o projeto.
3. Advocacia: “Checklist documental; modelo da minuta, quando incluída no escopo”.

Não foram atribuídas novas notas após esses ajustes pontuais. As cinco rodadas
avaliaram quatro públicos; notas não são conversão medida. A evidência permaneceu
moderada onde a pesquisa é indireta. O texto final mantém as fontes e limites
da pesquisa neste registro, sem transformar as LPs em relatórios acadêmicos.

## Gate antes da implementação

As 13 fontes de produto permaneciam idênticas à baseline após a R5, confirmado
por SHA-256. Este registro será commitado antes da primeira alteração no site.

SHA-256 do candidato de copy final: `ba333a5c6dff97e3fe456862ff295f12c33afecd1254c3171148aab5230df2f2`.

## O que validar em entrevistas após os anúncios

- Empreendedores: último pedido que demorou a virar proposta, etapa que exigiu
  intervenção e critérios comerciais que precisam ficar explícitos.
- Consultorias: último entregável recorrente, fontes e formato, esforço de
  preparação e conferência; verificar se este é de fato um gargalo prioritário.
- Agências: última refação, motivo e caminho do feedback; comparar essa dor com
  aquisição de clientes e margem antes de expandir o posicionamento.
- Advocacia: rotina documental mais repetida, qualidade dos arquivos, tipo de
  conferência e limite de acesso; não coletar documentos sigilosos na entrevista inicial.

Separar interesse no anúncio, intenção de contato, conversa realizada e
contratação. Não usar clique como comprovação de demanda ou de resultado.

## Revisão da implementação

Após implementar, Sol fez uma inspeção por código, sem nova rodada de conceito.
Encontrou uma inconsistência entre o formato do piloto de consultoria (relatório
ou apresentação) e o nome da quarta fase, “Apresentação”. Correção aceita:
renomear essa fase para “Entregável” e descrever a quinta como revisão e entrega
ao cliente. O ajuste será aplicado às fontes, controles e card da Home.

A pesquisa da Harvest foi descrita com maior precisão neste registro: amostra
multissetorial, sem recorte brasileiro identificado no material consultado.
Isso não altera a hipótese nem a nota de evidência da revisão.

## Verificação concluída

O registro das cinco rodadas foi commitado isoladamente em `9590572`, antes de
qualquer alteração de produto. A implementação subsequente passou por:

- TypeScript e 84 estados de composição Remotion, incluindo limites de fase,
  responsáveis e decisões humanas antes das etapas seguintes.
- Validação estática das sete páginas: estrutura, links, IDs acessíveis,
  formulários e dependências locais dos módulos.
- Conferência dos quatro segmentos: seis tarefas com saídas, insumos do piloto,
  cinco etapas iguais no card da Home, LP e animação, ferramentas e contato.
- Comparação com a versão anterior: Creators e o restante da Home preservados,
  exceto as versões dos assets compartilhados e o marcador de versão da Home.
- Testes existentes de atribuição: campanha, sessão, identificadores de clique,
  navegação interna, limites dos campos e codificação da mensagem de WhatsApp.
- Build reproduzível de 26 arquivos públicos; pacote e lista do deploy idênticos;
  sintaxe do script de inicialização e ausência de erros no diff.

Verificação por código e HTML estático; não foi feita inspeção visual em navegador.
As notas das rodadas são avaliações da proposta, não medições de conversão.
