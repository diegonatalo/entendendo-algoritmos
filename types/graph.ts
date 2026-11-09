export type Graph = Record<string, string[]>;

export type BfsStep = {
  type: "start" | "visit" | "ignores" | "didFind" | "end";
  current: string | null;
  queue: string[];
  visitedSet: string[];
  description: string;
};

export type BfsResult = {
  steps: BfsStep[];
  path: string[] | null;
};
