export type Edge = {
  from: string;
  to: string;
  weight: number;
};

export type BellmanFordStep = {
  round: number;
  edge: Edge | null;
  improved: boolean;
  costs: Record<string, number>;
  parents: Record<string, string | null>;
  description: string;
};

export type BellmanFordResult = {
  steps: BellmanFordStep[];
  costs: Record<string, number>;
  path: string[] | null;
  negativeCycle: boolean;
};

export type SimpleDijkstraResult = {
  costs: Record<string, number>;
  path: string[] | null;
  totalCost: number | null;
};
