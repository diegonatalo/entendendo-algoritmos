"use client";

import { knn } from "@/functions/knn";
import { Classe, PontoKnn } from "@/@types/knn";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";
import { GraficoRolavel } from "../components/ui";

// x = tamanho, y = vermelhidão (0 a 100)
const PONTOS: PontoKnn[] = [
  ...(
    [
      [20, 70], [25, 55], [30, 65], [35, 50], [28, 80], [40, 62],
      [33, 40], [45, 55], [22, 45], [38, 75], [50, 48], [42, 35],
    ] as const
  ).map(([x, y]): PontoKnn => ({ x, y, classe: "laranja" })),
  ...(
    [
      [60, 30], [70, 45], [75, 25], [65, 55], [80, 40], [85, 60],
      [72, 70], [58, 42], [90, 35], [68, 20], [55, 60], [78, 52],
    ] as const
  ).map(([x, y]): PontoKnn => ({ x, y, classe: "toranja" })),
];

const COR: Record<Classe, { fill: string; stroke: string; texto: string; barra: string }> = {
  laranja: {
    fill: "fill-amber-500",
    stroke: "stroke-amber-400",
    texto: "text-amber-400",
    barra: "bg-amber-500",
  },
  toranja: {
    fill: "fill-rose-500",
    stroke: "stroke-rose-400",
    texto: "text-rose-400",
    barra: "bg-rose-500",
  },
};

const NOME: Record<Classe, string> = { laranja: "Laranja", toranja: "Toranja" };

// o gráfico usa a área de 15..115 (x) e 5..105 (y) do viewBox
const OFFSET_X = 15;
const BASE_Y = 105;
const px = (x: number) => OFFSET_X + x;
const py = (y: number) => BASE_Y - y;

export default function Knn() {
  const [novo, setNovo] = useState<{ x: number; y: number } | null>(null);
  const [k, setK] = useState(3);

  const resultado = novo ? knn(PONTOS, novo, k) : null;
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
          K-vizinhos mais próximos
        </h1>
        <p className="text-zinc-400">
          Para classificar um item novo, o KNN olha os k itens mais parecidos e
          escolhe a categoria que mais aparece entre eles. Aqui, frutas são
          pontos em um plano: tamanho e vermelhidão. Clique no gráfico para
          colocar uma fruta nova.
        </p>
        <Explicacao
          simples={EXPLICACOES.knnClassificacao.simples}
          tecnica={EXPLICACOES.knnClassificacao.tecnica}
          codigo={CODIGOS.knn}
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
              Sortear ponto
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

        <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-amber-500" /> Laranja
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500" /> Toranja
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full ring-2 ring-zinc-100" /> Fruta
            nova
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <GraficoRolavel minLargura={340}>
          <svg
            viewBox="0 0 120 115"
            className="mx-auto w-full max-w-xl cursor-crosshair"
            role="img"
            aria-label="Gráfico de frutas por tamanho e vermelhidão. Clique para colocar uma fruta nova."
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
              tamanho →
            </text>
            <text
              x={5}
              y={55}
              textAnchor="middle"
              fontSize={4}
              transform="rotate(-90 5 55)"
              className="fill-zinc-500"
            >
              vermelhidão →
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
              const vizinho = resultado?.vizinhos.some(
                (v) => v.ponto === p,
              );
              return (
                <circle
                  key={i}
                  cx={px(p.x)}
                  cy={py(p.y)}
                  r={vizinho ? 2.6 : 2}
                  className={`${COR[p.classe].fill} ${vizinho ? "stroke-zinc-100" : "stroke-transparent"}`}
                  strokeWidth={0.8}
                  opacity={resultado && !vizinho ? 0.45 : 1}
                />
              );
            })}

            {novo && resultado && (
              <circle
                cx={px(novo.x)}
                cy={py(novo.y)}
                r={3.8}
                className={`${COR[resultado.classe].fill} stroke-zinc-100`}
                strokeWidth={1.2}
              />
            )}
          </svg>
          </GraficoRolavel>
        </div>

        {resultado && novo ? (
          <div className="flex flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-sm text-zinc-400">
                Fruta em (tamanho {novo.x}, vermelhidão {novo.y}) é classificada
                como
              </span>
              <span
                className={`text-xl font-semibold ${COR[resultado.classe].texto}`}
              >
                {NOME[resultado.classe]}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-xs uppercase tracking-wider text-zinc-500">
                Votação entre os {k} vizinhos
              </div>
              {(Object.keys(NOME) as Classe[]).map((c) => (
                <div key={c} className="flex items-center gap-3 text-sm">
                  <span className="w-16 text-zinc-300">{NOME[c]}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className={`h-full ${COR[c].barra} transition-all`}
                      style={{ width: `${(resultado.votos[c] / k) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right font-mono text-zinc-400">
                    {resultado.votos[c]}
                  </span>
                </div>
              ))}
              {resultado.votos.laranja === resultado.votos.toranja && (
                <p className="text-xs text-zinc-500">
                  Empate: vale a categoria do vizinho mais próximo. Use um k
                  ímpar para evitar isso.
                </p>
              )}
            </div>

            <ol className="flex flex-col gap-1 text-sm">
              {resultado.vizinhos.map(({ ponto, distancia: d }, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-lg bg-zinc-900 px-3 py-1.5"
                >
                  <span className="w-5 font-mono text-xs text-zinc-500">
                    {i + 1}.
                  </span>
                  <span className={`w-16 ${COR[ponto.classe].texto}`}>
                    {NOME[ponto.classe]}
                  </span>
                  <span className="font-mono text-xs text-zinc-500">
                    ({ponto.x}, {ponto.y})
                  </span>
                  <span className="ml-auto font-mono text-xs text-zinc-300">
                    distância {d.toFixed(1)}
                  </span>
                </li>
              ))}
            </ol>
            <p className="text-xs text-zinc-500">
              Distância = √((x₂ − x₁)² + (y₂ − y₁)²). O círculo tracejado
              alcança o k-ésimo vizinho.
            </p>
          </div>
        ) : (
          <p className="text-sm text-zinc-500">
            Clique no gráfico ou use o botão Sortear ponto para classificar uma fruta.
          </p>
        )}
      </section>
    </main>
  );
}
