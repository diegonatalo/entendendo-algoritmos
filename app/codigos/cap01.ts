export const CODIGOS_CAP01 = {
  buscaBinaria: `function buscaBinaria(lista, alvo) {
  let inicio = 0;
  let fim = lista.length - 1;

  while (inicio <= fim) {
    const meio = Math.floor((inicio + fim) / 2);

    if (lista[meio] === alvo) return meio;   // achou
    if (lista[meio] < alvo) inicio = meio + 1;   // descarta a metade esquerda
    else fim = meio - 1;                         // descarta a metade direita
  }

  return -1;   // não está na lista
}`,
} as const;
