export const Stat = ({
  label,
  value,
  tone,
  small: small,
}: {
  label: string;
  value: string;
  tone: string;
  small?: boolean;
}) => {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div
        className={`mt-1 font-semibold ${small ? "text-base leading-8" : "text-2xl"} ${tone}`}
      >
        {value}
      </div>
    </div>
  );
};

export const Legend = ({ color, text }: { color: string; text: string }) => {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded ${color}`} />
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
        className="overflow-x-auto rounded-lg focus-visible:outline-2 focus-visible:outline-emerald-400"
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
  "cursor-pointer whitespace-nowrap rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-700 disabled:hover:text-zinc-300";

export const primaryButton =
  "cursor-pointer rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:bg-emerald-600";

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
  "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30";

export const inputMono = inputClass.replace("text-zinc-100", "font-mono text-zinc-100");
