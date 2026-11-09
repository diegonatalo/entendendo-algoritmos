"use client";

import { bellmanFord, simpleDijkstra } from "@/lib/bellman-ford";
import { Edge } from "@/types/bellman-ford";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";
import { StepControls, ScrollableChart, Legend, Stat, primaryButton } from "@/components/ui";

const NODES = ["inicio", "a", "b", "fim"];
const START = "inicio";
const END = "fim";

const BASE_EDGES: Edge[] = [
  { from: "inicio", to: "a", weight: 2 },
  { from: "inicio", to: "b", weight: 3 },
  { from: "b", to: "a", weight: -2 },
  { from: "a", to: "fim", weight: 4 },
  { from: "b", to: "fim", weight: 6 },
];

const CYCLE_EDGE: Edge = { from: "a", to: "b", weight: 1 };

const POSITIONS: Record<string, { x: number; y: number }> = {
  inicio: { x: 70, y: 150 },
  a: { x: 240, y: 50 },
  b: { x: 240, y: 250 },
  fim: { x: 410, y: 150 },
};

const RADIUS = 28;
const fmt = (cost: number) => (cost === Infinity ? "∞" : String(cost));
const sameEdge = (x: Edge | null, y: Edge) =>
  x !== null && x.from === y.from && x.to === y.to;

