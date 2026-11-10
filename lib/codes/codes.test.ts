import { describe, expect, it } from "vitest";
import { CODES } from "@/lib/codes";
import { binarySearch } from "@/lib/binary-search";
import { dijkstra } from "@/lib/dijkstra";
import { factorial } from "@/lib/factorial";
import { knapsack } from "@/lib/knapsack";
import { mergeSort } from "@/lib/merge-sort";
import { quicksort } from "@/lib/quicksort";
import { selectionSort } from "@/lib/selection-sort";

// Os trechos de código mostrados nas páginas são texto. Aqui eles são executados de
// verdade e comparados com as funções reais, para os dois não divergirem.
const load = <T>(code: string, name: string): T =>
  new Function(`${code}\nreturn ${name};`)() as T;

describe("trechos de código", () => {
  it.each(Object.entries(CODES))("%s é JavaScript válido", (_key, code) => {
    expect(() => new Function(code)).not.toThrow();
  });

  it("todos têm conteúdo", () => {
    for (const [key, code] of Object.entries(CODES)) expect(code.trim().length, key).toBeGreaterThan(20);
  });
});

describe("trechos equivalentes às funções reais", () => {
  it("busca binária", () => {
    const snippet = load<(list: number[], target: number) => number>(CODES.binarySearch, "buscaBinaria");
    const list = [1, 3, 5, 7, 9, 11, 13];
    for (const target of [0, 1, 7, 13, 14, 4]) {
      expect(snippet(list, target), String(target)).toBe(binarySearch(list, target).index);
    }
  });

  it("ordenação por seleção", () => {
    const snippet = load<(list: number[]) => number[]>(CODES.selectionSort, "ordenacaoSelecao");
    for (const input of [[], [3, 1, 2], [5, 5, 1], [9, 8, 7, 6]]) {
      expect(snippet(input)).toEqual(selectionSort(input).isSorted);
    }
  });

  it("fatorial", () => {
    const snippet = load<(n: number) => number>(CODES.factorial, "fatorial");
    for (const n of [0, 1, 5, 8]) expect(snippet(n)).toBe(factorial(n).result);
  });

  it("quicksort", () => {
    const snippet = load<(list: number[]) => number[]>(CODES.quicksort, "quicksort");
    for (const input of [[], [2, 1], [5, 3, 8, 1, 9, 2, 7], [4, 4, 1]]) {
      expect(snippet(input)).toEqual(quicksort(input).isSorted);
    }
  });

  it("merge sort", () => {
    const snippet = load<(list: number[]) => number[]>(CODES.mergeSort, "mesclagem");
    for (const input of [[], [2, 1], [5, 3, 8, 1, 9, 2, 7], [4, 4, 1]]) {
      expect(snippet(input)).toEqual(mergeSort(input).isSorted);
    }
  });

  it("dijkstra", () => {
    const snippet = load<
      (graph: Record<string, Record<string, number>>, start: string, end: string) => { custo: number; caminho: string[] } | null
    >(CODES.dijkstra, "dijkstra");
    const graph = { start: { a: 6, b: 2 }, a: { fim: 1 }, b: { a: 3, fim: 5 }, fim: {} };
    const real = dijkstra(graph, "start", "fim");
    expect(snippet(graph, "start", "fim")).toEqual({ custo: real.totalCost, caminho: real.path });
    expect(snippet({ a: {}, b: {} }, "a", "b")).toBeNull();
  });

  it("mochila", () => {
    const snippet = load<(items: { peso: number; valor: number }[], capacity: number) => number>(
      CODES.knapsack,
      "mochila",
    );
    const items = [
      { name: "violão", weight: 1, value: 1500 },
      { name: "som", weight: 4, value: 3000 },
      { name: "notebook", weight: 3, value: 2000 },
    ];
    const portuguese = items.map((item) => ({ peso: item.weight, valor: item.value }));
    for (const capacity of [1, 3, 4, 5, 8]) {
      expect(snippet(portuguese, capacity), String(capacity)).toBe(knapsack(items, capacity).totalValue);
    }
  });
});
