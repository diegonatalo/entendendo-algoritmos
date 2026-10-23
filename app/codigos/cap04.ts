export const CODIGOS_CAP04 = {
  divisaoConquista: `// Terreno de a × b: o lado do maior quadrado que o divide por igual é o MDC
function mdc(a, b) {
  if (b === 0) return a;      // caso base: sobrou só quadrados
  return mdc(b, a % b);       // caso recursivo: repete com o que sobrou
}

// Soma de uma lista: primeiro item + soma do resto
function soma(lista) {
  if (lista.length === 0) return 0;   // caso base
  const [primeiro, ...resto] = lista;
  return primeiro + soma(resto);      // caso recursivo
}`,

  quicksort: `function quicksort(lista) {
  if (lista.length < 2) return lista;   // caso base

  const meio = Math.floor(lista.length / 2);
  const pivo = lista[meio];                          // pivô no meio
  const resto = lista.filter((_, i) => i !== meio);  // lista sem o pivô

  const menores = resto.filter((n) => n <= pivo);
  const maiores = resto.filter((n) => n > pivo);

  return [...quicksort(menores), pivo, ...quicksort(maiores)];
}`,

  mesclagem: `function mesclagem(lista) {
  if (lista.length < 2) return lista;   // caso base

  const meio = Math.floor(lista.length / 2);
  const esquerda = mesclagem(lista.slice(0, meio));
  const direita = mesclagem(lista.slice(meio));

  return juntar(esquerda, direita);
}

// junta duas listas já ordenadas
function juntar(a, b) {
  const resultado = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    resultado.push(a[i] <= b[j] ? a[i++] : b[j++]);
  }

  return [...resultado, ...a.slice(i), ...b.slice(j)];
}`,
} as const;
