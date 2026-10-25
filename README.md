# BR CAR LIFE | Site oficial (CROW77 Developments)

Site estático (HTML, CSS e JS puros). Sem build, sem dependências.

## Publicar no GitHub Pages
1. Crie um repositório e envie estes arquivos na raiz (`index.html` e a pasta `assets`).
2. Em **Settings > Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Aguarde alguns minutos: o site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

## O que editar
- Links de Discord, Steam e GitHub: seção `#estudio` em `index.html` (o link do Discord é um exemplo).
- Linha do tempo: lista `.tl` na seção `#devlog`. Use as classes `ok` (feito) e `now` (em andamento).
- Rádios: seção `#radio`. Quando a feature estiver pronta, troque o bloco por um player.
- Cores e fontes: variáveis no topo de `assets/style.css`.

## Acessibilidade
Link de pular conteúdo, navegação por teclado, foco visível, contraste alto nos temas claro e escuro,
`prefers-reduced-motion` respeitado, alvos de toque de 44 px ou mais e texto que quebra linha sem cortar.