export default function BellmanFord() {
  const [withCycle, setWithCycle] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const edges = withCycle ? [...BASE_EDGES, CYCLE_EDGE] : BASE_EDGES;
  const bf = bellmanFord(NODES, edges, START, END);
  const dj = simpleDijkstra(NODES, edges, START, END);

  const step = bf.steps[currentStep];
  const final = currentStep === bf.steps.length - 1;
  const showPath = final && bf.path;

  const onPath = (from: string, to: string) => {
    if (!showPath || !bf.path) return false;
    const i = bf.path.indexOf(from);
    return i !== -1 && bf.path[i + 1] === to;
  };

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Bellman-Ford</h1>
        <p className="text-zinc-400">
          O Dijkstra assume que, ao processar um nó, o custo dele já é o
          menor possível. Com pesos negativos (um desconto, um reembolso) isso
          deixa de ser verdade. O Bellman-Ford não faz essa suposição: relaxa
          todas as arestas várias vezes e, se ainda melhorar depois do limite,
          há um ciclo negativo.
        </p>
        <Explanation
          simple={EXPLANATIONS.bellmanFord.simple}
          technique={EXPLANATIONS.bellmanFord.technique}
          code={CODES.bellmanFord}
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
            Adicionar a aresta a → b (peso 1). Com b → a (−2), o ciclo a → b →
            a soma −1 e pode ser repetido para sempre.
          </span>
        </label>
        <button
          className={primaryButton}
          onClick={() => {
            setExecuted(true);
            setCurrentStep(0);
          }}
        >
          Comparar Dijkstra e Bellman-Ford
        </button>
      </div>

      {executed && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Stat
              label="Dijkstra encontrou"
              value={
                dj.path
                  ? `${dj.totalCost} (${dj.path.join(" → ")})`
                  : "sem caminho"
              }
              tone="text-amber-400"
              small
            />
            <Stat
              label="Bellman-Ford encontrou"
              value={
                bf.negativeCycle
                  ? "ciclo negativo: sem menor caminho"
                  : bf.path
                    ? `${bf.costs[END]} (${bf.path.join(" → ")})`
                    : "sem caminho"
              }
              tone={bf.negativeCycle ? "text-red-400" : "text-emerald-400"}
              small
            />
          </div>

          {!bf.negativeCycle && dj.totalCost !== null && dj.totalCost !== bf.costs[END] && (
            <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              O Dijkstra errou: tratou o custo de &quot;a&quot; como final ao processá-lo e nunca
              reviu esse valor, então perdeu o caminho inicio → b → a → fim, mais barato
              por causa da aresta negativa.
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
            <Legend color="bg-amber-500" text="Aresta sendo relaxada" />
            <Legend color="bg-emerald-500" text="Caminho final" />
            <Legend color="bg-red-400" text="Peso negativo" />
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p
                className={`text-sm font-medium ${step.improved ? "text-emerald-400" : "text-zinc-300"}`}
              >
                {step.description}
              </p>
              <StepControls currentStep={currentStep} total={bf.steps.length} onChange={setCurrentStep} />
            </div>
            <p className="text-xs text-zinc-500">
              Passo {currentStep + 1} de {bf.steps.length}
            </p>

            <ScrollableChart minWidthValue={480}>
            <svg viewBox="0 0 480 300" className="mx-auto w-full max-w-xl" role="img" aria-label="Grafo com pesos negativos">
              <defs>
                {[
                  ["seta-bf", "fill-zinc-500"],
                  ["seta-bf-ok", "fill-emerald-400"],
                  ["seta-bf-at", "fill-amber-400"],
                ].map(([id, cssClass]) => (
                  <marker key={id} id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" className={cssClass} />
                  </marker>
                ))}
              </defs>

              {edges.map((edge) => {
                const { from, to, weight } = edge;
                const a = POSITIONS[from];
                const b = POSITIONS[to];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const d = Math.hypot(dx, dy);
                // arestas em sentidos opostos ficam lado a lado
                const opposite = edges.some((o) => o.from === to && o.to === from);
                const deviation = opposite ? 9 : 0;
                const ox = (dy / d) * deviation;
                const oy = (-dx / d) * deviation;
                const ok = onPath(from, to);
                const current = sameEdge(step.edge, edge);
                const color = current ? "stroke-amber-400" : ok ? "stroke-emerald-400" : "stroke-zinc-600";
                const marker = current ? "seta-bf-at" : ok ? "seta-bf-ok" : "seta-bf";
                const lx = (a.x + b.x) / 2 + (dy / d) * (opposite ? 24 : 15);
                const ly = (a.y + b.y) / 2 - (dx / d) * (opposite ? 24 : 15);
                return (
                  <g key={`${from}-${to}`}>
                    <line
                      x1={a.x + (dx / d) * RADIUS + ox}
                      y1={a.y + (dy / d) * RADIUS + oy}
                      x2={b.x - (dx / d) * (RADIUS + 2) + ox}
                      y2={b.y - (dy / d) * (RADIUS + 2) + oy}
                      strokeWidth={current || ok ? 3 : 1.5}
                      className={color}
                      markerEnd={`url(#${marker})`}
                    />
                    <text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={13}
                      className={`font-mono font-semibold ${weight < 0 ? "fill-red-400" : "fill-zinc-400"}`}
                    >
                      {weight}
                    </text>
                  </g>
                );
              })}

              {NODES.map((name) => (
                <g key={name}>
                  <circle
                    cx={POSITIONS[name].x}
                    cy={POSITIONS[name].y}
                    r={RADIUS}
                    strokeWidth={2}
                    className={`transition-colors ${
                      showPath && bf.path?.includes(name)
                        ? "fill-emerald-500 stroke-emerald-300"
                        : "fill-zinc-800 stroke-zinc-600"
                    }`}
                  />
                  <text
                    x={POSITIONS[name].x}
                    y={POSITIONS[name].y - 5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={11}
                    className={`font-mono ${showPath && bf.path?.includes(name) ? "fill-emerald-950" : "fill-zinc-100"}`}
                  >
                    {name}
                  </text>
                  <text
                    x={POSITIONS[name].x}
                    y={POSITIONS[name].y + 9}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={10}
                    className={`font-mono font-semibold ${showPath && bf.path?.includes(name) ? "fill-emerald-950" : "fill-amber-400"}`}
                  >
                    {fmt(step.costs[name])}
                  </text>
                </g>
              ))}
            </svg>
            </ScrollableChart>
            <p className="text-xs text-zinc-500">
              O número dentro de cada nó é o melhor custo conhecido até ali.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
