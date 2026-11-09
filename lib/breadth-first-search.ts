import { Graph, BfsStep, BfsResult } from "@/types/graph";

export function breadthFirstSearch(
  graph: Graph,
  start: string,
  target: string,
): BfsResult {
  const queue: string[] = [start];
  const visitedSet: string[] = [];
  const parent: Record<string, string | null> = { [start]: null };
  const steps: BfsStep[] = [];

  function register(
    type: BfsStep["type"],
    current: string | null,
    description: string,
  ) {
    steps.push({
      type,
      current,
      queue: [...queue],
      visitedSet: [...visitedSet],
      description,
    });
  }

  register("start", null, `Começa na fila com ${start}`);

  while (queue.length > 0) {
    const current = queue.shift()!;

    // evita verificar a mesma pessoa duas vezes (e entrar em loop com ciclos)
    if (visitedSet.includes(current)) {
      register("ignores", current, `${current} já foi verificado: ignora`);
      continue;
    }

    visitedSet.push(current);

    if (current === target) {
      const path: string[] = [];
      for (let node: string | null = current; node !== null; node = parent[node]) {
        path.unshift(node);
      }
      register("didFind", current, `${current} é o alvo! Caminho encontrado`);
      return { steps, path };
    }

    const neighbors = graph[current] ?? [];
    for (const neighbor of neighbors) {
      queue.push(neighbor);
      if (!(neighbor in parent)) {
        parent[neighbor] = current;
      }
    }

    register(
      "visit",
      current,
      neighbors.length > 0
        ? `Verifica ${current}: não é o alvo. Adiciona à fila: ${neighbors.join(", ")}`
        : `Verifica ${current}: não é o alvo e não tem vizinhos`,
    );
  }

  register("end", null, "A fila acabou: não existe caminho até o alvo");
  return { steps, path: null };
}
