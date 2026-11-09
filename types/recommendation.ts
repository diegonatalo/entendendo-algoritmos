export type Method = "euclidean" | "normalized" | "cosine";

export type User = {
  name: string;
  // notas dos filmes que o alvo também avaliou, na mesma ordem
  ratings: number[];
  // nota do filme que o alvo ainda não viu
  newRating: number;
};

export type RecommendationNeighbor = {
  user: User;
  // distância (menor = mais parecido) ou similaridade do cosseno (maior = mais parecido)
  measure: number;
};

export type RecommendationResult = {
  ranking: RecommendationNeighbor[];
  chosenSet: RecommendationNeighbor[];
  prediction: number;
};
