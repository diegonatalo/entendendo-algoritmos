"use client";

import {
  coberturaGulosa,
  coberturaOtima,
} from "@/functions/coberturaConjuntos";
import { Conjuntos } from "@/@types/guloso";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";

type Exemplo = {
  titulo: string;
  descricao: string;
  universo: string[];
  conjuntos: Conjuntos;
};

const EXEMPLOS: Exemplo[] = [
  {
    titulo: "Estações de rádio (livro)",
    descricao:
      "Cada estação cobre alguns estados. Meta: cobrir todos os estados com o menor número de estações.",
    universo: ["mt", "wa", "or", "id", "nv", "ut", "ca", "az"],
    conjuntos: {
      kone: ["id", "nv", "ut"],
      ktwo: ["wa", "id", "mt"],
      kthree: ["or", "nv", "ca"],
      kfour: ["nv", "ut"],
      kfive: ["ca", "az"],
    },
  },
  {
    titulo: "Quando o guloso erra",
    descricao:
      "O conjunto 'grande' parece a melhor escolha, mas 'esq' e 'dir' sozinhos já cobrem tudo.",
    universo: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    conjuntos: {
      grande: ["1", "2", "3", "4", "7", "8", "9"],
      esq: ["1", "2", "3", "4", "5", "6"],
      dir: ["7", "8", "9", "10", "11", "12"],
    },
  },
];

const botao =
  "cursor-pointer whitespace-nowrap rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-700 disabled:hover:text-zinc-300";

const corDoTipo = {
  inicio: "text-zinc-300",
  escolhe: "text-amber-400",
  fim: "text-emerald-400",
};

const chip = "rounded-md px-2 py-1 font-mono text-xs";

