"use client";

import { readNumbers } from "@/lib/input";
import { euclid, recursiveSum } from "@/lib/euclid";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";
import { StepControls, Stat, primaryButton, inputClass } from "@/components/ui";

const MAX_MEASURE = 2000;

const PALETTE = ["#34d399", "#38bdf8", "#a78bfa", "#fbbf24", "#fb7185", "#2dd4bf"];

export default function DivideAndConquer() {
  const [measures, setMeasures] = useState<{ width: number; height: number } | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");

  const [listText, setListText] = useState("2, 4, 6");
  const [list, setList] = useState([2, 4, 6]);
  const [listError, setListError] = useState("");

  const result = measures ? euclid(measures.width, measures.height) : null;
  const step = result?.steps[currentStep];
  const calls = recursiveSum(list);

  function handleTerrain(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const width = Number(e.currentTarget.width.value);
    const height = Number(e.currentTarget.height.value);
    if (
      !Number.isInteger(width) || !Number.isInteger(height) ||
      width < 1 || height < 1 || width > MAX_MEASURE || height > MAX_MEASURE
    ) {
      setError(`Use números inteiros de 1 a ${MAX_MEASURE}.`);
      return;
    }
    setError("");
    setMeasures({ width, height });
    setCurrentStep(0);
  }

  function handleList(e: React.FormEvent) {
    e.preventDefault();
    const numbers = readNumbers(listText);
    if (numbers.length > 8 || numbers.some((n) => !Number.isFinite(n))) {
      setListError("Digite até 8 números, separados por vírgula.");
      return;
    }
    setListError("");
    setList(numbers);
  }

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dividir para conquistar</h1>
        <p className="text-zinc-400">
          Uma técnica recursiva para resolver problemas: (1) descubra o caso
          base mais simples; (2) reduza o problema até ele virar o caso base.
          O quicksort usa essa técnica. Aqui estão os dois exemplos que o livro
          usa para introduzi-la.
        </p>
        <Explanation
          simple={EXPLANATIONS.divideAndConquer.simple}
          technique={EXPLANATIONS.divideAndConquer.technique}
          code={CODES.divideAndConquer}
        />
      </header>

      <section className="fade-up flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">1. O terreno e o algoritmo de Euclides</h2>
          <p className="text-sm text-zinc-400">
            Divida um terreno retangular em quadrados iguais, os maiores
            possíveis. Caso base: quando um lado divide o outro, o terreno já é
            feito de quadrados iguais. Senão, corte o maior quadrado que cabe e
            repita com a sobra. O lado final é o maior divisor comum (MDC) das
            duas medidas.
          </p>
        </div>

        <form
          className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
          onSubmit={handleTerrain}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
              Largura
              <input
                className={inputClass}
                name="width"
                type="number"
                min={1}
                max={MAX_MEASURE}
                defaultValue={1680}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
              Altura
              <input
                className={inputClass}
                name="height"
                type="number"
                min={1}
                max={MAX_MEASURE}
                defaultValue={640}
              />
            </label>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button className={primaryButton} type="submit">
            Dividir o terreno
          </button>
        </form>

        {result && measures && step && (
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat
                label="MDC"
                value={String(result.gcd)}
                tone="text-emerald-400"
              />
              <Stat
                label="Quadrados no fim"
                value={String(result.squares.length)}
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
                <p className="text-sm font-medium text-amber-400">{step.description}</p>
                <StepControls currentStep={currentStep} total={result.steps.length} onChange={setCurrentStep} />
              </div>

              <svg
                viewBox={`0 0 ${measures.width} ${measures.height}`}
                className="mx-auto max-h-96 w-full max-w-xl rounded-lg bg-zinc-950"
                role="img"
                aria-label="Terreno dividido em quadrados"
              >
                {result.squares
                  .filter((q) => q.step <= currentStep)
                  .map((q, i) => (
                    <rect
                      key={i}
                      x={q.x}
                      y={q.y}
                      width={q.side}
                      height={q.side}
                      fill={PALETTE[q.step % PALETTE.length]}
                      fillOpacity={q.step === currentStep ? 0.95 : 0.45}
                      className="stroke-zinc-950"
                      strokeWidth={Math.max(measures.width, measures.height) / 300}
                    />
                  ))}
              </svg>
              <p className="text-xs text-zinc-500">
                O quadrado novo de cada passo aparece mais forte; os anteriores
                ficam mais claros.
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="fade-up flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">2. Soma recursiva de uma lista</h2>
          <p className="text-sm text-zinc-400">
            Caso base: a lista vazia soma 0. Caso recursivo: o primeiro item
            mais a soma do resto. A recursão desce até a lista vazia e depois os
            resultados voltam somando.
          </p>
        </div>

        <form
          className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
          onSubmit={handleList}
        >
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Números a somar
            <input
              className={inputClass}
              value={listText}
              onChange={(e) => setListText(e.target.value)}
              placeholder="Ex.: 2, 4, 6"
            />
          </label>
          {listError && <p className="text-sm text-red-400">{listError}</p>}
          <button className={primaryButton} type="submit">
            Somar recursivamente
          </button>
        </form>

        <ol className="flex flex-col gap-1.5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 font-mono text-sm">
          {calls.map((c) => {
            const [first, ...remainder] = c.list;
            const base = c.list.length === 0;
            return (
              <li
                key={c.depth}
                style={{ paddingLeft: `${c.depth * 1.25}rem` }}
                className={base ? "text-sky-400" : "text-zinc-300"}
              >
                soma([{c.list.join(", ")}]) ={" "}
                {base ? (
                  <span>0 <span className="text-zinc-500">(caso base)</span></span>
                ) : (
                  <span>
                    {first} + soma([{remainder.join(", ")}]) ={" "}
                    <span className="text-emerald-400">{c.result}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}
