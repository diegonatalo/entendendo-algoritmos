export type EntradaHash = {
  chave: string;
  valor: string;
};

export type TabelaHash = EntradaHash[][];

export type ResultadoHash = {
  soma: number;
  indice: number;
};

export type ResultadoInsercao = {
  tabela: TabelaHash;
  indice: number;
  soma: number;
  colisao: boolean;
  atualizou: boolean;
};

export type ResultadoBuscaHash = {
  indice: number;
  soma: number;
  comparacoes: number;
  valor?: string;
};
