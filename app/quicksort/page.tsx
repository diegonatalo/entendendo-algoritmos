"use client";

import { readNumbers, randomNumbers } from "@/lib/input";
import { inputClass } from "@/components/ui";
import { quicksort } from "@/lib/quicksort";
import { PivotStrategy, QuicksortNode } from "@/types/quicksort";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";

const cell =
  "flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 font-mono text-xs tabular-nums";

export default function Quicksort() {
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
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Quicksort</h1>
        <p className="text-zinc-400">
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
        className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
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
            className="cursor-pointer rounded-xl border border-zinc-700 px-4 py-2.5 text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
          >
            Gerar aleatório
          </button>
          <button
            type="submit"
            className="flex-1 cursor-pointer rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:bg-emerald-600"
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

          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex w-max min-w-full justify-center">
              <Tree node={result.root} />
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
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
}

function Tree({
  node,
  side,
}: {
  node: QuicksortNode;
  side?: "smaller" | "larger";
}) {
  if (node.list.length === 0) {
    return <div className="px-2 py-1 text-xs text-zinc-600">∅</div>;
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

function Legend({ color, text }: { color: string; text: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded ${color}`} />
      {text}
    </span>
  );
}
