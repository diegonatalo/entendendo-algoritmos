export const CODIGOS_CAP07 = {
  dijkstra: `function dijkstra(grafo, inicio, fim) {
  const custos = {};
  const pais = {};
  for (const no in grafo) {
    custos[no] = Infinity;
    pais[no] = null;
  }
  custos[inicio] = 0;
  const processados = new Set();

  while (true) {
    // acha o nó mais barato ainda não processado
    let atual = null;
    for (const no in custos) {
      if (processados.has(no) || custos[no] === Infinity) continue;
      if (atual === null || custos[no] < custos[atual]) atual = no;
    }
    if (atual === null) break;

    // atualiza o custo dos vizinhos, se passar por aqui for mais barato
    for (const [vizinho, peso] of Object.entries(grafo[atual])) {
      if (custos[atual] + peso < custos[vizinho]) {
        custos[vizinho] = custos[atual] + peso;
        pais[vizinho] = atual;
      }
    }
    processados.add(atual);
  }

  if (custos[fim] === Infinity) return null;   // sem caminho
  const caminho = [];
  for (let no = fim; no !== null; no = pais[no]) caminho.unshift(no);
  return { custo: custos[fim], caminho };
}`,

  bellmanFord: `function bellmanFord(nos, arestas, inicio) {
  const custos = {};
  for (const no of nos) custos[no] = no === inicio ? 0 : Infinity;

  // relaxa todas as arestas V - 1 vezes
  for (let rodada = 1; rodada < nos.length; rodada++) {
    for (const { de, para, peso } of arestas) {
      if (custos[de] + peso < custos[para]) {
        custos[para] = custos[de] + peso;
      }
    }
  }

  // uma rodada extra: se ainda melhora, existe um ciclo negativo
  const cicloNegativo = arestas.some(
    ({ de, para, peso }) => custos[de] + peso < custos[para],
  );

  return { custos, cicloNegativo };
}`,
} as const;
