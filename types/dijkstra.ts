export type WeightedGraph = Record<string, Record<string, number>>;

export type DijkstraStep = {
  type: "start" | "process" | "end";
  current: string | null;
  costs: Record<string, number>;
  parents: Record<string, string | null>;
  processed: string[];
  description: string;
};

export type DijkstraResult = {
  steps: DijkstraStep[];
  path: string[] | null;
  totalCost: number | null;
};
