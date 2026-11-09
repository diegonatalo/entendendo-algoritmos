"use client";

import { useSyncExternalStore } from "react";

type Theme = "claro" | "escuro";

// o tema vive no atributo data-theme do <html>, definido por um script antes da primeira pintura
function subscribe(notice: () => void) {
  const observer = new MutationObserver(notice);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const readTheme = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "claro" : "escuro";

function toggle() {
  const created = readTheme() === "claro" ? "dark" : "light";
  document.documentElement.dataset.theme = created;
  try {
    localStorage.setItem("theme", created);
  } catch {
    // sem armazenamento (modo privado): o tema vale só até recarregar
  }
}

export const ThemeButton = ({ compact = false }: { compact?: boolean }) => {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "escuro" as Theme);
  const destination = theme === "claro" ? "escuro" : "claro";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Mudar para o tema ${destination}`}
      title={`Tema ${destination}`}
      className={`flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-800 text-sm text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-emerald-400 ${
        compact ? "h-10 w-10 justify-center" : "px-3 py-2"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {theme === "claro" ? (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        )}
      </svg>
      {!compact && <span>Tema {destination}</span>}
    </button>
  );
};
