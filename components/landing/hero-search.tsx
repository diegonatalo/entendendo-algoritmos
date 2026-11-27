"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/cn";
import { DEMO_LIST, DEMO_TARGET, maxAttempts, searchDemo } from "@/lib/landing";

const STEPS = searchDemo();
// o último passo fica na tela por mais um tique antes de recomeçar
const TICKS = STEPS.length + 1;

const pointer = (index: number, step: (typeof STEPS)[number]) => {
  if (index === step.middle) return step.found ? "achou" : "meio";
  if (index === step.start) return "início";
  if (index === step.end) return "fim";
  return "";
};

/** A busca binária do hero, tocando sozinha. Pausa no botão; não anima com movimento reduzido. */
export const HeroSearch = () => {
  const reducedMotion = useReducedMotion();
  const [tick, setTick] = useState(0);
  // null: segue o sistema (anima, a menos que a pessoa tenha pedido menos movimento)
  const [choice, setChoice] = useState<boolean | null>(null);
  const playing = choice ?? !reducedMotion;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTick((t) => (t + 1) % TICKS), 1600);
    return () => clearInterval(id);
  }, [playing]);

  const current = Math.min(tick, STEPS.length - 1);
  const step = STEPS[current];

  return (
    <figure className="m-0 flex flex-col gap-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-[0_40px_90px_-40px_rgb(0_0_0/0.6)] sm:p-7">
      <div className="flex flex-wrap items-center gap-3">
        <span aria-hidden className={cn("h-2 w-2 rounded-full bg-emerald-400", playing && "animate-blink")} />
        <span className="font-mono text-sm font-semibold">buscaBinaria(lista, {DEMO_TARGET})</span>
        <span className="ml-auto font-mono text-xs text-zinc-500" aria-live="polite">
          passo {current + 1} de {STEPS.length}
        </span>
        <button
          type="button"
          onClick={() => setChoice(!playing)}
          aria-label={playing ? "Pausar a animação" : "Continuar a animação"}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-zinc-700 hover:border-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            {playing ? (
              <>
                <rect x="5" y="4" width="5" height="16" rx="1.5" />
                <rect x="14" y="4" width="5" height="16" rx="1.5" />
              </>
            ) : (
              <path d="M7 4.5v15l12-7.5z" />
            )}
          </svg>
        </button>
      </div>

      <div
        role="img"
        aria-label={`Lista de ${DEMO_LIST.length} números ordenados. No passo ${current + 1}, o meio é ${step.value}.`}
        className="flex gap-[3px] sm:gap-1.5"
      >
        {DEMO_LIST.map((value, index) => {
          const out = index < step.start || index > step.end;
          const middle = index === step.middle;
          return (
            <div key={value} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <span
                className={cn(
                  "flex h-10 w-full items-center justify-center rounded-md border font-mono text-[11px] transition-all duration-500 sm:h-13 sm:rounded-[10px] sm:text-[15px]",
                  out && "border-zinc-800 text-zinc-500 line-through opacity-35",
                  !out && !middle && "border-zinc-700 bg-zinc-800 text-zinc-100",
                  middle &&
                    "-translate-y-1.5 border-emerald-400 bg-emerald-400 font-bold text-emerald-950 shadow-[0_14px_34px_-12px_rgb(52_211_153/0.7)]",
                )}
              >
                {value}
              </span>
              <span className="h-4 font-mono text-[9px] font-semibold text-violet-400 sm:text-[11px]">
                {pointer(index, step)}
              </span>
            </div>
          );
        })}
      </div>

      <p className="m-0 rounded-xl bg-emerald-400/10 px-4 py-3.5 font-mono text-sm">{step.verdict}</p>

      <ol className="m-0 flex list-none flex-col gap-0.5 p-0">
        {STEPS.map((s, i) => (
          <li
            key={s.value}
            className={cn(
              "flex gap-3 rounded-lg px-3 py-1.5 font-mono text-xs transition-opacity sm:text-[13px]",
              i === current && "bg-zinc-800",
              i > current && "opacity-30",
              i < current && "opacity-70",
            )}
          >
            <span className="w-4 text-zinc-500">{i + 1}</span>
            <span className="flex-1">meio = {s.value}</span>
            <span className="text-zinc-500">
              {s.found ? "achou" : s.value < DEMO_TARGET ? "descarta a esquerda" : "descarta a direita"}
            </span>
          </li>
        ))}
      </ol>

      <figcaption className="flex flex-wrap justify-between gap-3 border-t border-dashed border-zinc-700 pt-4 text-sm text-zinc-400">
        <span>
          {DEMO_LIST.length} itens → no máximo <b className="text-zinc-100">{maxAttempts(DEMO_LIST.length)} passos</b>
        </span>
        <span>
          1 bilhão → no máximo <b className="text-emerald-400">{maxAttempts(1_000_000_000)} passos</b>
        </span>
      </figcaption>
    </figure>
  );
};
