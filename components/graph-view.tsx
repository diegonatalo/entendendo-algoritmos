import { useId } from "react";
import { ScrollableChart } from "@/components/ui";

type Point = { x: number; y: number };

/** `path` destaca a aresta no caminho final; `current` é a aresta analisada no passo. */
export type EdgeTone = "idle" | "path" | "current";

export type GraphEdge = {
  from: string;
  to: string;
  label?: string | number;
  tone?: EdgeTone;
  /** Cor do rótulo; o padrão segue o tom da aresta. */
  labelClassName?: string;
};

export type GraphNode = {
  name: string;
  /** Classes do círculo (preenchimento e borda). */
  className: string;
  textClassName: string;
  /** Segunda linha dentro do nó, como o custo atual. */
  value?: { text: string; className: string };
};

type GraphViewProps = {
  label: string;
  width: number;
  height: number;
  radius: number;
  positions: Record<string, Point>;
  nodes: GraphNode[];
  edges: GraphEdge[];
  className?: string;
  nodeFontSize?: number;
  edgeFontSize?: number;
  /** Onde o rótulo fica ao longo da aresta (0 = origem, 1 = destino). */
  labelAt?: number;
};

const STROKE: Record<EdgeTone, string> = {
  idle: "stroke-zinc-600",
  path: "stroke-emerald-400",
  current: "stroke-amber-400",
};

const ARROW: Record<EdgeTone, string> = {
  idle: "fill-zinc-500",
  path: "fill-emerald-400",
  current: "fill-amber-400",
};

const LABEL: Record<EdgeTone, string> = {
  idle: "fill-zinc-400",
  path: "fill-emerald-300",
  current: "fill-amber-300",
};

const TONES = Object.keys(STROKE) as EdgeTone[];

/** Grafo dirigido em SVG: nós em círculo e arestas com seta, peso e destaque. */
export const GraphView = ({
  label,
  width,
  height,
  radius,
  positions,
  nodes,
  edges,
  className = "mx-auto w-full max-w-xl",
  nodeFontSize = 11,
  edgeFontSize = 13,
  labelAt = 0.5,
}: GraphViewProps) => {
  const id = useId();
  const arrowId = (tone: EdgeTone) => `${id}-${tone}`;

  return (
    <ScrollableChart minWidthValue={width}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={className}
        role="img"
        aria-label={label}
      >
        <defs>
          {TONES.map((tone) => (
            <marker
              key={tone}
              id={arrowId(tone)}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" className={ARROW[tone]} />
            </marker>
          ))}
        </defs>

        {edges.map(({ from, to, label: weight, tone = "idle", labelClassName }) => {
          const a = positions[from];
          const b = positions[to];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy);
          // arestas em sentidos opostos ficam lado a lado
          const opposite = edges.some((e) => e.from === to && e.to === from);
          const ox = opposite ? (dy / d) * 8 : 0;
          const oy = opposite ? (-dx / d) * 8 : 0;
          const side = opposite ? 22 : 14;
          const highlighted = tone !== "idle";
          return (
            <g key={`${from}-${to}`}>
              <line
                x1={a.x + (dx / d) * radius + ox}
                y1={a.y + (dy / d) * radius + oy}
                x2={b.x - (dx / d) * (radius + 2) + ox}
                y2={b.y - (dy / d) * (radius + 2) + oy}
                strokeWidth={highlighted ? 3 : 1.5}
                className={STROKE[tone]}
                markerEnd={`url(#${arrowId(tone)})`}
              />
              {weight !== undefined && (
                <text
                  x={a.x + dx * labelAt + (dy / d) * side}
                  y={a.y + dy * labelAt - (dx / d) * side}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={edgeFontSize}
                  className={`font-mono font-semibold ${labelClassName ?? LABEL[tone]}`}
                >
                  {weight}
                </text>
              )}
            </g>
          );
        })}

        {nodes.map(({ name, className: circle, textClassName, value }) => {
          const { x, y } = positions[name];
          return (
            <g key={name}>
              <circle
                cx={x}
                cy={y}
                r={radius}
                strokeWidth={2}
                className={`transition-colors ${circle}`}
              />
              <text
                x={x}
                y={value ? y - 5 : y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={nodeFontSize}
                className={`font-mono ${textClassName}`}
              >
                {name}
              </text>
              {value && (
                <text
                  x={x}
                  y={y + 9}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={10}
                  className={`font-mono font-semibold ${value.className}`}
                >
                  {value.text}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </ScrollableChart>
  );
};
