import Link from "next/link";
import type { ReactNode } from "react";
import { HeroSearch } from "@/components/landing/hero-search";
import { Levels } from "@/components/landing/levels";
import { Showcase } from "@/components/landing/showcase";
import { Logo } from "@/components/logo";
import { SiteFooter } from "@/components/site-footer";
import { ThemeButton } from "@/components/theme-button";
import { primaryButton, secondaryButton } from "@/components/ui";
import { chapterGroups, chapters, pageCode } from "@/lib/chapters";
import { cn } from "@/lib/cn";
import { FAQ, HERO, PERKS, STEPS, chapterCount, stats } from "@/lib/landing";
import { SOURCE_URL } from "@/lib/site";

const WRAP = "mx-auto w-full max-w-6xl px-5 sm:px-10";
const SECTION = cn(WRAP, "pt-24 sm:pt-32");
const EYEBROW = "font-mono text-[13px] uppercase tracking-[0.08em] text-emerald-400";
const H2 = "mt-3.5 text-4xl font-bold leading-none tracking-tight sm:text-6xl";

const SectionTitle = ({ id, eyebrow, children }: { id: string; eyebrow: string; children: ReactNode }) => (
  <>
    <p className={EYEBROW}>{eyebrow}</p>
    <h2 id={id} className={H2}>
      {children}
    </h2>
  </>
);

