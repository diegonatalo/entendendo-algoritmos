"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Chapter, chapters } from "@/lib/chapters";
import { ThemeButton } from "./theme-button";

// agrupa as páginas por capítulo, mantendo a ordem de capitulos.ts
const groups: { number: number; pages: Chapter[] }[] = chapters.reduce(
  (acc, page) => {
    const last = acc[acc.length - 1];
    if (last && last.number === page.number) last.pages.push(page);
    else acc.push({ number: page.number, pages: [page] });
    return acc;
  },
  [] as { number: number; pages: Chapter[] }[],
);

const Mark = ({ onClick }: { onClick?: () => void }) => {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="shrink-0 whitespace-nowrap rounded-md font-semibold tracking-tight"
    >
      <span className="text-emerald-400">{"</>"}</span> Entendendo Algoritmos
    </Link>
  );
};

const foco =
  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-emerald-400";

const List = ({ onNavigate }: { onNavigate?: () => void }) => {
  const pathname = usePathname();
  const idPrefix = useId();
  const activeRef = useRef<HTMLAnchorElement>(null);
  const [manuallyOpened, setManuallyOpened] = useState<Record<number, boolean>>({});

  const activeChapter = groups.find((g) =>
    g.pages.some((p) => p.href === pathname),
  )?.number;

  // leva o item da página atual para dentro da área visível do menu
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  const itemClass = (active: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${foco} ${
      active
        ? "bg-zinc-800 text-zinc-50"
        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
    }`;

  return (
    <nav aria-label="Capítulos" className="flex flex-col gap-1">
      <Link
        href="/"
        onClick={onNavigate}
        aria-current={pathname === "/" ? "page" : undefined}
        ref={pathname === "/" ? activeRef : undefined}
        className={itemClass(pathname === "/")}
      >
        Início
      </Link>

      <div className="mt-3 flex flex-col gap-0.5">
        {groups.map((group) => {
          const isActive = group.number === activeChapter;
          // o capítulo da página atual fica sempre aberto
          const isOpen = isActive || manuallyOpened[group.number] === true;
          const listId = `${idPrefix}-capitulo-${group.number}`;

          return (
            <div key={group.number}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={listId}
                onClick={() =>
                  !isActive &&
                  setManuallyOpened((m) => ({ ...m, [group.number]: !isOpen }))
                }
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${foco} ${
                  isActive
                    ? "cursor-default text-emerald-400"
                    : "cursor-pointer text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                }`}
              >
                <span>Capítulo {group.number}</span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[10px] normal-case tracking-normal text-zinc-400">
                    {group.pages.length}
                  </span>
                  <span aria-hidden className="w-3 text-center">
                    {isOpen ? "▾" : "▸"}
                  </span>
                </span>
              </button>

              {isOpen && (
                <ul id={listId} className="mb-1 ml-3 flex flex-col gap-0.5 border-l border-zinc-800 pl-2">
                  {group.pages.map((page) => {
                    const active = pathname === page.href;
                    return (
                      <li key={page.href}>
                        <Link
                          href={page.href}
                          onClick={onNavigate}
                          aria-current={active ? "page" : undefined}
                          ref={active ? activeRef : undefined}
                          className={itemClass(active)}
                        >
                          {page.title}
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
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Sidebar = () => {
  const pathname = usePathname();
  // guarda em qual página a gaveta foi aberta: ao navegar, ela fecha sozinha
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const isOpen = openedAt === pathname;

  const drawerRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  const close = () => setOpenedAt(null);

  useEffect(() => {
    if (!isOpen) return;

    const drawer = drawerRef.current;
    const openButton = openButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focaveis = () =>
      drawer ? Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : [];
    (drawer?.querySelector<HTMLElement>('[aria-label="Fechar menu"]') ?? focaveis()[0])?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenedAt(null);
        return;
      }
      if (e.key !== "Tab") return;

      // mantém o foco do teclado dentro da gaveta
      const items = focaveis();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      openButton?.focus();
    };
  }, [isOpen]);

  return (
    <>
      {/* telas largas: barra lateral fixa */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col gap-6 overflow-y-auto border-r border-zinc-800/80 bg-zinc-950/80 p-4 backdrop-blur lg:flex">
        <div className="px-3 pt-1">
          <Mark />
        </div>
        <List />
        <div className="mt-auto px-1">
          <ThemeButton />
        </div>
      </aside>

      {/* celular e tablet: barra superior com menu em gaveta */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-4 py-3 backdrop-blur lg:hidden">
        <Mark />
        <div className="flex items-center gap-2">
          <ThemeButton compact />
          <button
            ref={openButtonRef}
            type="button"
            aria-label="Abrir menu de capítulos"
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            onClick={() => setOpenedAt(pathname)}
            className={`cursor-pointer rounded-lg border border-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:border-zinc-600 ${foco}`}
          >
            ☰ Capítulos
          </button>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div
            aria-hidden
            onClick={close}
            className="absolute inset-0 bg-black/60"
          />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de capítulos"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col gap-6 overflow-y-auto border-r border-zinc-800 bg-zinc-950 p-4"
          >
            <div className="flex items-center justify-between px-3 pt-1">
              <Mark onClick={close} />
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={close}
                className={`cursor-pointer rounded-md px-1.5 text-zinc-400 hover:text-zinc-100 ${foco}`}
              >
                ✕
              </button>
            </div>
            <List onNavigate={close} />
          </div>
        </div>
      )}
    </>
  );
};
