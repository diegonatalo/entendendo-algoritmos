export type KnapsackItem = {
  name: string;
  weight: number;
  value: number;
};

export type KnapsackStep = {
  line: number;
  column: number;
  value: number;
  above: number;
  withItem: number | null;
  usedItem: boolean;
  description: string;
};

export type KnapsackResult = {
  table: number[][];
  steps: KnapsackStep[];
  chosenSet: string[];
  chosenCells: [number, number][];
  totalValue: number;
};

export type GreedyKnapsackResult = {
  chosenSet: string[];
  totalValue: number;
};
