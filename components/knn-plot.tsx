import type { ReactNode } from "react";
import { ScrollableChart } from "@/components/ui";

type Point = { x: number; y: number };

// o gráfico usa a área de 15..115 (x) e 5..105 (y) do viewBox; dados de 0 a 100
const OFFSET_X = 15;
const BASE_Y = 105;

export const plotX = (x: number) => OFFSET_X + x;
export const plotY = (y: number) => BASE_Y - y;

const clamp = (value: number) => Math.round(Math.min(100, Math.max(0, value)));

const smallButton =
  "cursor-pointer rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40";

type KnnControlsProps = {
  k: number;
  onKChange: (k: number) => void;
  randomLabel: string;
  onRandom: () => void;
  onClear?: () => void;
};

/** Escolha de k e botões para sortear e limpar o ponto novo. */
export const KnnControls = ({
  k,
  onKChange,
  randomLabel,
  onRandom,
  onClear,
}: KnnControlsProps) => (
  <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
    <label className="flex items-center justify-between text-sm text-zinc-300">
      <span>Número de vizinhos (k)</span>
      <span className="font-mono text-lg text-emerald-400">{k}</span>
    </label>
    <input
      type="range"
      min={1}
      max={9}
      step={1}
      value={k}
      onChange={(e) => onKChange(Number(e.target.value))}
      className="w-full accent-emerald-500"
      aria-label="Número de vizinhos (k)"
    />
    <div className="flex gap-2">
      <button className={smallButton} onClick={onRandom}>
        {randomLabel}
      </button>
      <button className={smallButton} disabled={!onClear} onClick={onClear}>
        Limpar
      </button>
    </div>
  </div>
);

type KnnPlotProps = {
  label: string;
  minWidth: number;
  xLabel: string;
  yLabel: string;
  /** Ponto novo e seus vizinhos: desenha as ligações e o círculo até o k-ésimo. */
  created: Point | null;
  neighbors: Point[];
  onPick: (point: Point) => void;
  /** Pontos de dados e o ponto novo, desenhados por cima da grade. */
  children: ReactNode;
};

/** Plano 100 × 100 do KNN: clique para escolher o ponto novo. */
export const KnnPlot = ({
  label,
  minWidth,
  xLabel,
  yLabel,
  created,
  neighbors,
  onPick,
  children,
}: KnnPlotProps) => {
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const location = point.matrixTransform(svg.getScreenCTM()!.inverse());
    onPick({ x: clamp(location.x - OFFSET_X), y: clamp(BASE_Y - location.y) });
  };

  const last = neighbors[neighbors.length - 1];
  const radius =
    created && last ? Math.hypot(last.x - created.x, last.y - created.y) : 0;

  return (
    <ScrollableChart minWidthValue={minWidth}>
      <svg
        viewBox="0 0 120 115"
        className="mx-auto w-full max-w-xl cursor-crosshair"
        role="img"
        aria-label={label}
        onClick={handleClick}
      >
        <rect
          x={OFFSET_X}
          y={5}
          width={100}
          height={100}
          rx={2}
          className="fill-zinc-950 stroke-zinc-700"
          strokeWidth={0.5}
        />
        {[25, 50, 75].map((g) => (
          <g key={g}>
            <line
              x1={plotX(g)}
              x2={plotX(g)}
              y1={5}
              y2={105}
              className="stroke-zinc-800"
              strokeWidth={0.3}
            />
            <line
              x1={OFFSET_X}
              x2={115}
              y1={plotY(g)}
              y2={plotY(g)}
              className="stroke-zinc-800"
              strokeWidth={0.3}
            />
          </g>
        ))}
        <text x={65} y={113} textAnchor="middle" fontSize={4} className="fill-zinc-500">
          {xLabel} →
        </text>
        <text
          x={5}
          y={55}
          textAnchor="middle"
          fontSize={4}
          transform="rotate(-90 5 55)"
          className="fill-zinc-500"
        >
          {yLabel} →
        </text>

        {created && neighbors.length > 0 && (
          <>
            <circle
              cx={plotX(created.x)}
              cy={plotY(created.y)}
              r={radius}
              className="fill-zinc-100/5 stroke-zinc-500"
              strokeWidth={0.4}
              strokeDasharray="2 2"
            />
            {neighbors.map((point, i) => (
              <line
                key={i}
                x1={plotX(created.x)}
                y1={plotY(created.y)}
                x2={plotX(point.x)}
                y2={plotY(point.y)}
                className="stroke-zinc-400"
                strokeWidth={0.5}
              />
            ))}
          </>
        )}

        {children}
      </svg>
    </ScrollableChart>
  );
};
