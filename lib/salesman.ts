import { City, OptimalResult, Route } from "@/types/salesman";

const distance = (a: City, b: City) => Math.hypot(a.x - b.x, a.y - b.y);

// comprimento do circuito fechado (volta à cidade inicial)
export function routeLength(cities: City[], order: number[]): number {
  let total = 0;
  for (let i = 0; i < order.length; i++) {
    total += distance(cities[order[i]], cities[order[(i + 1) % order.length]]);
  }
  return total;
}

// aproximação gulosa: sempre vai para a cidade não visitada mais próxima
export function nearestNeighborRoute(cities: City[]): Route {
  const order = [0];
  const visited = new Set([0]);

  while (order.length < cities.length) {
    const current = cities[order[order.length - 1]];
    let nextStep = -1;
    for (let i = 0; i < cities.length; i++) {
      if (visited.has(i)) continue;
      if (nextStep === -1 || distance(current, cities[i]) < distance(current, cities[nextStep])) {
        nextStep = i;
      }
    }
    order.push(nextStep);
    visited.add(nextStep);
  }

  return { order, totalLength: routeLength(cities, order) };
}

// força bruta: testa todas as (n-1)! ordens possíveis, fixando a primeira cidade
export function bruteForceRoute(cities: City[]): OptimalResult {
  const n = cities.length;
  let best: Route = { order: [], totalLength: Infinity };
  let permutations = 0;

  function permute(order: number[], remainingItems: number[]) {
    if (remainingItems.length === 0) {
      permutations++;
      const totalLength = routeLength(cities, order);
      if (totalLength < best.totalLength) {
        best = { order: [...order], totalLength };
      }
      return;
    }
    for (let i = 0; i < remainingItems.length; i++) {
      permute(
        [...order, remainingItems[i]],
        [...remainingItems.slice(0, i), ...remainingItems.slice(i + 1)],
      );
    }
  }

  permute([0], Array.from({ length: n - 1 }, (_, i) => i + 1));
  return { ...best, permutations };
}
