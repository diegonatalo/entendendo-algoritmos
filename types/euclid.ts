export type TerrainSquare = {
  x: number;
  y: number;
  side: number;
  step: number;
};

export type EuclidStep = {
  width: number;
  height: number;
  side: number;
  quantity: number;
  description: string;
};

export type EuclidResult = {
  steps: EuclidStep[];
  squares: TerrainSquare[];
  gcd: number;
};

export type SumCall = {
  depth: number;
  list: number[];
  result: number;
};
