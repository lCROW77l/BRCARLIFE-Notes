# BR CAR LIFE — site e notas públicas

BR CAR LIFE é um jogo de arrancada 2D em desenvolvimento pela **CROW77 Projects**. Este repositório contém o site público do projeto: uma apresentação do carro de referência, dos sistemas em construção e do progresso divulgado à comunidade.

**O código-fonte do jogo não está neste repositório.** As interações do site são demonstrações de apresentação e não revelam nem reproduzem os parâmetros internos da física do jogo.

## Acompanhe o projeto

- [Site oficial](https://lcrow77l.github.io/BRCARLIFE-Notes/)
- [O jogo](https://lcrow77l.github.io/BRCARLIFE-Notes/jogo.html): motor, transmissão, rodas, dinâmica, cabine e áudio em páginas separadas.
- [Status dos recursos](https://lcrow77l.github.io/BRCARLIFE-Notes/fenomenos.html): o que já existe no projeto, o que está em desenvolvimento e o que está previsto.
- [Diário de desenvolvimento](https://lcrow77l.github.io/BRCARLIFE-Notes/devlog.html): marcos e direções de trabalho, sem datas de lançamento prometidas.
- [Canal no YouTube](https://www.youtube.com/channel/UCXaQCiopvvrpPMqWYJalVgg)

O jogo está em **pré-alfa**. Um recurso presente no código pode depender de configuração, integração e validação antes de aparecer numa versão jogável. Efeitos visuais ou sonoros aproximados são apresentados como tal.

## Estrutura

As páginas HTML na raiz compõem o site. `jogo.html` organiza as áreas do projeto; `cabine.html` apresenta os painéis dos veículos, incluindo o painel universal previsto; `camera.html` trata dos efeitos visuais de condução. As rodas usam um atlas único (`roda.webp`, `roda-n.webp`, `roda-m.webp`) desenhado por `wheel.js`; as peças originais do jogo não são publicadas. A pasta `assets/` contém estilos, interações próprias do site e imagens usadas na apresentação. O conteúdo público foi escrito para comunicar resultados e estágio de desenvolvimento, sem publicar fórmulas, parâmetros de calibração ou código interno do jogo.

## Direitos e uso

**Código deste site:** proprietário, com todos os direitos reservados. Não é software de código aberto e não há autorização geral para copiar, modificar, redistribuir ou incorporar o código em outros projetos.

**Textos, imagens, identidade visual, áudio e demais conteúdos:** todos os direitos reservados, salvo indicação expressa em contrário. Não há autorização geral para reprodução, redistribuição ou uso comercial.

A publicação neste repositório permite visualização e as operações oferecidas pelo GitHub conforme seus termos; ela **não concede uma licença adicional de reutilização**. Direitos de marcas ou materiais de terceiros permanecem com seus respectivos titulares. Para qualquer uso além do permitido pela plataforma ou pela legislação aplicável, solicite autorização prévia por escrito à CROW77 Projects.

Veja o [aviso de direitos completo](LICENSE.md).
