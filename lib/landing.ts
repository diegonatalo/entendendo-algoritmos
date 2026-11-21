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

/** Quantos capítulos do livro têm visualização. */
export const chapterCount = () => new Set(chapters.map((c) => c.number)).size;

export type TocEntry = { number: number; pages: Chapter[] };

/** Sumário: as páginas agrupadas pelo capítulo do livro, na ordem de `lib/chapters.ts`. */
export const tableOfContents = (): TocEntry[] => {
  const entries: TocEntry[] = [];
  for (const page of chapters) {
    const last = entries.at(-1);
    if (last && last.number === page.number) last.pages.push(page);
    else entries.push({ number: page.number, pages: [page] });
  }
  return entries;
};