const Header = () => (
  <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/85 backdrop-blur-md">
    <div className={cn(WRAP, "flex h-[72px] items-center gap-6")}>
      <Logo className="text-lg sm:text-xl" />
      <nav aria-label="Seções" className="ml-4 hidden gap-1 lg:flex">
        {[
          ["#como-funciona", "Como funciona"],
          ["#visualizacoes", "Visualizações"],
          ["#sumario", "Sumário"],
          ["#perguntas", "Perguntas"],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="rounded-full px-3 py-2.5 text-[15px] text-zinc-400 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-violet-400"
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-3">
        <ThemeButton compact />
        {/* no celular o hero já traz o mesmo link logo abaixo */}
        <Link href="/app" className={cn(primaryButton, "text-[15px] max-sm:hidden")}>
          Abrir o app <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  </header>
);

const Hero = () => (
  <section aria-labelledby="titulo" className="dot-grid border-b border-zinc-800">
    <div className={cn(WRAP, "grid items-center gap-12 py-12 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-24")}>
      <div className="fade-up">
        <span className="inline-flex flex-wrap items-center gap-2.5 rounded-full border border-zinc-700 bg-zinc-900 py-1.5 pl-1.5 pr-4 font-mono text-xs text-zinc-400 sm:text-[13px]">
          <b className="rounded-full bg-emerald-400 px-2.5 py-0.5 font-semibold text-emerald-950">{chapterCount()} capítulos</b>
          {HERO.kicker}
        </span>
        <h1 id="titulo" className="mt-7 text-5xl font-extrabold leading-[0.95] tracking-tighter text-balance sm:text-7xl xl:text-[80px] xl:leading-[0.93]">
          {HERO.titleStart} <span className="marker">{HERO.titleMarked}</span>
          {HERO.titleEnd}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-zinc-400 sm:text-xl">{HERO.subtitle}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/app" className={cn(primaryButton, "min-h-13 max-sm:flex-1")}>
            Abrir o app <span aria-hidden>→</span>
          </Link>
          <Link href="/app/busca-binaria" className={cn(secondaryButton, "min-h-13 max-sm:flex-1")}>
            Começar pela busca binária
          </Link>
        </div>
        <p className="mt-7 font-mono text-[13px] text-zinc-500">{HERO.note}</p>
      </div>
      <HeroSearch />
    </div>
  </section>
);

const Marquee = () => {
  const titles = chapters.map((c) => c.title);
  return (
    <div aria-hidden className="overflow-hidden border-b border-zinc-800 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div className="flex w-max animate-marquee gap-10 py-5">
        {[...titles, ...titles].map((title, i) => (
          <span key={i} className="inline-flex items-center gap-10 whitespace-nowrap font-mono text-sm text-zinc-500">
            {title}
            <span className="h-1.5 w-1.5 rounded-sm bg-emerald-400" />
          </span>
        ))}
      </div>
    </div>
  );
};

const Stats = () => (
  <section aria-label="O projeto em números" className={cn(WRAP, "pt-16 sm:pt-20")}>
    <dl className="m-0 grid grid-cols-2 border-y border-zinc-800 md:grid-cols-4">
      {stats().map((stat, i) => (
        <div
          key={stat.label}
          className={cn(
            "flex flex-col-reverse gap-2.5 border-zinc-800 py-7 sm:py-9",
            i % 2 === 0 ? "pr-4 max-md:pl-0 sm:pr-7" : "border-l px-4 sm:px-7",
            i === 2 && "md:border-l md:px-7",
            i >= 2 && "max-md:border-t",
          )}
        >
          <dt className="text-zinc-400">{stat.label}</dt>
          <dd className={cn("m-0 font-display text-5xl font-bold leading-none tracking-tighter sm:text-6xl", i === 3 && "text-emerald-400")}>
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  </section>
);

const HowItWorks = () => (
  <section id="como-funciona" aria-labelledby="titulo-como" className={cn(SECTION, "scroll-mt-20")}>
    <SectionTitle id="titulo-como" eyebrow="Como funciona">
      Três gestos.
      <br />
      Nenhuma decoreba.
    </SectionTitle>
    <ol className="mt-14 grid list-none gap-5 p-0 md:grid-cols-3">
      {STEPS.map((step, index) => (
        <li key={step.title} className="flex flex-col gap-3.5 rounded-3xl border border-zinc-800 bg-zinc-900 p-7 md:min-h-90">
          <span className="font-mono text-[13px] text-zinc-500">0{index + 1}</span>
          <h3 className="m-0 text-[28px] font-bold leading-tight">{step.title}</h3>
          <p className="m-0 text-[15px] text-zinc-400">{step.text}</p>
          <div aria-hidden className="mt-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-4.5">
            {index === 0 && (
              <div className="flex flex-wrap gap-2 text-[13px]">
                {["Recursão", "Busca binária", "Quicksort", "Dijkstra", "Tabela hash", "KNN"].map((name) => (
                  <span
                    key={name}
                    className={cn(
                      "rounded-full border px-3 py-1.5",
                      name === "Busca binária"
                        ? "border-emerald-400 bg-emerald-400 font-semibold text-emerald-950"
                        : "border-zinc-700 bg-zinc-900 text-zinc-400",
                    )}
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
            {index === 1 && (
              <div className="flex flex-col gap-2.5">
                <span className="text-[13px] text-zinc-500">Número alvo</span>
                <span className="flex h-12 items-center rounded-xl border-[1.5px] border-emerald-400 px-3.5 font-mono text-lg ring-4 ring-emerald-400/15">
                  42
                  <span className="ml-1 h-5 w-0.5 animate-blink bg-zinc-50" />
                </span>
              </div>
            )}
            {index === 2 && (
              <div className="flex items-center gap-2.5">
                <span className="rounded-full border border-zinc-700 px-3 py-1.5 text-[13px]">←</span>
                <span className="flex flex-1 gap-1.5">
                  {[true, true, false, false].map((done, i) => (
                    <span key={i} className={cn("h-1.5 flex-1 rounded-full", done ? "bg-emerald-400" : "bg-zinc-700")} />
                  ))}
                </span>
                <span className="rounded-full border border-zinc-700 px-3 py-1.5 text-[13px]">→</span>
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  </section>
);

const Visualizations = () => (
  <section id="visualizacoes" aria-labelledby="titulo-visualizacoes" className={cn(SECTION, "scroll-mt-20")}>
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <SectionTitle id="titulo-visualizacoes" eyebrow="Visualizações">
          Uma tela viva
          <br />
          para cada ideia.
        </SectionTitle>
      </div>
      <Link href="/app" className={secondaryButton}>
        Ver as {chapters.length} <span aria-hidden className="ml-2">→</span>
      </Link>
    </div>
    <Showcase />
  </section>
);

const LevelsSection = () => (
  <section aria-labelledby="titulo-niveis" className={SECTION}>
    <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <div>
        <SectionTitle id="titulo-niveis" eyebrow="Explicação em dois níveis">
          Primeiro a analogia. Depois, o custo e o código.
        </SectionTitle>
        <p className="mt-5 max-w-xl text-lg text-zinc-400">
          Cada página começa com a ferramenta à vista. A explicação abre quando você quiser, no nível que fizer sentido
          agora.
        </p>
        <ul className="mt-9 list-none p-0">
          {PERKS.map((perk, i) => (
            <li key={perk.title} className="flex gap-4 border-t border-zinc-800 py-4.5">
              <span className="font-mono text-emerald-400">0{i + 1}</span>
              <span>
                <b className="block text-[17px]">{perk.title}</b>
                <span className="text-[15px] text-zinc-400">{perk.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Levels />
    </div>
  </section>
);

const TableOfContents = () => (
  <section id="sumario" aria-labelledby="titulo-sumario" className={cn(SECTION, "scroll-mt-20")}>
    <SectionTitle id="titulo-sumario" eyebrow="Sumário">
      O livro inteiro,
      <br />
      em {chapters.length} telas.
    </SectionTitle>
    <ol className="mt-12 grid list-none gap-x-16 p-0 md:grid-cols-2">
      {chapterGroups().map((group) => (
        <li key={group.number} className="group grid grid-cols-[64px_minmax(0,1fr)] gap-5 border-t border-zinc-800 py-6 sm:grid-cols-[96px_minmax(0,1fr)]">
          <span aria-hidden className="outline-number font-display text-[40px] font-extrabold leading-[0.9] tracking-tighter transition-colors group-hover:[-webkit-text-stroke-color:var(--color-emerald-400)] sm:text-[56px]">
            {String(group.number).padStart(2, "0")}
          </span>
          <div>
            <p className="mb-2.5 mt-1 font-mono text-xs uppercase tracking-[0.08em] text-zinc-500">
              Capítulo {group.number} · {group.name}
            </p>
            <ul className="m-0 list-none p-0">
              {group.pages.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className="group/link flex items-baseline gap-2.5 rounded py-1.5 font-medium hover:text-emerald-400 focus-visible:outline-2 focus-visible:outline-violet-400"
                  >
                    <span>{page.title}</span>
                    <span aria-hidden className="flex-1 translate-y-[-4px] border-b border-dotted border-zinc-700" />
                    <span aria-hidden className="font-mono text-[13px] text-zinc-500 group-hover/link:text-emerald-400">
                      {pageCode(page)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  </section>
);

const Faq = () => (
  <section id="perguntas" aria-labelledby="titulo-perguntas" className={cn(SECTION, "scroll-mt-20")}>
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <div>
        <SectionTitle id="titulo-perguntas" eyebrow="Perguntas">
          Antes de abrir.
        </SectionTitle>
      </div>
      <div>
        {FAQ.map((item, i) => (
          <details key={item.question} open={i === 0} className="group border-t border-zinc-800 py-1.5 last:border-b">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-4 text-lg font-semibold focus-visible:outline-2 focus-visible:outline-violet-400 sm:text-xl [&::-webkit-details-marker]:hidden">
              {item.question}
              <span aria-hidden className="font-mono text-2xl text-zinc-500 transition-transform group-open:rotate-45 group-open:text-emerald-400">
                +
              </span>
            </summary>
            <p className="mb-5 max-w-2xl text-zinc-400">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

const FinalCta = () => (
  <section aria-labelledby="titulo-final" className={cn(SECTION, "pb-10")}>
    <div className="relative grid items-end gap-10 overflow-hidden rounded-[28px] bg-[#34d399] px-7 py-12 text-emerald-950 sm:rounded-[36px] sm:px-16 sm:py-22 md:grid-cols-[minmax(0,1fr)_auto]">
      <div className="relative">
        <p className="mb-5 font-mono text-sm uppercase tracking-[0.06em] opacity-70">{chapters.length} visualizações</p>
        <h2 id="titulo-final" className="m-0 text-5xl font-extrabold leading-[0.9] tracking-tighter sm:text-[88px]">
          Pare de decorar.
          <br />
          Veja acontecer.
        </h2>
      </div>
      <Link
        href="/app"
        className="relative inline-flex min-h-15 items-center justify-center gap-2 rounded-full bg-[#0c0c10] px-8 text-[17px] font-semibold text-[#34d399] transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0c0c10]"
      >
        Abrir o app <span aria-hidden>→</span>
      </Link>
      <svg aria-hidden width="320" height="320" viewBox="0 0 30 30" className="pointer-events-none absolute -right-16 -top-24 opacity-15">
        <rect x="1.5" y="9" width="7" height="12" rx="2.5" className="fill-none stroke-emerald-950" strokeWidth="0.8" />
        <rect x="11.5" y="3" width="7" height="24" rx="2.5" className="fill-emerald-950" />
        <rect x="21.5" y="9" width="7" height="12" rx="2.5" className="fill-none stroke-emerald-950" strokeWidth="0.8" />
      </svg>
    </div>
  </section>
);

/** Página inicial: apresenta o projeto e leva aos capítulos (`/app`). */
export const LandingPage = () => (
  <div className="flex min-h-full flex-col">
    <Header />
    <main id="conteudo" className="flex-1">
      <Hero />
      <Marquee />
      <Stats />
      <HowItWorks />
      <Visualizations />
      <LevelsSection />
      <TableOfContents />
      <Faq />
      <FinalCta />
    </main>
    <SiteFooter sourceUrl={SOURCE_URL} authorUrl="https://diegonatalo.dev" />
  </div>
);
