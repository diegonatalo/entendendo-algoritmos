export type ModoSubcadeia = "subcadeia" | "subsequencia";

export type PassoSubcadeia = {
  linha: number;
  coluna: number;
  valor: number;
  iguais: boolean;
  descricao: string;
};

export type ResultadoSubcadeia = {
  tabela: number[][];
  passos: PassoSubcadeia[];
  resultado: string;
  celulasDoResultado: [number, number][];
};
