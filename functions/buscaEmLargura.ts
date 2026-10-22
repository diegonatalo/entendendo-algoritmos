import { Grafo, PassoBFS, ResultadoBFS } from "@/@types/grafo";

export function buscaEmLargura(
  grafo: Grafo,
  inicio: string,
  alvo: string,
): ResultadoBFS {
  const fila: string[] = [inicio];
  const visitados: string[] = [];
  const pai: Record<string, string | null> = { [inicio]: null };
  const passos: PassoBFS[] = [];

  function registrar(
    tipo: PassoBFS["tipo"],
    atual: string | null,
    descricao: string,
  ) {
    passos.push({
      tipo,
      atual,
      fila: [...fila],
      visitados: [...visitados],
      descricao,
    });
  }

  registrar("inicio", null, `Começa na fila com ${inicio}`);

  while (fila.length > 0) {
    const atual = fila.shift()!;

    // evita verificar a mesma pessoa duas vezes (e entrar em loop com ciclos)
    if (visitados.includes(atual)) {
      registrar("ignora", atual, `${atual} já foi verificado: ignora`);
      continue;
    }

    visitados.push(atual);

    if (atual === alvo) {
      const caminho: string[] = [];
      for (let no: string | null = atual; no !== null; no = pai[no]) {
        caminho.unshift(no);
      }
      registrar("achou", atual, `${atual} é o alvo! Caminho encontrado`);
      return { passos, caminho };
    }

    const vizinhos = grafo[atual] ?? [];
    for (const vizinho of vizinhos) {
      fila.push(vizinho);
      if (!(vizinho in pai)) {
        pai[vizinho] = atual;
      }
    }

    registrar(
      "visita",
      atual,
      vizinhos.length > 0
        ? `Verifica ${atual}: não é o alvo. Adiciona à fila: ${vizinhos.join(", ")}`
        : `Verifica ${atual}: não é o alvo e não tem vizinhos`,
    );
  }

  registrar("fim", null, "A fila acabou: não existe caminho até o alvo");
  return { passos, caminho: null };
}
