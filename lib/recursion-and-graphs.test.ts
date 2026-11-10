import { describe, expect, it } from "vitest";
import { bellmanFord, simpleDijkstra } from "@/lib/bellman-ford";
import { breadthFirstSearch } from "@/lib/breadth-first-search";
import { dijkstra } from "@/lib/dijkstra";
import { euclid, recursiveSum } from "@/lib/euclid";
import { factorial } from "@/lib/factorial";
import { topologicalSort } from "@/lib/topological-sort";

describe("factorial", () => {
  it.each([
    [0, 1],
    [1, 1],
    [5, 120],
    [10, 3_628_800],
  ])("fatorial de %s é %s", (n, expected) => {
    expect(factorial(n).result).toBe(expected);
  });

  it("registra a pilha: empilha até o caso base e desempilha devolvendo valores", () => {
    const { steps } = factorial(3);
    expect(steps.map((s) => s.type)).toEqual(["push", "push", "base", "returns", "returns", "returns"]);
    expect(Math.max(...steps.map((s) => s.stack.length))).toBe(3);
    expect(steps[2].stack.map((f) => f.n)).toEqual([3, 2, 1]);
    expect(steps.at(-1)!.stack.at(-1)?.returnValue).toBe(6);
  });

  it("cada passo guarda uma cópia da pilha", () => {
    const { steps } = factorial(3);
    expect(steps[0].stack).toHaveLength(1);
    expect(steps[2].stack).toHaveLength(3);
  });
});

describe("euclid", () => {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

  it.each([
    [1680, 640, 80],
    [12, 8, 4],
    [7, 7, 7],
    [9, 3, 3],
    [13, 5, 1],
  ])("o terreno %s×%s tem MDC %s", (width, height, expected) => {
    const result = euclid(width, height);
    expect(result.gcd).toBe(expected);
    expect(result.gcd).toBe(gcd(width, height));
  });

  it("os quadrados cobrem exatamente a área do terreno, sem sobrepor", () => {
    const { squares } = euclid(18, 8);
    expect(squares.reduce((area, s) => area + s.side * s.side, 0)).toBe(18 * 8);

    const cells = new Set<string>();
    for (const s of squares) {
      for (let x = s.x; x < s.x + s.side; x++) {
        for (let y = s.y; y < s.y + s.side; y++) {
          const key = `${x},${y}`;
          expect(cells.has(key), key).toBe(false);
          cells.add(key);
        }
      }
    }
  });

  it("a descrição usa singular e plural e termina com o MDC", () => {
    const { steps } = euclid(10, 4);
    expect(steps[0].description).toContain("cabem 2 quadrados de 4×4");
    expect(steps.at(-1)!.description).toContain("O MDC é 2");
    expect(euclid(5, 3).steps[0].description).toContain("cabem 1 quadrado de 3×3");
  });
});

describe("recursiveSum", () => {
  it("devolve uma chamada por nível, do total até a lista vazia", () => {
    expect(recursiveSum([2, 4, 6])).toEqual([
      { depth: 0, list: [2, 4, 6], result: 12 },
      { depth: 1, list: [4, 6], result: 10 },
      { depth: 2, list: [6], result: 6 },
      { depth: 3, list: [], result: 0 },
    ]);
  });
});

describe("breadthFirstSearch", () => {
  const graph = {
    voce: ["alice", "bob", "claire"],
    alice: ["peggy"],
    bob: ["anuj", "peggy"],
    claire: ["thom", "jonny"],
    anuj: [],
    peggy: [],
    thom: [],
    jonny: [],
  };

  it("acha o caminho mais curto até o alvo", () => {
    expect(breadthFirstSearch(graph, "voce", "thom").path).toEqual(["voce", "claire", "thom"]);
    expect(breadthFirstSearch(graph, "voce", "peggy").path).toEqual(["voce", "alice", "peggy"]);
  });

  it("o caminho até o próprio começo tem um nó", () => {
    expect(breadthFirstSearch(graph, "voce", "voce").path).toEqual(["voce"]);
  });

  it("devolve null quando não há caminho e termina com o passo end", () => {
    const result = breadthFirstSearch(graph, "anuj", "thom");
    expect(result.path).toBeNull();
    expect(result.steps.at(-1)!.type).toBe("end");
  });

  it("não entra em loop com ciclos", () => {
    const cyclic = { a: ["b"], b: ["a", "c"], c: [] };
    expect(breadthFirstSearch(cyclic, "a", "z").path).toBeNull();
    expect(breadthFirstSearch(cyclic, "a", "c").path).toEqual(["a", "b", "c"]);
  });

  it("registra o passo ignores para quem já foi verificado", () => {
    const { steps } = breadthFirstSearch({ a: ["b", "c"], b: ["c"], c: [] }, "a", "z");
    expect(steps.some((s) => s.type === "ignores" && s.current === "c")).toBe(true);
  });

  it("começa com o passo start e termina com didFind quando acha", () => {
    const { steps } = breadthFirstSearch(graph, "voce", "alice");
    expect(steps[0].type).toBe("start");
    expect(steps.at(-1)!.type).toBe("didFind");
  });
});

