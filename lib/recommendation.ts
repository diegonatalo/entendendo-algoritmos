import {
  Method,
  RecommendationResult,
  User,
} from "@/types/recommendation";

const average = (v: number[]) => v.reduce((s, x) => s + x, 0) / v.length;

export function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, x, i) => sum + (x - b[i]) ** 2, 0));
}

// subtrai de cada nota a média da própria pessoa: quem dá notas altas e quem dá notas
// baixas passam a ser comparados pelo quanto cada filme está acima ou abaixo do "normal" dela
export function normalize(ratings: number[]): number[] {
  const m = average(ratings);
  return ratings.map((n) => n - m);
}

// similaridade do cosseno: compara a direção das listas de notas, não o tamanho.
// Vai de -1 a 1; quanto mais perto de 1, mais parecidos os gostos
export function cosineSimilarity(a: number[], b: number[]): number {
  const product = a.reduce((s, x, i) => s + x * b[i], 0);
  const normA = Math.sqrt(a.reduce((s, x) => s + x * x, 0));
  const normB = Math.sqrt(b.reduce((s, x) => s + x * x, 0));
  return product / (normA * normB);
}

export function measure(method: Method, a: number[], b: number[]): number {
  if (method === "euclidean") return euclideanDistance(a, b);
  if (method === "normalized") return euclideanDistance(normalize(a), normalize(b));
  return cosineSimilarity(a, b);
}

// k-vizinhos: acha as k pessoas mais parecidas e prevê a nota do filme novo pela média delas
export function recommend(
  target: number[],
  others: User[],
  method: Method,
  k: number,
): RecommendationResult {
  const ranking = others
    .map((user) => ({ user, measure: measure(method, target, user.ratings) }))
    .sort((a, b) =>
      method === "cosine" ? b.measure - a.measure : a.measure - b.measure,
    );

  const chosenSet = ranking.slice(0, k);
  return {
    ranking,
    chosenSet,
    prediction: average(chosenSet.map((v) => v.user.newRating)),
  };
}
