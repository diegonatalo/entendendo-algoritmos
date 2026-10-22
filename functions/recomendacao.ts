import {
  Metodo,
  ResultadoRecomendacao,
  Usuario,
} from "@/@types/recomendacao";

const media = (v: number[]) => v.reduce((s, x) => s + x, 0) / v.length;

export function distanciaEuclidiana(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((soma, x, i) => soma + (x - b[i]) ** 2, 0));
}

// subtrai de cada nota a média da própria pessoa: quem dá notas altas e quem dá notas
// baixas passam a ser comparados pelo quanto cada filme está acima ou abaixo do "normal" dela
export function normalizar(notas: number[]): number[] {
  const m = media(notas);
  return notas.map((n) => n - m);
}

// similaridade do cosseno: compara a direção das listas de notas, não o tamanho.
// Vai de -1 a 1; quanto mais perto de 1, mais parecidos os gostos
export function similaridadeCosseno(a: number[], b: number[]): number {
  const produto = a.reduce((s, x, i) => s + x * b[i], 0);
  const normaA = Math.sqrt(a.reduce((s, x) => s + x * x, 0));
  const normaB = Math.sqrt(b.reduce((s, x) => s + x * x, 0));
  return produto / (normaA * normaB);
}

export function medida(metodo: Metodo, a: number[], b: number[]): number {
  if (metodo === "euclidiana") return distanciaEuclidiana(a, b);
  if (metodo === "normalizada") return distanciaEuclidiana(normalizar(a), normalizar(b));
  return similaridadeCosseno(a, b);
}

// k-vizinhos: acha as k pessoas mais parecidas e prevê a nota do filme novo pela média delas
export function recomendar(
  alvo: number[],
  outros: Usuario[],
  metodo: Metodo,
  k: number,
): ResultadoRecomendacao {
  const ranking = outros
    .map((usuario) => ({ usuario, medida: medida(metodo, alvo, usuario.notas) }))
    .sort((a, b) =>
      metodo === "cosseno" ? b.medida - a.medida : a.medida - b.medida,
    );

  const escolhidos = ranking.slice(0, k);
  return {
    ranking,
    escolhidos,
    previsao: media(escolhidos.map((v) => v.usuario.notaNova)),
  };
}
