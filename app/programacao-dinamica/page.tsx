"use client";

import { StepControls } from "@/components/ui";
import { knapsack, greedyKnapsack } from "@/lib/knapsack";
import { KnapsackItem } from "@/types/knapsack";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";

type Example = {
  title: string;
  description: string;
  capacity: number;
  items: KnapsackItem[];
};

const EXAMPLES: Example[] = [
  {
    title: "Mochila do livro",
    description: "Capacidade de 4 kg. Qual combinação vale mais?",
    capacity: 4,
    items: [
      { name: "Violão", weight: 1, value: 1500 },
      { name: "Som", weight: 4, value: 3000 },
      { name: "Notebook", weight: 3, value: 2000 },
    ],
  },
  {
    title: "Guloso erra aqui",
    description:
      "Capacidade de 6 kg. O item mais valioso ocupa quase tudo e impede combinações melhores.",
    capacity: 6,
    items: [
      { name: "Monitor", weight: 5, value: 1000 },
      { name: "Tablet", weight: 3, value: 700 },
      { name: "Câmera", weight: 3, value: 700 },
    ],
  },
];

const money = (n: number) => `R$ ${n.toLocaleString("pt-BR")}`;

export default function DynamicProgramming() {
  const [index, setIndex] = useState(0);
  const [executed, setExecuted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const example = EXAMPLES[index];
  const dp = knapsack(example.items, example.capacity);
  const greedyResult = greedyKnapsack(example.items, example.capacity);

  const total = dp.steps.length;
  const step = dp.steps[currentStep];
  const final = currentStep === total - 1;

  const columns = Array.from({ length: example.capacity }, (_, i) => i + 1);

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Programação dinâmica
        </h1>
        <p className="text-zinc-400">
          Resolve um problema grande combinando respostas de subproblemas
          menores, guardadas em uma tabela. Exemplo: o problema da mochila —
          qual conjunto de itens cabe e vale mais?
        </p>
        <Explanation
          simple={EXPLANATIONS.dynamicProgramming.simple}
          technique={EXPLANATIONS.dynamicProgramming.technique}
          code={CODES.knapsack}
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
        <ul className="grid gap-2 sm:grid-cols-3">
          {example.items.map((item) => (
            <li
              key={item.name}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm"
            >
              <div className="font-medium text-zinc-200">{item.name}</div>
              <div className="font-mono text-xs text-zinc-500">
                {item.weight} kg · {money(item.value)}
              </div>
            </li>
          ))}
        </ul>
        <button
          className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:bg-emerald-600"
          onClick={() => {
            setExecuted(true);
            setCurrentStep(0);
          }}
        >
          Preencher a tabela
        </button>
      </div>

      {executed && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Melhor valor (dinâmica)"
              value={money(dp.totalValue)}
              tone="text-emerald-400"
            />
            <Stat
              label="Guloso (maior valor)"
              value={money(greedyResult.totalValue)}
              tone="text-amber-400"
            />
            <Stat
              label="Célula"
              value={`${currentStep + 1} / ${total}`}
              tone="text-zinc-100"
            />
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p
                className={`text-sm font-medium ${step.usedItem ? "text-amber-400" : "text-zinc-300"}`}
              >
                {step.description}
              </p>
              <StepControls currentStep={currentStep} total={total} onChange={setCurrentStep} />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-1 text-center text-sm">
                <thead>
                  <tr className="text-xs text-zinc-500">
                    <th />
                    {columns.map((c) => (
                      <th key={c} className="px-2 py-1 font-medium">
                        {c} kg
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {example.items.map((item, i) => (
                    <tr key={item.name}>
                      <th className="whitespace-nowrap pr-3 text-right text-xs font-medium text-zinc-400">
                        {item.name}
                      </th>
                      {columns.map((c, j) => {
                        const order = i * example.capacity + j;
                        const filled = order <= currentStep;
                        const current = order === currentStep;
                        const chosen =
                          final &&
                          dp.chosenCells.some(
                            ([li, co]) => li === i && co === j,
                          );
                        return (
                          <td
                            key={c}
                            className={`rounded-lg px-2 py-2.5 font-mono text-xs tabular-nums transition-colors ${
                              chosen
                                ? "bg-emerald-500 font-semibold text-emerald-950"
                                : current
                                  ? "bg-amber-500 font-semibold text-amber-950"
                                  : filled
                                    ? "bg-zinc-800 text-zinc-200"
                                    : "bg-zinc-900 text-zinc-700"
                            }`}
                          >
                            {filled ? dp.table[i][j].toLocaleString("pt-BR") : "·"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-zinc-500">
              Cada célula = melhor valor usando os itens até aquela linha em uma
              mochila daquele tamanho. Em verde: células em que o item entrou
              na solução final.
            </p>
          </div>

          {final && (
            <div
              className={`flex flex-col gap-2 rounded-2xl border p-4 text-sm ${
                dp.totalValue > greedyResult.totalValue
                  ? "border-amber-500/40 bg-amber-500/10 text-zinc-200"
                  : "border-emerald-500/30 bg-emerald-500/5 text-zinc-300"
              }`}
            >
              <div className="font-medium">
                {dp.totalValue > greedyResult.totalValue
                  ? "A programação dinâmica achou uma solução melhor que o guloso."
                  : "Aqui o guloso chegou ao mesmo valor."}
              </div>
              <div className="text-zinc-400">
                Dinâmica: {dp.chosenSet.join(" + ")} ({money(dp.totalValue)}
                ). Guloso: {greedyResult.chosenSet.join(" + ")} (
                {money(greedyResult.totalValue)}).
              </div>
            </div>
          )}
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
