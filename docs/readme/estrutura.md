```text
app/
├── <rota>/page.tsx      uma pasta por página (busca-binaria, quicksort, dijkstra…)
├── og/[slug]/route.tsx  imagem de compartilhamento (1200×630) de cada página, gerada no build
├── sitemap.ts           sitemap.xml: a home e as páginas de lib/capitulos.ts
├── robots.ts            robots.txt: libera tudo e aponta para o sitemap
├── not-found.tsx        página 404 com sugestão de páginas parecidas
└── icon.svg, favicon.ico, apple-icon.png
components/              menu lateral, explicação Simples/Técnica, bloco de código, botão de tema
lib/
├── <algoritmo>.ts       algoritmos puros em TypeScript (devolvem o resultado e cada passo)
├── capitulos.ts         lista única de páginas: menu, home, títulos e sitemap leem daqui
├── codigos/             trechos de código mostrados nas páginas, um arquivo por capítulo
├── explicacoes/         textos Simples e Técnico de cada página, um arquivo por capítulo
├── metadata.ts          título, descrição e tags Open Graph de cada rota
├── site.ts              endereço público e nome do site
└── entrada.ts           leitura e geração das listas de números dos formulários
types/                   tipos dos resultados de cada algoritmo
docs/img/                banner e capturas de tela deste README
```