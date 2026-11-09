export type DependencyGraph = Record<string, string[]>;

export type TopologicalStep = {
  type: "start" | "remove" | "end";
  current: string | null;
  order: string[];
  queue: string[];
  inDegrees: Record<string, number>;
  description: string;
};

export type TopologicalResult = {
  steps: TopologicalStep[];
  order: string[];
  hasCycle: boolean;
  stuck: string[];
};
