"use client";

import { mesclagem } from "@/functions/mesclagem";
import { quicksort } from "@/functions/quicksort";
import {
  listaAleatoria,
  listaInversa,
  listaOrdenada,
} from "@/functions/geradores";
import { NoMesclagem } from "@/@types/mesclagem";
import { useMemo, useState } from "react";
import { Stat, botaoPrimario } from "../components/ui";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";

const inputClass =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30";

const celula =
  "flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 font-mono text-xs tabular-nums";

const ENTRADAS = [
  { nome: "Aleatória", gerar: (n: number) => listaAleatoria(n) },
  { nome: "Já ordenada", gerar: listaOrdenada },
  { nome: "Em ordem inversa", gerar: listaInversa },
];

const fmt = (n: number) => n.toLocaleString("pt-BR");

function Arvore({ no }: { no: NoMesclagem }) {
  const folha = no.esquerda === undefined;
  return (
    <div className="flex flex-col items-center gap-2 px-1.5">
      <div className="flex flex-wrap justify-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 p-1.5">
        {no.lista.map((n, i) => (
          <div key={i} className={`${celula} bg-zinc-800 text-zinc-300`}>
            {n}
          </div>
        ))}
      </div>
      {!folha && (
        <>
          <div className="flex items-start">
            {no.esquerda && <Arvore no={no.esquerda} />}
            {no.direita && <Arvore no={no.direita} />}
          </div>
          <div className="flex flex-wrap justify-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-1.5">
            {no.ordenada.map((n, i) => (
              <div key={i} className={`${celula} bg-emerald-500/30 text-emerald-100`}>
                {n}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function QuicksortMesclagem() {
  const [n, setN] = useState(100);
  const [texto, setTexto] = useState("38, 27, 43, 3, 9, 82, 10, 5");
  const [erro, setErro] = useState("");
  const [lista, setLista] = useState([38, 27, 43, 3, 9, 82, 10, 5]);

  const tabela = useMemo(
    () =>
      ENTRADAS.map(({ nome, gerar }) => {
        const entrada = gerar(n);
        return {
          nome,
          meio: quicksort(entrada, "meio").comparacoes,
          primeiro: quicksort(entrada, "primeiro").comparacoes,
          mescla: mesclagem(entrada).comparacoes,
        };
      }),
    [n],
  );

  const resultado = mesclagem(lista);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numeros = texto.split(/[\s,;]+/).filter(Boolean).map(Number);
    if (numeros.length === 0 || numeros.length > 16 || numeros.some((x) => !Number.isFinite(x))) {
      setErro("Digite de 1 a 16 números, separados por vírgula.");
      return;
    }
    setErro("");
    setLista(numeros);
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
        <Explicacao
          simples={EXPLICACOES.quicksortMesclagem.simples}
          tecnica={EXPLICACOES.quicksortMesclagem.tecnica}
          codigo={CODIGOS.mesclagem}
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
              {tabela.map((linha) => {
                const pior = Math.max(linha.meio, linha.primeiro, linha.mescla);
                const cel = (v: number) =>
                  `px-4 py-3 text-right ${v === pior && pior > 2 * Math.min(linha.meio, linha.primeiro, linha.mescla) ? "text-red-400" : "text-zinc-200"}`;
                return (
                  <tr key={linha.nome} className="border-t border-zinc-800">
                    <td className="px-4 py-3 font-sans text-zinc-300">{linha.nome}</td>
                    <td className={cel(linha.meio)}>{fmt(linha.meio)}</td>
                    <td className={cel(linha.primeiro)}>{fmt(linha.primeiro)}</td>
                    <td className={cel(linha.mescla)}>{fmt(linha.mescla)}</td>
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
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Ex.: 38, 27, 43, 3"
            />
          </label>
          {erro && <p className="text-sm text-red-400">{erro}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              className="cursor-pointer rounded-xl border border-zinc-700 px-4 py-2.5 text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
              onClick={() => {
                const aleatoria = Array.from({ length: 10 }, () => Math.floor(Math.random() * 99 + 1));
                setTexto(aleatoria.join(", "));
                setLista(aleatoria);
                setErro("");
              }}
            >
              Gerar aleatório
            </button>
            <button type="submit" className={`${botaoPrimario} flex-1`}>
              Ordenar
            </button>
          </div>
        </form>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Comparações" value={String(resultado.comparacoes)} tone="text-amber-400" />
          <Stat label="Profundidade" value={String(resultado.profundidade)} tone="text-zinc-100" />
          <Stat label="Itens" value={String(lista.length)} tone="text-zinc-100" />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex w-max min-w-full justify-center">
            <Arvore no={resultado.raiz} />
          </div>
        </div>
      </section>
    </main>
  );
}
