import {
  KnnPoint,
  RegressionPoint,
  KnnResult,
  RegressionResult,
} from "@/types/knn";

export function distance(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// regressão: em vez de votar uma categoria, tira a média dos valores dos vizinhos
export function knnRegression(
  points: RegressionPoint[],
  created: { x: number; y: number },
  k: number,
): RegressionResult {
  const neighbors = points
    .map((point) => ({ point, distance: distance(point, created) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k);

  const average =
    neighbors.reduce((sum, v) => sum + v.point.value, 0) / neighbors.length;

  return { neighbors, average };
}

export function knn(
  points: KnnPoint[],
  created: { x: number; y: number },
  k: number,
): KnnResult {
  const neighbors = points
    .map((point) => ({ point, distance: distance(point, created) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k);

  const votes = { laranja: 0, toranja: 0 };
  for (const { point } of neighbors) {
    votes[point.category]++;
  }

  // em caso de empate, vale a classe do vizinho mais próximo
  const category =
    votes.laranja === votes.toranja
      ? neighbors[0].point.category
      : votes.laranja > votes.toranja
        ? "laranja"
        : "toranja";

  return { neighbors, votes, category };
}
