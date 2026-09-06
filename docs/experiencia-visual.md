# Experiência visual da Mescla

A Home usa uma composição tridimensional de duas fitas nas cores Sol e Maré,
com referências ao encontro de pessoas e agentes. É uma interpretação da trama
da marca, não uma substituição do logo original. O asset da marca foi preservado.

A página prioriza logos de ferramentas, ícones por público e um fluxo de colaboração.
A cópia visível no elemento `main` passou de 1.390 para 875 palavras, incluindo FAQ.
As cinco páginas mantêm suas superfícies próprias: mesa de decisões, estúdio de
conteúdo, caderno de projeto, quadro de produção e índice documental.

## Bibliotecas e fontes

- Direção orientada pela skill [frontend-design da Anthropic](https://github.com/anthropics/skills/tree/main/skills/frontend-design), consultada diretamente, sem instalação global.
- [Three.js 0.185.1](https://www.npmjs.com/package/three/v/0.185.1), licença MIT.
  Módulos locais em `assets/vendor/three-0.185.1/`; versão fixada.
- [lucide-static 1.41.0](https://www.npmjs.com/package/lucide-static/v/1.41.0), licença ISC.
  SVGs incorporados no HTML durante o build, sem biblioteca de ícones no navegador.
- Marcas de ferramentas: fontes e versões em [landing-pages.md](landing-pages.md).
- Buzz: [favicon do repositório oficial](https://github.com/block/buzz/blob/main/admin-web/public/favicon.svg).
- OpenClaw: [favicon do repositório oficial](https://github.com/openclaw/openclaw/blob/main/ui/public/favicon.svg).
- Hyperagent: [ícone do site oficial](https://www.hyperagent.com/icon.svg?icon.0o5r0lv~rb9iu.svg).
- Hermes: [ícone da documentação oficial](https://hermes-agent.nousresearch.com/icon.png?icon.160vfo.zgihhn.png).

As marcas identificam ferramentas possíveis, sem indicar parceria ou integração
já implantada. A nota de avaliação das conexões permanece nas páginas.
As licenças das bibliotecas estão incluídas no pacote público.

## Movimento e carregamento

O módulo Three.js só carrega na Home, em tempo ocioso. O visitante pode pausar.
A animação para fora da área visível e em abas em segundo plano. A preferência
por movimento reduzido começa com uma cena estática; economia de dados evita
carregar o 3D. Falhas de WebGL ou de carregamento mantêm o asset original visível.
A resolução é limitada a 1,6 vezes a resolução CSS.

Nas landing pages, a perspectiva responde discretamente ao mouse em dispositivos
compatíveis. Não há interceptação de rolagem nem conteúdo oculto esperando animação.
No celular e com movimento reduzido, as superfícies ficam estáticas.

## Manutenção e verificações

`index.html` contém a Home. `scripts/experience.py` concentra os elementos visuais
compartilhados. `scripts/segment_visuals.py` gera as composições dos públicos.
`assets/experience.css`, `assets/experience.js` e `assets/ribbon-scene.js` controlam
a apresentação e o movimento. As versões dos arquivos de entrada usam hashes.

- `python3 scripts/build-site.py`: gera páginas e pacote reproduzível.
- `python3 scripts/check-site.py`: estrutura HTML, referências, formulários,
  marcas, dependências locais e lista exata de arquivos públicos.
- `node scripts/check-motion.mjs`: geometria real do Three.js e ciclo de movimento
  com renderizador simulado; enquadramento, pausa, segundo plano, preferência de
  movimento e falha de WebGL. Não é uma inspeção visual em navegador/GPU.
- `node scripts/check-attribution.cjs`: preservação de campanha e contato.

A lista pública está em `scripts/public_bundle.py` e é comparada à lista permitida
no início do container. Arquivos de infraestrutura e documentação ficam fora do site.
