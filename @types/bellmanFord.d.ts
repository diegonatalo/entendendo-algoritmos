export type Aresta = {
  de: string;
  para: string;
  peso: number;
};

export type PassoBellmanFord = {
  rodada: number;
  aresta: Aresta | null;
  melhorou: boolean;
  custos: Record<string, number>;
  pais: Record<string, string | null>;
  descricao: string;
};

export type ResultadoBellmanFord = {
  passos: PassoBellmanFord[];
  custos: Record<string, number>;
  caminho: string[] | null;
  cicloNegativo: boolean;
};

export type ResultadoDijkstraSimples = {
  custos: Record<string, number>;
  caminho: string[] | null;
  custoTotal: number | null;
};
