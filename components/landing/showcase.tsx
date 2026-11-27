import Link from "next/link";
import type { ReactNode } from "react";
import { chapters, pageCode } from "@/lib/chapters";
import { cn } from "@/lib/cn";

// os preenchimentos usam o hex do esmeralda direto: as classes fill-emerald-* escurecem no
// tema claro (para texto), e aqui são formas com texto escuro por cima
const HL_FILL = "fill-[#34d399]";
const HL_STROKE = "stroke-[#34d399]";

const page = (href: string) => {
  const found = chapters.find((c) => c.href === href);
  if (!found) throw new Error(`Página da vitrine não registrada: ${href}`);
  return found;
};

const Tile = ({ href, text, wide, children }: { href: string; text: string; wide?: boolean; children: ReactNode }) => {
  const chapter = page(href);
  return (
    <Link
      href={href}
      className={cn(
        "group flex min-w-0 flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 transition hover:-translate-y-1 hover:border-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 sm:p-7",
        wide && "md:col-span-2",
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="m-0 text-2xl font-bold leading-tight">{chapter.title}</h3>
        <span className="whitespace-nowrap font-mono text-xs text-zinc-500">{pageCode(chapter)}</span>
      </div>
      <p className="m-0 text-[15px] text-zinc-400">{text}</p>
      <div className="flex min-h-56 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        {children}
      </div>
    </Link>
  );
};

const Cell = ({ children, tone = "base" }: { children: ReactNode; tone?: "base" | "hl" | "vi" }) => (
  <span
    className={cn(
      "rounded-lg py-2.5",
      tone === "base" && "bg-zinc-800",
      tone === "hl" && "bg-[#34d399] font-bold text-emerald-950",
      tone === "vi" && "bg-violet-400/15 font-semibold text-violet-400 outline-[1.5px] outline-violet-400 outline",
    )}
  >
    {children}
  </span>
);

const Chip = ({ children, tone = "base" }: { children: ReactNode; tone?: "base" | "hl" | "vi" | "pivot" }) => (
  <span
    className={cn(
      "rounded-lg px-2.5 py-1.5",
      tone === "base" && "bg-zinc-800",
      tone === "hl" && "bg-[#34d399] text-emerald-950",
      tone === "vi" && "bg-violet-400/15 text-violet-400",
      tone === "pivot" && "border-[1.5px] border-emerald-400 font-bold text-emerald-400",
    )}
  >
    {children}
  </span>
);

const Dijkstra = () => (
  <svg viewBox="0 0 560 240" className="w-full max-w-xl" role="img" aria-label="Grafo com o caminho Início, B, A, Fim destacado, custo total 6">
    <g className="fill-none stroke-zinc-700" strokeWidth="2">
      <path d="M64 120 L280 46" />
      <path d="M280 194 L496 120" />
    </g>
    <g className={cn("fill-none", HL_STROKE)} strokeWidth="4" strokeLinecap="round">
      <path d="M64 120 L280 194" />
      <path d="M280 194 L280 46" />
      <path d="M280 46 L496 120" />
    </g>
    <g className="font-mono text-[13px] font-bold" textAnchor="middle">
      {[
        { x: 170, y: 77, w: "6", hl: false },
        { x: 170, y: 163, w: "2", hl: true },
        { x: 280, y: 120, w: "3", hl: true },
        { x: 388, y: 77, w: "1", hl: true },
        { x: 388, y: 163, w: "5", hl: false },
      ].map((edge) => (
        <g key={`${edge.x}-${edge.y}`}>
          <rect x={edge.x - 14} y={edge.y - 11} width="28" height="22" rx="6" className={edge.hl ? HL_FILL : "fill-zinc-900 stroke-zinc-700"} />
          <text x={edge.x} y={edge.y + 5} className={edge.hl ? "fill-emerald-950" : "fill-zinc-400"}>
            {edge.w}
          </text>
        </g>
      ))}
    </g>
    <g className="text-xs font-semibold" textAnchor="middle">
      {[
        { x: 64, y: 120, label: "Início" },
        { x: 280, y: 46, label: "A" },
        { x: 280, y: 194, label: "B" },
      ].map((node) => (
        <g key={node.label}>
          <circle cx={node.x} cy={node.y} r="30" className={cn("fill-zinc-800", HL_STROKE)} strokeWidth="2.5" />
          <text x={node.x} y={node.y + 4} className="fill-zinc-50">
            {node.label}
          </text>
        </g>
      ))}
      <circle cx="496" cy="120" r="30" className={HL_FILL} />
      <text x="496" y="124" className="fill-emerald-950">
        Fim
      </text>
    </g>
    <g className="fill-violet-400 font-mono text-xs font-semibold">
      <text x="64" y="172" textAnchor="middle">custo 0</text>
      <text x="336" y="40">custo 5</text>
      <text x="336" y="214">custo 2</text>
      <text x="496" y="172" textAnchor="middle">custo 6</text>
    </g>
  </svg>
);

const Knapsack = () => (
  <div aria-hidden className="grid w-full grid-cols-[72px_repeat(4,minmax(0,1fr))] gap-1 text-center font-mono text-xs">
    <span />
    {[1, 2, 3, 4].map((n) => (
      <span key={n} className="text-zinc-500">
        {n}
      </span>
    ))}
    <span className="py-2.5 text-left text-zinc-400">Guitarra</span>
    <Cell>1500</Cell>
    <Cell>1500</Cell>
    <Cell>1500</Cell>
    <Cell>1500</Cell>
    <span className="py-2.5 text-left text-zinc-400">Som</span>
    <Cell tone="vi">1500</Cell>
    <Cell>1500</Cell>
    <Cell>1500</Cell>
    <Cell>3000</Cell>
    <span className="py-2.5 text-left text-zinc-400">Notebook</span>
    <Cell>1500</Cell>
    <Cell>1500</Cell>
    <Cell>2000</Cell>
    <Cell tone="hl">3500</Cell>
  </div>
);

const Knn = () => (
  <svg viewBox="0 0 300 200" className="w-full" role="img" aria-label="Gráfico de pontos: o ponto novo é ligado aos três vizinhos mais próximos">
    <circle cx="150" cy="104" r="56" className="fill-emerald-400/10 stroke-emerald-400" strokeWidth="1.5" strokeDasharray="5 5" />
    <g className="stroke-emerald-400" strokeWidth="1.5">
      <path d="M150 104 L118 82" />
      <path d="M150 104 L126 136" />
      <path d="M150 104 L186 118" />
    </g>
    <g className={HL_FILL}>
      {[
        [118, 82],
        [126, 136],
        [72, 120],
        [58, 70],
        [92, 160],
        [40, 150],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="8" />
      ))}
    </g>
    <g className="fill-violet-400">
      {[
        [186, 118],
        [226, 64],
        [250, 120],
        [206, 36],
        [262, 170],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="8" />
      ))}
    </g>
    <rect x="141" y="95" width="18" height="18" rx="4" className="fill-zinc-50" />
    <text x="150" y="108" textAnchor="middle" className="fill-zinc-950 font-mono text-xs font-bold">
      ?
    </text>
  </svg>
);

