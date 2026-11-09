"use client";

import { readNumbers, randomNumbers } from "@/lib/input";
import { inputClass } from "@/components/ui";
import { selectionSort } from "@/lib/selection-sort";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";

const cell =
  "flex h-10 min-w-10 items-center justify-center rounded-lg px-2 font-mono text-sm tabular-nums";

export default function SelectionSort() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ReturnType<
    typeof selectionSort
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
    if (numbers.length > 30) {
      setError("Use no máximo 30 números.");
      setResult(null);
      return;
    }
    setError("");
    setResult(selectionSort(numbers));
  }

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Ordenação por seleção
        </h1>
        <p className="text-zinc-400">
          A cada rodada, o algoritmo percorre os itens que sobraram, encontra o
          menor e o move para a lista ordenada. Custo: O(n²).
        </p>
        <Explanation
          simple={EXPLANATIONS.selectionSort.simple}
          technique={EXPLANATIONS.selectionSort.technique}
          code={CODES.selectionSort}
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
            placeholder="Ex.: 5, 3, 6, 2, 10"
            required
          />
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setText(randomNumbers(10))}
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="text-xs uppercase tracking-wider text-zinc-500">
                Rodadas
              </div>
              <div className="mt-1 text-2xl font-semibold text-amber-400">
                {result.steps.length}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="text-xs uppercase tracking-wider text-zinc-500">
                Comparações
              </div>
              <div className="mt-1 text-2xl font-semibold text-zinc-100">
                {result.comparisons}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
            <Legend color="bg-amber-500" text="Menor da rodada" />
            <Legend color="bg-zinc-800" text="Ainda não ordenado" />
            <Legend color="bg-emerald-500" text="Já ordenado" />
          </div>

          <ol className="flex flex-col gap-4">
            {result.steps.map((step) => (
              <li
                key={step.round}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold">
                    {step.round}
                  </span>
                  <span className="text-zinc-300">
                    Menor ={" "}
                    <span className="font-mono text-amber-400">
                      {step.remainingItems[step.smallestIndex]}
                    </span>
                    {" — vai para a posição "}
                    {step.sortedSet.length + 1}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {step.sortedSet.map((n, i) => (
                    <div
                      key={`o${i}`}
                      className={`${cell} bg-emerald-500/20 text-emerald-300`}
                    >
                      {n}
                    </div>
                  ))}
                  {step.remainingItems.map((n, i) => (
                    <div
                      key={`r${i}`}
                      className={`${cell} ${
                        i === step.smallestIndex
                          ? "bg-amber-500 font-semibold text-amber-950 ring-2 ring-amber-300"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>

          <div className="flex flex-col gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="text-sm text-zinc-300">Resultado final</div>
            <div className="flex flex-wrap gap-1.5">
              {result.isSorted.map((n, i) => (
                <div key={i} className={`${cell} bg-emerald-500 font-semibold text-emerald-950`}>
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

function Legend({ color, text }: { color: string; text: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded ${color}`} />
      {text}
    </span>
  );
}
