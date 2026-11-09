export type ResultadoVoto = {
  aceito: boolean;
  votantes: string[];
  // quantas comparações uma busca na lista faria até decidir
  comparacoesLista: number;
};

// detecção de duplicatas: cada pessoa só pode votar uma vez.
// Com uma tabela hash a checagem é uma única consulta; em uma lista, é preciso comparar com cada nome.
export function votar(votantes: string[], nome: string): ResultadoVoto {
  const normalizado = nome.trim().toLowerCase();
  const posicao = votantes.indexOf(normalizado);
  const jaVotou = posicao !== -1;

  return {
    aceito: !jaVotou,
    votantes: jaVotou ? votantes : [...votantes, normalizado],
    comparacoesLista: jaVotou ? posicao + 1 : votantes.length,
  };
}

export const CUSTO_ACERTO_MS = 1;
export const CUSTO_FALHA_MS = 800;

export type ResultadoCache = {
  acerto: boolean;
  cache: string[];
  custoMs: number;
};

// cache de páginas: se a página já está guardada, devolve na hora;
// senão busca no servidor (lento) e guarda para a próxima vez.
export function consultarCache(cache: string[], url: string): ResultadoCache {
  const acerto = cache.includes(url);
  return {
    acerto,
    cache: acerto ? cache : [...cache, url],
    custoMs: acerto ? CUSTO_ACERTO_MS : CUSTO_FALHA_MS,
  };
}
