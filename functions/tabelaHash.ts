import {
  ResultadoBuscaHash,
  ResultadoHash,
  ResultadoInsercao,
  TabelaHash,
} from "@/@types/hash";

export function criarTabela(tamanho: number): TabelaHash {
  return Array.from({ length: tamanho }, () => []);
}

// função hash didática: soma dos códigos dos caracteres, módulo o tamanho
export function funcaoHash(chave: string, tamanho: number): ResultadoHash {
  let soma = 0;
  for (let i = 0; i < chave.length; i++) {
    soma += chave.charCodeAt(i);
  }
  return { soma, indice: soma % tamanho };
}

export function inserir(
  tabela: TabelaHash,
  chave: string,
  valor: string,
): ResultadoInsercao {
  const { soma, indice } = funcaoHash(chave, tabela.length);
  const balde = tabela[indice];
  const existente = balde.findIndex((entrada) => entrada.chave === chave);
  const atualizou = existente !== -1;
  const colisao = !atualizou && balde.length > 0;

  const novoBalde = atualizou
    ? balde.map((entrada, i) => (i === existente ? { chave, valor } : entrada))
    : [...balde, { chave, valor }];

  return {
    tabela: tabela.map((b, i) => (i === indice ? novoBalde : b)),
    indice,
    soma,
    colisao,
    atualizou,
  };
}

export function buscar(tabela: TabelaHash, chave: string): ResultadoBuscaHash {
  const { soma, indice } = funcaoHash(chave, tabela.length);
  let comparacoes = 0;

  for (const entrada of tabela[indice]) {
    comparacoes++;
    if (entrada.chave === chave) {
      return { indice, soma, comparacoes, valor: entrada.valor };
    }
  }

  return { indice, soma, comparacoes };
}

export function redimensionar(
  tabela: TabelaHash,
  novoTamanho: number,
): TabelaHash {
  let nova = criarTabela(novoTamanho);
  for (const entrada of tabela.flat()) {
    nova = inserir(nova, entrada.chave, entrada.valor).tabela;
  }
  return nova;
}

export function fatorDeCarga(tabela: TabelaHash): number {
  return tabela.flat().length / tabela.length;
}
