export type ItemMochila = {
  nome: string;
  peso: number;
  valor: number;
};

export type PassoMochila = {
  linha: number;
  coluna: number;
  valor: number;
  acima: number;
  comItem: number | null;
  usouItem: boolean;
  descricao: string;
};

export type ResultadoMochila = {
  tabela: number[][];
  passos: PassoMochila[];
  escolhidos: string[];
  celulasEscolhidas: [number, number][];
  valorTotal: number;
};

export type ResultadoGulosoMochila = {
  escolhidos: string[];
  valorTotal: number;
};
