# Personalização das landing pages

Versão geral: `2026-09-v7`. Home: `2026-09-v7-home-story-v3`.
Creators: `2026-09-creators-video-v1`. Demais segmentos: `2026-09-{slug}-workflow-v1`.

| Público | Situação central | Composição | Valor a avaliar |
| --- | --- | --- | --- |
| Empreendedores | Pedido de serviço parado antes da proposta ou do retorno | Proposta comercial; seis tarefas ligadas às suas saídas | Tempo até a proposta revisada e continuidade do retorno |
| Creators | Gravações paradas na edição | Fluxo de cinco etapas e seis operações de edição | Tempo dedicado à edição, rodadas de ajuste e fidelidade ao padrão |
| Consultorias | Preparação de evidências e entregáveis disputando tempo com a análise | Matriz de evidências; capítulos de fontes, análise e entrega | Preparação, correspondência com as fontes e revisão técnica |
| Agências | Peças presas em briefings incompletos e refações | Quadro de versões; entrada, produção e aprovação | Tempo até a rodada aprovada e motivo dos ajustes |
| Advocacia | Leitura e organização repetida de materiais do caso | Índice documental; tarefas de extração, conferência e minuta | Localização de informações e correspondência com as fontes |

As superfícies são exemplos de fluxos, não screenshots de produtos da Mescla
nem resultados de clientes. Não contêm métricas inventadas, garantias de ganho
ou promessas de integração universal.

As páginas distinguem integração e troca de arquivos. A disponibilidade depende
de acesso, plano, aprovação e recurso da ferramenta. CapCut, Premiere, DaVinci,
Word, PowerPoint e sistemas jurídicos não são apresentados como conexões já
implantadas ou automações universais.

## OpenClaw

A Home e as cinco páginas incluem OpenClaw entre os ambientes possíveis.
A documentação de Teams confirma chat de equipe, sessões compartilhadas,
presença e papéis de operador. Um gateway representa um domínio de confiança;
organizações que não confiam umas nas outras requerem gateways separados.
Não afirmar equivalência completa com o Buzz nem uma data de lançamento não
verificada. Fonte: https://docs.openclaw.ai/start/teams

## Fontes para capacidades

- Google Drive: https://developers.google.com/workspace/drive/api/guides/manage-downloads
- Google Sheets: https://developers.google.com/workspace/sheets/api/guides/values
- Notion: https://developers.notion.com/guides/data-apis/working-with-page-content
- Canva: https://www.canva.dev/docs/connect/
- Trello: https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/
- WhatsApp: https://business.whatsapp.com/policy
- Remotion: https://www.remotion.dev/
- CapCut: https://www.capcut.com/
- DaVinci Resolve: https://www.blackmagicdesign.com/products/davinciresolve

## Creators: edição como gargalo

Direção solicitada em 7 de setembro de 2026, posterior à revisão da Home:
**Roteiro (Agente) → Gravação (Pessoa) → Edição (Agente) → Aprovação
(Pessoa) → Publicação (Agente)**. A Home, o fallback estático, o texto acessível,
a landing page e o infográfico apresentam a mesma sequência.

A oferta passa a detalhar cortes e montagem, remoção de silêncios, ajuste de cor,
grafismos e animações, melhoria do som e legendas sincronizadas. O agente executa
as tarefas previstas no projeto; a pessoa avalia e aprova. Ferramentas, fontes,
acabamento e acesso aos canais são definidos e testados na implantação.

Remotion, CapCut e DaVinci Resolve aparecem no grupo de edição e produção;
YouTube, TikTok e Instagram, no de publicação após aprovação. A presença de um
logo não afirma integração pronta ou API universal. A mudança é na apresentação
do serviço no site; não configura uma operação real de edição ou publicação.

Todos os infográficos de segmentos têm cinco fases de 70 frames (350 frames
a 30 fps). A Home mantém três fases e sua duração anterior. `motion/src/check.tsx`
verifica 84 estados: início, meio e fim de cada fase, correspondência com as
etapas e os responsáveis da página, e decisões humanas antes do trabalho seguinte.

## Quatro segmentos: pesquisa e cinco rodadas

A revisão de 7/9/2026 foi registrada antes de implementar, com GPT‑5.6 Sol como
adversarial. Fontes, limites da pesquisa, evolução das propostas e perguntas de
entrevista estão no [registro das cinco rodadas](segmentos-loop-2026-09-07.md).
As dores escolhidas são hipóteses de validação, não uma classificação universal
dos maiores problemas de cada mercado.

