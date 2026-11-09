"use client";

import { StepControls, inputClass } from "@/components/ui";
import { factorial } from "@/lib/factorial";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";

const colorOfType = {
  push: "text-amber-400",
  base: "text-sky-400",
  returns: "text-emerald-400",
};

export default function Recursion() {
  const [result, setResult] = useState<ReturnType<
    typeof factorial
  > | null>(null);
  const [n, setN] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const step = result?.steps[currentStep];

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Recursão</h1>
        <p className="text-zinc-400">
          Uma função que chama a si mesma. Cada chamada vai para a pilha até
          chegar ao caso base; depois as chamadas retornam, da última para a
          primeira. Exemplo: o fatorial.
        </p>
        <Explanation
          simple={EXPLANATIONS.recursion.simple}
          technique={EXPLANATIONS.recursion.technique}
          code={CODES.factorial}
        />
      </header>

      <form
        className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const value = Number(e.currentTarget.n.value);
          setN(value);
          setResult(factorial(value));
          setCurrentStep(0);
        }}
      >
        <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
          Calcular o fatorial de
          <input
            className={inputClass}
            name="n"
            type="number"
            min="1"
            max="15"
            placeholder="Ex.: 5"
            required
          />
        </label>
        <button
          className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:bg-emerald-600"
          type="submit"
        >
          Calcular
        </button>
      </form>

      {result && step && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Resultado"
              value={result.result.toLocaleString("pt-BR")}
              tone="text-emerald-400"
            />
            <Stat
              label="Chamadas"
              value={String(n)}
              tone="text-amber-400"
            />
            <Stat
              label="Passo"
              value={`${currentStep + 1} / ${result.steps.length}`}
              tone="text-zinc-100"
            />
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={`text-sm font-medium ${colorOfType[step.type]}`}>
                {step.description}
              </p>
              <StepControls currentStep={currentStep} total={result.steps.length} onChange={setCurrentStep} goToEnd={false} />
            </div>

            <div className="flex min-h-24 flex-col-reverse gap-1.5">
              {step.stack.map((frame, i) => {
                const top = i === step.stack.length - 1;
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between rounded-lg px-4 py-2 font-mono text-sm ${
                      top
                        ? "bg-amber-500 font-semibold text-amber-950 ring-2 ring-amber-300"
                        : "bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    <span>fatorial({frame.n})</span>
                    <span>
                      {frame.returnValue !== undefined
                        ? `→ ${frame.returnValue.toLocaleString("pt-BR")}`
                        : "aguardando…"}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-zinc-500">
              O topo da pilha (em âmbar) é a chamada em execução.
            </p>
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
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className={`mt-1 text-2xl font-semibold ${tone}`}>{value}</div>
    </div>
  );
}
