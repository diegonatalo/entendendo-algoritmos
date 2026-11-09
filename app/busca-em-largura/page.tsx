"use client";

import { breadthFirstSearch } from "@/lib/breadth-first-search";
import { Graph } from "@/types/graph";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";
import { StepControls, ScrollableChart } from "@/components/ui";

// rede de amigos do exemplo do livro (arestas dirigidas)
const GRAPH: Graph = {
  voce: ["alice", "bob", "claire"],
  alice: ["peggy"],
  bob: ["anuj", "peggy"],
  claire: ["thom", "jonny"],
  anuj: [],
  peggy: [],
  thom: [],
  jonny: [],
};

const POSITIONS: Record<string, { x: number; y: number }> = {
  voce: { x: 70, y: 170 },
  alice: { x: 230, y: 50 },
  bob: { x: 230, y: 170 },
  claire: { x: 230, y: 290 },
  peggy: { x: 400, y: 50 },
  anuj: { x: 400, y: 150 },
  thom: { x: 400, y: 250 },
  jonny: { x: 400, y: 340 },
};

const RADIUS = 26;
const names = Object.keys(GRAPH);

const selectClass =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-100 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30";

const colorOfType = {
  start: "text-zinc-300",
  visit: "text-amber-400",
  ignores: "text-zinc-500",
  didFind: "text-emerald-400",
  end: "text-red-400",
};

export default function BreadthFirstSearch() {
  const [start, setStart] = useState("voce");
  const [target, setTarget] = useState("thom");
  const [result, setResult] = useState<ReturnType<
    typeof breadthFirstSearch
  > | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const step = result?.steps[currentStep];
  const onPath = (name: string) =>
    step?.type === "didFind" && result?.path?.includes(name);
  const edgeOnPath = (from: string, to: string) => {
    if (step?.type !== "didFind" || !result?.path) return false;
    const i = result.path.indexOf(from);
    return i !== -1 && result.path[i + 1] === to;
  };

  function nodeStyle(name: string) {
    if (onPath(name)) return "fill-emerald-500 stroke-emerald-300";
    if (step && step.current === name) return "fill-amber-500 stroke-amber-300";
    if (step?.visitedSet.includes(name)) return "fill-sky-900 stroke-sky-500";
    if (step?.queue.includes(name))
      return "fill-violet-950 stroke-violet-400";
    return "fill-zinc-800 stroke-zinc-600";
  }

  function nodeText(name: string) {
    if (onPath(name)) return "fill-emerald-950";
    if (step && step.current === name) return "fill-amber-950";
    return "fill-zinc-100";
  }

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Busca em largura</h1>
        <p className="text-zinc-400">
          Em um grafo, a busca em largura usa uma fila para verificar primeiro
          os vizinhos diretos, depois os vizinhos dos vizinhos, e assim por
          diante. Assim encontra o caminho com menos arestas. Custo: O(V + E).
        </p>
        <Explanation
          simple={EXPLANATIONS.breadthFirstSearch.simple}
          technique={EXPLANATIONS.breadthFirstSearch.technique}
          code={CODES.breadthFirstSearch}
        />
      </header>

      <form
        className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          setResult(breadthFirstSearch(GRAPH, start, target));
          setCurrentStep(0);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Começar em
            <select
              className={selectClass}
              value={start}
              onChange={(e) => setStart(e.target.value)}
            >
              {names.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Procurar por
            <select
              className={selectClass}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            >
              {names.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>
        <button
          className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:bg-emerald-600"
          type="submit"
        >
          Buscar
        </button>
      </form>

      {result && step && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Caminho"
              value={
                result.path
                  ? result.path.join(" → ")
                  : "Não existe"
              }
              tone={result.path ? "text-emerald-400" : "text-red-400"}
              small
            />
            <Stat
              label="Arestas no caminho"
              value={result.path ? String(result.path.length - 1) : "—"}
              tone="text-amber-400"
            />
            <Stat
              label="Passo"
              value={`${currentStep + 1} / ${result.steps.length}`}
              tone="text-zinc-100"
            />
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
            <Legend color="bg-amber-500" text="Sendo verificado" />
            <Legend color="bg-sky-900 ring-1 ring-sky-500" text="Já verificado" />
            <Legend color="bg-violet-950 ring-1 ring-violet-400" text="Na fila" />
            <Legend color="bg-emerald-500" text="Caminho" />
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={`text-sm font-medium ${colorOfType[step.type]}`}>
                {step.description}
              </p>
              <StepControls currentStep={currentStep} total={result.steps.length} onChange={setCurrentStep} goToEnd={false} />
            </div>

            <ScrollableChart minWidthValue={470}>
            <svg
              viewBox="0 0 470 390"
              className="mx-auto w-full max-w-xl"
              role="img"
              aria-label="Grafo da rede de amigos"
            >
              <defs>
                <marker
                  id="seta"
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
                  id="seta-ok"
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
                GRAPH[from].map((to) => {
                  const a = POSITIONS[from];
                  const b = POSITIONS[to];
                  const dx = b.x - a.x;
                  const dy = b.y - a.y;
                  const d = Math.hypot(dx, dy);
                  const ok = edgeOnPath(from, to);
                  return (
                    <line
                      key={`${from}-${to}`}
                      x1={a.x + (dx / d) * RADIUS}
                      y1={a.y + (dy / d) * RADIUS}
                      x2={b.x - (dx / d) * (RADIUS + 2)}
                      y2={b.y - (dy / d) * (RADIUS + 2)}
                      strokeWidth={ok ? 3 : 1.5}
                      className={ok ? "stroke-emerald-400" : "stroke-zinc-600"}
                      markerEnd={`url(#${ok ? "seta-ok" : "seta"})`}
                    />
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
                    fontSize={11}
                    className={`font-mono ${nodeText(name)}`}
                  >
                    {name}
                  </text>
                </g>
              ))}
            </svg>
            </ScrollableChart>

            <div className="grid gap-3 sm:grid-cols-2">
              <List title="Fila (próximo à esquerda)" items={step.queue} />
              <List title="Já verificados" items={step.visitedSet} />
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

const List = ({ title, items }: { title: string; items: string[] }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs uppercase tracking-wider text-zinc-500">
        {title}
      </div>
      <div className="flex min-h-9 flex-wrap gap-1.5">
        {items.length === 0 ? (
          <span className="text-xs text-zinc-600">vazia</span>
        ) : (
          items.map((n, i) => (
            <span
              key={i}
              className="rounded-lg bg-zinc-800 px-2.5 py-1.5 font-mono text-xs text-zinc-300"
            >
              {n}
            </span>
          ))
        )}
      </div>
    </div>
  );
};

const Stat = ({
  label,
  value,
  tone,
  small: small,
}: {
  label: string;
  value: string;
  tone: string;
  small?: boolean;
}) => {
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
};

const Legend = ({ color, text }: { color: string; text: string }) => {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded ${color}`} />
      {text}
    </span>
  );
};
