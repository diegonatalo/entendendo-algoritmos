import { ExemploDigito, ResultadoOcr } from "@/@types/ocr";

export const LARGURA = 5;
export const ALTURA = 7;

// cada dígito é uma grade 5 × 7 de pixels: "#" aceso, "." apagado
const MODELOS: string[][] = [
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

export const modeloDoDigito = (digito: number): number[] =>
  MODELOS[digito].flatMap((linha) => [...linha].map((c) => (c === "#" ? 1 : 0)));

// gerador pseudoaleatório fixo, para o treino ser sempre o mesmo
function sequencia(semente: number) {
  let s = semente;
  return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
}

// treino: o modelo de cada dígito mais duas versões "mal escritas" (3 pixels trocados)
export const TREINO: ExemploDigito[] = MODELOS.flatMap((_, digito) => {
  const base = modeloDoDigito(digito);
  const aleatorio = sequencia(97 * (digito + 1));
  const variantes = [0, 1].map(() => {
    const pixels = [...base];
    for (let i = 0; i < 3; i++) {
      const p = Math.floor(aleatorio() * pixels.length);
      pixels[p] = pixels[p] === 1 ? 0 : 1;
    }
    return { digito, pixels };
  });
  return [{ digito, pixels: base }, ...variantes];
});

const hamming = (a: number[], b: number[]) =>
  a.reduce((soma, v, i) => soma + (v !== b[i] ? 1 : 0), 0);

// o KNN do capítulo 10 aplicado a OCR: cada imagem vira um ponto (os 35 pixels são as
// "características") e a distância é o número de pixels diferentes
export function reconhecerDigito(pixels: number[], k: number): ResultadoOcr {
  const vizinhos = TREINO.map((exemplo) => ({
    exemplo,
    distancia: hamming(pixels, exemplo.pixels),
  }))
    .sort((a, b) => a.distancia - b.distancia)
    .slice(0, k);

  const votos = Array(10).fill(0);
  for (const { exemplo } of vizinhos) votos[exemplo.digito]++;

  const maisVotos = Math.max(...votos);
  // em empate, vale o vizinho mais próximo entre os mais votados
  const digito =
    vizinhos.find((v) => votos[v.exemplo.digito] === maisVotos)?.exemplo.digito ?? 0;

  return { vizinhos, votos, digito };
}
