"use client";

import { curvas, formatarPassos, formatarTempo } from "@/functions/bigO";
import { useState } from "react";
import { GraficoRolavel } from "../components/ui";
import { Explicacao } from "../components/explicacao";
import { EXPLICACOES } from "../explicacoes";

const X_MAX = 20;
const Y_MAX = 200;
const LARGURA = 500;
const ALTURA = 280;
const M = { esq: 40, dir: 10, topo: 10, base: 30 };

const gx = (n: number) =>
  M.esq + ((n - 1) / (X_MAX - 1)) * (LARGURA - M.esq - M.dir);
const gy = (v: number) =>
  ALTURA - M.base - (Math.min(v, Y_MAX) / Y_MAX) * (ALTURA - M.topo - M.base);

export default function BigO() {
  const [n, setN] = useState(10);

  const pontosX = Array.from({ length: X_MAX }, (_, i) => i + 1);

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Notação Big O</h1>
        <p className="text-zinc-400">
          Big O não mede segundos: mede como o número de operações cresce
          quando a entrada cresce. Um algoritmo mais rápido para entradas
          pequenas pode perder feio para uma entrada grande.
        </p>
        <Explicacao
          simples={EXPLICACOES.bigO.simples}
          tecnica={EXPLICACOES.bigO.tecnica}
        />
      </header>

      <section className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <label className="flex items-center justify-between text-sm text-zinc-300">
          <span>Tamanho da entrada (n)</span>
          <span className="font-mono text-lg text-emerald-400">{n}</span>
        </label>
        <input
          type="range"
          min={1}
          max={100}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="w-full accent-emerald-500"
          aria-label="Tamanho da entrada (n)"
        />
      </section>

      <section className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="text-xs uppercase tracking-wider text-zinc-500">
          Operações para n de 1 a {X_MAX} (eixo cortado em {Y_MAX})
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {curvas.map((c) => (
            <span key={c.id} className={`flex items-center gap-1.5 ${c.corTexto}`}>
              <span
                className="h-0.5 w-4 rounded"
                style={{ backgroundColor: c.cor }}
              />
              <span className="font-mono">{c.notacao}</span>
            </span>
          ))}
        </div>
        <GraficoRolavel minLargura={LARGURA}>
        <svg
          viewBox={`0 0 ${LARGURA} ${ALTURA}`}
          className="mx-auto w-full max-w-2xl"
          role="img"
          aria-label="Gráfico comparando o crescimento das classes de custo"
        >
          {[0, 50, 100, 150, 200].map((v) => (
            <g key={v}>
              <line
                x1={M.esq}
                x2={LARGURA - M.dir}
                y1={gy(v)}
                y2={gy(v)}
                className="stroke-zinc-800"
              />
              <text
                x={M.esq - 6}
                y={gy(v)}
                textAnchor="end"
                dominantBaseline="central"
                fontSize={10}
                className="fill-zinc-500"
              >
                {v}
              </text>
            </g>
          ))}
          {[1, 5, 10, 15, 20].map((v) => (
            <text
              key={v}
              x={gx(v)}
              y={ALTURA - 10}
              textAnchor="middle"
              fontSize={10}
              className="fill-zinc-500"
            >
              {v}
            </text>
          ))}

          {curvas.map((c) => (
            <polyline
              key={c.id}
              fill="none"
              stroke={c.cor}
              strokeWidth={2}
              points={pontosX.map((x) => `${gx(x)},${gy(c.passos(x))}`).join(" ")}
            />
          ))}

          {n <= X_MAX && (
            <line
              x1={gx(n)}
              x2={gx(n)}
              y1={M.topo}
              y2={ALTURA - M.base}
              className="stroke-zinc-400"
              strokeDasharray="4 4"
            />
          )}
        </svg>
        </GraficoRolavel>
        {n > X_MAX && (
          <p className="text-center text-xs text-zinc-500">
            O gráfico mostra n até {X_MAX}; a tabela abaixo usa n = {n}.
          </p>
        )}
      </section>

      <section className="fade-up flex flex-col gap-3">
        <div className="text-xs uppercase tracking-wider text-zinc-500">
          Para n = {n}, supondo 1 ms por operação
        </div>
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/60 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Custo</th>
                <th className="px-4 py-3 font-medium">Exemplo</th>
                <th className="px-4 py-3 text-right font-medium">Operações</th>
                <th className="px-4 py-3 text-right font-medium">Tempo</th>
              </tr>
            </thead>
            <tbody>
              {curvas.map((c) => {
                const passos = c.passos(n);
                return (
                  <tr key={c.id} className="border-t border-zinc-800">
                    <td className={`px-4 py-3 font-mono ${c.corTexto}`}>
                      {c.notacao}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{c.exemplo}</td>
                    <td className="px-4 py-3 text-right font-mono text-zinc-200">
                      {formatarPassos(passos)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-zinc-400">
                      {formatarTempo(passos)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-zinc-500">
          Experimente n = 100: a busca binária precisa de cerca de 7
          operações, enquanto uma busca simples precisa de 100. Já o O(n!) é
          impraticável a partir de n ≈ 20.
        </p>
      </section>
    </main>
  );
}
