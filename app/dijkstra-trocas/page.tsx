"use client";

import { dijkstra } from "@/lib/dijkstra";
import { WeightedGraph } from "@/types/dijkstra";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";
import { StepControls, ScrollableChart, Legend, Stat, primaryButton } from "@/components/ui";

// cada aresta é uma troca: o peso é o dinheiro a pagar além do item entregue
const SWAPS: WeightedGraph = {
  livro: { LP: 5, pôster: 0 },
  LP: { baixo: 15, bateria: 20 },
  pôster: { baixo: 30, bateria: 35 },
  baixo: { piano: 20 },
  bateria: { piano: 10 },
  piano: {},
};

const POSITIONS: Record<string, { x: number; y: number }> = {
  livro: { x: 55, y: 150 },
  LP: { x: 205, y: 55 },
  pôster: { x: 205, y: 245 },
  baixo: { x: 355, y: 55 },
  bateria: { x: 355, y: 245 },
  piano: { x: 505, y: 150 },
};

const START = "livro";
const END = "piano";
const RADIUS = 30;
const names = Object.keys(SWAPS);

const colorOfType = {
  start: "text-zinc-300",
  process: "text-amber-400",
  end: "text-emerald-400",
};

const fmt = (cost: number) => (cost === Infinity ? "∞" : `R$ ${cost}`);

