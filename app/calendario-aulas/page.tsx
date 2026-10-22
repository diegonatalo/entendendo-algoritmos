"use client";

import { calendarioGuloso, formatarHora } from "@/functions/calendario";
import { Aula } from "@/@types/calendario";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";
import { Legenda, Stat, botaoNavegacao, botaoPrimario } from "../components/ui";

type Exemplo = {
  titulo: string;
  descricao: string;
  aulas: Aula[];
};

const EXEMPLOS: Exemplo[] = [
  {
    titulo: "Aulas do livro",
    descricao:
      "Você quer assistir ao maior número possível de aulas em uma sala, sem sobreposição de horários.",
    aulas: [
      { nome: "Arte", inicio: 9, fim: 10 },
      { nome: "Inglês", inicio: 9.5, fim: 10.5 },
      { nome: "Matemática", inicio: 10, fim: 11 },
      { nome: "Computação", inicio: 10.5, fim: 11.5 },
      { nome: "Música", inicio: 11, fim: 12 },
    ],
  },
  {
    titulo: "Mais aulas",
    descricao:
      "Aulas de durações bem diferentes. Terminar cedo importa mais que começar cedo ou ser curta.",
    aulas: [
      { nome: "A", inicio: 8, fim: 12 },
      { nome: "B", inicio: 8, fim: 9 },
      { nome: "C", inicio: 9, fim: 10.5 },
      { nome: "D", inicio: 9.5, fim: 11 },
      { nome: "E", inicio: 11, fim: 12 },
      { nome: "F", inicio: 10, fim: 13 },
      { nome: "G", inicio: 12, fim: 14 },
    ],
  },
];

export default function CalendarioAulas() {
  const [indice, setIndice] = useState(0);
  const [executado, setExecutado] = useState(false);
  const [passoAtual, setPassoAtual] = useState(0);

  const exemplo = EXEMPLOS[indice];
  const resultado = calendarioGuloso(exemplo.aulas);
  const passo = resultado.passos[passoAtual];
  const final = passoAtual === resultado.passos.length - 1;

  const minimo = Math.min(...exemplo.aulas.map((a) => a.inicio));
  const maximo = Math.max(...exemplo.aulas.map((a) => a.fim));
  const pos = (hora: number) => ((hora - minimo) / (maximo - minimo)) * 100;

  function estadoDaAula(nome: string): "atual" | "aceita" | "recusada" | "pendente" {
    const i = resultado.passos.findIndex((p) => p.aula.nome === nome);
    if (!executado || i > passoAtual) return "pendente";
    if (i === passoAtual && !final) return "atual";
    return resultado.passos[i].aceita ? "aceita" : "recusada";
  }

  const cores = {
    atual: "bg-amber-500 text-amber-950",
    aceita: "bg-emerald-500 text-emerald-950",
    recusada: "bg-zinc-800 text-zinc-500 line-through",
    pendente: "bg-zinc-800 text-zinc-300",
  };

  // mostra as aulas na ordem em que o guloso as examina (fim mais cedo primeiro)
  const ordem = executado ? resultado.ordenadas : exemplo.aulas;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Calendário de aulas</h1>
        <p className="text-zinc-400">
          O problema que apresenta o algoritmo guloso: escolha a aula que
          termina primeiro, depois a próxima que começa depois dela, e repita.
          Aqui a estratégia gulosa chega à resposta ótima, mas só porque este
          problema tem essa propriedade.
        </p>
        <Explicacao
          simples={EXPLICACOES.calendarioAulas.simples}
          tecnica={EXPLICACOES.calendarioAulas.tecnica}
          codigo={CODIGOS.calendario}
        />
      </header>

      <div className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex flex-wrap gap-2">
          {EXEMPLOS.map((e, i) => (
            <button
              key={e.titulo}
              onClick={() => {
                setIndice(i);
                setExecutado(false);
                setPassoAtual(0);
              }}
              className={`cursor-pointer rounded-xl border px-4 py-2 text-sm transition-colors ${
                i === indice
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                  : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              {e.titulo}
            </button>
          ))}
        </div>
        <p className="text-sm text-zinc-400">{exemplo.descricao}</p>
        <button
          className={botaoPrimario}
          onClick={() => {
            setExecutado(true);
            setPassoAtual(0);
          }}
        >
          Executar algoritmo guloso
        </button>
      </div>

      <section className="fade-up flex flex-col gap-6">
        {executado && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Aulas escolhidas"
              value={String(passo.escolhidas.length)}
              tone="text-emerald-400"
            />
            <Stat
              label="Escolhidas"
              value={passo.escolhidas.join(", ") || "—"}
              tone="text-zinc-100"
              pequeno
            />
            <Stat
              label="Passo"
              value={`${passoAtual + 1} / ${resultado.passos.length}`}
              tone="text-zinc-100"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
          <Legenda cor="bg-amber-500" texto="Sendo examinada" />
          <Legenda cor="bg-emerald-500" texto="Escolhida" />
          <Legenda cor="bg-zinc-800" texto="Recusada ou ainda não examinada" />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          {executado && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p
                className={`text-sm font-medium ${passo.aceita ? "text-emerald-400" : "text-zinc-300"}`}
              >
                {passo.descricao}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  className={botaoNavegacao}
                  disabled={passoAtual === 0}
                  onClick={() => setPassoAtual((p) => p - 1)}
                >
                  ← Anterior
                </button>
                <button
                  className={botaoNavegacao}
                  disabled={final}
                  onClick={() => setPassoAtual((p) => p + 1)}
                >
                  Próximo →
                </button>
                <button
                  className={botaoNavegacao}
                  disabled={final}
                  onClick={() => setPassoAtual(resultado.passos.length - 1)}
                >
                  Ir ao fim
                </button>
              </div>
            </div>
          )}

          <div className="relative flex flex-col gap-1.5 pt-6">
            {Array.from(
              { length: Math.floor(maximo) - Math.ceil(minimo) + 1 },
              (_, i) => Math.ceil(minimo) + i,
            ).map((hora) => (
              <div
                key={hora}
                className="absolute top-0 bottom-0 border-l border-zinc-800"
                style={{ left: `${pos(hora)}%` }}
              >
                <span className="absolute -top-0 -translate-x-1/2 font-mono text-[10px] text-zinc-600">
                  {hora}h
                </span>
              </div>
            ))}
            {ordem.map((aula) => (
              <div key={aula.nome} className="relative h-9">
                <div
                  className={`absolute flex h-9 items-center overflow-hidden rounded-lg px-2 text-xs font-medium transition-colors ${cores[estadoDaAula(aula.nome)]}`}
                  style={{
                    left: `${pos(aula.inicio)}%`,
                    width: `${pos(aula.fim) - pos(aula.inicio)}%`,
                  }}
                  title={`${aula.nome}: ${formatarHora(aula.inicio)}–${formatarHora(aula.fim)}`}
                >
                  <span className="truncate">
                    {aula.nome}{" "}
                    <span className="font-mono opacity-70">
                      {formatarHora(aula.inicio)}–{formatarHora(aula.fim)}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
          {executado && (
            <p className="text-xs text-zinc-500">
              As aulas estão ordenadas pelo horário de término, que é a ordem em
              que o guloso as examina.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
