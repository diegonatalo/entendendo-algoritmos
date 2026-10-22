import { Passo, ResultadoBusca } from "@/@types/busca";

export function buscaBinaria(arr: number[], alvo: number): ResultadoBusca {
  let inicio = 0;
  let fim = arr.length - 1;
  let tentativas = 0;

  // pior caso: cada tentativa descarta pelo menos metade, então são ⌊log₂ n⌋ + 1 tentativas
  const maxTentativas = arr.length > 0 ? Math.floor(Math.log2(arr.length)) + 1 : 0;
  const passos: Passo[] = [];

  while (inicio <= fim) {
    tentativas++;

    const meio = Math.floor((inicio + fim) / 2);

    const arrayAtual = arr.slice(inicio, fim + 1);

    passos.push({
      tentativa: tentativas,
      arrayAtual,
      meio,
      valorMeio: arr[meio],
    });

    if (arr[meio] === alvo) {
      return {
        indice: meio,
        tentativas,
        maxTentativas,
        passos,
      };
    }
    if (arr[meio] < alvo) {
      inicio = meio + 1;
    } else {
      fim = meio - 1;
    }
  }

  return { indice: -1, tentativas, maxTentativas, passos };
}
