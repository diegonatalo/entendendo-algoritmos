export type Caixa = {
  id: string;
  nome: string;
  itens: string[];
  caixas: Caixa[];
};

export type PassoCaixa = {
  tipo: "abre" | "achou" | "volta";
  atual: string;
  pilha: string[];
  vasculhadas: string[];
  descricao: string;
};

export type ResultadoCaixas = {
  passos: PassoCaixa[];
  encontradaEm: string | null;
};
