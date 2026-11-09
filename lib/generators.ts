// geradores de listas para comparar algoritmos; a lista "aleatória" usa uma semente fixa
// para dar sempre o mesmo resultado
export function randomList(n: number, seed = 42): number[] {
  let s = seed;
  const nextItem = () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
  return Array.from({ length: n }, () => Math.floor(nextItem() * n * 10));
}

export const sortedList = (n: number): number[] =>
  Array.from({ length: n }, (_, i) => i + 1);

export const reversedList = (n: number): number[] =>
  Array.from({ length: n }, (_, i) => n - i);
