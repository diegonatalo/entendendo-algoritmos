import {
  Sets,
  GreedyStep,
  GreedyResult,
  OptimalResult,
} from "@/types/greedy";

export function greedyCoverage(
  universe: string[],
  sets: Sets,
): GreedyResult {
  const missing = new Set(universe);
  const coveredItems: string[] = [];
  const solution: string[] = [];
  const steps: GreedyStep[] = [];

  function countNew(): Record<string, number> {
    const candidates: Record<string, number> = {};
    for (const [name, items] of Object.entries(sets)) {
      candidates[name] = items.filter((item) => missing.has(item)).length;
    }
    return candidates;
  }

  function register(
    type: GreedyStep["type"],
    chosen: string | null,
    candidates: Record<string, number>,
    description: string,
  ) {
    steps.push({
      type,
      chosen,
      candidates,
      coveredItems: [...coveredItems],
      missing: universe.filter((item) => missing.has(item)),
      solution: [...solution],
      description,
    });
  }

  register(
    "start",
    null,
    countNew(),
    `Faltam cobrir ${universe.length} itens`,
  );

  while (missing.size > 0) {
    const candidates = countNew();

    // escolhe o conjunto que cobre mais itens ainda não cobertos
    let best: string | null = null;
    for (const name of Object.keys(sets)) {
      if (candidates[name] > 0 && (best === null || candidates[name] > candidates[best])) {
        best = name;
      }
    }
    if (best === null) break;

    const newItems = sets[best].filter((item) => missing.has(item));
    for (const item of newItems) {
      missing.delete(item);
      coveredItems.push(item);
    }
    solution.push(best);

    register(
      "choose",
      best,
      candidates,
      `Escolhe ${best}: cobre ${newItems.length} ${newItems.length === 1 ? "novo" : "novos"} (${newItems.join(", ")})`,
    );
  }

  const complete = missing.size === 0;
  register(
    "end",
    null,
    {},
    complete
      ? `Tudo coberto com ${solution.length} conjuntos: ${solution.join(", ")}`
      : `Não é possível cobrir: ${[...missing].join(", ")}`,
  );

  return { steps, solution, complete };
}

// força bruta: testa todos os subconjuntos (O(2^n)) e fica com o menor que cobre tudo
export function optimalCoverage(
  universe: string[],
  sets: Sets,
): OptimalResult {
  const names = Object.keys(sets);
  const total = 2 ** names.length - 1;
  let best: string[] | null = null;

  for (let mask = 1; mask <= total; mask++) {
    const chosenSet = names.filter((_, i) => mask & (1 << i));
    if (best !== null && chosenSet.length >= best.length) continue;

    const coveredItems = new Set(chosenSet.flatMap((name) => sets[name]));
    if (universe.every((item) => coveredItems.has(item))) {
      best = chosenSet;
    }
  }

  return { solution: best, testedCombinations: total };
}
