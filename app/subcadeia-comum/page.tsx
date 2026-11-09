"use client";

import { StepControls, inputMono } from "@/components/ui";
import { commonSubstring } from "@/lib/common-substring";
import { SubstringMode } from "@/types/substring";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";

const MAX_LETTERS = 10;

const MODES: Record<SubstringMode, { title: string; explanation: string }> = {
  substring: {
    title: "Subcadeia (consecutiva)",
    explanation:
      "Letras em comum lado a lado, sem buracos. Letras diferentes zeram a célula. É o exemplo do livro.",
  },
  subsequence: {
    title: "Subsequência (com buracos)",
    explanation:
      "Letras em comum na mesma ordem, mas podem estar separadas. Letras diferentes herdam o maior valor entre cima e esquerda.",
  },
};

type Execution = {
  a: string;
  b: string;
  mode: SubstringMode;
  data: ReturnType<typeof commonSubstring>;
};

export default function CommonSubstring() {
  const [mode, setMode] = useState<SubstringMode>("substring");
  const [execution, setExecution] = useState<Execution | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const a = e.currentTarget.palavraA.value.trim().toLowerCase();
    const b = e.currentTarget.palavraB.value.trim().toLowerCase();

    if (!a || !b || a.length > MAX_LETTERS || b.length > MAX_LETTERS) {
      setError(`Digite duas palavras de 1 a ${MAX_LETTERS} letras.`);
      return;
    }
    setError("");
    setExecution({ a, b, mode, data: commonSubstring(a, b, mode) });
    setCurrentStep(0);
  }

  const data = execution?.data;
  const total = data?.steps.length ?? 0;
  const step = data?.steps[currentStep];
  const final = currentStep === total - 1;

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Subcadeia comum</h1>
        <p className="text-zinc-400">
          Outra aplicação da programação dinâmica: comparar duas palavras. Cada
          célula da tabela compara uma letra de cada palavra e reaproveita
          respostas anteriores. É a ideia por trás de corretores ortográficos e
          da comparação de DNA.
        </p>
        <Explanation
          simple={EXPLANATIONS.commonSubstring.simple}
          technique={EXPLANATIONS.commonSubstring.technique}
          code={CODES.substring}
        />
      </header>

      <form
        className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-wrap gap-2">
          {(Object.keys(MODES) as SubstringMode[]).map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setMode(m)}
              className={`cursor-pointer rounded-xl border px-4 py-2 text-sm transition-colors ${
                m === mode
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                  : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              {MODES[m].title}
            </button>
          ))}
        </div>
        <p className="text-sm text-zinc-400">{MODES[mode].explanation}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Primeira palavra (linhas)
            <input
              className={inputMono}
              name="palavraA"
              defaultValue="hish"
              maxLength={MAX_LETTERS}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Segunda palavra (colunas)
            <input
              className={inputMono}
              name="palavraB"
              defaultValue="fish"
              maxLength={MAX_LETTERS}
            />
          </label>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:bg-emerald-600"
          type="submit"
        >
          Preencher a tabela
        </button>
      </form>

      {execution && data && step && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label={
                execution.mode === "substring"
                  ? "Maior subcadeia"
                  : "Maior subsequência"
              }
              value={data.result ? `"${data.result}"` : "nenhuma"}
              tone="text-emerald-400"
            />
            <Stat
              label="Tamanho"
              value={String(data.result.length)}
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
                className={`font-mono text-sm ${step.equal ? "text-amber-400" : "text-zinc-300"}`}
              >
                {step.description}
              </p>
              <StepControls currentStep={currentStep} total={total} onChange={setCurrentStep} />
            </div>

            <div className="overflow-x-auto">
              <table className="mx-auto border-separate border-spacing-1 text-center">
                <thead>
                  <tr>
                    <th />
                    {execution.b.split("").map((letter, j) => (
                      <th
                        key={j}
                        className="h-8 w-10 font-mono text-sm font-medium text-zinc-400"
                      >
                        {letter}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {execution.a.split("").map((letter, i) => (
                    <tr key={i}>
                      <th className="pr-2 font-mono text-sm font-medium text-zinc-400">
                        {letter}
                      </th>
                      {execution.b.split("").map((_, j) => {
                        const order = i * execution.b.length + j;
                        const filled = order <= currentStep;
                        const current = order === currentStep;
                        const ofResult =
                          final &&
                          data.resultCells.some(
                            ([li, co]) => li === i && co === j,
                          );
                        return (
                          <td
                            key={j}
                            className={`h-10 w-10 rounded-lg font-mono text-sm tabular-nums transition-colors ${
                              ofResult
                                ? "bg-emerald-500 font-semibold text-emerald-950"
                                : current
                                  ? "bg-amber-500 font-semibold text-amber-950"
                                  : filled
                                    ? "bg-zinc-800 text-zinc-200"
                                    : "bg-zinc-900 text-zinc-700"
                            }`}
                          >
                            {filled ? data.table[i][j] : "·"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-zinc-500">
              Em verde, no final: as células que formam a resposta.
            </p>
          </div>
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
