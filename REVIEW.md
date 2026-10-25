# Revisão técnica: BR CAR LIFE (CROW77 Projects)

Auditoria feita em navegador automatizado (Chromium) nas 6 páginas. Não substitui testes em aparelhos reais nem com leitor de tela.

## Corrigido nesta rodada
- **Header preto:** as luzes do fundo eram cortadas na borda do hero. Agora o fundo é uma camada única da página e o header fica integrado.
- **Pneus sem contraste:** pneu com contorno claro, brilho e halo na cor do acento (contorno 5,7:1 contra o fundo; o mínimo WCAG para elementos gráficos é 3:1). Vale também para a garagem e a largada em `rodas.html`.
- **Nome:** "CROW77 Projects" no header, rodapé, alt e README.
- **Contact patch:** o valor da garagem estava irreal (~440 mm). Agora ~235 mm.

## Acessibilidade (WCAG 2.2)
| Item | Resultado |
|---|---|
| Idioma, 1 h1 por página, sem salto de nível de título | OK (corrigido o salto em `devlog.html`) |
| Landmarks (header, nav, main, footer), links e botões com nome | OK |
| Imagens com alt (decorativas com alt vazio) | OK |
| Foco visível ao navegar por Tab | 0 falhas em ~13 paradas por página |
| Alvos de toque | OK (só um link dentro de parágrafo, que é exceção) |
| Contraste de texto | 8,5:1 a 17,9:1 (mínimo AA: 4,5:1) |
| Sem rolagem lateral em 320, 390, 768 e 1366 px | OK |
| `prefers-reduced-motion` | Transição, partículas, carro e faixa desligados |
| **Pausar animações (novo)** | Botão no header, lembra a escolha (WCAG 2.2.2: movimento por mais de 5 s precisa de pausa) |
| Termos em inglês | Marcados com `lang="en"` para o leitor de tela pronunciar certo |
| Modo de alto contraste do Windows | Regras de borda e foco adicionadas |

## Desempenho
- Primeira carga da home: ~540 KB (sem fontes); páginas internas: ~140 KB.
- Imagens: o logo de 16 MB virou 268 KB, com versão de 640 px (~90 KB) para telas pequenas. Roda do carro com versão de 256 px. Todas com width e height (sem salto de layout).
- A imagem principal e a textura do carro são pré-carregadas; a logo tem `fetchpriority="high"`.
- A transição de página e as entradas foram encurtadas (menos tempo com a tela coberta).
- WebGL: só desenha quando o carro está na tela e limita a 30 quadros por segundo em celulares. Se o WebGL falhar, ou o contexto for perdido, o carro simples aparece no lugar.
- CSS: 13 regras sem uso removidas.

## Segurança
- Política de conteúdo (CSP) por meta tag: scripts só do próprio site (o script inline é liberado por hash), sem requisições para terceiros além das fontes do Google. Nenhuma violação nas 6 páginas.
- Sem formulários, cookies ou rastreadores.

## Pendências (precisam de você ou de rede)
1. **Fontes:** hoje vêm do Google Fonts. Para privacidade (LGPD) e velocidade, baixe Anton e Barlow, ponha em `assets/fonts/` e troque o `<link>` por `@font-face` (e ajuste a CSP, removendo os domínios do Google).
2. **Prévia em redes sociais:** `og:image` precisa de URL absoluta. Adicione quando o endereço final existir. Faça o mesmo com `<link rel="canonical">` e um `sitemap.xml`.
3. **Foto de fundo:** defina `--foto:url(img/fundo.jpg)` em `:root` do `style.css` e coloque a imagem (comprima em WebP, até ~200 KB).
4. **Testes reais:** rode o Lighthouse e o PageSpeed no endereço publicado, e teste com NVDA ou VoiceOver e em um celular de entrada.
5. **Página 404:** funciona na raiz do site; em subpastas profundas os caminhos relativos podem quebrar (o site não tem subpastas).

## Stack: ficar no HTML, CSS e JS puros ou migrar?
**Recomendação: ficar como está por enquanto.** O site é pequeno, não precisa de build, carrega rápido e o GitHub Pages serve direto. Trocar agora só adicionaria complexidade para uma pessoa só.
- **Three.js ou PixiJS para o carro:** não vale. O carro é um único quadro com iluminação por normal map (~60 linhas de WebGL). Essas bibliotecas pesariam centenas de KB para fazer o mesmo.
- **GSAP/ScrollTrigger:** só se você quiser cenas de rolagem bem mais longas. O que existe hoje (CSS e IntersectionObserver) cobre o necessário.
- **Astro (quando o devlog crescer):** a dor real do projeto é o cabeçalho e o rodapé repetidos nas páginas. Quando você tiver vários posts com fotos e vídeos, migre para o Astro: posts em Markdown, imagens otimizadas automaticamente e layout compartilhado. O deploy no GitHub Pages usa as ações oficiais `withastro/action` e `actions/deploy-pages`. O WebGL e o CSS atuais seguem funcionando como estão.
- **View Transitions nativas:** uma opção futura para trocar a faixa de transição manual. Segundo um guia de 2025, já funcionam entre páginas no Chrome 126+, no Safari e no Firefox 144+. Confirme o suporte antes de adotar.
- **Vídeos:** hospede no YouTube (com `youtube-nocookie.com`) ou mantenha cada arquivo pequeno. O GitHub Pages tem limites de uso: veja a documentação oficial.
