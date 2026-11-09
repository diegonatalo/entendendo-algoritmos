export type PivotStrategy = "middle" | "first";

export type QuicksortNode = {
  list: number[];
  pivot?: number;
  pivotIndex?: number;
  smallerOnes?: QuicksortNode;
  largerOnes?: QuicksortNode;
  sorted: number[];
};

export type QuicksortResult = {
  root: QuicksortNode;
  isSorted: number[];
  comparisons: number;
  depth: number;
};
