export type SortStep = {
  round: number;
  remainingItems: number[];
  smallestIndex: number;
  sortedSet: number[];
};

export type SortResult = {
  isSorted: number[];
  comparisons: number;
  steps: SortStep[];
};
