export type Sets = Record<string, string[]>;

export type GreedyStep = {
  type: "start" | "choose" | "end";
  chosen: string | null;
  candidates: Record<string, number>;
  coveredItems: string[];
  missing: string[];
  solution: string[];
  description: string;
};

export type GreedyResult = {
  steps: GreedyStep[];
  solution: string[];
  complete: boolean;
};

export type OptimalResult = {
  solution: string[] | null;
  testedCombinations: number;
};
