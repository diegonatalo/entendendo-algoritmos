import { chapters, type Chapter } from "@/lib/chapters";

/** Textos da landing (`/`). As seções ficam em `components/landing/`. */

export const HERO = {
  kicker: "Visualizações do livro Entendendo Algoritmos",
  title: "Algoritmo no papel é abstrato. Em movimento, faz sentido.",
  subtitle:
    "Os capítulos do livro viram visualizações interativas: você muda a entrada, avança passo a passo e vê cada decisão acontecer, da busca binária ao Dijkstra e à programação dinâmica.",
};

export type Step = { title: string; text: string };

export const STEPS: Step[] = [
  { title: "Escolha um algoritmo", text: "Organizados pelos capítulos do livro, do mais simples ao mais avançado." },
  { title: "Mude a entrada", text: "Troque os números, o alvo ou o grafo e veja o resultado mudar junto." },
  { title: "Avance passo a passo", text: "Cada passo mostra o que o algoritmo olhou e por que decidiu assim." },
];

export const PERKS: Step[] = [
  { title: "Explicação em dois níveis", text: "Uma versão simples, com analogia, e outra detalhada." },
  { title: "Código para consultar", text: "A implementação de cada algoritmo ao lado da visualização." },
  { title: "Sem cadastro", text: "Abre no navegador, no computador ou no celular." },
];

/** Páginas mostradas na landing. */
export const FEATURED_HREFS = ["/app/busca-binaria", "/app/quicksort", "/app/dijkstra"];

export const featuredChapters = (): Chapter[] =>
  FEATURED_HREFS.map((href) => chapters.find((c) => c.href === href)).filter((c): c is Chapter => Boolean(c));

/** Quantos capítulos do livro têm visualização. */
export const chapterCount = () => new Set(chapters.map((c) => c.number)).size;
