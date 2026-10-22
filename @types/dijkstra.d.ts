export type GrafoPonderado = Record<string, Record<string, number>>;

export type PassoDijkstra = {
  tipo: "inicio" | "processa" | "fim";
  atual: string | null;
  custos: Record<string, number>;
  pais: Record<string, string | null>;
  processados: string[];
  descricao: string;
};

export type ResultadoDijkstra = {
  passos: PassoDijkstra[];
  caminho: string[] | null;
  custoTotal: number | null;
};
