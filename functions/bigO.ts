export type CurvaBigO = {
  id: string;
  notacao: string;
  nome: string;
  exemplo: string;
  cor: string;
  corTexto: string;
  passos: (n: number) => number;
};

function fatorialNumero(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

export const curvas: CurvaBigO[] = [
  {
    id: "log",
    notacao: "O(log n)",
    nome: "Logarítmico",
    exemplo: "Busca binária",
    cor: "#34d399",
    corTexto: "text-emerald-400",
    passos: (n) => Math.log2(n),
  },
  {
    id: "n",
    notacao: "O(n)",
    nome: "Linear",
    exemplo: "Busca simples",
    cor: "#38bdf8",
    corTexto: "text-sky-400",
    passos: (n) => n,
  },
  {
    id: "nlog",
    notacao: "O(n log n)",
    nome: "Linearítmico",
    exemplo: "Quicksort (caso médio)",
    cor: "#a78bfa",
    corTexto: "text-violet-400",
    passos: (n) => n * Math.log2(n),
  },
  {
    id: "n2",
    notacao: "O(n²)",
    nome: "Quadrático",
    exemplo: "Ordenação por seleção",
    cor: "#fbbf24",
    corTexto: "text-amber-400",
    passos: (n) => n * n,
  },
  {
    id: "fat",
    notacao: "O(n!)",
    nome: "Fatorial",
    exemplo: "Caixeiro-viajante (força bruta)",
    cor: "#fb7185",
    corTexto: "text-rose-400",
    passos: (n) => fatorialNumero(n),
  },
];

export function formatarPassos(valor: number): string {
  if (valor < 1000) {
    return Number.isInteger(valor)
      ? String(valor)
      : valor.toFixed(1).replace(".", ",");
  }
  if (valor < 1e9) {
    return Math.round(valor).toLocaleString("pt-BR");
  }
  return valor.toExponential(1).replace(".", ",").replace("e+", " × 10^");
}

// tempo estimado se cada operação levasse 1 ms (como no exemplo do livro)
export function formatarTempo(passos: number): string {
  const segundos = passos / 1000;
  if (segundos < 1) return `${Math.round(passos)} ms`;
  if (segundos < 60) return `${segundos.toFixed(1).replace(".", ",")} s`;
  if (segundos < 3600) return `${(segundos / 60).toFixed(1).replace(".", ",")} min`;
  if (segundos < 86400) return `${(segundos / 3600).toFixed(1).replace(".", ",")} h`;
  const anos = segundos / 31_557_600;
  if (anos < 1) return `${(segundos / 86400).toFixed(1).replace(".", ",")} dias`;
  if (anos < 1e6) return `${Math.round(anos).toLocaleString("pt-BR")} anos`;
  return "mais que a idade do universo";
}
