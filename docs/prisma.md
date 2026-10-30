# Prisma — apresentação pública

Página em `/prisma/`, com curadoria de André de Moraes, seis especialistas, método, exemplo ilustrativo e três contatos distintos: futuro piloto gratuito, implantação e aprendizagem. A Home aponta para a página. Nenhuma sessão de análise nem inscrição automática foi implementada.

Fonte: `scripts/prisma_page.py`, `assets/prisma.css` e catálogo editorial `content/prisma-specialists.json`. Catálogo derivado do projeto Prisma v2; nenhuma fonte privada entra no pacote público.

Validação: oito páginas com links e IDs; build determinístico; allowlist de 28 arquivos no build e no inicializador; sintaxe JS/shell e atribuição. Revisão visual em 1200px e 390px, sem overflow horizontal. Expansão de perfil verificada no navegador, bem como mensagens distintas para os três CTAs.

Publicação exige atualizar a allowlist no comando do Compose além de fixar o commit: o pacote passa a incluir `prisma/index.html` e `assets/prisma.css`.
