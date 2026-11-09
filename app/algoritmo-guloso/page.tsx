"use client";

import { StepControls } from "@/components/ui";
import {
  greedyCoverage,
  optimalCoverage,
} from "@/lib/set-coverage";
import { Sets } from "@/types/greedy";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";

type Example = {
  title: string;
  description: string;
  universe: string[];
  sets: Sets;
};

const EXAMPLES: Example[] = [
  {
    title: "Estações de rádio (livro)",
    description:
      "Cada estação cobre alguns estados. Meta: cobrir todos os estados com o menor número de estações.",
    universe: ["mt", "wa", "or", "id", "nv", "ut", "ca", "az"],
    sets: {
      kone: ["id", "nv", "ut"],
      ktwo: ["wa", "id", "mt"],
      kthree: ["or", "nv", "ca"],
      kfour: ["nv", "ut"],
      kfive: ["ca", "az"],
    },
  },
  {
    title: "Quando o guloso erra",
    description:
      "O conjunto 'grande' parece a melhor escolha, mas 'esq' e 'dir' sozinhos já cobrem tudo.",
    universe: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    sets: {
      grande: ["1", "2", "3", "4", "7", "8", "9"],
      esq: ["1", "2", "3", "4", "5", "6"],
      dir: ["7", "8", "9", "10", "11", "12"],
    },
  },
];

const colorOfType = {
  start: "text-zinc-300",
  choose: "text-amber-400",
  end: "text-emerald-400",
};

const chip = "rounded-md px-2 py-1 font-mono text-xs";

export default function GreedyAlgorithm() {
  const [index, setIndex] = useState(0);
  const [executed, setExecuted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const example = EXAMPLES[index];
  const greedyResult = greedyCoverage(example.universe, example.sets);
  const optimal = optimalCoverage(example.universe, example.sets);
  const step = greedyResult.steps[currentStep];

  const greedy = greedyResult.solution.length;
  const minimum = optimal.solution?.length ?? 0;

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Algoritmo guloso
        </h1>
        <p className="text-zinc-400">
          A cada passo, escolhe a melhor opção do momento, sem olhar o quadro
          todo. Aqui: cobertura de conjuntos. Achar a solução exata exige
          testar todas as combinações (O(2ⁿ)); o guloso é uma aproximação
          rápida (O(n²)).
        </p>
        <Explanation
          simple={EXPLANATIONS.greedyAlgorithm.simple}
          technique={EXPLANATIONS.greedyAlgorithm.technique}
          code={CODES.greedyCoverage}
        />
      </header>

      <div className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((e, i) => (
            <button
              key={e.title}
              onClick={() => {
                setIndex(i);
                setExecuted(false);
                setCurrentStep(0);
              }}
              className={`cursor-pointer rounded-xl border px-4 py-2 text-sm transition-colors ${
                i === index
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                  : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              {e.title}
            </button>
          ))}
        </div>
        <p className="text-sm text-zinc-400">{example.description}</p>
        <div className="flex flex-col gap-2">
          <div className="text-xs uppercase tracking-wider text-zinc-500">
            Itens a cobrir
          </div>
          <div className="flex flex-wrap gap-1.5">
            {example.universe.map((item) => (
              <span key={item} className={`${chip} bg-zinc-800 text-zinc-300`}>
                {item}
              </span>
            ))}
          </div>
        </div>
        <button
          className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:bg-emerald-600"
          onClick={() => {
            setExecuted(true);
            setCurrentStep(0);
          }}
        >
          Executar algoritmo guloso
        </button>
      </div>

      {executed && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Conjuntos usados (guloso)"
              value={String(greedy)}
              tone="text-amber-400"
            />
            <Stat
              label="Mínimo possível"
              value={String(minimum)}
              tone="text-emerald-400"
            />
            <Stat
              label="Passo"
              value={`${currentStep + 1} / ${greedyResult.steps.length}`}
              tone="text-zinc-100"
            />
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
            <Legend color="bg-amber-500" text="Conjunto escolhido agora" />
            <Legend color="bg-emerald-500/30" text="Já coberto" />
            <Legend color="bg-red-500/20" text="Ainda falta cobrir" />
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={`text-sm font-medium ${colorOfType[step.type]}`}>
                {step.description}
              </p>
              <StepControls currentStep={currentStep} total={greedyResult.steps.length} onChange={setCurrentStep} goToEnd={false} />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-xs uppercase tracking-wider text-zinc-500">
                Itens
              </div>
              <div className="flex flex-wrap gap-1.5">
                {example.universe.map((item) => {
                  const covered = step.coveredItems.includes(item);
                  return (
                    <span
                      key={item}
                      className={`${chip} ${
                        covered
                          ? "bg-emerald-500/30 text-emerald-200"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
            </div>

            <ul className="flex flex-col gap-2">
              {Object.entries(example.sets).map(([name, items]) => {
                const chosen = step.chosen === name;
                const used = step.solution.includes(name);
                return (
                  <li
                    key={name}
                    className={`flex flex-wrap items-center gap-3 rounded-xl border p-2.5 transition-colors ${
                      chosen
                        ? "border-amber-500/60 bg-amber-500/10"
                        : used
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : "border-zinc-800 bg-zinc-900/40"
                    }`}
                  >
                    <span
                      className={`w-16 shrink-0 font-mono text-sm ${chosen ? "font-semibold text-amber-300" : "text-zinc-300"}`}
                    >
                      {name}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((item) => (
                        <span
                          key={item}
                          className={`${chip} ${
                            chosen && !step.coveredItems.includes(item)
                              ? "bg-zinc-800 text-zinc-300"
                              : chosen
                                ? "bg-amber-500 font-semibold text-amber-950"
                                : step.coveredItems.includes(item)
                                  ? "bg-zinc-800 text-zinc-500"
                                  : "bg-zinc-800 text-zinc-300"
                          }`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    {step.type !== "end" && (
                      <span className="ml-auto text-xs text-zinc-500">
                        cobriria {step.candidates[name] ?? 0} novos
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div
            className={`flex flex-col gap-2 rounded-2xl border p-4 text-sm ${
              greedy === minimum
                ? "border-emerald-500/30 bg-emerald-500/5 text-zinc-300"
                : "border-amber-500/40 bg-amber-500/10 text-zinc-200"
            }`}
          >
            <div className="font-medium">
              {greedy === minimum
                ? "O guloso acertou: usou o mínimo possível."
                : "O guloso não achou a solução mínima."}
            </div>
            <div className="text-zinc-400">
              Guloso: {greedyResult.solution.join(", ")} ({greedy}). Força bruta:{" "}
              {optimal.solution?.join(", ") ?? "sem solução"} ({minimum}), após
              testar {optimal.testedCombinations} combinações.
            </div>
          </div>

          <ol className="flex flex-col gap-1 text-sm">
            {greedyResult.steps.map((p, i) => (
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

const Stat = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) => {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className={`mt-1 text-2xl font-semibold ${tone}`}>{value}</div>
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
