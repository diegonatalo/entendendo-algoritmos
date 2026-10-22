"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Capitulo, capitulos } from "../capitulos";

// agrupa as páginas por capítulo, mantendo a ordem de capitulos.ts
const grupos: { numero: number; paginas: Capitulo[] }[] = capitulos.reduce(
  (acc, pagina) => {
    const ultimo = acc[acc.length - 1];
    if (ultimo && ultimo.numero === pagina.numero) ultimo.paginas.push(pagina);
    else acc.push({ numero: pagina.numero, paginas: [pagina] });
    return acc;
  },
  [] as { numero: number; paginas: Capitulo[] }[],
);

function Marca({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="shrink-0 whitespace-nowrap rounded-md font-semibold tracking-tight"
    >
      <span className="text-emerald-400">{"</>"}</span> Entendendo Algoritmos
    </Link>
  );
}

const foco =
  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-emerald-400";

function Lista({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const prefixoId = useId();
  const ativoRef = useRef<HTMLAnchorElement>(null);
  const [abertosManual, setAbertosManual] = useState<Record<number, boolean>>({});

  const capituloAtivo = grupos.find((g) =>
    g.paginas.some((p) => p.href === pathname),
  )?.numero;

  // leva o item da página atual para dentro da área visível do menu
  useEffect(() => {
    ativoRef.current?.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  const itemClass = (ativo: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${foco} ${
      ativo
        ? "bg-zinc-800 text-zinc-50"
        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
    }`;

  return (
    <nav aria-label="Capítulos" className="flex flex-col gap-1">
      <Link
        href="/"
        onClick={onNavigate}
        aria-current={pathname === "/" ? "page" : undefined}
        ref={pathname === "/" ? ativoRef : undefined}
        className={itemClass(pathname === "/")}
      >
        Início
      </Link>

      <div className="mt-3 flex flex-col gap-0.5">
        {grupos.map((grupo) => {
          const ehAtivo = grupo.numero === capituloAtivo;
          // o capítulo da página atual fica sempre aberto
          const aberto = ehAtivo || abertosManual[grupo.numero] === true;
          const idLista = `${prefixoId}-capitulo-${grupo.numero}`;

          return (
            <div key={grupo.numero}>
              <button
                type="button"
                aria-expanded={aberto}
                aria-controls={idLista}
                onClick={() =>
                  !ehAtivo &&
                  setAbertosManual((m) => ({ ...m, [grupo.numero]: !aberto }))
                }
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${foco} ${
                  ehAtivo
                    ? "cursor-default text-emerald-400"
                    : "cursor-pointer text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                }`}
              >
                <span>Capítulo {grupo.numero}</span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[10px] normal-case tracking-normal text-zinc-400">
                    {grupo.paginas.length}
                  </span>
                  <span aria-hidden className="w-3 text-center">
                    {aberto ? "▾" : "▸"}
                  </span>
                </span>
              </button>

              {aberto && (
                <ul id={idLista} className="mb-1 ml-3 flex flex-col gap-0.5 border-l border-zinc-800 pl-2">
                  {grupo.paginas.map((pagina) => {
                    const ativo = pathname === pagina.href;
                    return (
                      <li key={pagina.href}>
                        <Link
                          href={pagina.href}
                          onClick={onNavigate}
                          aria-current={ativo ? "page" : undefined}
                          ref={ativo ? ativoRef : undefined}
                          className={itemClass(ativo)}
                        >
                          {pagina.titulo}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

const SELETOR_FOCAVEL =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Sidebar() {
  const pathname = usePathname();
  // guarda em qual página a gaveta foi aberta: ao navegar, ela fecha sozinha
  const [abertoEm, setAbertoEm] = useState<string | null>(null);
  const aberto = abertoEm === pathname;

  const gavetaRef = useRef<HTMLDivElement>(null);
  const botaoAbrirRef = useRef<HTMLButtonElement>(null);

  const fechar = () => setAbertoEm(null);

  useEffect(() => {
    if (!aberto) return;

    const gaveta = gavetaRef.current;
    const botaoAbrir = botaoAbrirRef.current;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focaveis = () =>
      gaveta ? Array.from(gaveta.querySelectorAll<HTMLElement>(SELETOR_FOCAVEL)) : [];
    (gaveta?.querySelector<HTMLElement>('[aria-label="Fechar menu"]') ?? focaveis()[0])?.focus();

    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAbertoEm(null);
        return;
      }
      if (e.key !== "Tab") return;

      // mantém o foco do teclado dentro da gaveta
      const itens = focaveis();
      if (itens.length === 0) return;
      const primeiro = itens[0];
      const ultimo = itens[itens.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = overflowAnterior;
      botaoAbrir?.focus();
    };
  }, [aberto]);

  return (
    <>
      {/* telas largas: barra lateral fixa */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col gap-6 overflow-y-auto border-r border-zinc-800/80 bg-zinc-950/80 p-4 backdrop-blur lg:flex">
        <div className="px-3 pt-1">
          <Marca />
        </div>
        <Lista />
      </aside>

      {/* celular e tablet: barra superior com menu em gaveta */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-4 py-3 backdrop-blur lg:hidden">
        <Marca />
        <button
          ref={botaoAbrirRef}
          type="button"
          aria-label="Abrir menu de capítulos"
          aria-haspopup="dialog"
          aria-expanded={aberto}
          onClick={() => setAbertoEm(pathname)}
          className={`cursor-pointer rounded-lg border border-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:border-zinc-600 ${foco}`}
        >
          ☰ Capítulos
        </button>
      </header>

      {aberto && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div
            aria-hidden
            onClick={fechar}
            className="absolute inset-0 bg-black/60"
          />
          <div
            ref={gavetaRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de capítulos"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col gap-6 overflow-y-auto border-r border-zinc-800 bg-zinc-950 p-4"
          >
            <div className="flex items-center justify-between px-3 pt-1">
              <Marca onClick={fechar} />
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={fechar}
                className={`cursor-pointer rounded-md px-1.5 text-zinc-400 hover:text-zinc-100 ${foco}`}
              >
                ✕
              </button>
            </div>
            <Lista onNavigate={fechar} />
          </div>
        </div>
      )}
    </>
  );
}
