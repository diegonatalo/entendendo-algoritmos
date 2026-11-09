export const CODIGOS_CAP09 = {
  mochila: `function mochila(itens, capacidade) {
  // tabela[i][c - 1]: melhor valor usando os itens 0..i com capacidade c
  const tabela = itens.map(() => Array(capacidade).fill(0));

  for (let i = 0; i < itens.length; i++) {
    const { peso, valor } = itens[i];

    for (let c = 1; c <= capacidade; c++) {
      const sem = i > 0 ? tabela[i - 1][c - 1] : 0;   // linha de cima: sem o item
      const sobra = c - peso;
      let com = 0;                                     // com o item (se couber)
      if (sobra >= 0) {
        com = valor + (i > 0 && sobra > 0 ? tabela[i - 1][sobra - 1] : 0);
      }
      tabela[i][c - 1] = Math.max(sem, com);
    }
  }

  return tabela[itens.length - 1][capacidade - 1];
}`,

  subcadeia: `// consecutiva = true: subcadeia (sem buracos); false: subsequência
function subcadeiaComum(a, b, consecutiva) {
  const t = Array.from({ length: a.length }, () => Array(b.length).fill(0));
  const celula = (i, j) => (i < 0 || j < 0 ? 0 : t[i][j]);
  let maior = 0;

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (a[i] === b[j]) {
        t[i][j] = celula(i - 1, j - 1) + 1;   // letras iguais: diagonal + 1
      } else {
        t[i][j] = consecutiva
          ? 0                                                   // quebrou a sequência
          : Math.max(celula(i - 1, j), celula(i, j - 1));      // herda o melhor vizinho
      }
      maior = Math.max(maior, t[i][j]);
    }
  }

  return consecutiva ? maior : celula(a.length - 1, b.length - 1);   // tamanho da resposta
}`,
} as const;
