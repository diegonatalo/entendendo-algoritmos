"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorScreenProps = {
  error: unknown;
  retry: () => void;
};

export const ErrorScreen = ({ error, retry }: ErrorScreenProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="conteudo"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-16"
    >
      <p className="font-mono text-sm text-emerald-400">erro · algo saiu do esperado</p>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Algo deu errado</h1>
      <p className="max-w-xl text-lg text-zinc-400">
        Esta página encontrou um erro inesperado. Tente de novo ou volte para a lista de capítulos.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={() => retry()}
          className="cursor-pointer rounded-xl bg-emerald-500 px-5 py-2.5 font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:bg-emerald-600"
        >
          Tentar de novo
        </button>
        <Link
          href="/"
          className="rounded-xl border border-zinc-700 px-5 py-2.5 text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-emerald-400"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  );
};
