"use client";

import { topologicalSort } from "@/lib/topological-sort";
import { DependencyGraph } from "@/types/topological";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";
import { StepControls, ScrollableChart, Legend, Stat, primaryButton } from "@/components/ui";

// "a: [b]" significa que a precisa acontecer antes de b
const ROUTINE: DependencyGraph = {
  acordar: ["exercitar", "escovar dentes", "fazer lanche"],
  exercitar: ["tomar banho"],
  "escovar dentes": ["sair"],
  "fazer lanche": ["sair"],
  "tomar banho": ["vestir"],
  vestir: ["sair"],
  sair: [],
};

const POSITIONS: Record<string, { x: number; y: number }> = {
  acordar: { x: 70, y: 150 },
  exercitar: { x: 240, y: 50 },
  "escovar dentes": { x: 240, y: 150 },
  "fazer lanche": { x: 240, y: 250 },
  "tomar banho": { x: 410, y: 50 },
  vestir: { x: 570, y: 50 },
  sair: { x: 570, y: 220 },
};

const HALF_WIDTH = 52;
const HALF_HEIGHT = 17;
const names = Object.keys(ROUTINE);

// ponto onde a reta do centro de a para b cruza a borda do retângulo de a
function onEdge(a: { x: number; y: number }, b: { x: number; y: number }, slack: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.min(
    (HALF_WIDTH + slack) / Math.abs(dx || 1e-9),
    (HALF_HEIGHT + slack) / Math.abs(dy || 1e-9),
  );
  return { x: a.x + dx * t, y: a.y + dy * t };
}

