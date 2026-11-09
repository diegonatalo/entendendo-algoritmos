"use client";

import { readNumbers } from "@/lib/input";
import { mergeSort } from "@/lib/merge-sort";
import { quicksort } from "@/lib/quicksort";
import {
  randomList,
  reversedList,
  sortedList,
} from "@/lib/generators";
import { MergeNode } from "@/types/merge-sort";
import { useMemo, useState } from "react";
import { Stat, primaryButton, inputClass } from "@/components/ui";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";

const cell =
  "flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 font-mono text-xs tabular-nums";

const INPUTS = [
  { name: "Aleatória", generate: (n: number) => randomList(n) },
  { name: "Já ordenada", generate: sortedList },
  { name: "Em ordem inversa", generate: reversedList },
];

const fmt = (n: number) => n.toLocaleString("pt-BR");

function Tree({ node }: { node: MergeNode }) {
  const leaf = node.left === undefined;
  return (
    <div className="flex flex-col items-center gap-2 px-1.5">
      <div className="flex flex-wrap justify-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 p-1.5">
        {node.list.map((n, i) => (
          <div key={i} className={`${cell} bg-zinc-800 text-zinc-300`}>
            {n}
          </div>
        ))}
      </div>
      {!leaf && (
        <>
          <div className="flex items-start">
            {node.left && <Tree node={node.left} />}
            {node.right && <Tree node={node.right} />}
          </div>
          <div className="flex flex-wrap justify-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-1.5">
            {node.sorted.map((n, i) => (
              <div key={i} className={`${cell} bg-emerald-500/30 text-emerald-100`}>
                {n}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function QuicksortMergeSort() {
  const [n, setN] = useState(100);
  const [text, setText] = useState("38, 27, 43, 3, 9, 82, 10, 5");
  const [error, setError] = useState("");
  const [list, setList] = useState([38, 27, 43, 3, 9, 82, 10, 5]);

  const table = useMemo(
    () =>
      INPUTS.map(({ name, generate }) => {
        const input = generate(n);
        return {
          name,
          middle: quicksort(input, "middle").comparisons,
          first: quicksort(input, "first").comparisons,
          mergeStep: mergeSort(input).comparisons,
        };
      }),
    [n],
  );

  const result = mergeSort(list);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numbers = readNumbers(text);
    if (numbers.length === 0 || numbers.length > 16 || numbers.some((x) => !Number.isFinite(x))) {
      setError("Digite de 1 a 16 números, separados por vírgula.");
      return;
    }
    setError("");
    setList(numbers);
  }

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-14 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Quicksort × mesclagem</h1>
        <p className="text-zinc-400">
          A ordenação por mesclagem (merge sort) também divide para conquistar:
          parte a lista ao meio, ordena cada metade e junta as duas já
          ordenadas. Ela é O(n log n) sempre, enquanto o quicksort é O(n log n)
          no caso médio e O(n²) no pior caso. Compare quantas comparações cada
          um faz.
        </p>
        <Explanation
          simple={EXPLANATIONS.quicksortMergeSort.simple}
          technique={EXPLANATIONS.quicksortMergeSort.technique}
          code={CODES.mergeSort}
        />
      </header>

      <section className="fade-up flex flex-col gap-6">
        <h2 className="text-xl font-semibold">Comparações em três tipos de entrada</h2>

        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <label className="flex items-center justify-between text-sm text-zinc-300">
            <span>Tamanho da lista (n)</span>
            <span className="font-mono text-lg text-emerald-400">{n}</span>
          </label>
          <input
            type="range"
            min={8}
            max={1000}
            step={4}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full accent-emerald-500"
            aria-label="Tamanho da lista (n)"
          />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/60 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Entrada</th>
                <th className="px-4 py-3 text-right font-medium">Quicksort (pivô no meio)</th>
                <th className="px-4 py-3 text-right font-medium">Quicksort (pivô no primeiro)</th>
                <th className="px-4 py-3 text-right font-medium">Mesclagem</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {table.map((line) => {
                const worst = Math.max(line.middle, line.first, line.mergeStep);
                const cellValue = (v: number) =>
                  `px-4 py-3 text-right ${v === worst && worst > 2 * Math.min(line.middle, line.first, line.mergeStep) ? "text-red-400" : "text-zinc-200"}`;
                return (
                  <tr key={line.name} className="border-t border-zinc-800">
                    <td className="px-4 py-3 font-sans text-zinc-300">{line.name}</td>
                    <td className={cellValue(line.middle)}>{fmt(line.middle)}</td>
                    <td className={cellValue(line.first)}>{fmt(line.first)}</td>
                    <td className={cellValue(line.mergeStep)}>{fmt(line.mergeStep)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Stat
            label="n × log₂ n (referência)"
            value={fmt(Math.round(n * Math.log2(n)))}
            tone="text-emerald-400"
          />
          <Stat
            label="n² ÷ 2 (referência do pior caso)"
            value={fmt(Math.round((n * n) / 2))}
            tone="text-amber-400"
          />
        </div>

        <p className="text-sm text-zinc-400">
          Em vermelho, o valor muito pior que o melhor da linha. Com o pivô no
          primeiro elemento, uma lista já ordenada (ou inversa) faz o quicksort
          escolher sempre o menor ou o maior elemento: o pior caso, O(n²). A
          mesclagem não depende da ordem da entrada. Repare que, nas listas
          aleatórias, a mesclagem até faz menos comparações. Ainda assim, o
          livro afirma que o quicksort costuma ser mais rápido na prática:
          o tempo depende de mais do que comparações (como copiar e alocar
          listas e usar a memória), e esse custo por passo é a constante que o
          Big O não mostra (veja a página sobre constantes). Esta página conta
          só comparações, não mede tempo.
        </p>
      </section>

      <section className="fade-up flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">A mesclagem passo a passo</h2>
          <p className="text-sm text-zinc-400">
            A árvore desce dividindo as listas ao meio até sobrar um elemento
            (caso base). Depois sobe juntando: as listas em verde são o
            resultado de cada junção.
          </p>
        </div>

        <form
          className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
          onSubmit={handleSubmit}
        >
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Números a ordenar (até 16)
            <input
              className={inputClass}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ex.: 38, 27, 43, 3"
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              className="cursor-pointer rounded-xl border border-zinc-700 px-4 py-2.5 text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
              onClick={() => {
                const randomValue = Array.from({ length: 10 }, () => Math.floor(Math.random() * 99 + 1));
                setText(randomValue.join(", "));
                setList(randomValue);
                setError("");
              }}
            >
              Gerar aleatório
            </button>
            <button type="submit" className={`${primaryButton} flex-1`}>
              Ordenar
            </button>
          </div>
        </form>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Comparações" value={String(result.comparisons)} tone="text-amber-400" />
          <Stat label="Profundidade" value={String(result.depth)} tone="text-zinc-100" />
          <Stat label="Itens" value={String(list.length)} tone="text-zinc-100" />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex w-max min-w-full justify-center">
            <Tree node={result.root} />
          </div>
        </div>
      </section>
    </main>
  );
}
