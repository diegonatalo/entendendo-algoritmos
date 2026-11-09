"use client";

import {
  formatDuration,
  crossingPoint,
  linearTime,
  logarithmicTime,
} from "@/lib/constants";
import { useState } from "react";
import { ScrollableChart, Stat, inputMono } from "@/components/ui";
import { Explanation } from "@/components/explanation";
import { EXPLANATIONS } from "@/lib/explanations";

const EXPONENTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const WIDTH = 500;
const HEIGHT = 260;
const M = { esq: 52, dir: 12, top: 10, base: 28 };

const fmtN = (n: number) => n.toLocaleString("pt-BR");

export default function BigOConstants() {
  const [linearMs, setLinearMs] = useState(1);
  const [logMs, setLogMs] = useState(1000);
  const [exponent, setExponent] = useState(3);

  const n = 10 ** exponent;
  const tLinear = linearTime(n, linearMs);
  const tLog = logarithmicTime(n, logMs);
  const crossing = crossingPoint(linearMs, logMs);

  // gráfico: eixo x = expoente (n = 10^x), eixo y = log10 do tempo em ms
  const series = (f: (n: number) => number) =>
    EXPONENTS.map((e) => Math.log10(Math.max(f(10 ** e), 1e-3)));
  const sLinear = series((x) => linearTime(x, linearMs));
  const sLog = series((x) => logarithmicTime(x, logMs));
  const yMin = Math.floor(Math.min(...sLinear, ...sLog));
  const yMax = Math.ceil(Math.max(...sLinear, ...sLog));
  const gx = (e: number) => M.esq + ((e - 1) / 9) * (WIDTH - M.esq - M.dir);
  const gy = (v: number) =>
    HEIGHT - M.base - ((v - yMin) / Math.max(yMax - yMin, 1)) * (HEIGHT - M.top - M.base);
  const ticksY = Array.from({ length: yMax - yMin + 1 }, (_, i) => yMin + i).filter(
    (_, i, arr) => arr.length <= 8 || i % 2 === 0,
  );

  const winner = tLinear < tLog ? "linear" : "log";

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Constantes escondidas</h1>
        <p className="text-zinc-400">
          A notação Big O descarta a constante: O(n) significa &quot;n vezes algum
          tempo fixo&quot;. Quase sempre isso basta, mas às vezes a constante
          decide quem vence. Imagine uma busca simples que gasta 1 ms por item
          e uma busca binária que gasta 1 s por passo (porque, por exemplo,
          cada passo exige uma operação muito mais pesada). Para listas
          pequenas, a &quot;pior&quot; busca ganha.
        </p>
        <Explanation
          simple={EXPLANATIONS.bigOConstants.simple}
          technique={EXPLANATIONS.bigOConstants.technique}
        />
      </header>

      <section className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Tempo por passo da busca simples, O(n) (ms)
            <input
              className={inputMono}
              type="number"
              min={0.001}
              step="any"
              value={linearMs}
              onChange={(e) => setLinearMs(Math.max(0.001, Number(e.target.value) || 0.001))}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Tempo por passo da busca binária, O(log n) (ms)
            <input
              className={inputMono}
              type="number"
              min={0.001}
              step="any"
              value={logMs}
              onChange={(e) => setLogMs(Math.max(0.001, Number(e.target.value) || 0.001))}
            />
          </label>
        </div>
        <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
          <span className="flex items-center justify-between">
            Tamanho da lista
            <span className="font-mono text-lg text-emerald-400">{fmtN(n)}</span>
          </span>
          <input
            type="range"
            min={1}
            max={10}
            value={exponent}
            onChange={(e) => setExponent(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <span className="text-xs text-zinc-500">de 10 até 10 bilhões de itens</span>
        </label>
      </section>

      <section className="fade-up flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat
            label="Busca simples"
            value={formatDuration(tLinear)}
            tone={winner === "linear" ? "text-emerald-400" : "text-zinc-300"}
          />
          <Stat
            label="Busca binária"
            value={formatDuration(tLog)}
            tone={winner === "log" ? "text-emerald-400" : "text-zinc-300"}
          />
          <Stat
            label="Mais rápida aqui"
            value={winner === "linear" ? "Busca simples" : "Busca binária"}
            tone="text-amber-400"
            small
          />
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-400">
          {crossing === null
            ? "Com essas constantes, a busca binária nunca chega a compensar na faixa testada."
            : `A busca binária só passa a compensar a partir de cerca de ${fmtN(crossing)} itens. Abaixo disso, a constante maior pesa mais que o crescimento mais lento.`}
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex flex-wrap gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="h-0.5 w-4 rounded bg-sky-400" /> Busca simples
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-0.5 w-4 rounded bg-emerald-400" /> Busca binária
            </span>
            <span className="text-zinc-500">eixo vertical em escala logarítmica</span>
          </div>
          <ScrollableChart minWidthValue={WIDTH}>
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="mx-auto w-full max-w-2xl"
            role="img"
            aria-label="Tempo de cada busca conforme o tamanho da lista"
          >
            {ticksY.map((v) => (
              <g key={v}>
                <line x1={M.esq} x2={WIDTH - M.dir} y1={gy(v)} y2={gy(v)} className="stroke-zinc-800" />
                <text
                  x={M.esq - 6}
                  y={gy(v)}
                  textAnchor="end"
                  dominantBaseline="central"
                  fontSize={10}
                  className="fill-zinc-500"
                >
                  {formatDuration(10 ** v)}
                </text>
              </g>
            ))}
            {EXPONENTS.map((e) => (
              <text
                key={e}
                x={gx(e)}
                y={HEIGHT - 10}
                textAnchor="middle"
                fontSize={10}
                className="fill-zinc-500"
              >
                10{e === 1 ? "" : `^${e}`}
              </text>
            ))}
            <polyline
              fill="none"
              stroke="#38bdf8"
              strokeWidth={2}
              points={EXPONENTS.map((e, i) => `${gx(e)},${gy(sLinear[i])}`).join(" ")}
            />
            <polyline
              fill="none"
              stroke="#34d399"
              strokeWidth={2}
              points={EXPONENTS.map((e, i) => `${gx(e)},${gy(sLog[i])}`).join(" ")}
            />
            <line
              x1={gx(exponent)}
              x2={gx(exponent)}
              y1={M.top}
              y2={HEIGHT - M.base}
              className="stroke-zinc-400"
              strokeDasharray="4 4"
            />
          </svg>
          </ScrollableChart>
        </div>

        <div className="flex flex-col gap-3 text-sm text-zinc-400">
          <h2 className="text-lg font-semibold text-zinc-100">Por que isso importa</h2>
          <p>
            O mesmo raciocínio explica por que o quicksort e a ordenação por
            mesclagem, ambos O(n log n) em média, não têm o mesmo desempenho na
            prática: segundo o livro, o quicksort costuma ter uma constante
            menor e por isso costuma ser mais rápido. Isso depende da
            implementação e do hardware, então vale medir em vez de supor.
            Escolher bem o pivô evita o pior caso do quicksort.
          </p>
          <p>
            A lição do livro: Big O diz como o custo cresce, não quanto tempo
            leva. Use-o para comparar algoritmos com crescimentos diferentes e,
            quando o crescimento é o mesmo, olhe também para as constantes.
          </p>
        </div>
      </section>
    </main>
  );
}
