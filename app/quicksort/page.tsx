"use client";

import { lerNumeros, numerosAleatorios } from "../entrada";
import { inputClass } from "../components/ui";
import { quicksort } from "@/functions/quicksort";
import { EstrategiaPivo, NoQuicksort } from "@/@types/quicksort";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";

const celula =
  "flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 font-mono text-xs tabular-nums";

export default function Quicksort() {
  const [texto, setTexto] = useState("");
  const [estrategia, setEstrategia] = useState<EstrategiaPivo>("meio");
  const [resultado, setResultado] = useState<ReturnType<
    typeof quicksort
  > | null>(null);
  const [erro, setErro] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numeros = lerNumeros(texto);

    if (numeros.length === 0 || numeros.some((n) => !Number.isFinite(n))) {
      setErro("Digite apenas números, separados por vírgula.");
      setResultado(null);
      return;
    }
    if (numeros.length > 20) {
      setErro("Use no máximo 20 números.");
      setResultado(null);
      return;
    }
    setErro("");
    setResultado(quicksort(numeros, estrategia));
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
        <Explicacao
          simples={EXPLICACOES.quicksort.simples}
          tecnica={EXPLICACOES.quicksort.tecnica}
          codigo={CODIGOS.quicksort}
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
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Ex.: 10, 5, 2, 3"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
          Escolha do pivô
          <select
            className={inputClass}
            value={estrategia}
            onChange={(e) => setEstrategia(e.target.value as EstrategiaPivo)}
          >
            <option value="meio">Elemento do meio (recomendado)</option>
            <option value="primeiro">
              Primeiro elemento (pior caso em listas ordenadas)
            </option>
          </select>
        </label>
        {erro && <p className="text-sm text-red-400">{erro}</p>}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setTexto(numerosAleatorios(12))}
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

      {resultado && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Comparações"
              value={String(resultado.comparacoes)}
              tone="text-amber-400"
            />
            <Stat
              label="Profundidade"
              value={String(resultado.profundidade)}
              tone="text-zinc-100"
            />
            <Stat
              label="Itens"
              value={String(resultado.ordenado.length)}
              tone="text-zinc-100"
            />
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
            <Legenda cor="bg-amber-500" texto="Pivô" />
            <Legenda cor="bg-sky-500/30" texto="Menores ou iguais (esquerda)" />
            <Legenda cor="bg-violet-500/30" texto="Maiores (direita)" />
            <Legenda cor="bg-zinc-800" texto="Caso base" />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex w-max min-w-full justify-center">
              <Arvore no={resultado.raiz} />
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="text-sm text-zinc-300">Resultado final</div>
            <div className="flex flex-wrap gap-1.5">
              {resultado.ordenado.map((n, i) => (
                <div
                  key={i}
                  className={`${celula} bg-emerald-500 font-semibold text-emerald-950`}
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

function Arvore({
  no,
  lado,
}: {
  no: NoQuicksort;
  lado?: "menores" | "maiores";
}) {
  if (no.lista.length === 0) {
    return <div className="px-2 py-1 text-xs text-zinc-600">∅</div>;
  }

  const folha = no.pivo === undefined;
  const corLado =
    lado === "menores"
      ? "border-sky-500/40 bg-sky-500/10"
      : lado === "maiores"
        ? "border-violet-500/40 bg-violet-500/10"
        : "border-zinc-700 bg-zinc-900";

  return (
    <div className="flex flex-col items-center gap-3 px-1.5">
      <div
        className={`flex flex-wrap justify-center gap-1 rounded-lg border p-1.5 ${folha ? "border-zinc-800 bg-zinc-900" : corLado}`}
      >
        {no.lista.map((n, i) => {
          return (
            <div
              key={i}
              className={`${celula} ${
                i === no.indicePivo
                  ? "bg-amber-500 font-semibold text-amber-950"
                  : "bg-zinc-800 text-zinc-300"
              }`}
            >
              {n}
            </div>
          );
        })}
      </div>
      {!folha && (
        <div className="flex items-start">
          {no.menores && <Arvore no={no.menores} lado="menores" />}
          {no.maiores && <Arvore no={no.maiores} lado="maiores" />}
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

function Legenda({ cor, texto }: { cor: string; texto: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded ${cor}`} />
      {texto}
    </span>
  );
}
