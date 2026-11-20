import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { ThemeButton } from "@/components/theme-button";
import { HERO, PERKS, STEPS, chapterCount, featuredChapters } from "@/lib/landing";
import { SOURCE_URL } from "@/lib/site";

const SECTION = "mx-auto w-full max-w-5xl px-6";
const H2 = "text-2xl font-bold tracking-tight sm:text-3xl";
const CARD = "rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6";
const CTA =
  "inline-flex items-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400";

/** Página inicial: apresenta o projeto e leva aos capítulos (`/app`). */
export const LandingPage = () => (
  <div className="flex min-h-full flex-col">
    <header className="border-b border-zinc-800">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-4">
        <Link href="/" className="whitespace-nowrap font-semibold tracking-tight">
          <span className="text-emerald-400">{"</>"}</span> Entendendo Algoritmos
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <ThemeButton compact />
          {/* No celular o hero já traz o mesmo link logo abaixo. */}
          <Link href="/app" className={`${CTA} max-sm:hidden`}>
            Ver os capítulos
          </Link>
        </div>
      </div>
    </header>

    <main id="conteudo" className="flex flex-1 flex-col gap-20 pb-20">
      <section className={`${SECTION} fade-up flex flex-col gap-5 pt-16`} aria-labelledby="titulo">
        <p className="text-sm font-medium uppercase tracking-wider text-emerald-400">{HERO.kicker}</p>
        <h1 id="titulo" className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          {HERO.title}
        </h1>
        <p className="max-w-2xl text-lg text-zinc-400">{HERO.subtitle}</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/app" className={CTA}>
            Começar pelos capítulos
          </Link>
          <Link
            href="/app/busca-binaria"
            className="inline-flex items-center rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-semibold transition hover:border-emerald-500/60"
          >
            Abrir a busca binária
          </Link>
        </div>
      </section>

      <section className={SECTION} aria-labelledby="titulo-destaques">
        <h2 id="titulo-destaques" className={H2}>
          Para começar
        </h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {featuredChapters().map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                className={`${CARD} group flex h-full flex-col gap-2 transition-all hover:-translate-y-0.5 hover:border-emerald-500/50`}
              >
                <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                  Capítulo {c.number}
                </span>
                <h3 className="text-xl font-semibold">{c.title}</h3>
                <p className="text-sm text-zinc-400">{c.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={SECTION} aria-labelledby="titulo-como">
        <h2 id="titulo-como" className={H2}>
          Como funciona
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className={CARD}>
              <span className="font-mono text-sm text-emerald-400">0{index + 1}</span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-zinc-400">{step.text}</p>
            </li>
          ))}
        </ol>
        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          {PERKS.map((perk) => (
            <li key={perk.title} className="px-1">
              <h3 className="font-semibold">{perk.title}</h3>
              <p className="mt-1 text-sm text-zinc-400">{perk.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${SECTION} text-center`} aria-labelledby="titulo-final">
        <h2 id="titulo-final" className={H2}>
          {chapterCount()} capítulos, todos interativos
        </h2>
        <Link href="/app" className={`${CTA} mt-6`}>
          Ver os capítulos
        </Link>
      </section>
    </main>
    <SiteFooter sourceUrl={SOURCE_URL} authorUrl="https://diegonatalo.dev" />
  </div>
);
