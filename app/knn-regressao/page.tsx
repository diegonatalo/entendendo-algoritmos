"use client";

import { regressaoKnn } from "@/functions/knn";
import { PontoRegressao } from "@/@types/knn";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";
import { GraficoRolavel } from "../components/ui";

// x = movimento na rua, y = temperatura (0 a 100); valor = pães vendidos no dia
const PONTOS: PontoRegressao[] = (
  [
    [10, 20], [15, 60], [22, 35], [30, 80], [35, 15], [40, 50], [45, 75],
    [50, 30], [55, 60], [60, 90], [65, 20], [70, 45], [75, 70], [80, 35],
    [85, 85], [90, 55], [25, 55], [5, 45], [95, 15], [60, 50],
  ] as const
).map(([x, y], i) => ({
  x,
  y,
  valor: Math.round(40 + 1.2 * x + 0.6 * y + ((i * 7) % 9) * 3 - 12),
}));

const VALOR_MIN = Math.min(...PONTOS.map((p) => p.valor));
const VALOR_MAX = Math.max(...PONTOS.map((p) => p.valor));

const OFFSET_X = 15;
const BASE_Y = 105;
const px = (x: number) => OFFSET_X + x;
const py = (y: number) => BASE_Y - y;

// quanto maior o valor, mais intensa a cor do ponto
const opacidade = (valor: number) =>
  0.35 + 0.65 * ((valor - VALOR_MIN) / (VALOR_MAX - VALOR_MIN));

