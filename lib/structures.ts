import { OperationResult } from "@/types/structures";

const interval = (from: number, until: number) =>
  Array.from({ length: Math.max(0, until - from + 1) }, (_, i) => from + i);

const plural = (n: number, singular: string, pluralForm: string) =>
  `${n} ${n === 1 ? singular : pluralForm}`;

// custo de ler o item na posição i (0 a n-1)
export function readCost(n: number, i: number): OperationResult {
  return {
    array: {
      steps: 1,
      description: "Acesso direto: o endereço é calculado a partir do índice.",
      touched: [],
      target: i,
    },
    list: {
      steps: i + 1,
      description: `Percorre ${plural(i + 1, "nó", "nós")} seguindo os ponteiros até chegar ao item.`,
      touched: interval(0, i - 1),
      target: i,
    },
  };
}

// custo de inserir um item na posição i (0 a n)
export function insertCost(n: number, i: number): OperationResult {
  const shifted = n - i;
  return {
    array: {
      steps: shifted + 1,
      description:
        shifted === 0
          ? "Insere no fim: há espaço livre, nenhum item precisa mudar de lugar."
          : `Desloca ${plural(shifted, "item", "itens")} uma posição para a direita e grava o novo.`,
      touched: interval(i, n - 1),
      target: i,
    },
    list: {
      steps: i + 1,
      description:
        i === 0
          ? "Insere no início: só o novo nó aponta para o antigo primeiro. Nada é percorrido."
          : `Percorre ${plural(i, "nó", "nós")} até o anterior e troca dois ponteiros.`,
      touched: interval(0, i - 1),
      target: i,
    },
  };
}

// custo de remover o item na posição i (0 a n-1)
export function removeCost(n: number, i: number): OperationResult {
  const shifted = n - 1 - i;
  return {
    array: {
      steps: shifted + 1,
      description:
        shifted === 0
          ? "Remove o último: nenhum item precisa ser deslocado."
          : `Desloca ${plural(shifted, "item", "itens")} uma posição para a esquerda para fechar o buraco.`,
      touched: interval(i + 1, n - 1),
      target: i,
    },
    list: {
      steps: i + 1,
      description:
        i === 0
          ? "Remove o primeiro: a cabeça da lista passa a apontar para o segundo."
          : `Percorre ${plural(i, "nó", "nós")} até o anterior e faz o ponteiro pular o nó removido.`,
      touched: interval(0, i - 1),
      target: i,
    },
  };
}
