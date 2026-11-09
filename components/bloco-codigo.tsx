"use client";

import { useState } from "react";

// Mostra o código de um algoritmo, recolhido por padrão. Comentários (//) ficam em destaque.
export function BlocoCodigo({
  codigo,
  titulo = "Ver o código",
}: {
  codigo: string;
  titulo?: string;
}) {
  const [estado, setEstado] = useState<"ocioso" | "copiado" | "erro">("ocioso");

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo);
      setEstado("copiado");
    } catch {
      // sem permissão de área de transferência: o texto continua selecionável
      setEstado("erro");
    }
    setTimeout(() => setEstado("ocioso"), 1800);
  }

  return (
    <details className="group rounded-xl border border-zinc-800 bg-zinc-900/60">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-emerald-400 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2">
          <span className="font-mono text-emerald-400">{"{ }"}</span>
          {titulo}
        </span>
        <span
          aria-hidden
          className="text-xs text-zinc-400 transition-transform group-open:rotate-90"
        >
          ▸
        </span>
      </summary>

      <div className="border-t border-zinc-800">
        <div className="flex justify-end px-3 pt-3">
          <button
            type="button"
            onClick={copiar}
            className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-emerald-400"
          >
            {estado === "copiado"
              ? "Copiado!"
              : estado === "erro"
                ? "Não foi possível copiar"
                : "Copiar"}
          </button>
        </div>
        <pre
          tabIndex={0}
          className="overflow-x-auto px-4 pb-4 pt-2 font-mono text-[13px] leading-relaxed text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-emerald-400"
        >
          <code>
            {codigo.split("\n").map((linha, i, todas) => {
              const posicao = linha.indexOf("//");
              return (
                <span key={i}>
                  {posicao === -1 ? (
                    linha
                  ) : (
                    <>
                      {linha.slice(0, posicao)}
                      <span className="italic text-zinc-400">{linha.slice(posicao)}</span>
                    </>
                  )}
                  {i < todas.length - 1 ? "\n" : ""}
                </span>
              );
            })}
          </code>
        </pre>
      </div>
    </details>
  );
}
