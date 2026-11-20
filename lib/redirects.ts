import type { NextConfig } from "next";

export type Redirect = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>[number];

/**
 * Capítulos que ficavam na raiz antes da landing. A lista é escrita aqui (o `next.config.ts`
 * não carrega `lib/chapters.ts`); `lib/moved-pages.test.ts` confere que ela bate com os capítulos.
 */
export const MOVED_PAGES = ["algoritmo-guloso", "arrays-listas", "bellman-ford", "big-o", "busca-binaria", "busca-em-largura", "caixas-recursao", "caixeiro-viajante", "calendario-aulas", "constantes-big-o", "dijkstra", "dijkstra-trocas", "dividir-conquistar", "filtro-spam", "knn", "knn-regressao", "ocr-knn", "ordenacao-selecao", "ordenacao-topologica", "programacao-dinamica", "proximos-passos", "quicksort", "quicksort-mesclagem", "recomendacao-filmes", "recursao", "roteiro-londres", "subcadeia-comum", "tabela-hash", "usos-tabela-hash"];

/**
 * Redirecionamentos do projeto, lidos pelo `next.config.ts` (que é igual em todos os projetos).
 * Os capítulos saíram da raiz para `/app` quando a landing entrou em `/`.
 */
export const REDIRECTS: Redirect[] = MOVED_PAGES.map((slug) => ({
  source: `/${slug}`,
  destination: `/app/${slug}`,
  permanent: true,
}));
