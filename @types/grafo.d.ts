export type Grafo = Record<string, string[]>;

export type PassoBFS = {
  tipo: "inicio" | "visita" | "ignora" | "achou" | "fim";
  atual: string | null;
  fila: string[];
  visitados: string[];
  descricao: string;
};

export type ResultadoBFS = {
  passos: PassoBFS[];
  caminho: string[] | null;
};
