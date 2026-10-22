import Link from "next/link";
import { capitulos } from "./capitulos";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-6 py-16">
      <section className="fade-up flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Veja os algoritmos{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
            acontecendo
          </span>
        </h1>
        <p className="max-w-xl text-lg text-zinc-400">
          Visualizações interativas, passo a passo, para entender como cada
          algoritmo toma suas decisões.
        </p>
      </section>

      <section className="fade-up grid gap-4 sm:grid-cols-2">
        {capitulos.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition-all hover:-translate-y-0.5 hover:border-emerald-500/50 hover:bg-zinc-900"
          >
            <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">
              Capítulo {c.numero}
            </span>
            <h2 className="text-xl font-semibold">{c.titulo}</h2>
            <p className="text-sm text-zinc-400">{c.descricao}</p>
            <span className="mt-2 text-sm text-zinc-300 transition-transform group-hover:translate-x-1">
              Explorar →
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
