export type Cidade = {
  nome: string;
  x: number;
  y: number;
};

export type Rota = {
  ordem: number[];
  comprimento: number;
};

export type ResultadoOtimo = Rota & {
  permutacoes: number;
};