export default function AlgoritmoGuloso() {
  const [indice, setIndice] = useState(0);
  const [executado, setExecutado] = useState(false);
  const [passoAtual, setPassoAtual] = useState(0);

  const exemplo = EXEMPLOS[indice];
  const gulosa = coberturaGulosa(exemplo.universo, exemplo.conjuntos);
  const otima = coberturaOtima(exemplo.universo, exemplo.conjuntos);
  const passo = gulosa.passos[passoAtual];

  const guloso = gulosa.solucao.length;
  const minimo = otima.solucao?.length ?? 0;

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Algoritmo guloso
        </h1>
        <p className="text-zinc-400">
          A cada passo, escolhe a melhor opção do momento, sem olhar o quadro
          todo. Aqui: cobertura de conjuntos. Achar a solução exata exige
          testar todas as combinações (O(2ⁿ)); o guloso é uma aproximação
          rápida (O(n²)).
        </p>
        <Explicacao
          simples={EXPLICACOES.algoritmoGuloso.simples}
          tecnica={EXPLICACOES.algoritmoGuloso.tecnica}
          codigo={CODIGOS.coberturaGulosa}
        />
      </header>

      <div className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex flex-wrap gap-2">
          {EXEMPLOS.map((e, i) => (
            <button
              key={e.titulo}
              onClick={() => {
                setIndice(i);
                setExecutado(false);
                setPassoAtual(0);
              }}
              className={`cursor-pointer rounded-xl border px-4 py-2 text-sm transition-colors ${
                i === indice
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                  : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              {e.titulo}
            </button>
          ))}
        </div>
        <p className="text-sm text-zinc-400">{exemplo.descricao}</p>
        <div className="flex flex-col gap-2">
          <div className="text-xs uppercase tracking-wider text-zinc-500">
            Itens a cobrir
          </div>
          <div className="flex flex-wrap gap-1.5">
            {exemplo.universo.map((item) => (
              <span key={item} className={`${chip} bg-zinc-800 text-zinc-300`}>
                {item}
              </span>
            ))}
          </div>
        </div>
        <button
          className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:bg-emerald-600"
          onClick={() => {
            setExecutado(true);
            setPassoAtual(0);
          }}
        >
          Executar algoritmo guloso
        </button>
      </div>

      {executado && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Conjuntos usados (guloso)"
              value={String(guloso)}
              tone="text-amber-400"
            />
            <Stat
              label="Mínimo possível"
              value={String(minimo)}
              tone="text-emerald-400"
            />
            <Stat
              label="Passo"
              value={`${passoAtual + 1} / ${gulosa.passos.length}`}
              tone="text-zinc-100"
            />
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
            <Legenda cor="bg-amber-500" texto="Conjunto escolhido agora" />
            <Legenda cor="bg-emerald-500/30" texto="Já coberto" />
            <Legenda cor="bg-red-500/20" texto="Ainda falta cobrir" />
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={`text-sm font-medium ${corDoTipo[passo.tipo]}`}>
                {passo.descricao}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  className={botao}
                  disabled={passoAtual === 0}
                  onClick={() => setPassoAtual((p) => p - 1)}
                >
                  ← Anterior
                </button>
                <button
                  className={botao}
                  disabled={passoAtual === gulosa.passos.length - 1}
                  onClick={() => setPassoAtual((p) => p + 1)}
                >
                  Próximo →
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-xs uppercase tracking-wider text-zinc-500">
                Itens
              </div>
              <div className="flex flex-wrap gap-1.5">
                {exemplo.universo.map((item) => {
                  const coberto = passo.cobertos.includes(item);
                  return (
                    <span
                      key={item}
                      className={`${chip} ${
                        coberto
                          ? "bg-emerald-500/30 text-emerald-200"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
            </div>

            <ul className="flex flex-col gap-2">
              {Object.entries(exemplo.conjuntos).map(([nome, itens]) => {
                const escolhida = passo.escolhida === nome;
                const usada = passo.solucao.includes(nome);
                return (
                  <li
                    key={nome}
                    className={`flex flex-wrap items-center gap-3 rounded-xl border p-2.5 transition-colors ${
                      escolhida
                        ? "border-amber-500/60 bg-amber-500/10"
                        : usada
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : "border-zinc-800 bg-zinc-900/40"
                    }`}
                  >
                    <span
                      className={`w-16 shrink-0 font-mono text-sm ${escolhida ? "font-semibold text-amber-300" : "text-zinc-300"}`}
                    >
                      {nome}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {itens.map((item) => (
                        <span
                          key={item}
                          className={`${chip} ${
                            escolhida && !passo.cobertos.includes(item)
                              ? "bg-zinc-800 text-zinc-300"
                              : escolhida
                                ? "bg-amber-500 font-semibold text-amber-950"
                                : passo.cobertos.includes(item)
                                  ? "bg-zinc-800 text-zinc-500"
                                  : "bg-zinc-800 text-zinc-300"
                          }`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    {passo.tipo !== "fim" && (
                      <span className="ml-auto text-xs text-zinc-500">
                        cobriria {passo.candidatos[nome] ?? 0} novos
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div
            className={`flex flex-col gap-2 rounded-2xl border p-4 text-sm ${
              guloso === minimo
                ? "border-emerald-500/30 bg-emerald-500/5 text-zinc-300"
                : "border-amber-500/40 bg-amber-500/10 text-zinc-200"
            }`}
          >
            <div className="font-medium">
              {guloso === minimo
                ? "O guloso acertou: usou o mínimo possível."
                : "O guloso não achou a solução mínima."}
            </div>
            <div className="text-zinc-400">
              Guloso: {gulosa.solucao.join(", ")} ({guloso}). Força bruta:{" "}
              {otima.solucao?.join(", ") ?? "sem solução"} ({minimo}), após
              testar {otima.combinacoesTestadas} combinações.
            </div>
          </div>

          <ol className="flex flex-col gap-1 text-sm">
            {gulosa.passos.map((p, i) => (
              <li key={i}>
                <button
                  onClick={() => setPassoAtual(i)}
                  className={`w-full cursor-pointer rounded-lg px-3 py-1.5 text-left transition-colors hover:bg-zinc-800/60 ${
                    i === passoAtual
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-500"
                  }`}
                >
                  <span className="mr-2 font-mono text-xs">{i + 1}.</span>
                  {p.descricao}
                </button>
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
