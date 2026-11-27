import Link from "next/link";
import { primaryButton } from "@/components/ui";
import { chapterGroups, chapters, pageCode } from "@/lib/chapters";
import { cn } from "@/lib/cn";

// o trecho da busca binária no destaque "Comece por aqui": passo 2, meio = 27
const PREVIEW = [2, 5, 9, 14, 21, 27, 33, 40];
const PREVIEW_START = 4;
const PREVIEW_MIDDLE = 5;

export const ChaptersScreen = () => {
  const groups = chapterGroups();
  const [first] = chapters;

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-6xl flex-col px-5 py-10 sm:px-12 sm:py-14">
      <section className="fade-up flex flex-col gap-5">
        <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-emerald-400">
          {chapters.length} visualizações · {groups.length} capítulos
        </p>
        <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.95] tracking-tighter text-balance sm:text-7xl">
          Escolha um algoritmo e <span className="marker">mexa nele</span>.
        </h1>
        <p className="max-w-xl text-lg text-zinc-400">
          Visualizações interativas, passo a passo, na ordem dos capítulos do livro.
        </p>
      </section>

      <Link
        href={first.href}
        className="fade-up group mt-10 grid items-center gap-8 rounded-[28px] border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 sm:p-8 md:grid-cols-[1fr_1.1fr]"
      >
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-emerald-400">
            Comece por aqui · {pageCode(first)}
          </span>
          <span className="font-display text-4xl font-bold leading-none tracking-tight">{first.title}</span>
          <span className="text-zinc-400">{first.description}</span>
          <span className={cn(primaryButton, "mt-2 self-start")}>
            Abrir <span aria-hidden className="ml-2">→</span>
          </span>
        </div>
        <div aria-hidden className="flex flex-col gap-2.5 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="grid grid-cols-8 gap-1 font-mono text-xs sm:gap-1.5 sm:text-sm">
            {PREVIEW.map((n, i) => (
              <span
                key={n}
                className={cn(
                  "rounded-lg border py-3 text-center",
                  i < PREVIEW_START && "border-zinc-800 text-zinc-500 line-through opacity-35",
                  i >= PREVIEW_START && i !== PREVIEW_MIDDLE && "border-zinc-700 bg-zinc-800",
                  i === PREVIEW_MIDDLE && "-translate-y-1 border-emerald-400 bg-emerald-400 font-bold text-emerald-950",
                )}
              >
                {n}
              </span>
            ))}
          </div>
          <span className="font-mono text-[13px] text-zinc-400">passo 2 · meio = {PREVIEW[PREVIEW_MIDDLE]}</span>
        </div>
      </Link>

      <div className="mt-14">
        {groups.map((group) => (
          <section
            key={group.number}
            aria-labelledby={`capitulo-${group.number}`}
            className="grid gap-4 border-t border-zinc-800 py-8 sm:gap-7 sm:py-9 md:grid-cols-[150px_minmax(0,1fr)]"
          >
            <div className="flex items-baseline gap-4 md:block">
              <div aria-hidden className="outline-number font-display text-[44px] font-extrabold leading-[0.85] tracking-tighter md:text-[64px]">
                {String(group.number).padStart(2, "0")}
              </div>
              <div>
                <h2 id={`capitulo-${group.number}`} className="text-[15px] font-semibold tracking-normal md:mt-3">
                  <span className="sr-only">Capítulo {group.number}: </span>
                  {group.name}
                </h2>
                <p className="mt-1 font-mono text-xs text-zinc-500">
                  {group.pages.length} {group.pages.length === 1 ? "visualização" : "visualizações"}
                </p>
              </div>
            </div>
            <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
              {group.pages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="group flex min-h-40 flex-col gap-2 rounded-[20px] border border-zinc-800 bg-zinc-900 p-5.5 transition hover:-translate-y-0.5 hover:border-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                >
                  <span className="font-mono text-xs text-zinc-500">{pageCode(page)}</span>
                  <h3 className="text-[21px] font-bold leading-tight">{page.title}</h3>
                  <p className="text-sm text-zinc-400">{page.description}</p>
                  <span className="mt-auto pt-2 text-sm font-semibold text-zinc-500 transition-colors group-hover:text-emerald-400">
                    Abrir →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};
