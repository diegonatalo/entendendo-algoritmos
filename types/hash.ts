export type HashEntry = {
  key: string;
  value: string;
};

export type HashTable = HashEntry[][];

export type HashResult = {
  sum: number;
  index: number;
};

export type InsertionResult = {
  table: HashTable;
  index: number;
  sum: number;
  collision: boolean;
  updated: boolean;
};

export type HashSearchResult = {
  index: number;
  sum: number;
  comparisons: number;
  value?: string;
};
