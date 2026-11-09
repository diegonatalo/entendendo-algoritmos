"use client";

import { useId, useState } from "react";
import { CodeBlock } from "./code-block";
import type { Bloco } from "@/lib/explanations";

type Level = "simple" | "technique";

const LEVELS: { id: Level; label: string; description: string }[] = [
  { id: "simple", label: "Simples", description: "A ideia com uma analogia." },
  { id: "technique", label: "Técnica", description: "Como funciona, custo e limites." },
];

function Blocks({ blocks }: { blocks: Bloco[] }) {
  return (
    <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-zinc-300">
      {blocks.map((b, i) => {
        if (b.type === "title") {
          return (
            <h3 key={i} className="mt-2 text-sm font-semibold uppercase tracking-wider text-emerald-400">
              {b.text}
            </h3>
          );
        }
        if (b.type === "list") {
          return (
            <ul key={i} className="flex list-disc flex-col gap-1.5 pl-5 marker:text-zinc-500">
              {b.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }
        if (b.type === "highlight") {
          return (
            <p
              key={i}
              className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-zinc-200"
            >
              {b.text}
            </p>
          );
        }
        return <p key={i}>{b.text}</p>;
      })}
    </div>
  );
}

// Começa recolhida, para a ferramenta da página continuar à vista. Escolher um nível abre
// a explicação; tocar de novo no nível aberto recolhe.
export function Explanation({
  simple,
  technique,
  code,
}: {
  simple: Bloco[];
  technique: Bloco[];
  code?: string;
}) {
  const [level, setLevel] = useState<Level | null>(null);
  const panelId = useId();

  const current = LEVELS.find((n) => n.id === level);

  return (
    <div className="mt-2 flex flex-col gap-3">
      <section
        aria-label="Explicação do algoritmo"
        className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3 sm:p-4"
      >
        <div role="group" aria-label="Nível da explicação" className="flex gap-1 rounded-xl bg-zinc-900 p-1">
          {LEVELS.map((n) => {
            const active = level === n.id;
            return (
              <button
                key={n.id}
                type="button"
                aria-expanded={active}
                aria-controls={panelId}
                onClick={() => setLevel(active ? null : n.id)}
                className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-emerald-400 ${
                  active
                    ? "border-emerald-500 bg-emerald-500 text-emerald-950"
                    : "border-zinc-700 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800 hover:text-zinc-50"
                }`}
              >
                <span>{n.label}</span>
                <span aria-hidden className={`text-xs transition-transform ${active ? "rotate-90" : ""}`}>
                  ▸
                </span>
              </button>
            );
          })}
        </div>
  
        <p className="px-1 text-xs text-zinc-400">
          {current
            ? `${current.description} Toque em ${current.label} de novo para recolher.`
            : "Explicação do algoritmo: escolha um nível para ler."}
        </p>
  
        {current && (
          <div id={panelId} role="region" aria-label={`Explicação ${current.label.toLowerCase()}`} className="flex flex-col gap-4 pt-1">
            <Blocks blocks={level === "simple" ? simple : technique} />
          </div>
        )}
      </section>
      {/* logo abaixo da explicação, recolhido, qualquer que seja o nível aberto */}
      {code && <CodeBlock code={code} title="Ver o código" />}
    </div>
  );
}
