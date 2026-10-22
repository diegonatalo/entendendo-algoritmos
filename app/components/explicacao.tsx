"use client";

import { useId, useState } from "react";
import { BlocoCodigo } from "./bloco-codigo";
import type { Bloco } from "../explicacoes";

type Nivel = "simples" | "tecnica";

const NIVEIS: { id: Nivel; rotulo: string; descricao: string }[] = [
  { id: "simples", rotulo: "Simples", descricao: "A ideia com uma analogia." },
  { id: "tecnica", rotulo: "Técnica", descricao: "Como funciona, custo e limites." },
];

function Blocos({ blocos }: { blocos: Bloco[] }) {
  return (
    <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-zinc-300">
      {blocos.map((b, i) => {
        if (b.tipo === "titulo") {
          return (
            <h3 key={i} className="mt-2 text-sm font-semibold uppercase tracking-wider text-emerald-400">
              {b.texto}
            </h3>
          );
        }
        if (b.tipo === "lista") {
          return (
            <ul key={i} className="flex list-disc flex-col gap-1.5 pl-5 marker:text-zinc-500">
              {b.itens.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }
        if (b.tipo === "destaque") {
          return (
            <p
              key={i}
              className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-zinc-200"
            >
              {b.texto}
            </p>
          );
        }
        return <p key={i}>{b.texto}</p>;
      })}
    </div>
  );
}

// Começa recolhida, para a ferramenta da página continuar à vista. Escolher um nível abre
// a explicação; tocar de novo no nível aberto recolhe.
export function Explicacao({
  simples,
  tecnica,
  codigo,
}: {
  simples: Bloco[];
  tecnica: Bloco[];
  codigo?: string;
}) {
  const [nivel, setNivel] = useState<Nivel | null>(null);
  const idPainel = useId();

  const atual = NIVEIS.find((n) => n.id === nivel);

  return (
    <section
      aria-label="Explicação do algoritmo"
      className="mt-2 flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3 sm:p-4"
    >
      <div role="group" aria-label="Nível da explicação" className="flex gap-1 rounded-xl bg-zinc-900 p-1">
        {NIVEIS.map((n) => {
          const ativo = nivel === n.id;
          return (
            <button
              key={n.id}
              type="button"
              aria-expanded={ativo}
              aria-controls={idPainel}
              onClick={() => setNivel(ativo ? null : n.id)}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-emerald-400 ${
                ativo
                  ? "border-emerald-500 bg-emerald-500 text-emerald-950"
                  : "border-zinc-700 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800 hover:text-zinc-50"
              }`}
            >
              <span>{n.rotulo}</span>
              <span aria-hidden className={`text-xs transition-transform ${ativo ? "rotate-90" : ""}`}>
                ▸
              </span>
            </button>
          );
        })}
      </div>

      <p className="px-1 text-xs text-zinc-400">
        {atual
          ? `${atual.descricao} Toque em ${atual.rotulo} de novo para recolher.`
          : "Explicação do algoritmo: escolha um nível para ler."}
      </p>

      {atual && (
        <div id={idPainel} role="region" aria-label={`Explicação ${atual.rotulo.toLowerCase()}`} className="flex flex-col gap-4 pt-1">
          <Blocos blocos={nivel === "simples" ? simples : tecnica} />
          {nivel === "tecnica" && codigo && <BlocoCodigo codigo={codigo} titulo="Ver o código" />}
        </div>
      )}
    </section>
  );
}
