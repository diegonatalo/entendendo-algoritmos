import {
  Aula,
  PassoCalendario,
  ResultadoCalendario,
} from "@/@types/calendario";

export function formatarHora(hora: number): string {
  const h = Math.floor(hora);
  const min = Math.round((hora - h) * 60);
  return `${h}:${String(min).padStart(2, "0")}`;
}

// guloso: sempre pega a aula que termina primeiro e não conflita com as já escolhidas
export function calendarioGuloso(aulas: Aula[]): ResultadoCalendario {
  const ordenadas = [...aulas].sort((a, b) => a.fim - b.fim);
  const escolhidas: string[] = [];
  const passos: PassoCalendario[] = [];
  let ultimoFim = -Infinity;

  for (const aula of ordenadas) {
    const aceita = aula.inicio >= ultimoFim;
    if (aceita) {
      escolhidas.push(aula.nome);
      ultimoFim = aula.fim;
    }

    passos.push({
      aula,
      aceita,
      escolhidas: [...escolhidas],
      descricao: aceita
        ? `${aula.nome} (${formatarHora(aula.inicio)}–${formatarHora(aula.fim)}) termina cedo e não conflita: entra`
        : `${aula.nome} (${formatarHora(aula.inicio)}–${formatarHora(aula.fim)}) começa antes de ${formatarHora(ultimoFim)}: conflita, fica de fora`,
    });
  }

  return { ordenadas, passos, escolhidas };
}
