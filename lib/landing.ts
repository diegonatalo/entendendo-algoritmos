import { binarySearch } from "@/lib/binary-search";
import { chapters } from "@/lib/chapters";

/** Textos da landing (`/`). As seções ficam em `components/landing/`. */

export const HERO = {
  kicker: "Visualizações do livro Entendendo Algoritmos",
  titleStart: "Algoritmo no papel é abstrato.",
  titleMarked: "Em movimento",
  titleEnd: ", faz sentido.",
  subtitle:
    "Mude a entrada, avance passo a passo e veja cada decisão acontecer: da busca binária ao Dijkstra, da tabela hash à programação dinâmica.",
  note: "Sem cadastro · funciona no celular · código aberto",
};

export type Step = { title: string; text: string };

export const STEPS: Step[] = [
  { title: "Escolha um algoritmo", text: "Organizados como os capítulos do livro, do mais simples ao mais avançado." },
  { title: "Mude a entrada", text: "Troque os números, o alvo ou o grafo e veja o resultado mudar junto." },
  { title: "Avance passo a passo", text: "Cada passo mostra o que o algoritmo olhou e por que decidiu assim." },
];

export const PERKS: Step[] = [
  { title: "Simples", text: "A ideia com uma analogia do dia a dia." },
  { title: "Técnica", text: "Como funciona, quanto custa e onde falha." },
  { title: "Código", text: "A implementação ao lado da visualização." },
];

export type Question = { question: string; answer: string };

export const FAQ: Question[] = [
  {
    question: "Preciso ter o livro?",
    answer:
      "Não. Cada página traz a explicação simples, a técnica e o código. Com o livro ao lado, você acompanha capítulo por capítulo.",
  },
  {
    question: "Preciso saber programar?",
    answer: "Para mexer nas visualizações, não. O código em JavaScript fica à disposição para quem quiser ir além.",
  },
  { question: "Tem cadastro ou custo?", answer: "Não. É só abrir no navegador, no computador ou no celular." },
  { question: "O código do projeto é aberto?", answer: "Sim. O código-fonte está no GitHub, com o link no rodapé." },
];

/** Quantos capítulos do livro têm visualização. */
export const chapterCount = () => new Set(chapters.map((c) => c.number)).size;

export type Stat = { value: string; label: string };

/** Os números da faixa logo abaixo do hero. */
export const stats = (): Stat[] => [
  { value: String(chapterCount()), label: "capítulos do livro" },
  { value: String(chapters.length), label: "visualizações interativas" },
  { value: String(PERKS.length - 1), label: "níveis de explicação" },
  { value: "0", label: "cadastros para usar" },
];

/** No máximo quantas tentativas a busca binária precisa numa lista de `n` itens. */
export const maxAttempts = (n: number) => (n > 0 ? Math.floor(Math.log2(n)) + 1 : 0);

export type DemoStep = {
  /** Primeira e última posição ainda em jogo. */
  start: number;
  end: number;
  middle: number;
  value: number;
  found: boolean;
  /** O que o passo decide, em uma linha. */
  verdict: string;
};

export const DEMO_LIST = [3, 8, 12, 17, 23, 29, 31, 37, 42, 50, 56, 61, 68, 74, 80, 91];
export const DEMO_TARGET = 42;

/** Os passos da busca binária que o hero anima, com a decisão de cada um. */
export const searchDemo = (list: number[] = DEMO_LIST, target: number = DEMO_TARGET): DemoStep[] =>
  binarySearch(list, target).steps.map((step) => {
    const start = list.indexOf(step.currentArray[0]);
    const end = start + step.currentArray.length - 1;
    const value = step.middleValue;
    const found = value === target;
    const verdict = found
      ? `${value} = ${target} → encontrado no ${step.attempt}º passo`
      : value < target
        ? `${value} é menor que ${target} → a metade da esquerda sai da busca`
        : `${value} é maior que ${target} → a metade da direita sai da busca`;
    return { start, end, middle: step.middle, value, found, verdict };
  });

/** O exemplo da seção de níveis: a busca binária contada de três jeitos. */
export const LEVEL_EXAMPLE = {
  simple: {
    lead: "Pense num dicionário.",
    text: "Você não lê página por página. Abre no meio, vê se a palavra vem antes ou depois e descarta metade. Repete até achar.",
    note: `Com 1.000 páginas, bastam ${maxAttempts(1000)} aberturas.`,
  },
  technique: {
    lead: "O(log n) comparações.",
    text: "A cada passo o intervalo cai pela metade: n itens pedem no máximo ⌊log₂ n⌋ + 1 comparações. Só funciona em lista ordenada, e ordenar custa O(n log n).",
    samples: [
      { label: "n = 100", value: maxAttempts(100) },
      { label: "n = 10⁶", value: maxAttempts(1_000_000) },
      { label: "n = 10⁹", value: maxAttempts(1_000_000_000) },
    ],
  },
};
