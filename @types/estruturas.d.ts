export type Operacao = "ler" | "inserir" | "remover";

export type CustoEstrutura = {
  passos: number;
  descricao: string;
  // posições percorridas ou deslocadas
  tocados: number[];
  // posição que sofre a alteração principal
  alvo: number;
};

export type ResultadoOperacao = {
  array: CustoEstrutura;
  lista: CustoEstrutura;
};
