import { NoMesclagem, ResultadoMesclagem } from "@/@types/mesclagem";

// ordenação por mesclagem (merge sort): divide a lista ao meio, ordena cada metade
// recursivamente e junta as duas metades já ordenadas
export function mesclagem(entrada: number[]): ResultadoMesclagem {
  let comparacoes = 0;

  function juntar(a: number[], b: number[]): number[] {
    const resultado: number[] = [];
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
      comparacoes++;
      if (a[i] <= b[j]) resultado.push(a[i++]);
      else resultado.push(b[j++]);
    }
    return [...resultado, ...a.slice(i), ...b.slice(j)];
  }

  function ordenar(lista: number[], nivel: number): [NoMesclagem, number] {
    // caso base: listas vazias ou com um elemento já estão ordenadas
    if (lista.length < 2) {
      return [{ lista, ordenada: lista }, nivel];
    }

    const meio = Math.floor(lista.length / 2);
    const [esquerda, profEsquerda] = ordenar(lista.slice(0, meio), nivel + 1);
    const [direita, profDireita] = ordenar(lista.slice(meio), nivel + 1);

    return [
      {
        lista,
        esquerda,
        direita,
        ordenada: juntar(esquerda.ordenada, direita.ordenada),
      },
      Math.max(profEsquerda, profDireita),
    ];
  }

  const [raiz, profundidade] = ordenar(entrada, 1);
  return { raiz, ordenado: raiz.ordenada, comparacoes, profundidade };
}