const Hash = () => (
  <ol aria-hidden className="m-0 flex w-full list-none flex-col gap-1.5 p-0 font-mono text-xs">
    {[
      { i: 0, items: [["maçã · 0,67", "base"]] },
      { i: 1, items: [] },
      { i: 2, items: [["leite · 1,49", "base"], ["abacate", "vi"]] },
      { i: 3, items: [] },
      { i: 4, items: [["ovos · 3,20", "hl"]] },
    ].map((bucket) => (
      <li key={bucket.i} className="flex items-center gap-2">
        <span className="w-4 text-zinc-500">{bucket.i}</span>
        {bucket.items.length === 0 ? (
          <span className="h-7 flex-1 rounded-lg border border-dashed border-zinc-700" />
        ) : (
          bucket.items.map(([label, tone], j) => (
            <span key={label} className="flex items-center gap-2">
              {j > 0 && <span className="text-violet-400">→</span>}
              <Chip tone={tone as "base" | "hl" | "vi"}>{label}</Chip>
            </span>
          ))
        )}
      </li>
    ))}
    <li className="mt-1 text-zinc-500">carga 3/5 = 0,6</li>
  </ol>
);

const Quicksort = () => (
  <div aria-hidden className="flex flex-col items-center gap-3.5 font-mono text-[13px]">
    <div className="flex gap-1">
      <Chip>33</Chip>
      <Chip>10</Chip>
      <Chip tone="hl">15</Chip>
      <Chip>7</Chip>
      <Chip>21</Chip>
    </div>
    <svg width="160" height="18" viewBox="0 0 160 18" className="fill-none stroke-zinc-700" strokeWidth="1.5">
      <path d="M80 0 V8 M20 18 V8 H140 V18 M80 8 V18" />
    </svg>
    <div className="flex gap-3">
      <span className="flex gap-1">
        <Chip tone="vi">10</Chip>
        <Chip tone="vi">7</Chip>
      </span>
      <Chip tone="pivot">15</Chip>
      <span className="flex gap-1">
        <Chip tone="vi">33</Chip>
        <Chip tone="vi">21</Chip>
      </span>
    </div>
    <div className="mt-1 flex gap-1">
      {[7, 10, 15, 21, 33].map((n) => (
        <Chip key={n} tone="hl">
          {n}
        </Chip>
      ))}
    </div>
  </div>
);

