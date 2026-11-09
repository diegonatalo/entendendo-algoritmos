"use client";

import { inputClass } from "@/components/ui";
import { insertCost, readCost, removeCost } from "@/lib/structures";
import { Operation, OperationResult } from "@/types/structures";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";

const MAX = 12;

type Last = {
  operation: Operation;
  index: number;
  result: OperationResult;
};

const button =
  "cursor-pointer rounded-xl border border-zinc-700 px-4 py-2.5 text-sm text-zinc-200 transition-colors hover:border-emerald-500/60 hover:text-emerald-300";

export default function ArraysLists() {
  const [values, setValues] = useState<number[]>([10, 20, 30, 40, 50]);
  const [last, setLast] = useState<Last | null>(null);
  const [error, setError] = useState("");

  const n = values.length;

  function run(operation: Operation, form: HTMLFormElement) {
    const index = Number(form.position.value);
    const value = Number(form.value.value);
    const limit = operation === "insert" ? n : n - 1;

    if (!Number.isInteger(index) || index < 0 || index > limit) {
      setError(
        n === 0 && operation !== "insert"
          ? "A estrutura está vazia."
          : `Escolha uma posição de 0 a ${limit}.`,
      );
      return;
    }
    if (operation === "insert") {
      if (n >= MAX) {
        setError(`No máximo ${MAX} itens.`);
        return;
      }
      if (form.value.value === "" || !Number.isFinite(value)) {
        setError("Digite o valor a inserir.");
        return;
      }
    }
    setError("");

    if (operation === "read") {
      setLast({ operation, index, result: readCost(n, index) });
    } else if (operation === "insert") {
      setLast({ operation, index, result: insertCost(n, index) });
      setValues([...values.slice(0, index), value, ...values.slice(index)]);
    } else {
      setLast({ operation, index, result: removeCost(n, index) });
      setValues(values.filter((_, i) => i !== index));
    }
  }

  // posições a destacar na estrutura já atualizada
  function marks(type: "array" | "list") {
    if (!last) return { traversed: new Set<number>(), changed: new Set<number>() };
    const { operation, index, result } = last;
    const touched = result[type].touched;

    if (operation === "read") {
      return { traversed: new Set(touched), changed: new Set([index]) };
    }
    if (type === "array") {
      return operation === "insert"
        ? { traversed: new Set(touched.map((t) => t + 1)), changed: new Set([index]) }
        : { traversed: new Set(touched.map((t) => t - 1)), changed: new Set<number>() };
    }
    return operation === "insert"
      ? { traversed: new Set(touched), changed: new Set([index]) }
      : {
          traversed: new Set(touched),
          changed: new Set(index > 0 ? [index - 1] : []),
        };
  }

  const marksArray = marks("array");
  const marksList = marks("list");

  const cellClass = (
    i: number,
    m: { traversed: Set<number>; changed: Set<number> },
  ) =>
    m.changed.has(i)
      ? "bg-amber-500 font-semibold text-amber-950"
      : m.traversed.has(i)
        ? "bg-sky-900 text-sky-100 ring-1 ring-sky-500"
        : "bg-zinc-800 text-zinc-200";

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Arrays e listas encadeadas
        </h1>
        <p className="text-zinc-400">
          Em um array os itens ficam lado a lado na memória; em uma lista
          encadeada cada nó aponta para o próximo e pode estar em qualquer
          lugar. Cada estrutura é boa em uma coisa: experimente ler, inserir e
          remover e compare os passos.
        </p>
        <Explanation
          simple={EXPLANATIONS.arraysLists.simple}
          technique={EXPLANATIONS.arraysLists.technique}
          code={CODES.arraysLists}
        />
      </header>

      <form
        className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Posição (índice)
            <input
              className={inputClass}
              name="position"
              type="number"
              min={0}
              defaultValue={0}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Valor (para inserir)
            <input
              className={inputClass}
              name="value"
              type="number"
              defaultValue={99}
            />
          </label>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className={button}
            onClick={(e) => run("read", e.currentTarget.form!)}
          >
            Ler posição
          </button>
          <button
            type="button"
            className={button}
            onClick={(e) => run("insert", e.currentTarget.form!)}
          >
            Inserir na posição
          </button>
          <button
            type="button"
            className={button}
            onClick={(e) => run("remove", e.currentTarget.form!)}
          >
            Remover da posição
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-xl px-4 py-2.5 text-sm text-zinc-500 hover:text-zinc-300"
            onClick={() => {
              setValues([10, 20, 30, 40, 50]);
              setLast(null);
              setError("");
            }}
          >
            Reiniciar
          </button>
        </div>
      </form>

      <section className="fade-up flex flex-col gap-6">
        <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-sky-900 ring-1 ring-sky-500" />
            Percorrido ou deslocado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-amber-500" />
            Item lido, inserido ou ponto de alteração
          </span>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-semibold">Array</h2>
            {last && (
              <span className="font-mono text-lg text-amber-400">
                {last.result.array.steps}{" "}
                {last.result.array.steps === 1 ? "passo" : "passos"}
              </span>
            )}
          </div>
          <div className="flex flex-wrap">
            {values.length === 0 && (
              <span className="text-sm text-zinc-600">vazio</span>
            )}
            {values.map((v, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-12 items-center justify-center border border-zinc-700 font-mono text-sm transition-colors ${cellClass(i, marksArray)}`}
                >
                  {v}
                </div>
                <span className="mt-1 font-mono text-[10px] text-zinc-600">
                  {i}
                </span>
              </div>
            ))}
          </div>
          {last && (
            <p className="text-sm text-zinc-400">
              {last.result.array.description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-semibold">Lista encadeada</h2>
            {last && (
              <span className="font-mono text-lg text-sky-400">
                {last.result.list.steps}{" "}
                {last.result.list.steps === 1 ? "passo" : "passos"}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-y-3">
            {values.map((v, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`flex h-11 min-w-12 items-center justify-center rounded-lg px-3 font-mono text-sm transition-colors ${cellClass(i, marksList)}`}
                >
                  {v}
                </div>
                <span className="px-1.5 text-zinc-600">→</span>
              </div>
            ))}
            <span className="font-mono text-xs text-zinc-600">null</span>
          </div>
          {last && (
            <p className="text-sm text-zinc-400">
              {last.result.list.description}
            </p>
          )}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/60 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Operação</th>
                <th className="px-4 py-3 font-medium">Array</th>
                <th className="px-4 py-3 font-medium">Lista encadeada</th>
              </tr>
            </thead>
            <tbody className="font-mono text-zinc-300">
              <tr className="border-t border-zinc-800">
                <td className="px-4 py-3 font-sans">Ler</td>
                <td className="px-4 py-3 text-emerald-400">O(1)</td>
                <td className="px-4 py-3 text-amber-400">O(n)</td>
              </tr>
              <tr className="border-t border-zinc-800">
                <td className="px-4 py-3 font-sans">Inserir</td>
                <td className="px-4 py-3 text-amber-400">O(n)</td>
                <td className="px-4 py-3 text-emerald-400">O(1)*</td>
              </tr>
              <tr className="border-t border-zinc-800">
                <td className="px-4 py-3 font-sans">Remover</td>
                <td className="px-4 py-3 text-amber-400">O(n)</td>
                <td className="px-4 py-3 text-emerald-400">O(1)*</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-zinc-500">
          * Na lista, inserir e remover são O(1) quando você já está na posição
          (por exemplo, no início). Chegar a uma posição do meio ainda exige
          percorrer os nós, como mostra a contagem de passos acima.
        </p>
      </section>
    </main>
  );
}
