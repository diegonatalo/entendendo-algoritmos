export type EstrategiaPivo = "meio" | "primeiro";

export type NoQuicksort = {
  lista: number[];
  pivo?: number;
  indicePivo?: number;
  menores?: NoQuicksort;
  maiores?: NoQuicksort;
  ordenada: number[];
};

export type ResultadoQuicksort = {
  raiz: NoQuicksort;
  ordenado: number[];
  comparacoes: number;
  profundidade: number;
};
