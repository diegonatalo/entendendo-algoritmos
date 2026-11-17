"use client";

import { knnRegression } from "@/lib/knn";
import { RegressionPoint } from "@/types/knn";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";
import { KnnControls, KnnPlot, plotX, plotY } from "@/components/knn-plot";

// x = movimento na rua, y = temperatura (0 a 100); valor = pães vendidos no dia
const POINTS: RegressionPoint[] = (
  [
    [10, 20], [15, 60], [22, 35], [30, 80], [35, 15], [40, 50], [45, 75],
    [50, 30], [55, 60], [60, 90], [65, 20], [70, 45], [75, 70], [80, 35],
    [85, 85], [90, 55], [25, 55], [5, 45], [95, 15], [60, 50],
  ] as const
).map(([x, y], i) => ({
  x,
  y,
  value: Math.round(40 + 1.2 * x + 0.6 * y + ((i * 7) % 9) * 3 - 12),
}));

const MIN_VALUE = Math.min(...POINTS.map((p) => p.value));
const MAX_VALUE = Math.max(...POINTS.map((p) => p.value));

// quanto maior o valor, mais intensa a cor do ponto
const opacity = (value: number) =>
  0.35 + 0.65 * ((value - MIN_VALUE) / (MAX_VALUE - MIN_VALUE));

export const KnnRegressionPage = () => {
  const [created, setCreated] = useState<{ x: number; y: number } | null>(null);
  const [k, setK] = useState(3);

  const result = created ? knnRegression(POINTS, created, k) : null;

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          KNN: regressão
        </h1>
        <p className="text-zinc-400">
          Além de classificar, o KNN também prevê números. Cada ponto é um dia
          da padaria, descrito por movimento na rua e temperatura, com o número
          de pães vendidos. Clique em um dia novo: a previsão é a média dos
          pães dos k dias mais parecidos.
        </p>
        <Explanation
          simple={EXPLANATIONS.knnRegressionPage.simple}
          technique={EXPLANATIONS.knnRegressionPage.technique}
          code={CODES.knnRegression}
        />
      </header>

      <section className="fade-up flex flex-col gap-6">
        <KnnControls
          k={k}
          onKChange={setK}
          randomLabel="Sortear dia"
          onRandom={() =>
            setCreated({
              x: Math.round(Math.random() * 100),
              y: Math.round(Math.random() * 100),
            })
          }
          onClear={created ? () => setCreated(null) : undefined}
        />

        <p className="text-xs text-zinc-500">
          Os números dentro dos pontos são os pães vendidos; cores mais fortes
          indicam mais pães.
        </p>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <KnnPlot
            label="Gráfico de dias da padaria por movimento e temperatura. Clique para colocar um dia novo."
            minWidth={420}
            xLabel="movimento na rua"
            yLabel="temperatura"
            created={created}
            neighbors={result?.neighbors.map((n) => n.point) ?? []}
            onPick={setCreated}
          >
            {POINTS.map((p, i) => {
              const neighbor = result?.neighbors.some((v) => v.point === p);
              return (
                <g
                  key={i}
                  opacity={result && !neighbor ? 0.4 : 1}
                >
                  <circle
                    cx={plotX(p.x)}
                    cy={plotY(p.y)}
                    r={4.2}
                    className={`fill-amber-500 ${neighbor ? "stroke-zinc-100" : "stroke-transparent"}`}
                    fillOpacity={opacity(p.value)}
                    strokeWidth={0.8}
                  />
                  <text
                    x={plotX(p.x)}
                    y={plotY(p.y)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={3.2}
                    className="fill-zinc-50 font-mono"
                    pointerEvents="none"
                  >
                    {p.value}
                  </text>
                </g>
              );
            })}

            {created && result && (
              <g pointerEvents="none">
                <circle
                  cx={plotX(created.x)}
                  cy={plotY(created.y)}
                  r={5}
                  className="fill-emerald-500 stroke-zinc-100"
                  strokeWidth={1}
                />
                <text
                  x={plotX(created.x)}
                  y={plotY(created.y)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={3.6}
                  className="fill-emerald-950 font-mono font-semibold"
                >
                  {Math.round(result.average)}
                </text>
              </g>
            )}
          </KnnPlot>
        </div>

        {result && created ? (
          <div className="flex flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-sm text-zinc-400">
                Previsão para o dia (movimento {created.x}, temperatura {created.y}):
              </span>
              <span className="text-xl font-semibold text-emerald-400">
                {Math.round(result.average)} pães
              </span>
            </div>

            <p className="font-mono text-sm text-zinc-400">
              média = ({result.neighbors.map((v) => v.point.value).join(" + ")}
              ) ÷ {k} = {result.average.toFixed(1).replace(".", ",")}
            </p>

            <ol className="flex flex-col gap-1 text-sm">
              {result.neighbors.map(({ point, distance: d }, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-lg bg-zinc-900 px-3 py-1.5"
                >
                  <span className="w-5 font-mono text-xs text-zinc-500">
                    {i + 1}.
                  </span>
                  <span className="w-20 text-amber-400">
                    {point.value} pães
                  </span>
                  <span className="font-mono text-xs text-zinc-500">
                    ({point.x}, {point.y})
                  </span>
                  <span className="ml-auto font-mono text-xs text-zinc-300">
                    distância {d.toFixed(1).replace(".", ",")}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <p className="text-sm text-zinc-500">
            Clique no gráfico ou use o botão Sortear dia para prever as vendas.
          </p>
        )}
      </section>
    </main>
  );
};
