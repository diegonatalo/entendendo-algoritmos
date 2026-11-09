import {
  Edge,
  BellmanFordStep,
  BellmanFordResult,
  SimpleDijkstraResult,
} from "@/types/bellman-ford";

const fmt = (cost: number) => (cost === Infinity ? "∞" : String(cost));

function buildPath(
  parents: Record<string, string | null>,
  end: string,
  costs: Record<string, number>,
): string[] | null {
  if (costs[end] === Infinity) return null;
  const path: string[] = [];
  for (let node: string | null = end; node !== null; node = parents[node]) {
    path.unshift(node);
  }
  return path;
}

function initialize(nodes: string[], start: string) {
  const costs: Record<string, number> = {};
  const parents: Record<string, string | null> = {};
  for (const node of nodes) {
    costs[node] = node === start ? 0 : Infinity;
    parents[node] = null;
  }
  return { costs, parents };
}

// Dijkstra como no capítulo 7: uma vez processado, o custo de um nó é considerado final.
// Com pesos negativos essa suposição falha.
export function simpleDijkstra(
  nodes: string[],
  edges: Edge[],
  start: string,
  end: string,
): SimpleDijkstraResult {
  const { costs, parents } = initialize(nodes, start);
  const processed = new Set<string>();

  for (;;) {
    let current: string | null = null;
    for (const node of nodes) {
      if (processed.has(node) || costs[node] === Infinity) continue;
      if (current === null || costs[node] < costs[current]) current = node;
    }
    if (current === null) break;

    processed.add(current);
    for (const { from, to, weight } of edges) {
      if (from === current && !processed.has(to) && costs[current] + weight < costs[to]) {
        costs[to] = costs[current] + weight;
        parents[to] = current;
      }
    }
  }

  const path = buildPath(parents, end, costs);
  return { costs, path, totalCost: path ? costs[end] : null };
}

// Bellman-Ford: relaxa todas as arestas (V - 1) vezes. Aceita pesos negativos e
// detecta ciclos negativos com uma rodada extra.
export function bellmanFord(
  nodes: string[],
  edges: Edge[],
  start: string,
  end: string,
): BellmanFordResult {
  const { costs, parents } = initialize(nodes, start);
  const steps: BellmanFordStep[] = [];

  function register(
    round: number,
    edge: Edge | null,
    improved: boolean,
    description: string,
  ) {
    steps.push({
      round,
      edge,
      improved,
      costs: { ...costs },
      parents: { ...parents },
      description,
    });
  }

  register(0, null, false, `Custo de ${start} = 0; os demais começam em ∞`);

  for (let round = 1; round <= nodes.length - 1; round++) {
    for (const edge of edges) {
      const { from, to, weight } = edge;
      const created = costs[from] === Infinity ? Infinity : costs[from] + weight;
      if (created < costs[to]) {
        const before = costs[to];
        costs[to] = created;
        parents[to] = from;
        register(
          round,
          edge,
          true,
          `Rodada ${round}: ${from} → ${to} (${weight}) melhora ${to}: ${fmt(before)} → ${created}`,
        );
      } else {
        register(
          round,
          edge,
          false,
          `Rodada ${round}: ${from} → ${to} (${weight}) não melhora ${to} (${fmt(costs[to])})`,
        );
      }
    }
  }

  // uma rodada extra: se algo ainda melhora, existe um ciclo de peso negativo
  const negativeCycle = edges.some(
    ({ from, to, weight }) => costs[from] !== Infinity && costs[from] + weight < costs[to],
  );

  register(
    nodes.length,
    null,
    false,
    negativeCycle
      ? "Rodada extra: ainda dá para melhorar custos, então há um ciclo negativo e não existe menor caminho"
      : "Rodada extra: nada melhora, os custos são finais",
  );

  return {
    steps,
    costs: { ...costs },
    path: negativeCycle ? null : buildPath(parents, end, costs),
    negativeCycle,
  };
}
