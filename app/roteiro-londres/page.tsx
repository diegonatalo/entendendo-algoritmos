"use client";

import { mochila } from "@/functions/mochila";
import { ItemMochila } from "@/@types/mochila";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";
import { Stat, botaoNavegacao, botaoPrimario } from "../components/ui";

// a tabela trabalha em meios dias, para que todos os tempos sejam números inteiros
const ATRACOES: ItemMochila[] = [
  { nome: "Abadia de Westminster", peso: 1, valor: 7 },
  { nome: "Globe Theater", peso: 1, valor: 6 },
  { nome: "Galeria Nacional", peso: 2, valor: 9 },
  { nome: "Museu Britânico", peso: 4, valor: 9 },
  { nome: "Catedral de St. Paul", peso: 1, valor: 8 },
];

const EXTRA: ItemMochila = { nome: "Torre de Londres", peso: 2, valor: 10 };

const OPCOES_DIAS = [1, 1.5, 2, 2.5, 3];

const selectClass =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-100 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30";

const dias = (meiosDias: number) => {
  const d = meiosDias / 2;
  const texto = String(d).replace(".", ",");
  return d === 1 ? "1 dia" : `${texto} dias`;
};

export default function RoteiroLondres() {
  const [diasTotais, setDiasTotais] = useState(2);
  const [comExtra, setComExtra] = useState(false);
  const [executado, setExecutado] = useState(false);
  const [passoAtual, setPassoAtual] = useState(0);

  const itens = comExtra ? [...ATRACOES, EXTRA] : ATRACOES;
  const capacidade = diasTotais * 2;
  const dp = mochila(itens, capacidade, "meios-dias");

  const total = dp.passos.length;
  const passo = dp.passos[passoAtual];
  const final = passoAtual === total - 1;
  const colunas = Array.from({ length: capacidade }, (_, i) => i + 1);

  const escolhidasNomes = dp.escolhidos;
  const tempoUsado = itens
    .filter((i) => escolhidasNomes.includes(i.nome))
    .reduce((s, i) => s + i.peso, 0);

  function reiniciar() {
    setExecutado(false);
    setPassoAtual(0);
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Programação dinâmica: roteiro em Londres</h1>
        <p className="text-zinc-400">
          O outro exemplo de programação dinâmica do capítulo 9: você tem poucos
          dias em Londres e muitas atrações. Cada uma leva um tempo e tem uma
          nota. Quais visitar para somar a maior nota? É a mesma mochila de
          antes, com tempo no lugar de peso e nota no lugar de valor. Você não
          pode visitar metade de uma atração, e é por isso que a tabela só usa
          números inteiros de meios dias.
        </p>
        <Explicacao
          simples={EXPLICACOES.roteiroLondres.simples}
          tecnica={EXPLICACOES.roteiroLondres.tecnica}
          codigo={CODIGOS.mochila}
        />
      </header>

      <div className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <ul className="grid gap-2 sm:grid-cols-3">
          {itens.map((item) => (
            <li key={item.nome} className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm">
              <div className="font-medium text-zinc-200">{item.nome}</div>
              <div className="font-mono text-xs text-zinc-400">
                {dias(item.peso)} · nota {item.valor}
              </div>
            </li>
          ))}
        </ul>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Tempo disponível
            <select
              className={selectClass}
              value={diasTotais}
              onChange={(e) => {
                setDiasTotais(Number(e.target.value));
                reiniciar();
              }}
            >
              {OPCOES_DIAS.map((d) => (
                <option key={d} value={d}>
                  {String(d).replace(".", ",")} {d === 1 ? "dia" : "dias"}
                </option>
              ))}
            </select>
          </label>
          <label className="flex cursor-pointer items-start gap-3 self-end pb-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={comExtra}
              onChange={(e) => {
                setComExtra(e.target.checked);
                reiniciar();
              }}
              className="mt-0.5 h-5 w-5 shrink-0 accent-emerald-500"
            />
            <span>
              Adicionar a Torre de Londres (1 dia, nota 10). Atração e nota
              inventadas por mim, não fazem parte do exemplo do livro.
            </span>
          </label>
        </div>

        <button
          className={botaoPrimario}
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
            <Stat label="Maior nota total" value={String(dp.valorTotal)} tone="text-emerald-400" />
            <Stat
              label="Tempo usado"
              value={`${dias(tempoUsado)} de ${dias(capacidade)}`}
              tone="text-amber-400"
              pequeno
            />
            <Stat label="Célula" value={`${passoAtual + 1} / ${total}`} tone="text-zinc-100" />
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={`text-sm font-medium ${passo.usouItem ? "text-amber-400" : "text-zinc-300"}`}>
                {passo.descricao}
              </p>
              <div className="flex flex-wrap gap-2">
                <button className={botaoNavegacao} disabled={passoAtual === 0} onClick={() => setPassoAtual((p) => p - 1)}>
                  ← Anterior
                </button>
                <button className={botaoNavegacao} disabled={final} onClick={() => setPassoAtual((p) => p + 1)}>
                  Próximo →
                </button>
                <button className={botaoNavegacao} disabled={final} onClick={() => setPassoAtual(total - 1)}>
                  Ir ao fim
                </button>
              </div>
            </div>
            <p className="text-xs text-zinc-500">
              Na descrição acima, o tempo aparece em meios-dias (1 = meio dia) e
              os valores são as notas.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-1 text-center text-sm">
                <thead>
                  <tr className="text-xs text-zinc-400">
                    <th />
                    {colunas.map((c) => (
                      <th key={c} className="whitespace-nowrap px-2 py-1 font-medium">
                        {dias(c)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {itens.map((item, i) => (
                    <tr key={item.nome}>
                      <th className="whitespace-nowrap pr-3 text-right text-xs font-medium text-zinc-400">
                        {item.nome}
                      </th>
                      {colunas.map((c, j) => {
                        const ordem = i * capacidade + j;
                        const preenchida = ordem <= passoAtual;
                        const atual = ordem === passoAtual;
                        const escolhida =
                          final && dp.celulasEscolhidas.some(([li, co]) => li === i && co === j);
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
                                    : "bg-zinc-900 text-zinc-600"
                            }`}
                          >
                            {preenchida ? dp.tabela[i][j] : "·"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {final && (
            <div className="flex flex-col gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">
              <div className="font-medium text-zinc-200">Roteiro: {escolhidasNomes.join(" + ")}</div>
              <div className="text-zinc-400">
                Nota total {dp.valorTotal} em {dias(tempoUsado)}.
                {comExtra &&
                  " Repare que adicionar uma atração não obriga a recomeçar do zero: só acrescenta uma linha à tabela, que usa as respostas das linhas de cima."}
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