export default function KnnRegressao() {
  const [novo, setNovo] = useState<{ x: number; y: number } | null>(null);
  const [k, setK] = useState(3);

  const resultado = novo ? regressaoKnn(PONTOS, novo, k) : null;
  const raio = resultado
    ? resultado.vizinhos[resultado.vizinhos.length - 1].distancia
    : 0;

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    const svg = e.currentTarget;
    const ponto = svg.createSVGPoint();
    ponto.x = e.clientX;
    ponto.y = e.clientY;
    const local = ponto.matrixTransform(svg.getScreenCTM()!.inverse());
    const x = Math.min(100, Math.max(0, local.x - OFFSET_X));
    const y = Math.min(100, Math.max(0, BASE_Y - local.y));
    setNovo({ x: Math.round(x), y: Math.round(y) });
  }

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
        <Explicacao
          simples={EXPLICACOES.knnRegressao.simples}
          tecnica={EXPLICACOES.knnRegressao.tecnica}
          codigo={CODIGOS.regressaoKnn}
        />
      </header>

      <section className="fade-up flex flex-col gap-6">
        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <label className="flex items-center justify-between text-sm text-zinc-300">
            <span>Número de vizinhos (k)</span>
            <span className="font-mono text-lg text-emerald-400">{k}</span>
          </label>
          <input
            type="range"
            min={1}
            max={9}
            step={1}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="w-full accent-emerald-500"
            aria-label="Número de vizinhos (k)"
          />
          <div className="flex gap-2">
            <button
              className="cursor-pointer rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
              onClick={() =>
                setNovo({
                  x: Math.round(Math.random() * 100),
                  y: Math.round(Math.random() * 100),
                })
              }
            >
              Sortear dia
            </button>
            <button
              className="cursor-pointer rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!novo}
              onClick={() => setNovo(null)}
            >
              Limpar
            </button>
          </div>
        </div>

        <p className="text-xs text-zinc-500">
          Os números dentro dos pontos são os pães vendidos; cores mais fortes
          indicam mais pães.
        </p>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <GraficoRolavel minLargura={420}>
          <svg
            viewBox="0 0 120 115"
            className="mx-auto w-full max-w-xl cursor-crosshair"
            role="img"
            aria-label="Gráfico de dias da padaria por movimento e temperatura. Clique para colocar um dia novo."
            onClick={handleClick}
          >
            <rect
              x={OFFSET_X}
              y={5}
              width={100}
              height={100}
              rx={2}
              className="fill-zinc-950 stroke-zinc-700"
              strokeWidth={0.5}
            />
            {[25, 50, 75].map((g) => (
              <g key={g}>
                <line
                  x1={px(g)}
                  x2={px(g)}
                  y1={5}
                  y2={105}
                  className="stroke-zinc-800"
                  strokeWidth={0.3}
                />
                <line
                  x1={OFFSET_X}
                  x2={115}
                  y1={py(g)}
                  y2={py(g)}
                  className="stroke-zinc-800"
                  strokeWidth={0.3}
                />
              </g>
            ))}
            <text
              x={65}
              y={113}
              textAnchor="middle"
              fontSize={4}
              className="fill-zinc-500"
            >
              movimento na rua →
            </text>
            <text
              x={5}
              y={55}
              textAnchor="middle"
              fontSize={4}
              transform="rotate(-90 5 55)"
              className="fill-zinc-500"
            >
              temperatura →
            </text>

            {novo && resultado && (
              <>
                <circle
                  cx={px(novo.x)}
                  cy={py(novo.y)}
                  r={raio}
                  className="fill-zinc-100/5 stroke-zinc-500"
                  strokeWidth={0.4}
                  strokeDasharray="2 2"
                />
                {resultado.vizinhos.map(({ ponto }, i) => (
                  <line
                    key={i}
                    x1={px(novo.x)}
                    y1={py(novo.y)}
                    x2={px(ponto.x)}
                    y2={py(ponto.y)}
                    className="stroke-zinc-400"
                    strokeWidth={0.5}
                  />
                ))}
              </>
            )}

            {PONTOS.map((p, i) => {
              const vizinho = resultado?.vizinhos.some((v) => v.ponto === p);
              return (
                <g
                  key={i}
                  opacity={resultado && !vizinho ? 0.4 : 1}
                >
                  <circle
                    cx={px(p.x)}
                    cy={py(p.y)}
                    r={4.2}
                    className={`fill-amber-500 ${vizinho ? "stroke-zinc-100" : "stroke-transparent"}`}
                    fillOpacity={opacidade(p.valor)}
                    strokeWidth={0.8}
                  />
                  <text
                    x={px(p.x)}
                    y={py(p.y)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={3.2}
                    className="fill-zinc-50 font-mono"
                    pointerEvents="none"
                  >
                    {p.valor}
                  </text>
                </g>
              );
            })}

            {novo && resultado && (
              <g pointerEvents="none">
                <circle
                  cx={px(novo.x)}
                  cy={py(novo.y)}
                  r={5}
                  className="fill-emerald-500 stroke-zinc-100"
                  strokeWidth={1}
                />
                <text
                  x={px(novo.x)}
                  y={py(novo.y)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={3.6}
                  className="fill-emerald-950 font-mono font-semibold"
                >
                  {Math.round(resultado.media)}
                </text>
              </g>
            )}
          </svg>
          </GraficoRolavel>
        </div>

        {resultado && novo ? (
          <div className="flex flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-sm text-zinc-400">
                Previsão para o dia (movimento {novo.x}, temperatura {novo.y}):
              </span>
              <span className="text-xl font-semibold text-emerald-400">
                {Math.round(resultado.media)} pães
              </span>
            </div>

            <p className="font-mono text-sm text-zinc-400">
              média = ({resultado.vizinhos.map((v) => v.ponto.valor).join(" + ")}
              ) ÷ {k} = {resultado.media.toFixed(1).replace(".", ",")}
            </p>

            <ol className="flex flex-col gap-1 text-sm">
              {resultado.vizinhos.map(({ ponto, distancia: d }, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-lg bg-zinc-900 px-3 py-1.5"
                >
                  <span className="w-5 font-mono text-xs text-zinc-500">
                    {i + 1}.
                  </span>
                  <span className="w-20 text-amber-400">
                    {ponto.valor} pães
                  </span>
                  <span className="font-mono text-xs text-zinc-500">
                    ({ponto.x}, {ponto.y})
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
}
