export type Category = "laranja" | "toranja";

export type KnnPoint = {
  x: number;
  y: number;
  category: Category;
};

export type Neighbor = {
  point: KnnPoint;
  distance: number;
};

export type RegressionPoint = {
  x: number;
  y: number;
  value: number;
};

export type RegressionNeighbor = {
  point: RegressionPoint;
  distance: number;
};

export type RegressionResult = {
  neighbors: RegressionNeighbor[];
  average: number;
};

export type KnnResult = {
  neighbors: Neighbor[];
  votes: Record<Category, number>;
  category: Category;
};
