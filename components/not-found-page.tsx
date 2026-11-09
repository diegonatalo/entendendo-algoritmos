"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { chapters } from "@/lib/chapters";

// distância de edição entre dois textos: quantas letras trocar, inserir ou apagar
function distance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    previous = current;
  }
  return previous[b.length];
}

// páginas cujo endereço se parece com o digitado (só as que erram por pouco)
function similar(path: string) {
  const typed = path.replace(/^\/+|\/+$/g, "").toLowerCase();
  if (!typed) return [];
  return chapters
    .map((c) => ({ c, d: distance(typed, c.href.slice(1)) }))
    .filter(({ d }) => d <= Math.max(3, Math.floor(typed.length / 3)))
    .sort((x, y) => x.d - y.d)
    .slice(0, 3)
    .map(({ c }) => c);
}

export const NotFoundPage = () => {
  const path = usePathname();
  const suggestions = similar(path);

  return (
    <main
      id="conteudo"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-6 py-16"
    >
      <section className="fade-up flex flex-col gap-4">
        <p className="font-mono text-sm text-emerald-400">404 · página não encontrada</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Procuramos em toda a lista e{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
            não achamos
          </span>
        </h1>
        <p className="max-w-xl text-lg text-zinc-400">
          O endereço{" "}
          <code className="break-all rounded-md bg-zinc-900 px-1.5 py-0.5 font-mono text-base text-zinc-200">
            {path}
          </code>{" "}
          não existe neste app. Com uma busca binária, bastariam{" "}
          {Math.floor(Math.log2(chapters.length)) + 1} tentativas para ter certeza de que ele não
          está entre as {chapters.length} páginas.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/"
            className="cursor-pointer rounded-xl bg-emerald-500 px-5 py-2.5 font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:bg-emerald-600"
          >
            Voltar ao início
          </Link>
          <Link
            href="/busca-binaria"
            className="rounded-xl border border-zinc-700 px-5 py-2.5 text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-emerald-400"
          >
            Ver a busca binária
          </Link>
        </div>
      </section>

      {suggestions.length > 0 && (
        <section className="flex flex-col gap-3" aria-label="Páginas parecidas">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Você quis dizer
          </h2>
          <ul className="flex flex-col gap-2">
            {suggestions.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="group flex flex-col gap-0.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 transition-colors hover:border-emerald-500/50 focus-visible:outline-2 focus-visible:outline-emerald-400"
                >
                  <span className="font-medium text-zinc-100">{c.title}</span>
                  <span className="font-mono text-xs text-zinc-500">{c.href}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
};
