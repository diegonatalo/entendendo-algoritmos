import { cn } from "@/lib/cn";

export const Stat = ({
  label,
  value,
  tone,
  small,
}: {
  label: string;
  value: string;
  tone: string;
  small?: boolean;
}) => {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="text-sm text-zinc-500">{label}</div>
      <div
        className={cn(
          "mt-1 font-display font-bold tracking-tight",
          small ? "text-base leading-8" : "text-3xl",
          tone,
        )}
      >
        {value}
      </div>
    </div>
  );
};

export const Legend = ({ color, text }: { color: string; text: string }) => {
  return (
    <span className="flex items-center gap-2">
      <span className={cn("h-3.5 w-3.5 rounded", color)} />
      {text}
    </span>
  );
};

// Gráficos em SVG encolhem junto com a tela e o texto dentro deles ficaria ilegível no
// celular. Aqui o gráfico mantém uma largura mínima (a da escala natural) e rola para os lados.
export const ScrollableChart = ({
  minWidthValue,
  children,
}: {
  minWidthValue: number;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div
        tabIndex={0}
        role="region"
        aria-label="Gráfico, use as setas para rolar"
        className="overflow-x-auto rounded-lg focus-visible:outline-2 focus-visible:outline-violet-400"
      >
        <div style={{ minWidth: minWidthValue }}>{children}</div>
      </div>
      <p className="text-center text-xs text-zinc-400 sm:hidden">
        Arraste para os lados para ver o gráfico inteiro.
      </p>
    </div>
  );
};

export const navigationButton =
  "inline-flex min-h-11 cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-zinc-700 px-5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-700 disabled:hover:text-zinc-300";

export const primaryButton =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-emerald-400 px-6 font-semibold text-emerald-950 transition hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-[0_14px_34px_-12px_rgb(52_211_153/0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 active:translate-y-0 active:bg-emerald-500";

/** Botão de contorno, para a ação secundária ao lado do `primaryButton`. */
export const secondaryButton =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-zinc-700 px-6 font-semibold text-zinc-100 transition-colors hover:border-zinc-500 hover:bg-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400";

export const StepControls = ({
  currentStep,
  total,
  onChange,
  goToEnd = true,
}: {
  currentStep: number;
  total: number;
  onChange: (step: number) => void;
  goToEnd?: boolean;
}) => {
  const final = currentStep >= total - 1;
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={navigationButton}
        disabled={currentStep === 0}
        onClick={() => onChange(currentStep - 1)}
      >
        ← Anterior
      </button>
      <button
        className={navigationButton}
        disabled={final}
        onClick={() => onChange(currentStep + 1)}
      >
        Próximo →
      </button>
      {goToEnd && (
        <button
          className={navigationButton}
          disabled={final}
          onClick={() => onChange(total - 1)}
        >
          Ir ao fim
        </button>
      )}
    </div>
  );
};

export const inputClass =
  "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20";

export const inputMono = inputClass.replace("text-zinc-100", "font-mono text-zinc-100");
