export type VoteResult = {
  isAccepted: boolean;
  voters: string[];
  // quantas comparações uma busca na lista faria até decidir
  listComparisons: number;
};

// detecção de duplicatas: cada pessoa só pode votar uma vez.
// Com uma tabela hash a checagem é uma única consulta; em uma lista, é preciso comparar com cada nome.
export function vote(voters: string[], name: string): VoteResult {
  const normalizedValue = name.trim().toLowerCase();
  const position = voters.indexOf(normalizedValue);
  const hasVoted = position !== -1;

  return {
    isAccepted: !hasVoted,
    voters: hasVoted ? voters : [...voters, normalizedValue],
    listComparisons: hasVoted ? position + 1 : voters.length,
  };
}

export const HIT_COST_MS = 1;
export const MISS_COST_MS = 800;

export type CacheResult = {
  hit: boolean;
  cache: string[];
  costMs: number;
};

// cache de páginas: se a página já está guardada, devolve na hora;
// senão busca no servidor (lento) e guarda para a próxima vez.
export function queryCache(cache: string[], url: string): CacheResult {
  const hit = cache.includes(url);
  return {
    hit,
    cache: hit ? cache : [...cache, url],
    costMs: hit ? HIT_COST_MS : MISS_COST_MS,
  };
}
