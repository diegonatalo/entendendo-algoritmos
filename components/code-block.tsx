"use client";

import { useState } from "react";

// Mostra o código de um algoritmo, recolhido por padrão. Comentários (//) ficam em destaque.
export function CodeBlock({
  code,
  title = "Ver o código",
}: {
  code: string;
  title?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setState("copied");
    } catch {
      // sem permissão de área de transferência: o texto continua selecionável
      setState("error");
    }
    setTimeout(() => setState("idle"), 1800);
  }

  return (
    <details className="group rounded-xl border border-zinc-800 bg-zinc-900/60">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-emerald-400 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2">
          <span className="font-mono text-emerald-400">{"{ }"}</span>
          {title}
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
            onClick={copy}
            className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-emerald-400"
          >
            {state === "copied"
              ? "Copiado!"
              : state === "error"
                ? "Não foi possível copiar"
                : "Copiar"}
          </button>
        </div>
        <pre
          tabIndex={0}
          className="overflow-x-auto px-4 pb-4 pt-2 font-mono text-[13px] leading-relaxed text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-emerald-400"
        >
          <code>
            {code.split("\n").map((line, i, all) => {
              const position = line.indexOf("//");
              return (
                <span key={i}>
                  {position === -1 ? (
                    line
                  ) : (
                    <>
                      {line.slice(0, position)}
                      <span className="italic text-zinc-400">{line.slice(position)}</span>
                    </>
                  )}
                  {i < all.length - 1 ? "\n" : ""}
                </span>
              );
            })}
          </code>
        </pre>
      </div>
    </details>
  );
}
