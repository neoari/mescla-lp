# Medição do funil da Mescla

## Estado implementado

As páginas mantêm a origem da campanha durante a navegação e preparam eventos
no `dataLayer`. Os links para WhatsApp incluem o segmento, a versão da página e
as UTMs. O visitante revisa e envia a mensagem. Não há gravação das respostas
em um banco de leads do site.

O contêiner `GTM-PSBP9DGT` envia ao GA4 `G-RYVJGFER3S` as visitas e os seis
eventos abaixo, somente após o visitante permitir a medição. A tag base dispara
na inicialização e uma tag de eventos aceita somente esses seis nomes.

Captura automática de formulários, cliques de saída e dados fornecidos pelo
usuário está desativada. Assim, a URL do WhatsApp com respostas não é coletada
como evento automático. Google Signals e personalização de anúncios ficam
desativados; o consentimento de publicidade permanece negado.

PostHog, Meta Pixel, Google Ads e gravação de sessões não estão ativados.
Não configurar eventos de intenção como conversões de venda ou lead recebido.

## Eventos preparados no site

| Evento | Significado | Uso inicial |
| --- | --- | --- |
| `mescla_home_view` | Home carregada | Aquisição |
| `mescla_segment_open` | Card de segmento clicado | Interesse por público |
| `mescla_landing_view` | Landing page carregada | Entrada do funil |
| `mescla_contact_intent` | CTA que leva ao contato clicado | Microconversão |
| `mescla_qualification_start` | Primeiro campo de qualificação alterado | Microconversão |
| `mescla_whatsapp_open` | Link ou formulário direcionou ao WhatsApp | Microconversão, sem confirmação de envio |

Propriedades comuns: `event_id`, `segment`, `page_path`, `page_version`, UTMs.
No formulário: `team_size` e `interest_code`, sempre valores enumerados.
Nunca enviar o texto livre do resultado desejado para ferramentas analíticas.

## Conversões que dependem de confirmação

Não estão implementadas no site estático:

| Marco sugerido | Evidência necessária |
| --- | --- |
| `lead_received` | Mensagem recebida ou cadastro persistido |
| `interview_booked` | Agendamento confirmado pelo backend/webhook |
| `interview_completed` | Entrevista realizada, registrada pela equipe |
| `pilot_qualified` | Critérios de qualificação atendidos |
| `pilot_sold` | Contratação confirmada |

Uma confirmação de agendamento precisa de um ID estável. Reentregas de webhook
e recarregamentos não podem gerar novas conversões. Cancelamento e remarcação
devem atualizar o mesmo registro. Identificadores de anúncio necessários para
atribuição devem seguir até esse registro conforme as escolhas de medição.
O fluxo atual para WhatsApp não faz essa ligação automaticamente.

## Campanhas

Usar nomes consistentes e manter o segmento explícito:

```text
/para/creators/?utm_source=meta&utm_medium=paid_social&utm_campaign=validacao_creators_v1&utm_content=video_rotina_01
/para/consultorias/?utm_source=google&utm_medium=cpc&utm_campaign=validacao_consultorias_v1&utm_content=pesquisa_proposta_01
```

O código preserva `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`,
`utm_term`, `utm_id`, `gclid`, `gbraid`, `wbraid` e `fbclid` na navegação interna.
A cópia em `sessionStorage` expira após 30 minutos. Uma nova campanha substitui
a anterior. IDs de clique não são colocados na mensagem de WhatsApp.

As UTMs são referências de origem, não prova independente de atribuição. Visitas
diretas, bloqueadores e recusas de medição devem aparecer nas limitações da análise.

## Consentimento e manutenção

O código só carrega GTM após aceitação. Recusar mantém o contato disponível.
A preferência pode ser alterada no rodapé; retirar a permissão remove os cookies
GA deste domínio e recarrega a página sem o coletor. A versão da preferência é
`2026-11-ga4-v1`. Scripts de configuração e medição recebem versão por hash no build.

Somente IDs públicos ficam no front-end. As credenciais de leitura dos relatórios
ficam fora deste repositório. Antes de ampliar a coleta ou ativar anúncios,
revisar as tags, o consentimento e o aviso de privacidade.

Validar em produção: nenhuma requisição GTM/GA antes da permissão ou após recusa;
uma tag base por página depois da permissão; eventos recebidos sem texto livre;
e nenhum clique tratado como mensagem recebida, reunião ou venda.

## Fontes consultadas

- [PostHog Marketing Analytics](https://posthog.com/docs/web-analytics/marketing-analytics)
- [PostHog: Google Ads](https://posthog.com/docs/cdp/destinations/google-ads)
- [PostHog: Meta Ads](https://posthog.com/docs/cdp/destinations/meta-ads)
- [Google: conversões do Analytics no Google Ads](https://support.google.com/google-ads/answer/2375435?hl=en)
