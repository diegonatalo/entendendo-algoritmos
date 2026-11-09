import {
  SubstringMode,
  SubstringStep,
  SubstringResult,
} from "@/types/substring";

// tabela[i][j] compara as letras a[i] e b[j]
//  - subcadeia (letras consecutivas): letras iguais = diagonal + 1; diferentes = 0
//  - subsequência (letras em ordem, podem ter buracos): iguais = diagonal + 1;
//    diferentes = o maior entre a célula de cima e a da esquerda
export function commonSubstring(
  a: string,
  b: string,
  mode: SubstringMode,
): SubstringResult {
  const table: number[][] = Array.from({ length: a.length }, () =>
    Array(b.length).fill(0),
  );
  const steps: SubstringStep[] = [];

  const cell = (i: number, j: number) =>
    i < 0 || j < 0 ? 0 : table[i][j];

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      const equal = a[i] === b[j];
      const diagonal = cell(i - 1, j - 1);
      let value: number;
      let description: string;

      if (equal) {
        value = diagonal + 1;
        description = `"${a[i]}" = "${b[j]}": diagonal (${diagonal}) + 1 = ${value}`;
      } else if (mode === "substring") {
        value = 0;
        description = `"${a[i]}" ≠ "${b[j]}": a sequência é interrompida, vale 0`;
      } else {
        const cima = cell(i - 1, j);
        const left = cell(i, j - 1);
        value = Math.max(cima, left);
        description = `"${a[i]}" ≠ "${b[j]}": maior entre cima (${cima}) e esquerda (${left}) = ${value}`;
      }

      table[i][j] = value;
      steps.push({ line: i, column: j, value, equal, description });
    }
  }

  const resultCells: [number, number][] = [];
  let result = "";

  if (mode === "substring") {
    let best = 0;
    let end: [number, number] = [0, 0];
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b.length; j++) {
        if (table[i][j] > best) {
          best = table[i][j];
          end = [i, j];
        }
      }
    }
    for (let k = 0; k < best; k++) {
      resultCells.unshift([end[0] - k, end[1] - k]);
    }
    result = a.slice(end[0] - best + 1, end[0] + 1);
    if (best === 0) result = "";
  } else {
    let i = a.length - 1;
    let j = b.length - 1;
    while (i >= 0 && j >= 0) {
      if (a[i] === b[j]) {
        result = a[i] + result;
        resultCells.unshift([i, j]);
        i--;
        j--;
      } else if (cell(i - 1, j) >= cell(i, j - 1)) {
        i--;
      } else {
        j--;
      }
    }
  }

  return { table, steps, result, resultCells };
}
