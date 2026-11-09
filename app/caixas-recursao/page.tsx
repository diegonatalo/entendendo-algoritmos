"use client";

import {
  TARGET,
  KEY_LOCATIONS,
  searchKey,
  createBoxes,
} from "@/lib/boxes";
import { Box, BoxStep } from "@/types/boxes";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";
import { StepControls, Legend, Stat, primaryButton } from "@/components/ui";

const selectClass =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-100 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30";

const BoxVisual = ({
  box,
  step,
  executed,
  foundAt,
}: {
  box: Box;
  step: BoxStep;
  executed: boolean;
  foundAt: string | null;
}) => {
  const atStep = step.current === box.id;
  const atEnd = step.type === "didFind" && foundAt === box.id;
  const isOpen = executed && step.stack.includes(box.id);
  const scanned = executed && step.scannedItems.includes(box.id);

  const style = atEnd
    ? "border-emerald-500 bg-emerald-500/10"
    : atStep && isOpen
      ? "border-amber-500 bg-amber-500/10"
      : isOpen
        ? "border-sky-500/60 bg-sky-500/5"
        : scanned
          ? "border-zinc-700 bg-zinc-900/60 opacity-60"
          : "border-zinc-800 bg-zinc-900/40";

  return (
    <div className={`flex flex-col gap-2 rounded-xl border p-3 transition-colors ${style}`}>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-medium text-zinc-200">📦 {box.name}</span>
        {box.items.map((item) => (
          <span
            key={item}
            className={`rounded-md px-2 py-0.5 font-mono text-xs ${
              item === TARGET
                ? "bg-emerald-500 font-semibold text-emerald-950"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {item === TARGET ? "🔑 chave" : item}
          </span>
        ))}
        {scanned && <span className="text-xs text-zinc-500">vasculhada</span>}
      </div>
      {box.boxes.length > 0 && (
        <div className="ml-4 flex flex-col gap-2 border-l border-zinc-800 pl-3">
          {box.boxes.map((child) => (
            <BoxVisual
              key={child.id}
              box={child}
              step={step}
              executed={executed}
              foundAt={foundAt}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function RecursionBoxes() {
  const [location, setLocation] = useState<string>("azul2p");
  const [executed, setExecuted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const root = createBoxes(location === "nenhuma" ? null : location);
  const result = searchKey(root);
  const step = result.steps[currentStep];
  const final = currentStep === result.steps.length - 1;
  const nameOf = (id: string) => {
    const find = (c: Box): string | null =>
      c.id === id ? c.name : c.boxes.map(find).find((n) => n !== null) ?? null;
    return find(root) ?? id;
  };

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Caixas dentro de caixas</h1>
        <p className="text-zinc-400">
          O exemplo clássico de recursão: procurar uma chave em uma caixa que
          contém outras caixas, que contêm outras. Em vez de controlar a
          lista de caixas por conta própria, a função se chama para cada
          caixa interna. Quando não há mais caixas dentro, é o caso base.
        </p>
        <Explanation
          simple={EXPLANATIONS.recursionBoxes.simple}
          technique={EXPLANATIONS.recursionBoxes.technique}
          code={CODES.boxes}
        />
      </header>

      <div className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
          Onde está a chave?
          <select
            className={selectClass}
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setExecuted(false);
              setCurrentStep(0);
            }}
          >
            {KEY_LOCATIONS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
            <option value="nenhuma">Em nenhuma caixa</option>
          </select>
        </label>
        <button
          className={primaryButton}
          onClick={() => {
            setExecuted(true);
            setCurrentStep(0);
          }}
        >
          Procurar a chave
        </button>
      </div>

      <section className="fade-up flex flex-col gap-6">
        {executed && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Resultado"
              value={
                final
                  ? result.foundAt
                    ? "Encontrada"
                    : "Não encontrada"
                  : "Procurando…"
              }
              tone={final && !result.foundAt ? "text-red-400" : "text-emerald-400"}
            />
            <Stat
              label="Caixas abertas agora"
              value={String(step.stack.length)}
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
          <Legend color="bg-amber-500" text="Caixa sendo vasculhada" />
          <Legend color="bg-sky-500/40" text="Aberta, esperando as de dentro" />
          <Legend color="bg-zinc-700" text="Já vasculhada" />
          <Legend color="bg-emerald-500" text="Achou" />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          {executed && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p
                className={`text-sm font-medium ${step.type === "didFind" ? "text-emerald-400" : "text-amber-400"}`}
              >
                {step.description}
              </p>
              <StepControls currentStep={currentStep} total={result.steps.length} onChange={setCurrentStep} />
            </div>
          )}

          <BoxVisual
            box={root}
            step={step}
            executed={executed}
            foundAt={result.foundAt}
          />

          {executed && (
            <div className="flex flex-col gap-2">
              <div className="text-xs uppercase tracking-wider text-zinc-500">
                Pilha de chamadas (a última é a caixa em uso)
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {step.stack.length === 0 ? (
                  <span className="text-xs text-zinc-600">vazia</span>
                ) : (
                  step.stack.map((id, i) => (
                    <span key={id} className="flex items-center gap-1.5">
                      {i > 0 && <span className="text-zinc-600">→</span>}
                      <span
                        className={`rounded-lg px-2.5 py-1.5 text-xs ${
                          i === step.stack.length - 1
                            ? "bg-amber-500 font-semibold text-amber-950"
                            : "bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {nameOf(id)}
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
