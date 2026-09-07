# Infográficos Mescla

Seis composições de 15 segundos em Remotion: Home, empreendedores, creators,
consultorias, agências e advocacia. As cenas usam profundidade CSS e marcas
locais; o Player apresenta a animação diretamente no site.

- `npm ci`: instala as versões do lockfile.
- `npm run build:web`: gera o módulo estático em `../assets/infographics.js`.
- `npm run check`: verifica TypeScript.
- `node check.mjs`: verifica estados das seis composições sem navegador.
- `npm run dev -- --no-open`: abre o Studio para editar as composições.

`src/Infographic.tsx` define as cenas e `src/player.tsx` define reprodução,
seleção de etapas, pausa fora da tela e preferência de movimento reduzido.
`../content/motion-scenes.json` contém rótulos e descrições compartilhados com
a versão estática acessível. Não são dados ou resultados de clientes.

O build geral do site chama `build:web` antes de gerar as páginas e seu pacote
público. As dependências de desenvolvimento, o Studio e os fontes não entram
no site publicado. As licenças do runtime acompanham o módulo.

Remotion: https://www.remotion.dev/docs/player
Licença: https://www.remotion.dev/license
