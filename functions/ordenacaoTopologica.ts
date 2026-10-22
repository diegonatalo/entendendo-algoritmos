import {
  GrafoDependencias,
  PassoTopologico,
  ResultadoTopologico,
} from "@/@types/topologica";

// grafo[a] = tarefas que só podem começar depois de a
// algoritmo de Kahn: remove repetidamente as tarefas sem dependências pendentes
export function ordenacaoTopologica(grafo: GrafoDependencias): ResultadoTopologico {
  const nos = Object.keys(grafo);
  const grausEntrada: Record<string, number> = {};
  for (const no of nos) grausEntrada[no] = 0;
  for (const destinos of Object.values(grafo)) {
    for (const destino of destinos) grausEntrada[destino]++;
  }

  const fila = nos.filter((no) => grausEntrada[no] === 0);
  const ordem: string[] = [];
  const passos: PassoTopologico[] = [];

  function registrar(tipo: PassoTopologico["tipo"], atual: string | null, descricao: string) {
    passos.push({
      tipo,
      atual,
      ordem: [...ordem],
      fila: [...fila],
      grausEntrada: { ...grausEntrada },
      descricao,
    });
  }

  registrar(
    "inicio",
    null,
    `Sem dependências pendentes: ${fila.length > 0 ? fila.join(", ") : "nenhuma tarefa"}`,
  );

  while (fila.length > 0) {
    const atual = fila.shift()!;
    ordem.push(atual);

    const liberadas: string[] = [];
    for (const destino of grafo[atual]) {
      grausEntrada[destino]--;
      if (grausEntrada[destino] === 0) {
        fila.push(destino);
        liberadas.push(destino);
      }
    }

    registrar(
      "remove",
      atual,
      liberadas.length > 0
        ? `Faz ${atual}. Liberadas: ${liberadas.join(", ")}`
        : `Faz ${atual}. Nenhuma tarefa nova foi liberada`,
    );
  }

  const presos = nos.filter((no) => !ordem.includes(no));
  const temCiclo = presos.length > 0;

  registrar(
    "fim",
    null,
    temCiclo
      ? `Ciclo! Estas tarefas dependem umas das outras e nunca ficam livres: ${presos.join(", ")}`
      : `Ordem válida: ${ordem.join(" → ")}`,
  );

  return { passos, ordem, temCiclo, presos };
}
