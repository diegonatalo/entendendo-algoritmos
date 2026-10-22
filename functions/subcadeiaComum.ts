import {
  ModoSubcadeia,
  PassoSubcadeia,
  ResultadoSubcadeia,
} from "@/@types/subcadeia";

// tabela[i][j] compara as letras a[i] e b[j]
//  - subcadeia (letras consecutivas): letras iguais = diagonal + 1; diferentes = 0
//  - subsequência (letras em ordem, podem ter buracos): iguais = diagonal + 1;
//    diferentes = o maior entre a célula de cima e a da esquerda
export function subcadeiaComum(
  a: string,
  b: string,
  modo: ModoSubcadeia,
): ResultadoSubcadeia {
  const tabela: number[][] = Array.from({ length: a.length }, () =>
    Array(b.length).fill(0),
  );
  const passos: PassoSubcadeia[] = [];

  const celula = (i: number, j: number) =>
    i < 0 || j < 0 ? 0 : tabela[i][j];

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      const iguais = a[i] === b[j];
      const diagonal = celula(i - 1, j - 1);
      let valor: number;
      let descricao: string;

      if (iguais) {
        valor = diagonal + 1;
        descricao = `"${a[i]}" = "${b[j]}": diagonal (${diagonal}) + 1 = ${valor}`;
      } else if (modo === "subcadeia") {
        valor = 0;
        descricao = `"${a[i]}" ≠ "${b[j]}": a sequência é interrompida, vale 0`;
      } else {
        const cima = celula(i - 1, j);
        const esquerda = celula(i, j - 1);
        valor = Math.max(cima, esquerda);
        descricao = `"${a[i]}" ≠ "${b[j]}": maior entre cima (${cima}) e esquerda (${esquerda}) = ${valor}`;
      }

      tabela[i][j] = valor;
      passos.push({ linha: i, coluna: j, valor, iguais, descricao });
    }
  }

  const celulasDoResultado: [number, number][] = [];
  let resultado = "";

  if (modo === "subcadeia") {
    let melhor = 0;
    let fim: [number, number] = [0, 0];
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b.length; j++) {
        if (tabela[i][j] > melhor) {
          melhor = tabela[i][j];
          fim = [i, j];
        }
      }
    }
    for (let k = 0; k < melhor; k++) {
      celulasDoResultado.unshift([fim[0] - k, fim[1] - k]);
    }
    resultado = a.slice(fim[0] - melhor + 1, fim[0] + 1);
    if (melhor === 0) resultado = "";
  } else {
    let i = a.length - 1;
    let j = b.length - 1;
    while (i >= 0 && j >= 0) {
      if (a[i] === b[j]) {
        resultado = a[i] + resultado;
        celulasDoResultado.unshift([i, j]);
        i--;
        j--;
      } else if (celula(i - 1, j) >= celula(i, j - 1)) {
        i--;
      } else {
        j--;
      }
    }
  }

  return { tabela, passos, resultado, celulasDoResultado };
}
