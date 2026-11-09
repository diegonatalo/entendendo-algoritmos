export type Conjuntos = Record<string, string[]>;

export type PassoGuloso = {
  tipo: "inicio" | "escolhe" | "fim";
  escolhida: string | null;
  candidatos: Record<string, number>;
  cobertos: string[];
  faltam: string[];
  solucao: string[];
  descricao: string;
};

export type ResultadoGuloso = {
  passos: PassoGuloso[];
  solucao: string[];
  completa: boolean;
};

export type ResultadoOtimo = {
  solucao: string[] | null;
  combinacoesTestadas: number;
};
