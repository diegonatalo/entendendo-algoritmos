import {
  EstrategiaPivo,
  NoQuicksort,
  ResultadoQuicksort,
} from "@/@types/quicksort";

export function quicksort(
  entrada: number[],
  estrategia: EstrategiaPivo = "meio",
): ResultadoQuicksort {
  let comparacoes = 0;

  function ordenar(lista: number[], nivel: number): [NoQuicksort, number] {
    // caso base: listas vazias ou com um elemento já estão ordenadas
    if (lista.length < 2) {
      return [{ lista, ordenada: lista }, nivel];
    }

    const indicePivo =
      estrategia === "meio" ? Math.floor(lista.length / 2) : 0;
    const pivo = lista[indicePivo];
    const resto = lista.filter((_, i) => i !== indicePivo);
    comparacoes += resto.length;

    const menoresLista = resto.filter((n) => n <= pivo);
    const maioresLista = resto.filter((n) => n > pivo);

    const [menores, profMenores] = ordenar(menoresLista, nivel + 1);
    const [maiores, profMaiores] = ordenar(maioresLista, nivel + 1);

    return [
      {
        lista,
        pivo,
        indicePivo,
        menores,
        maiores,
        ordenada: [...menores.ordenada, pivo, ...maiores.ordenada],
      },
      Math.max(profMenores, profMaiores),
    ];
  }

  const [raiz, profundidade] = ordenar(entrada, 1);
  return { raiz, ordenado: raiz.ordenada, comparacoes, profundidade };
}
