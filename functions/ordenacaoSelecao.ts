import { PassoOrdenacao, ResultadoOrdenacao } from "@/@types/ordenacao";

function indiceDoMenor(arr: number[]): number {
  let indiceMenor = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[indiceMenor]) {
      indiceMenor = i;
    }
  }
  return indiceMenor;
}

export function ordenacaoSelecao(entrada: number[]): ResultadoOrdenacao {
  const restantes = [...entrada];
  const ordenados: number[] = [];
  const passos: PassoOrdenacao[] = [];
  let comparacoes = 0;

  while (restantes.length > 0) {
    const indiceMenor = indiceDoMenor(restantes);
    comparacoes += restantes.length - 1;

    passos.push({
      rodada: passos.length + 1,
      restantes: [...restantes],
      indiceMenor,
      ordenados: [...ordenados],
    });

    ordenados.push(restantes.splice(indiceMenor, 1)[0]);
  }

  return { ordenado: ordenados, comparacoes, passos };
}
