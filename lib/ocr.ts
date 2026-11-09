import { DigitExample, OcrResult } from "@/types/ocr";

export const WIDTH = 5;
export const HEIGHT = 7;

// cada dígito é uma grade 5 × 7 de pixels: "#" aceso, "." apagado
const MODELS: string[][] = [
  [".###.", "#...#", "#..##", "#.#.#", "##..#", "#...#", ".###."],
  ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
  [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],
  [".###.", "#...#", "....#", "..##.", "....#", "#...#", ".###."],
  ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
  ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."],
  ["..##.", ".#...", "#....", "####.", "#...#", "#...#", ".###."],
  ["#####", "....#", "...#.", "..#..", ".#...", ".#...", ".#..."],
  [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
  [".###.", "#...#", "#...#", ".####", "....#", "...#.", ".##.."],
];

export const digitModel = (digit: number): number[] =>
  MODELS[digit].flatMap((line) => [...line].map((c) => (c === "#" ? 1 : 0)));

// gerador pseudoaleatório fixo, para o treino ser sempre o mesmo
function sequence(seed: number) {
  let s = seed;
  return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
}

// treino: o modelo de cada dígito mais duas versões "mal escritas" (3 pixels trocados)
export const TRAINING: DigitExample[] = MODELS.flatMap((_, digit) => {
  const base = digitModel(digit);
  const randomItem = sequence(97 * (digit + 1));
  const variants = [0, 1].map(() => {
    const pixels = [...base];
    for (let i = 0; i < 3; i++) {
      const p = Math.floor(randomItem() * pixels.length);
      pixels[p] = pixels[p] === 1 ? 0 : 1;
    }
    return { digit, pixels };
  });
  return [{ digit, pixels: base }, ...variants];
});

const hamming = (a: number[], b: number[]) =>
  a.reduce((sum, v, i) => sum + (v !== b[i] ? 1 : 0), 0);

// o KNN do capítulo 10 aplicado a OCR: cada imagem vira um ponto (os 35 pixels são as
// "características") e a distância é o número de pixels diferentes
export function recognizeDigit(pixels: number[], k: number): OcrResult {
  const neighbors = TRAINING.map((example) => ({
    example,
    distance: hamming(pixels, example.pixels),
  }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k);

  const votes = Array(10).fill(0);
  for (const { example } of neighbors) votes[example.digit]++;

  const mostVotes = Math.max(...votes);
  // em empate, vale o vizinho mais próximo entre os mais votados
  const digit =
    neighbors.find((v) => votes[v.example.digit] === mostVotes)?.example.digit ?? 0;

  return { neighbors, votes, digit };
}
