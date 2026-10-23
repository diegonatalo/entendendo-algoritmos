"use client";

import { fatorial } from "@/functions/fatorial";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";

const inputClass =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30";

const botao =
  "cursor-pointer whitespace-nowrap rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-700 disabled:hover:text-zinc-300";

const corDoTipo = {
  empilha: "text-amber-400",
  base: "text-sky-400",
  retorna: "text-emerald-400",
};

export default function Recursao() {
  const [resultado, setResultado] = useState<ReturnType<
    typeof fatorial
  > | null>(null);
  const [n, setN] = useState(0);
  const [passoAtual, setPassoAtual] = useState(0);

  const passo = resultado?.passos[passoAtual];

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Recursão</h1>
        <p className="text-zinc-400">
          Uma função que chama a si mesma. Cada chamada vai para a pilha até
          chegar ao caso base; depois as chamadas retornam, da última para a
          primeira. Exemplo: o fatorial.
        </p>
        <Explicacao
          simples={EXPLICACOES.recursao.simples}
          tecnica={EXPLICACOES.recursao.tecnica}
          codigo={CODIGOS.fatorial}
        />
      </header>

      <form
        className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const valor = Number(e.currentTarget.n.value);
          setN(valor);
          setResultado(fatorial(valor));
          setPassoAtual(0);
        }}
      >
        <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
          Calcular o fatorial de
          <input
            className={inputClass}
            name="n"
            type="number"
            min="1"
            max="15"
            placeholder="Ex.: 5"
            required
          />
        </label>
        <button
          className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:bg-emerald-600"
          type="submit"
        >
          Calcular
        </button>
      </form>

      {resultado && passo && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Resultado"
              value={resultado.resultado.toLocaleString("pt-BR")}
              tone="text-emerald-400"
            />
            <Stat
              label="Chamadas"
              value={String(n)}
              tone="text-amber-400"
            />
            <Stat
              label="Passo"
              value={`${passoAtual + 1} / ${resultado.passos.length}`}
              tone="text-zinc-100"
            />
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={`text-sm font-medium ${corDoTipo[passo.tipo]}`}>
                {passo.descricao}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  className={botao}
                  disabled={passoAtual === 0}
                  onClick={() => setPassoAtual((p) => p - 1)}
                >
                  ← Anterior
                </button>
                <button
                  className={botao}
                  disabled={passoAtual === resultado.passos.length - 1}
                  onClick={() => setPassoAtual((p) => p + 1)}
                >
                  Próximo →
                </button>
              </div>
            </div>

            <div className="flex min-h-24 flex-col-reverse gap-1.5">
              {passo.pilha.map((quadro, i) => {
                const topo = i === passo.pilha.length - 1;
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between rounded-lg px-4 py-2 font-mono text-sm ${
                      topo
                        ? "bg-amber-500 font-semibold text-amber-950 ring-2 ring-amber-300"
                        : "bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    <span>fatorial({quadro.n})</span>
                    <span>
                      {quadro.retorno !== undefined
                        ? `→ ${quadro.retorno.toLocaleString("pt-BR")}`
                        : "aguardando…"}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-zinc-500">
              O topo da pilha (em âmbar) é a chamada em execução.
            </p>
          </div>

          <ol className="flex flex-col gap-1 text-sm">
            {resultado.passos.map((p, i) => (
              <li key={i}>
                <button
                  onClick={() => setPassoAtual(i)}
                  className={`w-full cursor-pointer rounded-lg px-3 py-1.5 text-left transition-colors hover:bg-zinc-800/60 ${
                    i === passoAtual
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-500"
                  }`}
                >
                  <span className="mr-2 font-mono text-xs">{i + 1}.</span>
                  {p.descricao}
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className={`mt-1 text-2xl font-semibold ${tone}`}>{value}</div>
    </div>
  );
}
