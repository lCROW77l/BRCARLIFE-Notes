# BR CAR LIFE | Site oficial (CROW77)

Site estático (HTML, CSS e JS puros), sem build e sem dependências.

## Estrutura
- `index.html`: página inicial, só com o índice das áreas do jogo.
- `rodas.html`: física de rodas, com demonstração de largada e garagem interativa.
- `suspensao.html` e `radio.html`: páginas de funcionalidades futuras.
- `devlog.html`: linha do tempo do desenvolvimento.
- `assets/`: `style.css`, `main.js` (todas as páginas) e `rodas.js` (só a página de rodas).

## Publicar no GitHub Pages
1. Suba os arquivos na raiz de um repositório.
2. Em **Settings > Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.

## Como editar
- Nova área do jogo: copie `suspensao.html`, ajuste o conteúdo, adicione na lista `.idx` de `index.html` e no menu `nav` de cada página.
- Status na linha do tempo: classes `ok` (feito) e `now` (em andamento) em `devlog.html`.
- Fotos e vídeos: troque cada bloco `.ph` ("Ainda não há mídia") por `<img>` ou `<video controls>`, sempre com texto alternativo ou legenda.
- Steam e comunidade: quando existirem, adicione os links no rodapé e na página `devlog.html`.

## Visual (v3)
- `assets/img/`: logos e peças do Gol GTI já otimizados (WebP). O carro é composto de `gol.webp` + `gol_n.webp` (normal map) e iluminado em WebGL.
- Foto de fundo: coloque uma imagem em `assets/img/fundo.jpg`. Ela aparece sozinha no fundo da página inicial, com um escurecimento por cima.
- Pré-visualização local: use um servidor (`python -m http.server`) e não abra o arquivo com duplo clique, porque o WebGL não carrega texturas via `file://`. No GitHub Pages funciona normalmente.
