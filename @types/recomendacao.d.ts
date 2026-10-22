export type Metodo = "euclidiana" | "normalizada" | "cosseno";

export type Usuario = {
  nome: string;
  // notas dos filmes que o alvo também avaliou, na mesma ordem
  notas: number[];
  // nota do filme que o alvo ainda não viu
  notaNova: number;
};

export type VizinhoRecomendacao = {
  usuario: Usuario;
  // distância (menor = mais parecido) ou similaridade do cosseno (maior = mais parecido)
  medida: number;
};

export type ResultadoRecomendacao = {
  ranking: VizinhoRecomendacao[];
  escolhidos: VizinhoRecomendacao[];
  previsao: number;
};
