"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { chapterGroups, chapters, pageCode } from "@/lib/chapters";

/** Acima de cada lição: o caminho até ela (capítulos, capítulo do livro) e o código da página. */
export const LessonTrail = () => {
  const pathname = usePathname();
  const page = chapters.find((c) => c.href === pathname);
  if (!page) return null;
  const group = chapterGroups().find((g) => g.number === page.number);

  return (
    <nav aria-label="Você está em" className="mx-auto w-full max-w-5xl px-5 pt-8 sm:px-10 sm:pt-12">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-[13px] text-zinc-500">
        <li>
          <Link href="/app" className="rounded text-zinc-400 hover:text-emerald-400 focus-visible:outline-2 focus-visible:outline-violet-400">
            Capítulos
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li>
          {String(page.number).padStart(2, "0")} · {group?.name}
        </li>
        <li aria-hidden>/</li>
        <li aria-current="page" className="text-emerald-400">
          {pageCode(page)}
        </li>
      </ol>
    </nav>
  );
};
