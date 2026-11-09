export type BigOCurve = {
  id: string;
  notation: string;
  name: string;
  example: string;
  color: string;
  textColor: string;
  steps: (n: number) => number;
};

function factorialNumber(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

export const curves: BigOCurve[] = [
  {
    id: "log",
    notation: "O(log n)",
    name: "Logarítmico",
    example: "Busca binária",
    color: "#34d399",
    textColor: "text-emerald-400",
    steps: (n) => Math.log2(n),
  },
  {
    id: "n",
    notation: "O(n)",
    name: "Linear",
    example: "Busca simples",
    color: "#38bdf8",
    textColor: "text-sky-400",
    steps: (n) => n,
  },
  {
    id: "nlog",
    notation: "O(n log n)",
    name: "Linearítmico",
    example: "Quicksort (caso médio)",
    color: "#a78bfa",
    textColor: "text-violet-400",
    steps: (n) => n * Math.log2(n),
  },
  {
    id: "n2",
    notation: "O(n²)",
    name: "Quadrático",
    example: "Ordenação por seleção",
    color: "#fbbf24",
    textColor: "text-amber-400",
    steps: (n) => n * n,
  },
  {
    id: "fat",
    notation: "O(n!)",
    name: "Fatorial",
    example: "Caixeiro-viajante (força bruta)",
    color: "#fb7185",
    textColor: "text-rose-400",
    steps: (n) => factorialNumber(n),
  },
];

export function formatSteps(value: number): string {
  if (value < 1000) {
    return Number.isInteger(value)
      ? String(value)
      : value.toFixed(1).replace(".", ",");
  }
  if (value < 1e9) {
    return Math.round(value).toLocaleString("pt-BR");
  }
  return value.toExponential(1).replace(".", ",").replace("e+", " × 10^");
}

// tempo estimado se cada operação levasse 1 ms (como no exemplo do livro)
export function formatTime(steps: number): string {
  const seconds = steps / 1000;
  if (seconds < 1) return `${Math.round(steps)} ms`;
  if (seconds < 60) return `${seconds.toFixed(1).replace(".", ",")} s`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1).replace(".", ",")} min`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1).replace(".", ",")} h`;
  const years = seconds / 31_557_600;
  if (years < 1) return `${(seconds / 86400).toFixed(1).replace(".", ",")} dias`;
  if (years < 1e6) return `${Math.round(years).toLocaleString("pt-BR")} anos`;
  return "mais que a idade do universo";
}
