import {
  KnapsackItem,
  KnapsackStep,
  GreedyKnapsackResult,
  KnapsackResult,
} from "@/types/knapsack";

const money = (n: number) => n.toLocaleString("pt-BR");

// programação dinâmica: tabela[i][c-1] = melhor valor usando os itens 0..i
// em uma mochila de capacidade c
export function knapsack(
  items: KnapsackItem[],
  capacity: number,
  unit = "kg",
): KnapsackResult {
  const table: number[][] = items.map(() => Array(capacity).fill(0));
  const steps: KnapsackStep[] = [];

  for (let i = 0; i < items.length; i++) {
    const { name, weight, value } = items[i];

    for (let c = 1; c <= capacity; c++) {
      const above = i > 0 ? table[i - 1][c - 1] : 0;
      const leftover = c - weight;

      let withItem: number | null = null;
      let description: string;

      if (leftover >= 0) {
        const remaining = leftover === 0 || i === 0 ? 0 : table[i - 1][leftover - 1];
        withItem = value + remaining;
        description = `${name} em ${c} ${unit}: máx(${money(above)} sem o item, ${money(value)} + ${money(remaining)} com a sobra de ${leftover} ${unit}) = ${money(Math.max(above, withItem))}`;
      } else {
        description = `${name} (${weight} ${unit}) não cabe em ${c} ${unit}: mantém ${money(above)}`;
      }

      const best = withItem !== null ? Math.max(above, withItem) : above;
      table[i][c - 1] = best;
      steps.push({
        line: i,
        column: c - 1,
        value: best,
        above,
        withItem,
        usedItem: withItem !== null && withItem > above,
        description,
      });
    }
  }

  // caminho de volta: onde o valor mudou em relação à linha de cima, o item entrou
  const chosenSet: string[] = [];
  const chosenCells: [number, number][] = [];
  let c = capacity;
  for (let i = items.length - 1; i >= 0 && c > 0; i--) {
    const above = i > 0 ? table[i - 1][c - 1] : 0;
    if (table[i][c - 1] !== above) {
      chosenSet.unshift(items[i].name);
      chosenCells.push([i, c - 1]);
      c -= items[i].weight;
    }
  }

  return {
    table,
    steps,
    chosenSet,
    chosenCells,
    totalValue: items.length > 0 ? table[items.length - 1][capacity - 1] : 0,
  };
}

// guloso: pega sempre o item mais valioso que ainda cabe
export function greedyKnapsack(
  items: KnapsackItem[],
  capacity: number,
): GreedyKnapsackResult {
  const chosenSet: string[] = [];
  let leftover = capacity;
  let totalValue = 0;

  for (const item of [...items].sort((a, b) => b.value - a.value)) {
    if (item.weight <= leftover) {
      chosenSet.push(item.name);
      leftover -= item.weight;
      totalValue += item.value;
    }
  }

  return { chosenSet, totalValue };
}
