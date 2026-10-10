# Diferencial Capoeira

Landing page original, estática, responsiva, sem dependências de build. A publicação usa `dist/`.

O deploy atual é realizado pelo Sites e não exige workflow do GitHub. A imagem atual do hero é `dist/assets/capoeira-hero.webp`, otimizada a partir de `capoeira.jpeg`, com o crédito a Maria Buzanovsky preservado na legenda.

## Configuração de contato

O WhatsApp oficial `(31) 99363-9073` já está configurado em `dist/config.js`, com DDI e DDD. Os CTAs abrem a conversa com uma mensagem pronta. O treino coletivo está apresentado às terças e quintas, das 19h30 às 21h. Treinos individuais são combinados com Mestre Carcará. O endereço e o link de localização são os fornecidos pelo responsável. Para alterar informações, atualize `dist/config.js` e os textos visíveis correspondentes em `dist/index.html`.

## Estrutura e acessibilidade

HTML, CSS e JavaScript locais; fotos otimizadas em WebP; fontes locais. Menu móvel, FAQ nativo, diálogo acessível e botão persistente no celular. O hero ocupa toda a largura e ao menos uma tela de altura (`100svh`), sem margem ou recorte. O menu fica sobre a foto e ganha fundo claro após o início da rolagem. Telas curtas podem expandir a altura para preservar todo o conteúdo. Os títulos usam Patua One, mantendo fonte simples nos textos. `refinements.css` contém os hovers com iluminação suave, sombra e movimento mínimo das setas, além dos sublinhados progressivos dos links.

Após o hero, as fotos de arquivo se deslocam em sentidos opostos durante a rolagem; uma interpolação baseada no tempo suaviza esse movimento e termina quando as posições se estabilizam. Os textos entram em uma sequência suave de 850 ms e deslocamento de 16 px. A foto de reconhecimento mantém o zoom sutil de até 3,5%. Não há bloqueio da rolagem nem texto escondido caso as animações não sejam suportadas. A preferência de movimento reduzido cancela as animações e mantém as imagens estáticas.

As imagens históricas e a imagem de abertura foram fornecidas como referências de capoeira. Os registros de reconhecimento, roda e grupo são os arquivos enviados do Diferencial. Os retratos foram preparados com image_gen a partir das imagens fornecidas. O logotipo foi mantido.

Horários, telefone, preços, depoimentos e números de impacto não foram inventados.
