"use client";

import { mochila, mochilaGulosa } from "@/functions/mochila";
import { ItemMochila } from "@/@types/mochila";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";

type Exemplo = {
  titulo: string;
  descricao: string;
  capacidade: number;
  itens: ItemMochila[];
};

const EXEMPLOS: Exemplo[] = [
  {
    titulo: "Mochila do livro",
    descricao: "Capacidade de 4 kg. Qual combinação vale mais?",
    capacidade: 4,
    itens: [
      { nome: "Violão", peso: 1, valor: 1500 },
      { nome: "Som", peso: 4, valor: 3000 },
      { nome: "Notebook", peso: 3, valor: 2000 },
    ],
  },
  {
    titulo: "Guloso erra aqui",
    descricao:
      "Capacidade de 6 kg. O item mais valioso ocupa quase tudo e impede combinações melhores.",
    capacidade: 6,
    itens: [
      { nome: "Monitor", peso: 5, valor: 1000 },
      { nome: "Tablet", peso: 3, valor: 700 },
      { nome: "Câmera", peso: 3, valor: 700 },
    ],
  },
];

const botao =
  "cursor-pointer whitespace-nowrap rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-700 disabled:hover:text-zinc-300";

const dinheiro = (n: number) => `R$ ${n.toLocaleString("pt-BR")}`;

export default function ProgramacaoDinamica() {
  const [indice, setIndice] = useState(0);
  const [executado, setExecutado] = useState(false);
  const [passoAtual, setPassoAtual] = useState(0);

  const exemplo = EXEMPLOS[indice];
  const dp = mochila(exemplo.itens, exemplo.capacidade);
  const gulosa = mochilaGulosa(exemplo.itens, exemplo.capacidade);

  const total = dp.passos.length;
  const passo = dp.passos[passoAtual];
  const final = passoAtual === total - 1;

  const colunas = Array.from({ length: exemplo.capacidade }, (_, i) => i + 1);

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Programação dinâmica
        </h1>
        <p className="text-zinc-400">
          Resolve um problema grande combinando respostas de subproblemas
          menores, guardadas em uma tabela. Exemplo: o problema da mochila —
          qual conjunto de itens cabe e vale mais?
        </p>
        <Explicacao
          simples={EXPLICACOES.programacaoDinamica.simples}
          tecnica={EXPLICACOES.programacaoDinamica.tecnica}
          codigo={CODIGOS.mochila}
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
        <ul className="grid gap-2 sm:grid-cols-3">
          {exemplo.itens.map((item) => (
            <li
              key={item.nome}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm"
            >
              <div className="font-medium text-zinc-200">{item.nome}</div>
              <div className="font-mono text-xs text-zinc-500">
                {item.peso} kg · {dinheiro(item.valor)}
              </div>
            </li>
          ))}
        </ul>
        <button
          className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:bg-emerald-600"
          onClick={() => {
            setExecutado(true);
            setPassoAtual(0);
          }}
        >
          Preencher a tabela
        </button>
      </div>

      {executado && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Melhor valor (dinâmica)"
              value={dinheiro(dp.valorTotal)}
              tone="text-emerald-400"
            />
            <Stat
              label="Guloso (maior valor)"
              value={dinheiro(gulosa.valorTotal)}
              tone="text-amber-400"
            />
            <Stat
              label="Célula"
              value={`${passoAtual + 1} / ${total}`}
              tone="text-zinc-100"
            />
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p
                className={`text-sm font-medium ${passo.usouItem ? "text-amber-400" : "text-zinc-300"}`}
              >
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
                  disabled={final}
                  onClick={() => setPassoAtual((p) => p + 1)}
                >
                  Próximo →
                </button>
                <button
                  className={botao}
                  disabled={final}
                  onClick={() => setPassoAtual(total - 1)}
                >
                  Ir ao fim
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-1 text-center text-sm">
                <thead>
                  <tr className="text-xs text-zinc-500">
                    <th />
                    {colunas.map((c) => (
                      <th key={c} className="px-2 py-1 font-medium">
                        {c} kg
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {exemplo.itens.map((item, i) => (
                    <tr key={item.nome}>
                      <th className="whitespace-nowrap pr-3 text-right text-xs font-medium text-zinc-400">
                        {item.nome}
                      </th>
                      {colunas.map((c, j) => {
                        const ordem = i * exemplo.capacidade + j;
                        const preenchida = ordem <= passoAtual;
                        const atual = ordem === passoAtual;
                        const escolhida =
                          final &&
                          dp.celulasEscolhidas.some(
                            ([li, co]) => li === i && co === j,
                          );
                        return (
                          <td
                            key={c}
                            className={`rounded-lg px-2 py-2.5 font-mono text-xs tabular-nums transition-colors ${
                              escolhida
                                ? "bg-emerald-500 font-semibold text-emerald-950"
                                : atual
                                  ? "bg-amber-500 font-semibold text-amber-950"
                                  : preenchida
                                    ? "bg-zinc-800 text-zinc-200"
                                    : "bg-zinc-900 text-zinc-700"
                            }`}
                          >
                            {preenchida ? dp.tabela[i][j].toLocaleString("pt-BR") : "·"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-zinc-500">
              Cada célula = melhor valor usando os itens até aquela linha em uma
              mochila daquele tamanho. Em verde: células em que o item entrou
              na solução final.
            </p>
          </div>

          {final && (
            <div
              className={`flex flex-col gap-2 rounded-2xl border p-4 text-sm ${
                dp.valorTotal > gulosa.valorTotal
                  ? "border-amber-500/40 bg-amber-500/10 text-zinc-200"
                  : "border-emerald-500/30 bg-emerald-500/5 text-zinc-300"
              }`}
            >
              <div className="font-medium">
                {dp.valorTotal > gulosa.valorTotal
                  ? "A programação dinâmica achou uma solução melhor que o guloso."
                  : "Aqui o guloso chegou ao mesmo valor."}
              </div>
              <div className="text-zinc-400">
                Dinâmica: {dp.escolhidos.join(" + ")} ({dinheiro(dp.valorTotal)}
                ). Guloso: {gulosa.escolhidos.join(" + ")} (
                {dinheiro(gulosa.valorTotal)}).
              </div>
            </div>
          )}
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
