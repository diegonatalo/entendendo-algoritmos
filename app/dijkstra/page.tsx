"use client";

import { dijkstra } from "@/lib/dijkstra";
import { WeightedGraph } from "@/types/dijkstra";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";
import { StepControls, ScrollableChart } from "@/components/ui";

// grafo do exemplo do livro (arestas dirigidas, com pesos)
const GRAPH: WeightedGraph = {
  inicio: { a: 6, b: 2 },
  a: { fim: 1 },
  b: { a: 3, fim: 5 },
  fim: {},
};

const START = "inicio";
const END = "fim";

const POSITIONS: Record<string, { x: number; y: number }> = {
  inicio: { x: 70, y: 150 },
  a: { x: 240, y: 50 },
  b: { x: 240, y: 250 },
  fim: { x: 410, y: 150 },
};

const RADIUS = 28;
const names = Object.keys(GRAPH);

const colorOfType = {
  start: "text-zinc-300",
  process: "text-amber-400",
  end: "text-emerald-400",
};

const format = (cost: number) => (cost === Infinity ? "∞" : String(cost));

export default function Dijkstra() {
  const [result, setResult] = useState<ReturnType<
    typeof dijkstra
  > | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const step = result?.steps[currentStep];
  const final = step?.type === "end" && result?.path;

  const onPath = (name: string) => final && result.path?.includes(name);
  const edgeOnPath = (from: string, to: string) => {
    if (!final || !result.path) return false;
    const i = result.path.indexOf(from);
    return i !== -1 && result.path[i + 1] === to;
  };

  function nodeStyle(name: string) {
    if (onPath(name)) return "fill-emerald-500 stroke-emerald-300";
    if (step?.current === name) return "fill-amber-500 stroke-amber-300";
    if (step?.processed.includes(name))
      return "fill-sky-900 stroke-sky-500";
    return "fill-zinc-800 stroke-zinc-600";
  }

  function nodeText(name: string) {
    if (onPath(name)) return "fill-emerald-950";
    if (step?.current === name) return "fill-amber-950";
    return "fill-zinc-100";
  }

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Algoritmo de Dijkstra
        </h1>
        <p className="text-zinc-400">
          Encontra o caminho de menor custo em um grafo com pesos nas arestas.
          A cada passo, escolhe o nó mais barato ainda não processado e
          atualiza o custo dos vizinhos. Não funciona com pesos negativos.
        </p>
        <p className="text-sm text-zinc-500">
          O caminho com menos arestas (inicio → a → fim) não é o mais barato:
          veja como o algoritmo descobre isso.
        </p>
        <Explanation
          simple={EXPLANATIONS.dijkstra.simple}
          technique={EXPLANATIONS.dijkstra.technique}
          code={CODES.dijkstra}
        />
      </header>

      <div className="fade-up">
        <button
          className="w-full cursor-pointer rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:bg-emerald-600"
          onClick={() => {
            setResult(dijkstra(GRAPH, START, END));
            setCurrentStep(0);
          }}
        >
          Executar de {START} até {END}
        </button>
      </div>

      {result && step && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Menor custo"
              value={
                result.totalCost !== null
                  ? String(result.totalCost)
                  : "—"
              }
              tone="text-emerald-400"
            />
            <Stat
              label="Caminho"
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
            <Legend color="bg-amber-500" text="Nó mais barato (atual)" />
            <Legend color="bg-sky-900 ring-1 ring-sky-500" text="Já processado" />
            <Legend color="bg-emerald-500" text="Caminho final" />
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={`text-sm font-medium ${colorOfType[step.type]}`}>
                {step.description}
              </p>
              <StepControls currentStep={currentStep} total={result.steps.length} onChange={setCurrentStep} goToEnd={false} />
            </div>

            <ScrollableChart minWidthValue={480}>
            <svg
              viewBox="0 0 480 300"
              className="mx-auto w-full max-w-xl"
              role="img"
              aria-label="Grafo ponderado do exemplo"
            >
              <defs>
                <marker
                  id="seta-d"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M0,0 L10,5 L0,10 z" className="fill-zinc-500" />
                </marker>
                <marker
                  id="seta-d-ok"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M0,0 L10,5 L0,10 z" className="fill-emerald-400" />
                </marker>
              </defs>

              {names.flatMap((from) =>
                Object.entries(GRAPH[from]).map(([to, weight]) => {
                  const a = POSITIONS[from];
                  const b = POSITIONS[to];
                  const dx = b.x - a.x;
                  const dy = b.y - a.y;
                  const d = Math.hypot(dx, dy);
                  const ok = edgeOnPath(from, to);
                  // rótulo deslocado para o lado da aresta
                  const lx = (a.x + b.x) / 2 + (dy / d) * 14;
                  const ly = (a.y + b.y) / 2 - (dx / d) * 14;
                  return (
                    <g key={`${from}-${to}`}>
                      <line
                        x1={a.x + (dx / d) * RADIUS}
                        y1={a.y + (dy / d) * RADIUS}
                        x2={b.x - (dx / d) * (RADIUS + 2)}
                        y2={b.y - (dy / d) * (RADIUS + 2)}
                        strokeWidth={ok ? 3 : 1.5}
                        className={ok ? "stroke-emerald-400" : "stroke-zinc-600"}
                        markerEnd={`url(#${ok ? "seta-d-ok" : "seta-d"})`}
                      />
                      <text
                        x={lx}
                        y={ly}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={13}
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
                    y={POSITIONS[name].y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={12}
                    className={`font-mono ${nodeText(name)}`}
                  >
                    {name}
                  </text>
                </g>
              ))}
            </svg>
            </ScrollableChart>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="py-2 pr-4 font-medium">Nó</th>
                    <th className="py-2 pr-4 font-medium">Custo</th>
                    <th className="py-2 pr-4 font-medium">Pai</th>
                    <th className="py-2 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {names.map((name) => (
                    <tr key={name} className="border-t border-zinc-800">
                      <td className="py-2 pr-4 text-zinc-300">{name}</td>
                      <td
                        className={`py-2 pr-4 ${step.costs[name] === Infinity ? "text-zinc-600" : "text-amber-400"}`}
                      >
                        {format(step.costs[name])}
                      </td>
                      <td className="py-2 pr-4 text-zinc-400">
                        {step.parents[name] ?? "—"}
                      </td>
                      <td className="py-2 text-xs text-zinc-500">
                        {step.processed.includes(name)
                          ? "processado"
                          : "pendente"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <ol className="flex flex-col gap-1 text-sm">
            {result.steps.map((p, i) => (
              <li key={i}>
                <button
                  onClick={() => setCurrentStep(i)}
                  className={`w-full cursor-pointer rounded-lg px-3 py-1.5 text-left transition-colors hover:bg-zinc-800/60 ${
                    i === currentStep
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-500"
                  }`}
                >
                  <span className="mr-2 font-mono text-xs">{i + 1}.</span>
                  {p.description}
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}

function Stat({
  label,
  value,
  tone,
  small: small,
}: {
  label: string;
  value: string;
  tone: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div
        className={`mt-1 font-semibold ${small ? "text-base leading-8" : "text-2xl"} ${tone}`}
      >
        {value}
      </div>
    </div>
  );
}

function Legend({ color, text }: { color: string; text: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded ${color}`} />
      {text}
    </span>
  );
}