describe("dijkstra", () => {
  const graph = {
    start: { a: 6, b: 2 },
    a: { fim: 1 },
    b: { a: 3, fim: 5 },
    fim: {},
  };

  it("acha o caminho mais barato, não o com menos arestas", () => {
    const result = dijkstra(graph, "start", "fim");
    expect(result.path).toEqual(["start", "b", "a", "fim"]);
    expect(result.totalCost).toBe(6);
  });

  it("devolve null quando o destino é inalcançável", () => {
    const result = dijkstra({ a: {}, b: {} }, "a", "b");
    expect(result).toMatchObject({ path: null, totalCost: null });
    expect(result.steps.at(-1)!.description).toContain("Não existe caminho");
  });

  it("começa com custo 0 na origem e infinito nos demais", () => {
    const [first] = dijkstra(graph, "start", "fim").steps;
    expect(first.costs).toEqual({ start: 0, a: Infinity, b: Infinity, fim: Infinity });
  });

  it("origem igual ao destino custa zero", () => {
    expect(dijkstra(graph, "start", "start")).toMatchObject({ path: ["start"], totalCost: 0 });
  });
});

describe("bellmanFord e simpleDijkstra", () => {
  const nodes = ["s", "a", "b", "t"];

  it("aceita pesos negativos", () => {
    const edges = [
      { from: "s", to: "a", weight: 5 },
      { from: "s", to: "b", weight: 2 },
      { from: "b", to: "a", weight: -4 },
      { from: "a", to: "t", weight: 1 },
    ];
    const result = bellmanFord(nodes, edges, "s", "t");
    expect(result.negativeCycle).toBe(false);
    expect(result.costs).toEqual({ s: 0, a: -2, b: 2, t: -1 });
    expect(result.path).toEqual(["s", "b", "a", "t"]);
  });

  it("o Dijkstra simples erra quando há peso negativo para um nó já processado", () => {
    const edges = [
      { from: "s", to: "a", weight: 2 },
      { from: "s", to: "b", weight: 3 },
      { from: "b", to: "a", weight: -2 },
      { from: "a", to: "t", weight: 1 },
    ];
    expect(simpleDijkstra(nodes, edges, "s", "t").totalCost).toBe(3);
    expect(bellmanFord(nodes, edges, "s", "t").costs.t).toBe(2);
  });

  it("os dois concordam quando todos os pesos são positivos", () => {
    const edges = [
      { from: "s", to: "a", weight: 1 },
      { from: "a", to: "t", weight: 2 },
      { from: "s", to: "t", weight: 5 },
    ];
    const simple = simpleDijkstra(["s", "a", "t"], edges, "s", "t");
    const bellman = bellmanFord(["s", "a", "t"], edges, "s", "t");
    expect(simple.totalCost).toBe(3);
    expect(bellman.costs.t).toBe(3);
    expect(simple.path).toEqual(bellman.path);
  });

  it("detecta ciclo negativo e não devolve caminho", () => {
    const edges = [
      { from: "s", to: "a", weight: 1 },
      { from: "a", to: "b", weight: -2 },
      { from: "b", to: "a", weight: 1 },
      { from: "a", to: "t", weight: 1 },
    ];
    const result = bellmanFord(nodes, edges, "s", "t");
    expect(result.negativeCycle).toBe(true);
    expect(result.path).toBeNull();
  });

  it("destino inalcançável não tem caminho", () => {
    const result = bellmanFord(["s", "x"], [], "s", "x");
    expect(result.path).toBeNull();
    expect(simpleDijkstra(["s", "x"], [], "s", "x")).toMatchObject({ path: null, totalCost: null });
  });

  it("registra um passo por aresta em cada rodada, mais o inicial e o final", () => {
    const edges = [{ from: "s", to: "a", weight: 1 }];
    const { steps } = bellmanFord(["s", "a"], edges, "s", "a");
    expect(steps).toHaveLength(1 + 1 * (2 - 1) + 1);
    expect(steps[1]).toMatchObject({ round: 1, improved: true });
  });
});

describe("topologicalSort", () => {
  it("respeita as dependências", () => {
    const graph = { acordar: ["cafe", "banho"], cafe: ["sair"], banho: ["sair"], sair: [] };
    const { order, hasCycle } = topologicalSort(graph);
    expect(hasCycle).toBe(false);
    expect(order).toHaveLength(4);
    expect(order[0]).toBe("acordar");
    expect(order.at(-1)).toBe("sair");
    expect(order.indexOf("cafe")).toBeLessThan(order.indexOf("sair"));
    expect(order.indexOf("banho")).toBeLessThan(order.indexOf("sair"));
  });

  it("detecta ciclo e aponta as tarefas presas", () => {
    const result = topologicalSort({ a: ["b"], b: ["c"], c: ["b"], d: [] });
    expect(result.hasCycle).toBe(true);
    expect(result.stuck.sort()).toEqual(["b", "c"]);
    expect(result.order).toEqual(["a", "d"]);
  });

  it("grafo vazio tem ordem vazia", () => {
    expect(topologicalSort({})).toMatchObject({ order: [], hasCycle: false });
  });

  it("o passo final descreve a ordem ou o ciclo", () => {
    expect(topologicalSort({ a: ["b"], b: [] }).steps.at(-1)!.description).toContain("Ordem válida: a → b");
    expect(topologicalSort({ a: ["a"] }).steps.at(-1)!.description).toContain("Ciclo!");
  });
});
