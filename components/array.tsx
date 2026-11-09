type ArrayProps = {
  arr: number[];
  middle: number;
  target: number;
};

export const ArrayVisual = ({ arr, middle, target }: ArrayProps) => {
  return (
    <div className="flex flex-wrap gap-1.5">
      {arr.map((item) => {
        const style =
          item === middle
            ? item === target
              ? "bg-emerald-500 text-emerald-950 font-semibold ring-2 ring-emerald-300"
              : "bg-amber-500 text-amber-950 font-semibold ring-2 ring-amber-300"
            : "bg-zinc-800 text-zinc-400";
        return (
          <div
            key={item}
            className={`flex h-10 min-w-10 items-center justify-center rounded-lg px-2 font-mono text-sm tabular-nums transition-colors ${style}`}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};
