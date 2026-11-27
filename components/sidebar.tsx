"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { ThemeButton } from "@/components/theme-button";
import { chapterGroups } from "@/lib/chapters";
import { cn } from "@/lib/cn";

const groups = chapterGroups();

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-violet-400";

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
    cn(
      "flex min-h-10 items-center gap-2.5 rounded-xl px-3 text-sm transition-colors",
      focusRing,
      active
        ? "bg-emerald-400/10 font-semibold text-zinc-50 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-sm before:bg-emerald-400"
        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-50",
    );

  return (
    <nav aria-label="Capítulos" className="flex flex-col gap-1">
      <Link
        href="/app"
        onClick={onNavigate}
        aria-current={pathname === "/app" ? "page" : undefined}
        ref={pathname === "/app" ? activeRef : undefined}
        className={itemClass(pathname === "/app")}
      >
        Todos os capítulos
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
                className={cn(
                  "flex min-h-10 w-full items-center gap-2.5 rounded-xl px-3 text-left text-[13px] transition-colors",
                  focusRing,
                  isActive
                    ? "cursor-default font-semibold text-zinc-50"
                    : cn("cursor-pointer hover:bg-zinc-900 hover:text-zinc-50", isOpen ? "font-semibold text-zinc-50" : "text-zinc-400"),
                )}
              >
                <span aria-hidden className={cn("w-5 font-mono text-xs", isOpen ? "text-emerald-400" : "text-zinc-500")}>
                  {String(group.number).padStart(2, "0")}
                </span>
                <span className="flex-1">
                  <span className="sr-only">Capítulo {group.number}: </span>
                  {group.name}
                </span>
                <span aria-hidden className="font-mono text-[11px] text-zinc-500">
                  {group.pages.length}
                </span>
              </button>

              {isOpen && (
                <ul id={listId} className="mb-1.5 ml-[22px] flex flex-col gap-0.5 border-l border-zinc-800 pl-2.5">
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

    const focusables = () =>
      drawer ? Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : [];
    (drawer?.querySelector<HTMLElement>('[aria-label="Fechar menu"]') ?? focusables()[0])?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenedAt(null);
        return;
      }
      if (e.key !== "Tab") return;

      // mantém o focusRing do teclado dentro da gaveta
      const items = focusables();
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
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 flex-col gap-6 overflow-y-auto border-r border-zinc-800 bg-zinc-950 px-3.5 py-5 lg:flex">
        <Logo size={26} className="px-2.5 pt-1" />
        <List />
        <div className="mt-auto border-t border-zinc-800 px-1 pt-4">
          <ThemeButton />
        </div>
      </aside>

      {/* celular e tablet: barra superior com menu em gaveta */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-950/85 px-4 py-3 backdrop-blur lg:hidden">
        <Logo size={24} className="min-w-0 text-base" />
        <div className="flex items-center gap-2">
          <ThemeButton compact />
          <button
            ref={openButtonRef}
            type="button"
            aria-label="Abrir menu de capítulos"
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            onClick={() => setOpenedAt(pathname)}
            className={cn(
              "flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-zinc-700 px-4 text-sm text-zinc-300 hover:border-zinc-500 hover:text-zinc-50",
              focusRing,
            )}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
            <span className="max-[380px]:sr-only">Capítulos</span>
          </button>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div
            aria-hidden
            onClick={close}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de capítulos"
            className="absolute inset-y-0 left-0 flex w-80 max-w-[88vw] flex-col gap-6 overflow-y-auto border-r border-zinc-800 bg-zinc-950 px-3.5 py-5"
          >
            <div className="flex items-center justify-between gap-2 px-2.5 pt-1">
              <Logo size={24} onClick={close} className="min-w-0 text-base" />
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={close}
                className={cn(
                  "flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-900 hover:text-zinc-50",
                  focusRing,
                )}
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
