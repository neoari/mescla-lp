# Medição do funil da Mescla

## Estado implementado

As páginas mantêm a origem da campanha durante a navegação e preparam eventos
no `dataLayer`. Os links para WhatsApp incluem o segmento, a versão da página e
as UTMs. O visitante revisa e envia a mensagem. Não há gravação das respostas
em um banco de leads do site.

O container GTM ainda precisa ser identificado. PostHog, GA4, Meta Pixel e as
conversões de Google Ads **não estão ativados por este código**. Eventos no
`dataLayer` só serão coletados depois de uma integração real.

## Stack proposta

- GTM existente: distribuição e controle das tags.
- PostHog: comparação de segmentos e funis. Marketing Analytics permite conectar
  custos de Meta e Google Ads, mas é uma funcionalidade opt-in em beta.
- GA4: análise do tráfego e integração com Google Ads.
- Conversões confirmadas: encaminhar ao Google Ads e à Meta a partir do sistema
  que confirma a ação, com identificadores consistentes para deduplicação.

Escolher uma única origem primária por conversão no Google Ads. Não somar a
mesma conversão via tag nativa e importação do GA4. Meta Pixel e CAPI exigem
deduplicação da mesma ação com `event_name` e `event_id` correspondentes.

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

## Ativação

1. Identificar o GTM existente e conferir suas tags publicadas.
2. Criar ou reutilizar os projetos e propriedades de analytics da Mescla.
3. Definir quais eventos cada destino recebe; desabilitar captura automática de
   campos de formulário e de texto livre. Revisar também URLs e replays.
4. Atualizar privacidade e configurar consentimento antes de ativar as tags.
5. Configurar apenas identificadores públicos no front-end. Tokens de CAPI,
   credenciais de calendário e chaves privadas ficam no servidor.
6. Validar recebimento dos eventos e conversões, ausência de duplicatas e o
   comportamento ao aceitar ou recusar a medição.

O código só carrega GTM após aceitação, quando existe um ID válido. O contato
funciona sem aceitar. Sem ID, não mostra um pedido de consentimento inútil.

## Fontes consultadas

- [PostHog Marketing Analytics](https://posthog.com/docs/web-analytics/marketing-analytics)
- [PostHog: Google Ads](https://posthog.com/docs/cdp/destinations/google-ads)
- [PostHog: Meta Ads](https://posthog.com/docs/cdp/destinations/meta-ads)
- [Google: conversões do Analytics no Google Ads](https://support.google.com/google-ads/answer/2375435?hl=en)
