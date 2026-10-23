export const CODIGOS_CAP06 = {
  buscaEmLargura: `function buscaEmLargura(grafo, inicio, alvo) {
  const fila = [inicio];
  const verificados = [];
  const pai = { [inicio]: null };   // quem descobriu cada nó

  while (fila.length > 0) {
    const atual = fila.shift();                   // primeiro a entrar, primeiro a sair
    if (verificados.includes(atual)) continue;    // já verificado: ignora
    verificados.push(atual);

    if (atual === alvo) {
      const caminho = [];
      for (let no = atual; no !== null; no = pai[no]) caminho.unshift(no);
      return caminho;                             // caminho com menos arestas
    }

    for (const vizinho of grafo[atual] ?? []) {
      fila.push(vizinho);
      if (!(vizinho in pai)) pai[vizinho] = atual;
    }
  }

  return null;   // não existe caminho
}`,

  ordenacaoTopologica: `// grafo[a] = tarefas que só podem começar depois de a
function ordenacaoTopologica(grafo) {
  const tarefas = Object.keys(grafo);
  const faltam = {};   // quantas dependências ainda faltam para cada tarefa
  for (const t of tarefas) faltam[t] = 0;
  for (const t of tarefas) for (const d of grafo[t]) faltam[d]++;

  const fila = tarefas.filter((t) => faltam[t] === 0);   // já estão livres
  const ordem = [];

  while (fila.length > 0) {
    const atual = fila.shift();
    ordem.push(atual);

    for (const d of grafo[atual]) {
      faltam[d]--;
      if (faltam[d] === 0) fila.push(d);   // ficou livre
    }
  }

  return ordem.length === tarefas.length ? ordem : null;   // null: há ciclo
}`,
} as const;
