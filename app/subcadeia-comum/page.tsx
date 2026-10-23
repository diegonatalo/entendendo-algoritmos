"use client";

import { subcadeiaComum } from "@/functions/subcadeiaComum";
import { ModoSubcadeia } from "@/@types/subcadeia";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";

const MAX_LETRAS = 10;

const MODOS: Record<ModoSubcadeia, { titulo: string; explicacao: string }> = {
  subcadeia: {
    titulo: "Subcadeia (consecutiva)",
    explicacao:
      "Letras em comum lado a lado, sem buracos. Letras diferentes zeram a célula. É o exemplo do livro.",
  },
  subsequencia: {
    titulo: "Subsequência (com buracos)",
    explicacao:
      "Letras em comum na mesma ordem, mas podem estar separadas. Letras diferentes herdam o maior valor entre cima e esquerda.",
  },
};

const inputClass =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 font-mono text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30";

const botao =
  "cursor-pointer whitespace-nowrap rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-700 disabled:hover:text-zinc-300";

type Execucao = {
  a: string;
  b: string;
  modo: ModoSubcadeia;
  dados: ReturnType<typeof subcadeiaComum>;
};

export default function SubcadeiaComum() {
  const [modo, setModo] = useState<ModoSubcadeia>("subcadeia");
  const [execucao, setExecucao] = useState<Execucao | null>(null);
  const [passoAtual, setPassoAtual] = useState(0);
  const [erro, setErro] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const a = e.currentTarget.palavraA.value.trim().toLowerCase();
    const b = e.currentTarget.palavraB.value.trim().toLowerCase();

    if (!a || !b || a.length > MAX_LETRAS || b.length > MAX_LETRAS) {
      setErro(`Digite duas palavras de 1 a ${MAX_LETRAS} letras.`);
      return;
    }
    setErro("");
    setExecucao({ a, b, modo, dados: subcadeiaComum(a, b, modo) });
    setPassoAtual(0);
  }

  const dados = execucao?.dados;
  const total = dados?.passos.length ?? 0;
  const passo = dados?.passos[passoAtual];
  const final = passoAtual === total - 1;

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Subcadeia comum</h1>
        <p className="text-zinc-400">
          Outra aplicação da programação dinâmica: comparar duas palavras. Cada
          célula da tabela compara uma letra de cada palavra e reaproveita
          respostas anteriores. É a ideia por trás de corretores ortográficos e
          da comparação de DNA.
        </p>
        <Explicacao
          simples={EXPLICACOES.subcadeiaComum.simples}
          tecnica={EXPLICACOES.subcadeiaComum.tecnica}
          codigo={CODIGOS.subcadeia}
        />
      </header>

      <form
        className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-wrap gap-2">
          {(Object.keys(MODOS) as ModoSubcadeia[]).map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setModo(m)}
              className={`cursor-pointer rounded-xl border px-4 py-2 text-sm transition-colors ${
                m === modo
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                  : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              {MODOS[m].titulo}
            </button>
          ))}
        </div>
        <p className="text-sm text-zinc-400">{MODOS[modo].explicacao}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Primeira palavra (linhas)
            <input
              className={inputClass}
              name="palavraA"
              defaultValue="hish"
              maxLength={MAX_LETRAS}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Segunda palavra (colunas)
            <input
              className={inputClass}
              name="palavraB"
              defaultValue="fish"
              maxLength={MAX_LETRAS}
            />
          </label>
        </div>
        {erro && <p className="text-sm text-red-400">{erro}</p>}
        <button
          className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:bg-emerald-600"
          type="submit"
        >
          Preencher a tabela
        </button>
      </form>

      {execucao && dados && passo && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label={
                execucao.modo === "subcadeia"
                  ? "Maior subcadeia"
                  : "Maior subsequência"
              }
              value={dados.resultado ? `"${dados.resultado}"` : "nenhuma"}
              tone="text-emerald-400"
            />
            <Stat
              label="Tamanho"
              value={String(dados.resultado.length)}
              tone="text-amber-400"
            />
            <Stat
              label="Célula"
              value={`${passoAtual + 1} / ${total}`}
              tone="text-zinc-100"
            />
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p
                className={`font-mono text-sm ${passo.iguais ? "text-amber-400" : "text-zinc-300"}`}
              >
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
                  disabled={final}
                  onClick={() => setPassoAtual((p) => p + 1)}
                >
                  Próximo →
                </button>
                <button
                  className={botao}
                  disabled={final}
                  onClick={() => setPassoAtual(total - 1)}
                >
                  Ir ao fim
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="mx-auto border-separate border-spacing-1 text-center">
                <thead>
                  <tr>
                    <th />
                    {execucao.b.split("").map((letra, j) => (
                      <th
                        key={j}
                        className="h-8 w-10 font-mono text-sm font-medium text-zinc-400"
                      >
                        {letra}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {execucao.a.split("").map((letra, i) => (
                    <tr key={i}>
                      <th className="pr-2 font-mono text-sm font-medium text-zinc-400">
                        {letra}
                      </th>
                      {execucao.b.split("").map((_, j) => {
                        const ordem = i * execucao.b.length + j;
                        const preenchida = ordem <= passoAtual;
                        const atual = ordem === passoAtual;
                        const doResultado =
                          final &&
                          dados.celulasDoResultado.some(
                            ([li, co]) => li === i && co === j,
                          );
                        return (
                          <td
                            key={j}
                            className={`h-10 w-10 rounded-lg font-mono text-sm tabular-nums transition-colors ${
                              doResultado
                                ? "bg-emerald-500 font-semibold text-emerald-950"
                                : atual
                                  ? "bg-amber-500 font-semibold text-amber-950"
                                  : preenchida
                                    ? "bg-zinc-800 text-zinc-200"
                                    : "bg-zinc-900 text-zinc-700"
                            }`}
                          >
                            {preenchida ? dados.tabela[i][j] : "·"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-zinc-500">
              Em verde, no final: as células que formam a resposta.
            </p>
          </div>
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
