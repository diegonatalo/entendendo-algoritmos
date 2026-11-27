"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { primaryButton, secondaryButton } from "@/components/ui";
import { chapters } from "@/lib/chapters";
import { cn } from "@/lib/cn";

// uma lista em que nenhuma posição guarda o endereço procurado (o null vira o "?")
const GHOST = [1, 4, 9, 13, null, 21, 26, 29];

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
    <div className="dot-grid flex min-h-full flex-1 flex-col">
      <header className="border-b border-zinc-800 bg-zinc-950 px-5 py-4 sm:px-8">
        <Logo size={26} />
      </header>
      <main
        id="conteudo"
        className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-7 px-5 py-14 sm:px-10 sm:py-20"
      >
        <div aria-hidden className="flex gap-[3px] sm:gap-1.5">
          {GHOST.map((n, i) => (
            <span
              key={i}
              className={cn(
                "flex h-10 flex-1 items-center justify-center rounded-md border font-mono text-[11px] sm:h-14 sm:rounded-[11px] sm:text-sm",
                n === null
                  ? "border-[1.5px] border-dashed border-violet-400 font-bold text-violet-400"
                  : "border-zinc-800 text-zinc-500 line-through opacity-40",
              )}
            >
              {n ?? "?"}
            </span>
          ))}
        </div>
        <p className="font-mono text-sm text-emerald-400">404 · página não encontrada</p>
        <h1 className="text-5xl font-extrabold leading-[0.95] tracking-tighter text-balance sm:text-7xl">
          Procuramos na lista inteira e <span className="marker">não achamos</span>.
        </h1>
        <p className="max-w-2xl text-lg text-zinc-400 sm:text-xl">
          O endereço{" "}
          <code className="break-all rounded-lg bg-zinc-800 px-2 py-0.5 font-mono text-base text-zinc-100">{path}</code>{" "}
          não existe. Com uma busca binária, bastariam {Math.floor(Math.log2(chapters.length)) + 1} tentativas para ter
          certeza de que ele não está entre as {chapters.length} páginas.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/app" className={primaryButton}>
            Ver os capítulos <span aria-hidden className="ml-2">→</span>
          </Link>
          <Link href="/" className={secondaryButton}>
            Ir para o início
          </Link>
        </div>

        {suggestions.length > 0 && (
          <section className="mt-2 flex flex-col gap-2.5" aria-labelledby="titulo-sugestoes">
            <h2
              id="titulo-sugestoes"
              className="font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-zinc-500"
            >
              Você quis dizer
            </h2>
            <ul className="flex flex-col gap-2">
              {suggestions.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 transition-colors hover:border-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                  >
                    <span className="flex flex-col">
                      <span className="font-semibold">{c.title}</span>
                      <span className="font-mono text-xs text-zinc-500">{c.href}</span>
                    </span>
                    <span aria-hidden className="text-emerald-400">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};
