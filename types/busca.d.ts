export type Passo = {
  tentativa: number;
  arrayAtual: number[];
  meio: number;
  valorMeio: number;
};

export type ResultadoBusca = {
  indice: number;
  tentativas: number;
  maxTentativas: number;
  passos: Passo[];
};
