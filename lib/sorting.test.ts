import { describe, expect, it } from "vitest";
import { binarySearch } from "@/lib/binary-search";
import { mergeSort } from "@/lib/merge-sort";
import { quicksort } from "@/lib/quicksort";
import { selectionSort } from "@/lib/selection-sort";

const ascending = (list: number[]) => [...list].sort((a, b) => a - b);
const samples = [[], [1], [2, 1], [5, 3, 8, 1, 9, 2, 7], [4, 4, 4, 1, 1], [9, 8, 7, 6, 5, 4, 3, 2, 1], [-3, 10, 0, -7]];

describe("binarySearch", () => {
  const list = [1, 3, 5, 7, 9, 11, 13, 15];

  it("acha o índice de cada elemento", () => {
    list.forEach((value, index) => expect(binarySearch(list, value).index).toBe(index));
  });

  it("devolve -1 quando o alvo não existe", () => {
    expect(binarySearch(list, 4).index).toBe(-1);
    expect(binarySearch(list, 100).index).toBe(-1);
    expect(binarySearch([], 1).index).toBe(-1);
  });

  it("nunca passa do pior caso de ⌊log₂ n⌋ + 1 tentativas", () => {
    for (let target = 0; target <= 16; target++) {
      const result = binarySearch(list, target);
      expect(result.maxAttempts).toBe(4);
      expect(result.attempts).toBeLessThanOrEqual(result.maxAttempts);
    }
  });

  it("registra um passo por tentativa, com a faixa que ainda sobra", () => {
    const { steps, attempts } = binarySearch(list, 15);
    expect(steps).toHaveLength(attempts);
    expect(steps[0].currentArray).toEqual(list);
    expect(steps[0].attempt).toBe(1);
    for (let i = 1; i < steps.length; i++) {
      expect(steps[i].currentArray.length).toBeLessThan(steps[i - 1].currentArray.length);
    }
  });

  it("lista vazia não tem tentativas", () => {
    expect(binarySearch([], 5)).toMatchObject({ attempts: 0, maxAttempts: 0, steps: [] });
  });
});

describe("selectionSort", () => {
  it.each(samples)("ordena %j", (...input) => {
    expect(selectionSort(input).isSorted).toEqual(ascending(input));
  });

  it("não altera a lista de entrada", () => {
    const input = [3, 1, 2];
    selectionSort(input);
    expect(input).toEqual([3, 1, 2]);
  });

  it("faz um passo por elemento e conta n(n-1)/2 comparações", () => {
    const result = selectionSort([5, 2, 9, 1, 7]);
    expect(result.steps).toHaveLength(5);
    expect(result.comparisons).toBe((5 * 4) / 2);
  });

  it("cada passo mostra o menor dos que sobram e o que já foi ordenado", () => {
    const { steps } = selectionSort([3, 1, 2]);
    expect(steps[0]).toMatchObject({ round: 1, remainingItems: [3, 1, 2], smallestIndex: 1, sortedSet: [] });
    expect(steps[1]).toMatchObject({ remainingItems: [3, 2], sortedSet: [1] });
  });
});

describe("mergeSort", () => {
  it.each(samples)("ordena %j", (...input) => {
    expect(mergeSort(input).isSorted).toEqual(ascending(input));
  });

  it("é estável: mantém a ordem dos iguais (usa <=)", () => {
    expect(mergeSort([2, 1, 2, 1]).isSorted).toEqual([1, 1, 2, 2]);
  });

  it("monta a árvore de divisões e calcula a profundidade", () => {
    const { root, depth } = mergeSort([4, 3, 2, 1]);
    expect(root.list).toEqual([4, 3, 2, 1]);
    expect(root.left?.list).toEqual([4, 3]);
    expect(root.right?.list).toEqual([2, 1]);
    expect(depth).toBe(3);
  });

  it("lista de um elemento não precisa de comparações", () => {
    expect(mergeSort([7])).toMatchObject({ comparisons: 0, depth: 1, isSorted: [7] });
  });

  it("não passa de n·⌈log₂ n⌉ comparações", () => {
    const input = Array.from({ length: 16 }, (_, i) => (i * 7) % 16);
    expect(mergeSort(input).comparisons).toBeLessThanOrEqual(16 * 4);
  });
});

describe("quicksort", () => {
  it.each(samples)("ordena %j com pivô no meio", (...input) => {
    expect(quicksort(input).isSorted).toEqual(ascending(input));
  });

  it.each(samples)("ordena %j com pivô no começo", (...input) => {
    expect(quicksort(input, "first").isSorted).toEqual(ascending(input));
  });

  it("o pivô do meio evita o pior caso em lista já ordenada", () => {
    const sorted = Array.from({ length: 15 }, (_, i) => i);
    const middle = quicksort(sorted, "middle");
    const first = quicksort(sorted, "first");
    expect(middle.depth).toBeLessThan(first.depth);
    expect(middle.comparisons).toBeLessThan(first.comparisons);
  });

  it("registra o pivô e as duas partes em cada nível", () => {
    const { root } = quicksort([3, 6, 2]);
    expect(root.pivot).toBe(6);
    expect(root.smallerOnes?.list).toEqual([3, 2]);
    expect(root.largerOnes?.list).toEqual([]);
  });
});
