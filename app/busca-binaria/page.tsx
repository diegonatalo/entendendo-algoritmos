"use client";

import { buscaBinaria } from "@/functions/buscaBinaria";
import { ArrayVisual } from "../components/array";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";

const inputClass =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30";

export default function BuscaBinaria() {
  const [resultado, setResultado] = useState<ReturnType<
    typeof buscaBinaria
  > | null>(null);
  const [alvo, setAlvo] = useState(0);

  function handleSearch(tamanho: number, alvo: number) {
    const array = Array.from({ length: tamanho }, (_, i) => i + 1);
    setAlvo(alvo);
    setResultado(buscaBinaria(array, alvo));
  }

  const encontrado = resultado !== null && resultado.indice !== -1;

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Busca binária</h1>
        <p className="text-zinc-400">
          Em um array ordenado de 1 até N, o algoritmo olha para o elemento do
          meio e descarta metade das opções a cada tentativa.
        </p>
        <Explicacao
          simples={EXPLICACOES.buscaBinaria.simples}
          tecnica={EXPLICACOES.buscaBinaria.tecnica}
          codigo={CODIGOS.buscaBinaria}
        />
      </header>

      <form
        className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const tamanho = Number(e.currentTarget.tamanho.value);
          const alvo = Number(e.currentTarget.alvo.value);
          handleSearch(tamanho, alvo);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Tamanho do array
            <input
              className={inputClass}
              name="tamanho"
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
              name="alvo"
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

      {resultado && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Resultado"
              value={encontrado ? "Encontrado" : "Não encontrado"}
              tone={encontrado ? "text-emerald-400" : "text-red-400"}
            />
            <Stat
              label="Tentativas usadas"
              value={String(resultado.tentativas)}
              tone="text-amber-400"
            />
            <Stat
              label="Máximo possível"
              value={String(resultado.maxTentativas)}
              tone="text-zinc-100"
            />
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
            <Legenda cor="bg-amber-500" texto="Elemento do meio" />
            <Legenda cor="bg-emerald-500" texto="Alvo encontrado" />
            <Legenda cor="bg-zinc-800" texto="Ainda em jogo" />
          </div>

          <ol className="flex flex-col gap-4">
            {resultado.passos.map((item) => (
              <li
                key={item.tentativa}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold">
                    {item.tentativa}
                  </span>
                  <span className="text-zinc-300">
                    Meio ={" "}
                    <span className="font-mono text-amber-400">
                      {item.valorMeio}
                    </span>
                    {item.valorMeio === alvo
                      ? " — é o alvo!"
                      : item.valorMeio < alvo
                        ? " — menor que o alvo, descarta a esquerda"
                        : " — maior que o alvo, descarta a direita"}
                  </span>
                </div>
                <ArrayVisual
                  arr={item.arrayAtual}
                  meio={item.valorMeio}
                  alvo={alvo}
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

function Legenda({ cor, texto }: { cor: string; texto: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded ${cor}`} />
      {texto}
    </span>
  );
}
