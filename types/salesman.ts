export type City = {
  name: string;
  x: number;
  y: number;
};

export type Route = {
  order: number[];
  totalLength: number;
};

export type OptimalResult = Route & {
  permutations: number;
};
