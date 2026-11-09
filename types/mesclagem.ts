export type NoMesclagem = {
  lista: number[];
  esquerda?: NoMesclagem;
  direita?: NoMesclagem;
  ordenada: number[];
};

export type ResultadoMesclagem = {
  raiz: NoMesclagem;
  ordenado: number[];
  comparacoes: number;
  profundidade: number;
};
