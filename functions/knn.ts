import {
  PontoKnn,
  PontoRegressao,
  ResultadoKnn,
  ResultadoRegressao,
} from "@/@types/knn";

export function distancia(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// regressão: em vez de votar uma categoria, tira a média dos valores dos vizinhos
export function regressaoKnn(
  pontos: PontoRegressao[],
  novo: { x: number; y: number },
  k: number,
): ResultadoRegressao {
  const vizinhos = pontos
    .map((ponto) => ({ ponto, distancia: distancia(ponto, novo) }))
    .sort((a, b) => a.distancia - b.distancia)
    .slice(0, k);

  const media =
    vizinhos.reduce((soma, v) => soma + v.ponto.valor, 0) / vizinhos.length;

  return { vizinhos, media };
}

export function knn(
  pontos: PontoKnn[],
  novo: { x: number; y: number },
  k: number,
): ResultadoKnn {
  const vizinhos = pontos
    .map((ponto) => ({ ponto, distancia: distancia(ponto, novo) }))
    .sort((a, b) => a.distancia - b.distancia)
    .slice(0, k);

  const votos = { laranja: 0, toranja: 0 };
  for (const { ponto } of vizinhos) {
    votos[ponto.classe]++;
  }

  // em caso de empate, vale a classe do vizinho mais próximo
  const classe =
    votos.laranja === votos.toranja
      ? vizinhos[0].ponto.classe
      : votos.laranja > votos.toranja
        ? "laranja"
        : "toranja";

  return { vizinhos, votos, classe };
}
