import { SortStep, SortResult } from "@/types/sort";

function indexOfSmallest(arr: number[]): number {
  let smallestIndex = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[smallestIndex]) {
      smallestIndex = i;
    }
  }
  return smallestIndex;
}

export function selectionSort(input: number[]): SortResult {
  const remainingItems = [...input];
  const sortedSet: number[] = [];
  const steps: SortStep[] = [];
  let comparisons = 0;

  while (remainingItems.length > 0) {
    const smallestIndex = indexOfSmallest(remainingItems);
    comparisons += remainingItems.length - 1;

    steps.push({
      round: steps.length + 1,
      remainingItems: [...remainingItems],
      smallestIndex,
      sortedSet: [...sortedSet],
    });

    sortedSet.push(remainingItems.splice(smallestIndex, 1)[0]);
  }

  return { isSorted: sortedSet, comparisons, steps };
}
