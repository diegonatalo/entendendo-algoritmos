import {
  PivotStrategy,
  QuicksortNode,
  QuicksortResult,
} from "@/types/quicksort";

export function quicksort(
  input: number[],
  strategy: PivotStrategy = "middle",
): QuicksortResult {
  let comparisons = 0;

  function sort(list: number[], level: number): [QuicksortNode, number] {
    // caso base: listas vazias ou com um elemento já estão ordenadas
    if (list.length < 2) {
      return [{ list, sorted: list }, level];
    }

    const pivotIndex =
      strategy === "middle" ? Math.floor(list.length / 2) : 0;
    const pivot = list[pivotIndex];
    const remainder = list.filter((_, i) => i !== pivotIndex);
    comparisons += remainder.length;

    const smallerList = remainder.filter((n) => n <= pivot);
    const largerList = remainder.filter((n) => n > pivot);

    const [smallerOnes, smallerDepth] = sort(smallerList, level + 1);
    const [largerOnes, largerDepth] = sort(largerList, level + 1);

    return [
      {
        list,
        pivot,
        pivotIndex,
        smallerOnes,
        largerOnes,
        sorted: [...smallerOnes.sorted, pivot, ...largerOnes.sorted],
      },
      Math.max(smallerDepth, largerDepth),
    ];
  }

  const [root, depth] = sort(input, 1);
  return { root, isSorted: root.sorted, comparisons, depth };
}