export default function DijkstraSwaps() {
  const [withCycle, setWithCycle] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // aresta que fecha um ciclo: LP → baixo → LP
  const graph: WeightedGraph = withCycle
    ? { ...SWAPS, baixo: { ...SWAPS.baixo, LP: 2 } }
    : SWAPS;

  const result = dijkstra(graph, START, END);
  const step = result.steps[currentStep];
  const final = currentStep === result.steps.length - 1;
  const showPath = final && result.path;

  const onPath = (name: string) => showPath && result.path?.includes(name);
  const edgeOnPath = (from: string, to: string) => {
    if (!showPath || !result.path) return false;
    const i = result.path.indexOf(from);
    return i !== -1 && result.path[i + 1] === to;
  };

  function nodeStyle(name: string) {
    if (!executed) return "fill-zinc-800 stroke-zinc-600";
    if (onPath(name)) return "fill-emerald-500 stroke-emerald-300";
    if (step.current === name) return "fill-amber-500 stroke-amber-300";
    if (step.processed.includes(name)) return "fill-sky-900 stroke-sky-500";
    return "fill-zinc-800 stroke-zinc-600";
  }

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dijkstra: trocando um livro por um piano</h1>
        <p className="text-zinc-400">
          O segundo exemplo do capítulo 7: você quer trocar um livro por um
          piano, passando por uma série de trocas, e cada troca exige pagar
          uma diferença em dinheiro. O caminho mais barato no grafo é a série
          de trocas mais econômica. O Dijkstra serve para qualquer custo, não
          só distância ou tempo, desde que não seja negativo.
        </p>
        <Explanation
          simple={EXPLANATIONS.dijkstraSwaps.simple}
          technique={EXPLANATIONS.dijkstraSwaps.technique}
          code={CODES.dijkstra}
        />
      </header>

      <div className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={withCycle}
            onChange={(e) => {
              setWithCycle(e.target.checked);
              setExecuted(false);
              setCurrentStep(0);
            }}
            className="mt-0.5 h-5 w-5 shrink-0 accent-emerald-500"
          />
          <span>
            Criar um ciclo: permitir trocar o baixo de volta por um LP (R$ 2).
            Um ciclo de custo positivo só gasta dinheiro à toa, então o
            Dijkstra o ignora.
          </span>
        </label>
        <button
          className={primaryButton}
          onClick={() => {
            setExecuted(true);
            setCurrentStep(0);
          }}
        >
          Achar as trocas mais baratas
        </button>
      </div>

      {executed && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Custo mínimo"
              value={result.totalCost !== null ? `R$ ${result.totalCost}` : "—"}
              tone="text-emerald-400"
            />
            <Stat
              label="Trocas"
              value={result.path ? result.path.join(" → ") : "—"}
              tone="text-zinc-100"
              small
            />
            <Stat
              label="Passo"
              value={`${currentStep + 1} / ${result.steps.length}`}
              tone="text-zinc-100"
            />
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
            <Legend color="bg-amber-500" text="Item mais barato agora" />
            <Legend color="bg-sky-900 ring-1 ring-sky-500" text="Já processado" />
            <Legend color="bg-emerald-500" text="Trocas escolhidas" />
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={`text-sm font-medium ${colorOfType[step.type]}`}>{step.description}</p>
              <StepControls currentStep={currentStep} total={result.steps.length} onChange={setCurrentStep} />
            </div>

            <ScrollableChart minWidthValue={560}>
            <svg viewBox="0 0 560 300" className="mx-auto w-full max-w-2xl" role="img" aria-label="Grafo de trocas do livro até o piano">
              <defs>
                {[
                  ["seta-tr", "fill-zinc-500"],
                  ["seta-tr-ok", "fill-emerald-400"],
                ].map(([id, cssClass]) => (
                  <marker key={id} id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" className={cssClass} />
                  </marker>
                ))}
              </defs>

              {names.flatMap((from) =>
                Object.entries(graph[from]).map(([to, weight]) => {
                  const a = POSITIONS[from];
                  const b = POSITIONS[to];
                  const dx = b.x - a.x;
                  const dy = b.y - a.y;
                  const d = Math.hypot(dx, dy);
                  const opposite = graph[to]?.[from] !== undefined;
                  const deviation = opposite ? 8 : 0;
                  const ox = (dy / d) * deviation;
                  const oy = (-dx / d) * deviation;
                  const ok = edgeOnPath(from, to);
                  const lx = a.x + dx * 0.4 + (dy / d) * (opposite ? 20 : 12) ;
                  const ly = a.y + dy * 0.4 - (dx / d) * (opposite ? 20 : 12);
                  return (
                    <g key={`${from}-${to}`}>
                      <line
                        x1={a.x + (dx / d) * RADIUS + ox}
                        y1={a.y + (dy / d) * RADIUS + oy}
                        x2={b.x - (dx / d) * (RADIUS + 2) + ox}
                        y2={b.y - (dy / d) * (RADIUS + 2) + oy}
                        strokeWidth={ok ? 3 : 1.5}
                        className={ok ? "stroke-emerald-400" : "stroke-zinc-600"}
                        markerEnd={`url(#${ok ? "seta-tr-ok" : "seta-tr"})`}
                      />
                      <text
                        x={lx}
                        y={ly}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={12}
                        className={`font-mono font-semibold ${ok ? "fill-emerald-300" : "fill-zinc-400"}`}
                      >
                        {weight}
                      </text>
                    </g>
                  );
                }),
              )}

              {names.map((name) => (
                <g key={name}>
                  <circle
                    cx={POSITIONS[name].x}
                    cy={POSITIONS[name].y}
                    r={RADIUS}
                    strokeWidth={2}
                    className={`transition-colors ${nodeStyle(name)}`}
                  />
                  <text
                    x={POSITIONS[name].x}
                    y={POSITIONS[name].y - 5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={11}
                    className={onPath(name) || step.current === name ? "fill-black" : "fill-zinc-100"}
                  >
                    {name}
                  </text>
                  <text
                    x={POSITIONS[name].x}
                    y={POSITIONS[name].y + 9}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={10}
                    className={`font-mono font-semibold ${onPath(name) || step.current === name ? "fill-black" : "fill-amber-400"}`}
                  >
                    {fmt(step.costs[name])}
                  </text>
                </g>
              ))}
            </svg>
            </ScrollableChart>
            <p className="text-xs text-zinc-500">
              O número em cada seta é o dinheiro pago naquela troca; o valor
              dentro de cada item é o menor custo conhecido para chegar nele.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="py-2 pr-4 font-medium">Item</th>
                    <th className="py-2 pr-4 font-medium">Custo</th>
                    <th className="py-2 pr-4 font-medium">Veio de</th>
                    <th className="py-2 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {names.map((name) => (
                    <tr key={name} className="border-t border-zinc-800">
                      <td className="py-2 pr-4 text-zinc-300">{name}</td>
                      <td className={`py-2 pr-4 ${step.costs[name] === Infinity ? "text-zinc-500" : "text-amber-400"}`}>
                        {fmt(step.costs[name])}
                      </td>
                      <td className="py-2 pr-4 text-zinc-400">{step.parents[name] ?? "—"}</td>
                      <td className="py-2 text-xs text-zinc-400">
                        {step.processed.includes(name) ? "processado" : "pendente"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </section>
      )}
    </main>
  );
}
