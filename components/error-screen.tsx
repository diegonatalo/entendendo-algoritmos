"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { primaryButton, secondaryButton } from "@/components/ui";

type ErrorScreenProps = {
  error: unknown;
  retry: () => void;
};

// a pilha de chamadas que parou: o quadro de cima é o que falhou
const FRAMES = ["passo(3) · parou aqui", "passo(2)", "passo(1)"];

export const ErrorScreen = ({ error, retry }: ErrorScreenProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="dot-grid flex min-h-full flex-1 flex-col">
      <header className="border-b border-zinc-800 bg-zinc-950 px-5 py-4 sm:px-8">
        <Logo size={26} />
      </header>
      <main
        id="conteudo"
        className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-7 px-5 py-14 sm:px-10 sm:py-20"
      >
        <ol aria-hidden className="flex max-w-md flex-col gap-1.5 font-mono text-sm">
          {FRAMES.map((frame, i) => (
            <li
              key={frame}
              className={
                i === 0
                  ? "rounded-xl border-[1.5px] border-rose-400 bg-rose-400/10 px-4 py-3 font-semibold text-rose-400"
                  : "rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-500"
              }
            >
              {i === 0 ? `✕ ${frame}` : frame}
            </li>
          ))}
        </ol>
        <p className="font-mono text-sm text-rose-400">erro · algo saiu do esperado</p>
        <h1 className="text-5xl font-extrabold leading-[0.95] tracking-tighter text-balance sm:text-7xl">
          A página parou <span className="marker">no meio do passo</span>.
        </h1>
        <p className="max-w-xl text-lg text-zinc-400 sm:text-xl">
          Esta página encontrou um erro inesperado. Tente de novo ou volte para a lista de capítulos.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => retry()} className={primaryButton}>
            Tentar de novo
          </button>
          <Link href="/app" className={secondaryButton}>
            Voltar aos capítulos
          </Link>
        </div>
      </main>
    </div>
  );
};
