export type SubstringMode = "substring" | "subsequence";

export type SubstringStep = {
  line: number;
  column: number;
  value: number;
  equal: boolean;
  description: string;
};

export type SubstringResult = {
  table: number[][];
  steps: SubstringStep[];
  result: string;
  resultCells: [number, number][];
};
