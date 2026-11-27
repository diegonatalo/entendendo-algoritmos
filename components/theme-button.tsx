"use client";

import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/cn";
import { THEME_KEY } from "@/lib/storage-keys";
import type { Theme } from "@/lib/theme";

const LABEL: Record<Theme, string> = { light: "claro", dark: "escuro" };

export const ThemeButton = ({ compact = false }: { compact?: boolean }) => {
  const { theme, toggle } = useTheme(THEME_KEY);
  const destination = LABEL[theme === "light" ? "dark" : "light"];

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Mudar para o tema ${destination}`}
      title={`Tema ${destination}`}
      className={cn(
        "flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-zinc-700 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400",
        compact ? "w-11 justify-center" : "px-4",
      )}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {theme === "light" ? (
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M5.2 18.8l1.6-1.6M17.2 6.8l1.6-1.6" />
          </>
        )}
      </svg>
      {!compact && <span>Tema {destination}</span>}
    </button>
  );
};
