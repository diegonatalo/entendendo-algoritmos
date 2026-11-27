"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { neighbors, pageCode, type Chapter } from "@/lib/chapters";
import { cn } from "@/lib/cn";

const Item = ({ page, direction }: { page: Chapter; direction: "previous" | "next" }) => (
  <Link
    href={page.href}
    className={cn(
      "flex min-w-0 flex-1 basis-60 flex-col gap-0.5 rounded-2xl border border-zinc-800 px-5 py-4 transition-colors hover:border-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400",
      direction === "next" && "text-right",
    )}
  >
    <span className="font-mono text-xs text-zinc-500">
      {direction === "previous" ? `← Anterior · ${pageCode(page)}` : `Próximo · ${pageCode(page)} →`}
    </span>
    <span className="font-semibold">{page.title}</span>
  </Link>
);

/** No fim de cada lição: a página anterior e a seguinte, na ordem do livro. */
export const LessonNav = () => {
  const { previous, next } = neighbors(usePathname());
  if (!previous && !next) return null;

  return (
    <nav aria-label="Outras lições" className="mx-auto w-full max-w-5xl px-5 pb-16 sm:px-10">
      <div className="flex flex-wrap gap-3 border-t border-zinc-800 pt-8">
        {previous && <Item page={previous} direction="previous" />}
        {next && <Item page={next} direction="next" />}
      </div>
    </nav>
  );
};
