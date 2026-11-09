export type PassoOrdenacao = {
  rodada: number;
  restantes: number[];
  indiceMenor: number;
  ordenados: number[];
};

export type ResultadoOrdenacao = {
  ordenado: number[];
  comparacoes: number;
  passos: PassoOrdenacao[];
};
