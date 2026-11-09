"use client";

import { knapsack } from "@/lib/knapsack";
import { KnapsackItem } from "@/types/knapsack";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";
import { StepControls, Stat, primaryButton } from "@/components/ui";

// a tabela trabalha em meios dias, para que todos os tempos sejam números inteiros
const ATTRACTIONS: KnapsackItem[] = [
  { name: "Abadia de Westminster", weight: 1, value: 7 },
  { name: "Globe Theater", weight: 1, value: 6 },
  { name: "Galeria Nacional", weight: 2, value: 9 },
  { name: "Museu Britânico", weight: 4, value: 9 },
  { name: "Catedral de St. Paul", weight: 1, value: 8 },
];

const EXTRA: KnapsackItem = { name: "Torre de Londres", weight: 2, value: 10 };

const DAY_OPTIONS = [1, 1.5, 2, 2.5, 3];

const selectClass =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-100 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30";

const days = (halfDays: number) => {
  const d = halfDays / 2;
  const text = String(d).replace(".", ",");
  return d === 1 ? "1 dia" : `${text} dias`;
};

export default function LondonItinerary() {
  const [totalDays, setTotalDays] = useState(2);
  const [withExtra, setWithExtra] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const items = withExtra ? [...ATTRACTIONS, EXTRA] : ATTRACTIONS;
  const capacity = totalDays * 2;
  const dp = knapsack(items, capacity, "meios-dias");

  const total = dp.steps.length;
  const step = dp.steps[currentStep];
  const final = currentStep === total - 1;
  const columns = Array.from({ length: capacity }, (_, i) => i + 1);

  const chosenNames = dp.chosenSet;
  const timeUsed = items
    .filter((i) => chosenNames.includes(i.name))
    .reduce((s, i) => s + i.weight, 0);

  function reset() {
    setExecuted(false);
    setCurrentStep(0);
  }

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Programação dinâmica: roteiro em Londres</h1>
        <p className="text-zinc-400">
          O outro exemplo de programação dinâmica do capítulo 9: você tem poucos
          dias em Londres e muitas atrações. Cada uma leva um tempo e tem uma
          nota. Quais visitar para somar a maior nota? É a mesma mochila de
          antes, com tempo no lugar de peso e nota no lugar de valor. Você não
          pode visitar metade de uma atração, e é por isso que a tabela só usa
          números inteiros de meios dias.
        </p>
        <Explanation
          simple={EXPLANATIONS.londonItinerary.simple}
          technique={EXPLANATIONS.londonItinerary.technique}
          code={CODES.knapsack}
        />
      </header>

      <div className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <ul className="grid gap-2 sm:grid-cols-3">
          {items.map((item) => (
            <li key={item.name} className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm">
              <div className="font-medium text-zinc-200">{item.name}</div>
              <div className="font-mono text-xs text-zinc-400">
                {days(item.weight)} · nota {item.value}
              </div>
            </li>
          ))}
        </ul>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Tempo disponível
            <select
              className={selectClass}
              value={totalDays}
              onChange={(e) => {
                setTotalDays(Number(e.target.value));
                reset();
              }}
            >
              {DAY_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {String(d).replace(".", ",")} {d === 1 ? "dia" : "dias"}
                </option>
              ))}
            </select>
          </label>
          <label className="flex cursor-pointer items-start gap-3 self-end pb-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={withExtra}
              onChange={(e) => {
                setWithExtra(e.target.checked);
                reset();
              }}
              className="mt-0.5 h-5 w-5 shrink-0 accent-emerald-500"
            />
            <span>
              Adicionar a Torre de Londres (1 dia, nota 10). Atração e nota
              inventadas por mim, não fazem parte do exemplo do livro.
            </span>
          </label>
        </div>

        <button
          className={primaryButton}
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
            <Stat label="Maior nota total" value={String(dp.totalValue)} tone="text-emerald-400" />
            <Stat
              label="Tempo usado"
              value={`${days(timeUsed)} de ${days(capacity)}`}
              tone="text-amber-400"
              small
            />
            <Stat label="Célula" value={`${currentStep + 1} / ${total}`} tone="text-zinc-100" />
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={`text-sm font-medium ${step.usedItem ? "text-amber-400" : "text-zinc-300"}`}>
                {step.description}
              </p>
              <StepControls currentStep={currentStep} total={total} onChange={setCurrentStep} />
            </div>
            <p className="text-xs text-zinc-500">
              Na descrição acima, o tempo aparece em meios-dias (1 = meio dia) e
              os valores são as notas.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-1 text-center text-sm">
                <thead>
                  <tr className="text-xs text-zinc-400">
                    <th />
                    {columns.map((c) => (
                      <th key={c} className="whitespace-nowrap px-2 py-1 font-medium">
                        {days(c)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={item.name}>
                      <th className="whitespace-nowrap pr-3 text-right text-xs font-medium text-zinc-400">
                        {item.name}
                      </th>
                      {columns.map((c, j) => {
                        const order = i * capacity + j;
                        const filled = order <= currentStep;
                        const current = order === currentStep;
                        const chosen =
                          final && dp.chosenCells.some(([li, co]) => li === i && co === j);
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
                                    : "bg-zinc-900 text-zinc-600"
                            }`}
                          >
                            {filled ? dp.table[i][j] : "·"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {final && (
            <div className="flex flex-col gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">
              <div className="font-medium text-zinc-200">Roteiro: {chosenNames.join(" + ")}</div>
              <div className="text-zinc-400">
                Nota total {dp.totalValue} em {days(timeUsed)}.
                {withExtra &&
                  " Repare que adicionar uma atração não obriga a recomeçar do zero: só acrescenta uma linha à tabela, que usa as respostas das linhas de cima."}
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
