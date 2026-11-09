export type MergeNode = {
  list: number[];
  left?: MergeNode;
  right?: MergeNode;
  sorted: number[];
};

export type MergeResult = {
  root: MergeNode;
  isSorted: number[];
  comparisons: number;
  depth: number;
};
