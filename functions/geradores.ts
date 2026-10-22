// geradores de listas para comparar algoritmos; a lista "aleatória" usa uma semente fixa
// para dar sempre o mesmo resultado
export function listaAleatoria(n: number, semente = 42): number[] {
  let s = semente;
  const proximo = () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
  return Array.from({ length: n }, () => Math.floor(proximo() * n * 10));
}

export const listaOrdenada = (n: number): number[] =>
  Array.from({ length: n }, (_, i) => i + 1);

export const listaInversa = (n: number): number[] =>
  Array.from({ length: n }, (_, i) => n - i);
