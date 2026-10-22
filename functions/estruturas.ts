import { ResultadoOperacao } from "@/@types/estruturas";

const intervalo = (de: number, ate: number) =>
  Array.from({ length: Math.max(0, ate - de + 1) }, (_, i) => de + i);

const plural = (n: number, singular: string, pluralForma: string) =>
  `${n} ${n === 1 ? singular : pluralForma}`;

// custo de ler o item na posição i (0 a n-1)
export function custoLer(n: number, i: number): ResultadoOperacao {
  return {
    array: {
      passos: 1,
      descricao: "Acesso direto: o endereço é calculado a partir do índice.",
      tocados: [],
      alvo: i,
    },
    lista: {
      passos: i + 1,
      descricao: `Percorre ${plural(i + 1, "nó", "nós")} seguindo os ponteiros até chegar ao item.`,
      tocados: intervalo(0, i - 1),
      alvo: i,
    },
  };
}

// custo de inserir um item na posição i (0 a n)
export function custoInserir(n: number, i: number): ResultadoOperacao {
  const deslocados = n - i;
  return {
    array: {
      passos: deslocados + 1,
      descricao:
        deslocados === 0
          ? "Insere no fim: há espaço livre, nenhum item precisa mudar de lugar."
          : `Desloca ${plural(deslocados, "item", "itens")} uma posição para a direita e grava o novo.`,
      tocados: intervalo(i, n - 1),
      alvo: i,
    },
    lista: {
      passos: i + 1,
      descricao:
        i === 0
          ? "Insere no início: só o novo nó aponta para o antigo primeiro. Nada é percorrido."
          : `Percorre ${plural(i, "nó", "nós")} até o anterior e troca dois ponteiros.`,
      tocados: intervalo(0, i - 1),
      alvo: i,
    },
  };
}

// custo de remover o item na posição i (0 a n-1)
export function custoRemover(n: number, i: number): ResultadoOperacao {
  const deslocados = n - 1 - i;
  return {
    array: {
      passos: deslocados + 1,
      descricao:
        deslocados === 0
          ? "Remove o último: nenhum item precisa ser deslocado."
          : `Desloca ${plural(deslocados, "item", "itens")} uma posição para a esquerda para fechar o buraco.`,
      tocados: intervalo(i + 1, n - 1),
      alvo: i,
    },
    lista: {
      passos: i + 1,
      descricao:
        i === 0
          ? "Remove o primeiro: a cabeça da lista passa a apontar para o segundo."
          : `Percorre ${plural(i, "nó", "nós")} até o anterior e faz o ponteiro pular o nó removido.`,
      tocados: intervalo(0, i - 1),
      alvo: i,
    },
  };
}
