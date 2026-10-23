export const CODIGOS_CAP02 = {
  arraysListas: `// Array: inserir na posição i desloca todos os itens seguintes
function inserirNoArray(array, i, valor) {
  for (let j = array.length; j > i; j--) {
    array[j] = array[j - 1];   // um passo por item deslocado
  }
  array[i] = valor;
}

// Lista encadeada: cada nó aponta para o próximo
function inserirNaLista(cabeca, i, valor) {
  const novo = { valor, proximo: null };

  if (i === 0) {                 // início: nada a percorrer
    novo.proximo = cabeca;
    return novo;
  }

  let anterior = cabeca;
  for (let k = 0; k < i - 1; k++) {
    anterior = anterior.proximo;   // um passo por nó percorrido
  }
  novo.proximo = anterior.proximo; // só dois ponteiros mudam
  anterior.proximo = novo;
  return cabeca;
}`,

  ordenacaoSelecao: `function indiceDoMenor(lista) {
  let menor = 0;
  for (let i = 1; i < lista.length; i++) {
    if (lista[i] < lista[menor]) menor = i;
  }
  return menor;
}

function ordenacaoSelecao(lista) {
  const restantes = [...lista];
  const ordenados = [];

  while (restantes.length > 0) {
    const i = indiceDoMenor(restantes);          // acha o menor
    ordenados.push(restantes.splice(i, 1)[0]);   // move para a lista ordenada
  }

  return ordenados;
}`,
} as const;