export default function TopologicalSort() {
  const [withCycle, setWithCycle] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // o ciclo faz "vestir" ser pré-requisito de "exercitar", que já leva a "vestir"
  const graph: DependencyGraph = withCycle
    ? { ...ROUTINE, vestir: [...ROUTINE.vestir, "exercitar"] }
    : ROUTINE;

  const result = topologicalSort(graph);
  const step = result.steps[currentStep];
  const final = currentStep === result.steps.length - 1;

  function nodeStyle(name: string) {
    if (!executed) return "fill-zinc-800 stroke-zinc-600";
    if (final && result.stuck.includes(name)) return "fill-red-950 stroke-red-500";
    if (step.current === name) return "fill-amber-500 stroke-amber-300";
    if (step.order.includes(name)) return "fill-sky-900 stroke-sky-500";
    if (step.queue.includes(name)) return "fill-violet-950 stroke-violet-400";
    return "fill-zinc-800 stroke-zinc-600";
  }

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Ordenação topológica</h1>
        <p className="text-zinc-400">
          Quando as tarefas dependem umas das outras, uma ordenação topológica
          é uma ordem em que cada tarefa vem depois de todas as suas
          dependências. O algoritmo repete: faça uma tarefa que não espera por
          mais nada e libere as que dependiam dela. Só existe se o grafo não
          tiver ciclos.
        </p>
        <Explanation
          simple={EXPLANATIONS.topologicalSort.simple}
          technique={EXPLANATIONS.topologicalSort.technique}
          code={CODES.topologicalSort}
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
            Criar dependência circular: &quot;vestir&quot; passa a ser pré-requisito de
            &quot;exercitar&quot;, que já leva a &quot;vestir&quot;.
          </span>
        </label>
        <button
          className={primaryButton}
          onClick={() => {
            setExecuted(true);
            setCurrentStep(0);
          }}
        >
          Ordenar tarefas
        </button>
      </div>

      <section className="fade-up flex flex-col gap-6">
        {executed && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Resultado"
              value={final ? (result.hasCycle ? "Impossível" : "Ordem válida") : "Em andamento"}
              tone={final && result.hasCycle ? "text-red-400" : "text-emerald-400"}
            />
            <Stat
              label="Tarefas na ordem"
              value={`${step.order.length} / ${names.length}`}
              tone="text-amber-400"
            />
            <Stat
              label="Passo"
              value={`${currentStep + 1} / ${result.steps.length}`}
              tone="text-zinc-100"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
          <Legend color="bg-amber-500" text="Tarefa feita agora" />
          <Legend color="bg-sky-900 ring-1 ring-sky-500" text="Já na ordem" />
          <Legend color="bg-violet-950 ring-1 ring-violet-400" text="Livre (na fila)" />
          <Legend color="bg-red-950 ring-1 ring-red-500" text="Presa em ciclo" />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          {executed && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p
                className={`text-sm font-medium ${final && result.hasCycle ? "text-red-400" : "text-amber-400"}`}
              >
                {step.description}
              </p>
              <StepControls currentStep={currentStep} total={result.steps.length} onChange={setCurrentStep} />
            </div>
          )}

          <ScrollableChart minWidthValue={640}>
          <svg viewBox="0 -45 640 335" className="w-full" role="img" aria-label="Grafo de dependências da rotina da manhã">
            <defs>
              <marker id="seta-t" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" className="fill-zinc-500" />
              </marker>
            </defs>
            {names.flatMap((from) =>
              graph[from].map((to) => {
                const a = POSITIONS[from];
                const b = POSITIONS[to];
                // arestas longas na horizontal contornam os nós do meio por cima
                if (a.y === b.y && Math.abs(a.x - b.x) > 200) {
                  const top = a.y - HALF_HEIGHT;
                  return (
                    <path
                      key={`${from}-${to}`}
                      d={`M ${a.x} ${top} Q ${(a.x + b.x) / 2} ${top - 70} ${b.x + (a.x > b.x ? 10 : -10)} ${top - 3}`}
                      fill="none"
                      strokeWidth={1.5}
                      className="stroke-zinc-600"
                      markerEnd="url(#seta-t)"
                    />
                  );
                }
                const start = onEdge(POSITIONS[from], POSITIONS[to], 0);
                const end = onEdge(POSITIONS[to], POSITIONS[from], 3);
                return (
                  <line
                    key={`${from}-${to}`}
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    strokeWidth={1.5}
                    className="stroke-zinc-600"
                    markerEnd="url(#seta-t)"
                  />
                );
              }),
            )}
            {names.map((name) => (
              <g key={name}>
                <rect
                  x={POSITIONS[name].x - HALF_WIDTH}
                  y={POSITIONS[name].y - HALF_HEIGHT}
                  width={HALF_WIDTH * 2}
                  height={HALF_HEIGHT * 2}
                  rx={9}
                  strokeWidth={2}
                  className={`transition-colors ${nodeStyle(name)}`}
                />
                <text
                  x={POSITIONS[name].x}
                  y={POSITIONS[name].y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                  className={step.current === name && executed ? "fill-amber-950" : "fill-zinc-100"}
                >
                  {name}
                </text>
                {executed && (
                  <g>
                    <circle
                      cx={POSITIONS[name].x + HALF_WIDTH - 2}
                      cy={POSITIONS[name].y - HALF_HEIGHT}
                      r={8}
                      className="fill-zinc-950 stroke-zinc-600"
                    />
                    <text
                      x={POSITIONS[name].x + HALF_WIDTH - 2}
                      y={POSITIONS[name].y - HALF_HEIGHT}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={10}
                      className="fill-zinc-300 font-mono"
                    >
                      {step.inDegrees[name]}
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>
          </ScrollableChart>
          {executed && (
            <p className="text-xs text-zinc-500">
              O número no canto de cada tarefa é quantas dependências ainda
              faltam. Quando chega a 0, a tarefa fica livre.
            </p>
          )}

          {executed && (
            <div className="flex flex-col gap-2">
              <div className="text-xs uppercase tracking-wider text-zinc-500">
                Ordem até agora
              </div>
              <div className="flex min-h-9 flex-wrap items-center gap-1.5">
                {step.order.length === 0 ? (
                  <span className="text-xs text-zinc-600">vazia</span>
                ) : (
                  step.order.map((n, i) => (
                    <span key={n} className="flex items-center gap-1.5">
                      {i > 0 && <span className="text-zinc-600">→</span>}
                      <span className="rounded-lg bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-200">
                        {n}
                      </span>
                    </span>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
