export type GrafoDependencias = Record<string, string[]>;

export type PassoTopologico = {
  tipo: "inicio" | "remove" | "fim";
  atual: string | null;
  ordem: string[];
  fila: string[];
  grausEntrada: Record<string, number>;
  descricao: string;
};

export type ResultadoTopologico = {
  passos: PassoTopologico[];
  ordem: string[];
  temCiclo: boolean;
  presos: string[];
};
