import { cn } from "@/lib/cn";

type ArrayProps = {
  arr: number[];
  middle: number;
  target: number;
};

export const ArrayVisual = ({ arr, middle, target }: ArrayProps) => {
  return (
    <div className="flex flex-wrap gap-1.5">
      {arr.map((item) => (
        <div
          key={item}
          className={cn(
            "flex h-11 min-w-11 items-center justify-center rounded-[10px] border px-2 font-mono text-sm tabular-nums transition-all",
            item !== middle && "border-zinc-700 bg-zinc-900 text-zinc-300",
            item === middle &&
              item === target &&
              "-translate-y-1 border-emerald-400 bg-emerald-400 font-semibold text-emerald-950 shadow-[0_12px_30px_-12px_rgb(52_211_153/0.7)]",
            item === middle && item !== target && "border-amber-400 bg-amber-400 font-semibold text-amber-950",
          )}
        >
          {item}
        </div>
      ))}
    </div>
  );
};
