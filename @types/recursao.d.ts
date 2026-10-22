export type Quadro = {
  n: number;
  retorno?: number;
};

export type PassoRecursao = {
  tipo: "empilha" | "base" | "retorna";
  descricao: string;
  pilha: Quadro[];
};

export type ResultadoFatorial = {
  resultado: number;
  passos: PassoRecursao[];
};
