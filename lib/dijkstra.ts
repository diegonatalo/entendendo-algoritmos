import {
  WeightedGraph,
  DijkstraStep,
  DijkstraResult,
} from "@/types/dijkstra";

const format = (cost: number) => (cost === Infinity ? "∞" : String(cost));

export function dijkstra(
  graph: WeightedGraph,
  start: string,
  end: string,
): DijkstraResult {
  const nodes = Object.keys(graph);
  const costs: Record<string, number> = {};
  const parents: Record<string, string | null> = {};
  const processed: string[] = [];
  const steps: DijkstraStep[] = [];

  for (const node of nodes) {
    costs[node] = node === start ? 0 : Infinity;
    parents[node] = null;
  }

  function register(
    type: DijkstraStep["type"],
    current: string | null,
    description: string,
  ) {
    steps.push({
      type,
      current,
      costs: { ...costs },
      parents: { ...parents },
      processed: [...processed],
      description,
    });
  }

  function cheapest(): string | null {
    let smallest: string | null = null;
    for (const node of nodes) {
      if (processed.includes(node) || costs[node] === Infinity) continue;
      if (smallest === null || costs[node] < costs[smallest]) smallest = node;
    }
    return smallest;
  }

  register("start", null, `Custo de ${start} = 0; os demais começam em ∞`);

  let current = cheapest();
  while (current !== null) {
    const changes: string[] = [];
    for (const [neighbor, weight] of Object.entries(graph[current])) {
      const newCost = costs[current] + weight;
      if (newCost < costs[neighbor]) {
        changes.push(
          `${neighbor}: ${format(costs[neighbor])} → ${newCost}`,
        );
        costs[neighbor] = newCost;
        parents[neighbor] = current;
      }
    }
    processed.push(current);

    register(
      "process",
      current,
      `Nó mais barato: ${current} (custo ${costs[current]}). ${
        changes.length > 0
          ? `Atualiza ${changes.join("; ")}`
          : "Nenhum custo melhorou"
      }`,
    );

    current = cheapest();
  }

  if (costs[end] === Infinity) {
    register("end", null, `Não existe caminho de ${start} até ${end}`);
    return { steps, path: null, totalCost: null };
  }

  const path: string[] = [];
  for (let node: string | null = end; node !== null; node = parents[node]) {
    path.unshift(node);
  }
  register(
    "end",
    null,
    `Caminho mais barato: ${path.join(" → ")}, custo ${costs[end]}`,
  );
  return { steps, path, totalCost: costs[end] };
}