Cada página descreve seis tarefas dos agentes, suas saídas, cinco etapas com
responsáveis, ferramentas reconhecíveis, insumos e entregas do primeiro projeto.
Os quatro cards da Home repetem as mesmas etapas. O conteúdo de Creators foi
preservado. Nas demais LPs, o fluxo vem antes das ferramentas e oferece um
caminho de contato no meio da página.

- Empreendedores: proposta editável e retorno comercial. A pessoa aprova preço,
  prazo e condições; referências reutilizáveis ficam separadas do histórico de clientes.
- Consultorias: matriz de evidências e um relatório **ou** apresentação escolhido
  no piloto. As recomendações vêm dos consultores.
- Agências: uma conta, um formato e uma rodada de peças e ajustes. Canva, arquivos
  e permissões dependem do projeto; Meta Ads e Google Ads são formatos de destino,
  sem promessa implícita de veiculação automática.
- Advocacia: índice, cronologia e pendências documentais. Minuta é opcional no
  escopo, depende da orientação do advogado e passa por sua revisão.

## Experiência visual

Infográficos Remotion por público, logos em destaque, ícones Lucide e movimento: [experiencia-visual.md](experiencia-visual.md).

## Ícones

SVGs de [Simple Icons](https://github.com/simple-icons/simple-icons), incorporados
no HTML para não depender de pedidos externos durante a navegação. Os nomes
das ferramentas permanecem visíveis; os ícones são decorativos para leitores
de tela. Não representam parceria ou certificação.

- Revisão `777807a262bb7384ff406fd4b35fdcd02e9514c3`: Google Drive, Google Docs,
  Google Sheets, Notion, YouTube, Instagram, Trello, WhatsApp, Claude, Gemini,
  Zoom, DaVinci Resolve, TikTok, Meta e Google Ads.
- Versão `13.0.0`: Canva, OpenAI e Slack.
- Versão `11.15.0`: Microsoft Word, Microsoft PowerPoint, Microsoft Excel e
  Adobe Acrobat Reader.
- Licença do acervo: https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md
- Remotion: símbolo vetorial do repositório oficial, revisão
  `670b222bf46c4d73e590f0995c28b7dc43221953`, arquivo
  `packages/brand/public/logo/remotion/logo.svg`. Caminhos e cores preservados,
  com ajuste proporcional ao espaço de 24 × 24 do componente.
- CapCut: símbolo extraído do SVG do cabeçalho de https://www.capcut.com/
  em 7 de setembro de 2026. Foram preservados os subcaminhos do símbolo,
  separados do nome que a página já apresenta em texto, e aplicada escala proporcional.

As marcas continuam pertencendo aos respectivos titulares. Novos assets devem
ter origem identificável; não desenhar logos aproximados nem alegar integração
nativa com base apenas na presença de um ícone.

## Por que contratar a Mescla se o cliente já usa IA?

A Home apresenta o diferencial como trabalho coletivo: várias pessoas podem
compartilhar um ou mais agentes, apoiadas na memória da empresa. A comparação
é entre uso individual e uso organizado em equipe, não entre limites universais
de fornecedores. A implantação continua como meio de colocar esse modelo em uso.
Cada landing page concretiza o compartilhamento para os papéis do seu público.

Memória corporativa significa fontes, modelos, processos e decisões que a empresa
escolhe registrar. Não pressupõe captura automática de conversas pessoais nem
acesso indiscriminado. A implantação define responsáveis, atualização, acesso e
separação por equipe, cliente ou projeto conforme os limites da plataforma.

A conta de IA pode ser suficiente para alguns visitantes; a FAQ reconhece isso.
Não apresentar ChatGPT, Claude ou Gemini como ferramentas que apenas respondem
perguntas: elas já oferecem recursos de contexto e integrações. Também não
atribuir à Mescla exclusividade de agentes, automação ou trabalho em equipe.

O primeiro projeto deve comparar esforço de preparação e revisão, qualidade e
entregas aprovadas. O site não publica percentuais de produtividade sem evidência.

Referências consultadas em 6 de setembro de 2026:
- ChatGPT Projects: https://help.openai.com/en/articles/10169521
- Apps no ChatGPT: https://help.openai.com/en/articles/11487775-apps-in-chatgpt
- Claude Connectors: https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities
- Gemini e Workspace: https://knowledge.workspace.google.com/admin/generative-ai/gemini-app/turn-google-apps-in-gemini-on-or-off
