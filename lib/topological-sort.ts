import {
  DependencyGraph,
  TopologicalStep,
  TopologicalResult,
} from "@/types/topological";

// grafo[a] = tarefas que só podem começar depois de a
// algoritmo de Kahn: remove repetidamente as tarefas sem dependências pendentes
export function topologicalSort(graph: DependencyGraph): TopologicalResult {
  const nodes = Object.keys(graph);
  const inDegrees: Record<string, number> = {};
  for (const node of nodes) inDegrees[node] = 0;
  for (const destinations of Object.values(graph)) {
    for (const destination of destinations) inDegrees[destination]++;
  }

  const queue = nodes.filter((node) => inDegrees[node] === 0);
  const order: string[] = [];
  const steps: TopologicalStep[] = [];

  function register(type: TopologicalStep["type"], current: string | null, description: string) {
    steps.push({
      type,
      current,
      order: [...order],
      queue: [...queue],
      inDegrees: { ...inDegrees },
      description,
    });
  }

  register(
    "start",
    null,
    `Sem dependências pendentes: ${queue.length > 0 ? queue.join(", ") : "nenhuma tarefa"}`,
  );

  while (queue.length > 0) {
    const current = queue.shift()!;
    order.push(current);

    const released: string[] = [];
    for (const destination of graph[current]) {
      inDegrees[destination]--;
      if (inDegrees[destination] === 0) {
        queue.push(destination);
        released.push(destination);
      }
    }

    register(
      "remove",
      current,
      released.length > 0
        ? `Faz ${current}. Liberadas: ${released.join(", ")}`
        : `Faz ${current}. Nenhuma tarefa nova foi liberada`,
    );
  }

  const stuck = nodes.filter((node) => !order.includes(node));
  const hasCycle = stuck.length > 0;

  register(
    "end",
    null,
    hasCycle
      ? `Ciclo! Estas tarefas dependem umas das outras e nunca ficam livres: ${stuck.join(", ")}`
      : `Ordem válida: ${order.join(" → ")}`,
  );

  return { steps, order, hasCycle, stuck };
}
