"use client";

import { curves, formatSteps, formatTime } from "@/lib/big-o";
import { useState } from "react";
import { ScrollableChart } from "@/components/ui";
import { Explanation } from "@/components/explanation";
import { EXPLANATIONS } from "@/lib/explanations";

const X_MAX = 20;
const Y_MAX = 200;
const WIDTH = 500;
const HEIGHT = 280;
const M = { esq: 40, dir: 10, top: 10, base: 30 };

const gx = (n: number) =>
  M.esq + ((n - 1) / (X_MAX - 1)) * (WIDTH - M.esq - M.dir);
const gy = (v: number) =>
  HEIGHT - M.base - (Math.min(v, Y_MAX) / Y_MAX) * (HEIGHT - M.top - M.base);

export default function BigO() {
  const [n, setN] = useState(10);

  const pointsX = Array.from({ length: X_MAX }, (_, i) => i + 1);

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Notação Big O</h1>
        <p className="text-zinc-400">
          Big O não mede segundos: mede como o número de operações cresce
          quando a entrada cresce. Um algoritmo mais rápido para entradas
          pequenas pode perder feio para uma entrada grande.
        </p>
        <Explanation
          simple={EXPLANATIONS.bigO.simple}
          technique={EXPLANATIONS.bigO.technique}
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
          {curves.map((c) => (
            <span key={c.id} className={`flex items-center gap-1.5 ${c.textColor}`}>
              <span
                className="h-0.5 w-4 rounded"
                style={{ backgroundColor: c.color }}
              />
              <span className="font-mono">{c.notation}</span>
            </span>
          ))}
        </div>
        <ScrollableChart minWidthValue={WIDTH}>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="mx-auto w-full max-w-2xl"
          role="img"
          aria-label="Gráfico comparando o crescimento das classes de custo"
        >
          {[0, 50, 100, 150, 200].map((v) => (
            <g key={v}>
              <line
                x1={M.esq}
                x2={WIDTH - M.dir}
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
              y={HEIGHT - 10}
              textAnchor="middle"
              fontSize={10}
              className="fill-zinc-500"
            >
              {v}
            </text>
          ))}

          {curves.map((c) => (
            <polyline
              key={c.id}
              fill="none"
              stroke={c.color}
              strokeWidth={2}
              points={pointsX.map((x) => `${gx(x)},${gy(c.steps(x))}`).join(" ")}
            />
          ))}

          {n <= X_MAX && (
            <line
              x1={gx(n)}
              x2={gx(n)}
              y1={M.top}
              y2={HEIGHT - M.base}
              className="stroke-zinc-400"
              strokeDasharray="4 4"
            />
          )}
        </svg>
        </ScrollableChart>
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
              {curves.map((c) => {
                const steps = c.steps(n);
                return (
                  <tr key={c.id} className="border-t border-zinc-800">
                    <td className={`px-4 py-3 font-mono ${c.textColor}`}>
                      {c.notation}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{c.example}</td>
                    <td className="px-4 py-3 text-right font-mono text-zinc-200">
                      {formatSteps(steps)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-zinc-400">
                      {formatTime(steps)}
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
