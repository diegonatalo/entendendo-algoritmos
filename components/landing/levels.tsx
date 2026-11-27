"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { CODES } from "@/lib/codes";
import { LEVEL_EXAMPLE, PERKS } from "@/lib/landing";

type Level = "simple" | "technique" | "code";
const LEVELS: { id: Level; label: string }[] = [
  { id: "simple", label: PERKS[0].title },
  { id: "technique", label: PERKS[1].title },
  { id: "code", label: PERKS[2].title },
];

/** O código com os comentários (`// ...`) apagados, como no bloco de código das lições. */
const Code = ({ code }: { code: string }) => (
  <pre tabIndex={0} className="m-0 overflow-x-auto font-mono text-[13px] leading-7 text-zinc-300 focus-visible:outline-2 focus-visible:outline-violet-400">
    <code>
      {code.split("\n").map((line, i) => {
        const comment = line.indexOf("//");
        return (
          <span key={i} className="block">
            {comment === -1 ? line || " " : line.slice(0, comment)}
            {comment !== -1 && <span className="italic text-zinc-500">{line.slice(comment)}</span>}
          </span>
        );
      })}
    </code>
  </pre>
);

/** As três abas da seção de níveis: a mesma busca binária contada de três jeitos. */
export const Levels = () => {
  const [level, setLevel] = useState<Level>("simple");
  const panelId = useId();

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">
      <div role="group" aria-label="Nível da explicação" className="flex gap-1 rounded-full border border-zinc-800 bg-zinc-950 p-1">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            type="button"
            aria-pressed={level === l.id}
            aria-controls={panelId}
            onClick={() => setLevel(l.id)}
            className={cn(
              "min-h-11 flex-1 cursor-pointer rounded-full text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400",
              level === l.id ? "bg-emerald-400 text-emerald-950" : "text-zinc-400 hover:text-zinc-50",
            )}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div id={panelId} aria-live="polite" className="min-h-80 px-1 sm:px-2">
        {level === "simple" && (
          <div className="flex flex-col gap-4">
            <p className="m-0 font-display text-3xl font-semibold tracking-tight">{LEVEL_EXAMPLE.simple.lead}</p>
            <p className="m-0 text-lg text-zinc-400">{LEVEL_EXAMPLE.simple.text}</p>
            <p className="m-0 rounded-2xl bg-emerald-400/10 px-4 py-3.5">{LEVEL_EXAMPLE.simple.note}</p>
          </div>
        )}
        {level === "technique" && (
          <div className="flex flex-col gap-4">
            <p className="m-0 font-display text-3xl font-semibold tracking-tight">{LEVEL_EXAMPLE.technique.lead}</p>
            <p className="m-0 text-lg text-zinc-400">{LEVEL_EXAMPLE.technique.text}</p>
            <dl className="m-0 grid grid-cols-3 gap-2 text-center font-mono text-xs">
              {LEVEL_EXAMPLE.technique.samples.map((sample, i, all) => (
                <div
                  key={sample.label}
                  className={cn(
                    "rounded-2xl px-2 py-3",
                    i === all.length - 1 ? "bg-emerald-400 text-emerald-950" : "bg-zinc-800",
                  )}
                >
                  <dt>{sample.label}</dt>
                  <dd className="m-0 text-lg font-bold">{sample.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        {level === "code" && <Code code={CODES.binarySearch} />}
      </div>
    </div>
  );
};
