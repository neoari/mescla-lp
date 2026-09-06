# mescla.ai — site e páginas por segmento

Repositório **público**. Nunca incluir coordenadas de infraestrutura, IDs de
contas, IPs, credenciais ou dados de contatos. A infraestrutura fica no
repositório privado `neoari/mescla`.

## Fontes e build

- `index.html`: Home e tema compartilhado.
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

Não editar diretamente os HTMLs em `para/` e `privacidade/`: são gerados.

```bash
python3 scripts/build-site.py
python3 scripts/check-site.py
node --check assets/measurement.js
node scripts/check-attribution.cjs
sh -n scripts/container-start.sh
git diff --check
```

O build usa apenas a biblioteca padrão do Python. A validação HTML usa `lxml`.
O pacote público contém apenas as sete páginas e três arquivos de assets;
documentação e fontes de geração não são servidas pelo site.

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
