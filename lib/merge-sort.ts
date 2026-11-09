import { MergeNode, MergeResult } from "@/types/merge-sort";

// ordenação por mesclagem (merge sort): divide a lista ao meio, ordena cada metade
// recursivamente e junta as duas metades já ordenadas
export function mergeSort(input: number[]): MergeResult {
  let comparisons = 0;

  function merge(a: number[], b: number[]): number[] {
    const result: number[] = [];
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
      comparisons++;
      if (a[i] <= b[j]) result.push(a[i++]);
      else result.push(b[j++]);
    }
    return [...result, ...a.slice(i), ...b.slice(j)];
  }

  function sort(list: number[], level: number): [MergeNode, number] {
    // caso base: listas vazias ou com um elemento já estão ordenadas
    if (list.length < 2) {
      return [{ list, sorted: list }, level];
    }

    const middle = Math.floor(list.length / 2);
    const [left, leftDepth] = sort(list.slice(0, middle), level + 1);
    const [right, rightDepth] = sort(list.slice(middle), level + 1);

    return [
      {
        list,
        left,
        right,
        sorted: merge(left.sorted, right.sorted),
      },
      Math.max(leftDepth, rightDepth),
    ];
  }

  const [root, depth] = sort(input, 1);
  return { root, isSorted: root.sorted, comparisons, depth };
}
