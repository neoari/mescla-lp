# mescla.ai — site e páginas por segmento

Repositório **público**. Nunca incluir coordenadas de infraestrutura, IDs de
contas, IPs, credenciais ou dados de contatos. A infraestrutura fica no
repositório privado `neoari/mescla`.

## Fontes e build

- `content/home.html`: fonte da Home (template versionado). `scripts/home_v3.py` só acrescenta `?v=` aos
  assets locais; `index.html` é gerado pelo build. Não editar `index.html` à mão.
- `assets/home.css`, `assets/fiandeiros.js` (personagens e cenas em SVG, textura de lã) e `assets/home.js`
  (conversa das 21h47, matriz, etiqueta, espinha, botão fixo do celular): só a Home usa.
- `content/theme.css`: tema das páginas /para e /privacidade (era o primeiro `<style>` da Home antiga).
- `content/segments.json`: conteúdo das cinco landing pages.
- `content/segment-details.json`: promessas, ferramentas, exemplos de valor e
  critérios de avaliação específicos de cada segmento.
- `scripts/segment_visuals.py`: composições próprias de cada público e ícones.
- `assets/icons/`: fontes SVG incorporadas no HTML pelo build; créditos em
  `docs/landing-pages.md`.
- `assets/segments.css`: estilos das páginas e dos cards.
- `assets/measurement.js`: atribuição de campanha, contato e eventos.
- `assets/measurement-config.js`: configuração pública; integrações inativas
  enquanto os respectivos valores não estiverem definidos e revisados.
- `scripts/build-site.py`: atualiza os cards, gera as landing pages, a página de
  privacidade e o pacote determinístico `site.tar.gz`.

Não editar diretamente os HTMLs em `index.html`, `para/` e `privacidade/`: são gerados.

```bash
python3 scripts/build-site.py
python3 scripts/check-site.py
node --check assets/measurement.js assets/home.js assets/fiandeiros.js assets/experience.js
node scripts/check-attribution.cjs
sh -n scripts/container-start.sh
git diff --check
```

O build usa apenas a biblioteca padrão do Python, mais `npm ci --prefix motion` (gera
`assets/infographics.js`, usado pelas /para). A validação HTML usa `lxml`.
O pacote público contém apenas as páginas e assets da allowlist em `scripts/public_bundle.py`;
documentação e fontes de geração não são servidas pelo site. A lista e a ordem precisam ser
idênticas a `mescla_expected` em `scripts/container-start.sh` (o check compara); mudar a lista exige
atualizar o Compose privado.

## Publicação

A branch `main` é a fonte publicada. No início do container, o comando de
`scripts/container-start.sh` baixa `site.tar.gz` do GitHub, valida os caminhos e
os arquivos esperados e substitui o site completo. Se o download falhar, mantém
a última cópia completa no volume. Um push sozinho não atualiza o site.

1. Gerar, validar, revisar e enviar os arquivos exatos da mudança para `main`.
2. Confirmar que o pacote disponível no GitHub corresponde ao build local.
3. Definir `MESCLA_SITE_REF` no Compose privado com o commit validado e recriar
   apenas o serviço do site. A URL imutável evita o cache da branch no GitHub.
4. Confirmar HTTP 200, conteúdo esperado e atualização do `Last-Modified` na
   Home, nas landing pages e nos assets.

`Last-Modified` sozinho não comprova a versão: comparar também um conteúdo ou
marcador da alteração. A Cloudflare pode ofuscar e-mails no HTML; isso não é
necessariamente divergência de fonte.

Mudanças no comando de inicialização exigem atualizar o Compose privado e
recriar somente o serviço do site. Fazer backup da configuração anterior e
validar o Compose antes. Escapar `$` como `$$` ao incorporar o script no Compose.
Não reiniciar outros serviços nem alterar o Traefik para uma publicação estática.
O script aceita `main` como fallback quando `MESCLA_SITE_REF` não foi definido.

## Medição e validação

Ver `docs/medicao.md` e `docs/validacao.md`. Abrir WhatsApp é uma intenção de
contato; nunca registrar esse clique como entrevista agendada ou venda.
Não incluir respostas livres, nomes, telefones ou e-mails nos eventos analíticos.
Ativar um coletor exige revisar suas tags e atualizar o aviso de privacidade.

## Home (nov/2026)
- Âncoras usadas por links externos: `#diagnostico` (bio, YouTube, /prisma) e `#metodo`. As /para voltam
  para `/#aplicacoes`. `assets/home.js` realinha a âncora depois que as fontes carregam.
- Todo botão de WhatsApp tem `data-contact`, `data-contact-message` e `data-placement`: `measurement.js`
  reescreve o link a partir de `data-contact-message`. Diagnóstico: "Quero o diagnóstico gratuito da Mescla.".
  `data-page-version` aparece na mensagem do cliente: manter neutro (`home-AAAA-MM-DD`).
- Consentimento: um mecanismo só, o de `measurement.js`. A Home fornece o aviso compacto
  (`[data-measurement-consent]` com `[data-consent="yes|no"]`) e o botão do rodapé
  (`[data-measurement-manage]`); GTM só carrega depois de "Permitir". Outras páginas usam o aviso padrão.
- Diagnóstico: "por escrito ou em áudio", resposta "em poucos minutos". Nunca prazo em número.
- Fiandeiros só na textura de lã. Movimento reduzido mostra o último quadro de cada cena.

## /prisma/ (redirecionamento)
O nome Prisma foi abolido em 08/11/2026: a marca é só Mescla. `/prisma/` existe apenas como redirecionamento para `/#diagnostico` (gerado em `scripts/build-site.py`), para não quebrar links antigos. Não criar páginas, seções, textos ou produtos com o nome Prisma. `scripts/check-site.py` recusa "prisma", "neoari", "Mescla.AI" e "Mescla AI" em qualquer HTML, CSS ou JS publicado (exceto o redirecionamento).

Saíram do pacote em 08/11/2026 (Home nova): `assets/prisma.css`, `assets/platforms/*`, `assets/ribbon-scene.js`
e `assets/vendor/three-0.185.1/*` (a cena 3D era só da Home antiga), com `scripts/home_v2.py`,
`scripts/home_sections.py` e `scripts/check-motion.mjs`.

## Porta de entrada (nov/2026)
Todo contato das páginas /para começa por "Quero o diagnóstico gratuito da Mescla." (`contact_message` em `scripts/build-site.py`, gravado em `data-contact-message` no link e no formulário; `assets/measurement.js` usa a mesma frase como padrão). Não prometer número, prazo ou preço. Não usar "clareza" nem "pessoas e agentes trabalhando juntos" nas páginas da Mescla (são de outra marca).
