"use client";

import { inputClass } from "@/components/ui";
import { binarySearch } from "@/lib/binary-search";
import { ArrayVisual } from "@/components/array";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";

export default function BinarySearch() {
  const [result, setResult] = useState<ReturnType<
    typeof binarySearch
  > | null>(null);
  const [target, setTarget] = useState(0);

  function handleSearch(size: number, target: number) {
    const array = Array.from({ length: size }, (_, i) => i + 1);
    setTarget(target);
    setResult(binarySearch(array, target));
  }

  const found = result !== null && result.index !== -1;

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Busca binária</h1>
        <p className="text-zinc-400">
          Em um array ordenado de 1 até N, o algoritmo olha para o elemento do
          meio e descarta metade das opções a cada tentativa.
        </p>
        <Explanation
          simple={EXPLANATIONS.binarySearch.simple}
          technique={EXPLANATIONS.binarySearch.technique}
          code={CODES.binarySearch}
        />
      </header>

      <form
        className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const size = Number(e.currentTarget.size.value);
          const target = Number(e.currentTarget.searchTarget.value);
          handleSearch(size, target);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Tamanho do array
            <input
              className={inputClass}
              name="size"
              type="number"
              min="1"
              max="1000"
              placeholder="Ex.: 100"
              required
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Número alvo
            <input
              className={inputClass}
              name="searchTarget"
              type="number"
              min="1"
              max="1000"
              placeholder="Ex.: 42"
              required
            />
          </label>
        </div>
        <button
          className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:bg-emerald-600"
          type="submit"
        >
          Buscar
        </button>
      </form>

      {result && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Resultado"
              value={found ? "Encontrado" : "Não encontrado"}
              tone={found ? "text-emerald-400" : "text-red-400"}
            />
            <Stat
              label="Tentativas usadas"
              value={String(result.attempts)}
              tone="text-amber-400"
            />
            <Stat
              label="Máximo possível"
              value={String(result.maxAttempts)}
              tone="text-zinc-100"
            />
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
            <Legend color="bg-amber-500" text="Elemento do meio" />
            <Legend color="bg-emerald-500" text="Alvo encontrado" />
            <Legend color="bg-zinc-800" text="Ainda em jogo" />
          </div>

          <ol className="flex flex-col gap-4">
            {result.steps.map((item) => (
              <li
                key={item.attempt}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold">
                    {item.attempt}
                  </span>
                  <span className="text-zinc-300">
                    Meio ={" "}
                    <span className="font-mono text-amber-400">
                      {item.middleValue}
                    </span>
                    {item.middleValue === target
                      ? " — é o alvo!"
                      : item.middleValue < target
                        ? " — menor que o alvo, descarta a esquerda"
                        : " — maior que o alvo, descarta a direita"}
                  </span>
                </div>
                <ArrayVisual
                  arr={item.currentArray}
                  middle={item.middleValue}
                  target={target}
                />
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

function Legend({ color, text }: { color: string; text: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded ${color}`} />
      {text}
    </span>
  );
}
