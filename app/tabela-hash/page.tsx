"use client";

import { inputClass } from "@/components/ui";
import {
  search,
  createTable,
  loadFactor,
  hashFunction,
  insert,
  resize,
} from "@/lib/hash-table";
import { HashTable } from "@/types/hash";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";

const INITIAL_SIZE = 8;

const secondaryButton =
  "cursor-pointer rounded-xl border border-zinc-700 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100";

const primaryButton =
  "cursor-pointer rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:bg-emerald-600";

const EXAMPLE: [string, string][] = [
  ["maca", "R$ 0,67"],
  ["leite", "R$ 1,49"],
  ["pao", "R$ 0,25"],
  ["ovo", "R$ 0,50"],
  ["arroz", "R$ 3,20"],
  ["cafe", "R$ 4,80"],
  ["sal", "R$ 0,99"],
  ["oleo", "R$ 2,10"],
];

type Highlight = {
  index: number;
  tone: "ok" | "collision" | "failure";
  key: string;
  message: string;
};

export default function HashTablePage() {
  const [table, setTable] = useState<HashTable>(() =>
    createTable(INITIAL_SIZE),
  );
  const [highlight, setHighlight] = useState<Highlight | null>(null);

  const total = table.flat().length;
  const load = loadFactor(table);

  function explainHash(key: string) {
    const { sum, index } = hashFunction(key, table.length);
    return `hash("${key}") = ${sum} % ${table.length} = ${index}`;
  }

  function handleInsert(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const key = form.key.value.trim();
    const value = form.value.value.trim();
    if (!key) return;

    const r = insert(table, key, value);
    setTable(r.table);
    setHighlight({
      index: r.index,
      tone: r.collision ? "collision" : "ok",
      key,
      message: `${explainHash(key)}. ${
        r.updated
          ? "A chave já existia: valor atualizado."
          : r.collision
            ? "Colisão! O balde já tinha itens, então a chave entra na lista."
            : "Balde vazio: chave guardada."
      }`,
    });
    form.reset();
  }

  function handleLookup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const key = e.currentTarget.busca.value.trim();
    if (!key) return;

    const r = search(table, key);
    const didFind = r.value !== undefined;
    setHighlight({
      index: r.index,
      tone: didFind ? "ok" : "failure",
      key,
      message: `${explainHash(key)}. ${
        didFind
          ? `Encontrado após ${r.comparisons} ${r.comparisons === 1 ? "comparação" : "comparações"}: ${r.value}.`
          : r.comparisons === 0
            ? "Balde vazio: a chave não está na tabela."
            : `Percorreu ${r.comparisons} ${r.comparisons === 1 ? "item" : "itens"} do balde e não achou a chave.`
      }`,
    });
  }

  function loadExample() {
    let next = createTable(INITIAL_SIZE);
    for (const [key, value] of EXAMPLE) {
      next = insert(next, key, value).table;
    }
    setTable(next);
    setHighlight(null);
  }

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Tabelas hash</h1>
        <p className="text-zinc-400">
          Uma função hash transforma a chave em um número, que indica o balde
          onde o valor fica guardado. Busca, inserção e remoção levam O(1) no
          caso médio. Quando duas chaves caem no mesmo balde, há uma colisão e
          os itens formam uma lista.
        </p>
        <p className="font-mono text-sm text-zinc-500">
          hash(chave) = soma dos códigos dos caracteres % tamanho da tabela
        </p>
        <Explanation
          simple={EXPLANATIONS.hashTable.simple}
          technique={EXPLANATIONS.hashTable.technique}
          code={CODES.hashTable}
        />
      </header>

      <div className="fade-up grid gap-4 md:grid-cols-2">
        <form
          className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
          onSubmit={handleInsert}
        >
          <h2 className="text-sm font-medium text-zinc-300">Inserir</h2>
          <div className="grid grid-cols-2 gap-3">
            <input
              className={inputClass}
              name="key"
              placeholder="Chave (ex.: maca)"
              required
            />
            <input
              className={inputClass}
              name="value"
              placeholder="Valor (ex.: R$ 0,67)"
            />
          </div>
          <button className={primaryButton} type="submit">
            Inserir
          </button>
        </form>

        <form
          className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
          onSubmit={handleLookup}
        >
          <h2 className="text-sm font-medium text-zinc-300">Buscar</h2>
          <input
            className={inputClass}
            name="busca"
            placeholder="Chave a buscar"
            required
          />
          <button className={primaryButton} type="submit">
            Buscar
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-3">
        <button className={secondaryButton} onClick={loadExample}>
          Carregar exemplo
        </button>
        <button
          className={secondaryButton}
          onClick={() => {
            setTable(resize(table, table.length * 2));
            setHighlight(null);
          }}
          disabled={table.length >= 64}
        >
          Dobrar tamanho da tabela
        </button>
        <button
          className={secondaryButton}
          onClick={() => {
            setTable(createTable(INITIAL_SIZE));
            setHighlight(null);
          }}
        >
          Limpar
        </button>
      </div>

      <section className="fade-up flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Itens" value={String(total)} tone="text-zinc-100" />
          <Stat
            label="Baldes"
            value={String(table.length)}
            tone="text-zinc-100"
          />
          <Stat
            label="Fator de carga"
            value={load.toFixed(2)}
            tone={load > 0.75 ? "text-red-400" : "text-emerald-400"}
          />
        </div>
        {load > 0.75 && (
          <p className="text-sm text-red-400">
            Fator de carga alto: aumentam as colisões. Experimente dobrar o
            tamanho da tabela.
          </p>
        )}

        {highlight && (
          <p
            className={`rounded-xl border px-4 py-3 text-sm ${
              highlight.tone === "ok"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                : highlight.tone === "collision"
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
                  : "border-red-500/40 bg-red-500/10 text-red-200"
            }`}
          >
            {highlight.message}
          </p>
        )}

        <ol className="flex flex-col gap-2">
          {table.map((bucket, i) => {
            const active = highlight?.index === i;
            return (
              <li
                key={i}
                className={`flex items-center gap-3 rounded-xl border p-2 transition-colors ${
                  active
                    ? "border-amber-500/60 bg-amber-500/5"
                    : "border-zinc-800 bg-zinc-900/40"
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 font-mono text-sm text-zinc-400">
                  {i}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {bucket.length === 0 ? (
                    <span className="text-xs text-zinc-600">vazio</span>
                  ) : (
                    bucket.map((input, j) => (
                      <div key={input.key} className="flex items-center gap-2">
                        {j > 0 && <span className="text-zinc-600">→</span>}
                        <span
                          className={`rounded-lg px-3 py-1.5 font-mono text-xs ${
                            active && input.key === highlight?.key
                              ? "bg-amber-500 font-semibold text-amber-950"
                              : "bg-zinc-800 text-zinc-300"
                          }`}
                        >
                          {input.key}
                          {input.value && (
                            <span className="ml-2 opacity-70">
                              {input.value}
                            </span>
                          )}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}

const Stat = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) => {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className={`mt-1 text-2xl font-semibold ${tone}`}>{value}</div>
    </div>
  );
};