const BigO = () => (
  <svg viewBox="0 0 620 230" className="w-full" role="img" aria-label="Curvas de crescimento: O de 1, log n, n, n log n e n ao quadrado">
    <path d="M30 20 V200 H600" className="fill-none stroke-zinc-800" />
    <g className="fill-none" strokeWidth="2.5" strokeLinecap="round">
      <path d="M30 192 L540 192" className="stroke-zinc-500" />
      <path d="M30 200 C 70 160, 220 150, 540 140" className={HL_STROKE} strokeWidth="5" />
      <path d="M30 200 L540 82" className="stroke-zinc-500" />
      <path d="M30 200 C 240 170, 420 100, 540 34" className="stroke-violet-400" />
      <path d="M30 200 C 220 196, 330 140, 400 14" className="stroke-zinc-400" strokeDasharray="2 6" />
    </g>
    <g className="font-mono text-[13px] font-semibold">
      <text x="550" y="196" className="fill-zinc-500">O(1)</text>
      <text x="550" y="145" className="fill-emerald-400">O(log n)</text>
      <text x="550" y="86" className="fill-zinc-500">O(n)</text>
      <text x="550" y="38" className="fill-violet-400">O(n log n)</text>
      <text x="410" y="18" className="fill-zinc-400">O(n²)</text>
    </g>
  </svg>
);

const SHOWN = ["/app/dijkstra", "/app/programacao-dinamica", "/app/knn", "/app/tabela-hash", "/app/quicksort", "/app/big-o"];

/** A vitrine: seis visualizações desenhadas e um atalho para as demais. */
export const Showcase = () => {
  const others = chapters.filter((c) => !SHOWN.includes(c.href));
  return (
    <div className="mt-14 grid gap-5 md:grid-cols-3">
      <Tile href="/app/dijkstra" text="O caminho mais barato num grafo com pesos, nó por nó." wide>
        <Dijkstra />
      </Tile>
      <Tile href="/app/programacao-dinamica" text="A mochila preenchida célula por célula.">
        <Knapsack />
      </Tile>
      <Tile href="/app/knn" text="A fruta nova ganha a classe dos vizinhos.">
        <Knn />
      </Tile>
      <Tile href="/app/tabela-hash" text="Baldes, colisões e fator de carga.">
        <Hash />
      </Tile>
      <Tile href="/app/quicksort" text="Pivô, menores, maiores e a junção.">
        <Quicksort />
      </Tile>
      <Tile href="/app/big-o" text="Como o custo cresce quando a entrada cresce." wide>
        <BigO />
      </Tile>
      <Link
        href="/app"
        className="flex flex-col gap-4 rounded-3xl border border-dashed border-zinc-700 p-6 transition-colors hover:border-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 sm:p-7"
      >
        <h3 className="m-0 text-2xl font-bold leading-tight">E mais {others.length} visualizações</h3>
        <ul aria-hidden className="m-0 flex list-none flex-wrap gap-2 p-0">
          {others.slice(0, 9).map((c) => (
            <li key={c.href} className="rounded-full border border-zinc-700 px-3 py-1.5 text-[13px] text-zinc-400">
              {c.title}
            </li>
          ))}
        </ul>
        <span className="mt-auto font-semibold text-emerald-400">Ver todos os capítulos →</span>
      </Link>
    </div>
  );
};
