"use client";

import { readNumbers, randomNumbers } from "@/lib/input";
import { Legend, Stat, inputClass } from "@/components/ui";
import { quicksort } from "@/lib/quicksort";
import { PivotStrategy, QuicksortNode } from "@/types/quicksort";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";

const cell =
  "flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 font-mono text-xs tabular-nums";

export const Quicksort = () => {
  const [text, setText] = useState("");
  const [strategy, setStrategy] = useState<PivotStrategy>("middle");
  const [result, setResult] = useState<ReturnType<
    typeof quicksort
  > | null>(null);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numbers = readNumbers(text);

    if (numbers.length === 0 || numbers.some((n) => !Number.isFinite(n))) {
      setError("Digite apenas números, separados por vírgula.");
      setResult(null);
      return;
    }
    if (numbers.length > 20) {
      setError("Use no máximo 20 números.");
      setResult(null);
      return;
    }
    setError("");
    setResult(quicksort(numbers, strategy));
  }

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 pb-14 pt-5 sm:px-10">
      <header className="fade-up flex flex-col gap-4">
        <h1 className="text-5xl font-extrabold leading-[0.95] tracking-tighter text-balance sm:text-6xl">Quicksort</h1>
        <p className="max-w-3xl text-lg text-zinc-400">
          Dividir para conquistar: escolhe um pivô, separa os menores e os
          maiores e ordena cada lado recursivamente. Caso médio O(n log n);
          pior caso O(n²).
        </p>
        <Explanation
          simple={EXPLANATIONS.quicksort.simple}
          technique={EXPLANATIONS.quicksort.technique}
          code={CODES.quicksort}
        />
      </header>

      <form
        className="fade-up flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6"
        onSubmit={handleSubmit}
      >
        <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
          Números a ordenar
          <input
            className={inputClass}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ex.: 10, 5, 2, 3"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
          Escolha do pivô
          <select
            className={inputClass}
            value={strategy}
            onChange={(e) => setStrategy(e.target.value as PivotStrategy)}
          >
            <option value="middle">Elemento do meio (recomendado)</option>
            <option value="first">
              Primeiro elemento (pior caso em listas ordenadas)
            </option>
          </select>
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setText(randomNumbers(12))}
            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-zinc-700 px-5 text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
          >
            Gerar aleatório
          </button>
          <button
            type="submit"
            className="flex-1 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-emerald-400 px-6 font-semibold text-emerald-950 transition hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-[0_14px_34px_-12px_rgb(52_211_153/0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 active:translate-y-0 active:bg-emerald-500"
          >
            Ordenar
          </button>
        </div>
      </form>

      {result && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Comparações"
              value={String(result.comparisons)}
              tone="text-amber-400"
            />
            <Stat
              label="Profundidade"
              value={String(result.depth)}
              tone="text-zinc-100"
            />
            <Stat
              label="Itens"
              value={String(result.isSorted.length)}
              tone="text-zinc-100"
            />
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
            <Legend color="bg-amber-500" text="Pivô" />
            <Legend color="bg-sky-500/30" text="Menores ou iguais (esquerda)" />
            <Legend color="bg-violet-500/30" text="Maiores (direita)" />
            <Legend color="bg-zinc-800" text="Caso base" />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900 bg-zinc-950/60 p-4">
            <div className="flex w-max min-w-full justify-center">
              <Tree node={result.root} />
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl bg-emerald-400/10 p-4">
            <div className="text-sm text-zinc-300">Resultado final</div>
            <div className="flex flex-wrap gap-1.5">
              {result.isSorted.map((n, i) => (
                <div
                  key={i}
                  className={`${cell} bg-emerald-500 font-semibold text-emerald-950`}
                >
                  {n}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

const Tree = ({
  node,
  side,
}: {
  node: QuicksortNode;
  side?: "smaller" | "larger";
}) => {
  if (node.list.length === 0) {
    return <div className="px-2 py-1 text-xs text-zinc-500">∅</div>;
  }

  const leaf = node.pivot === undefined;
  const sideColor =
    side === "smaller"
      ? "border-sky-500/40 bg-sky-500/10"
      : side === "larger"
        ? "border-violet-500/40 bg-violet-500/10"
        : "border-zinc-700 bg-zinc-900";

  return (
    <div className="flex flex-col items-center gap-3 px-1.5">
      <div
        className={`flex flex-wrap justify-center gap-1 rounded-lg border p-1.5 ${leaf ? "border-zinc-800 bg-zinc-900" : sideColor}`}
      >
        {node.list.map((n, i) => {
          return (
            <div
              key={i}
              className={`${cell} ${
                i === node.pivotIndex
                  ? "bg-amber-500 font-semibold text-amber-950"
                  : "bg-zinc-800 text-zinc-300"
              }`}
            >
              {n}
            </div>
          );
        })}
      </div>
      {!leaf && (
        <div className="flex items-start">
          {node.smallerOnes && <Tree node={node.smallerOnes} side="smaller" />}
          {node.largerOnes && <Tree node={node.largerOnes} side="larger" />}
        </div>
      )}
    </div>
  );
};
