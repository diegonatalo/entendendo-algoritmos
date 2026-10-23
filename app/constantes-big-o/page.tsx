"use client";

import {
  formatarDuracao,
  pontoDeCruzamento,
  tempoLinear,
  tempoLogaritmico,
} from "@/functions/constantes";
import { useState } from "react";
import { GraficoRolavel, Stat } from "../components/ui";
import { Explicacao } from "../components/explicacao";
import { EXPLICACOES } from "../explicacoes";

const EXPOENTES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const LARGURA = 500;
const ALTURA = 260;
const M = { esq: 52, dir: 12, topo: 10, base: 28 };

const inputClass =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 font-mono text-zinc-100 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30";

const fmtN = (n: number) => n.toLocaleString("pt-BR");

export default function ConstantesBigO() {
  const [linearMs, setLinearMs] = useState(1);
  const [logMs, setLogMs] = useState(1000);
  const [expoente, setExpoente] = useState(3);

  const n = 10 ** expoente;
  const tLinear = tempoLinear(n, linearMs);
  const tLog = tempoLogaritmico(n, logMs);
  const cruzamento = pontoDeCruzamento(linearMs, logMs);

  // gráfico: eixo x = expoente (n = 10^x), eixo y = log10 do tempo em ms
  const serie = (f: (n: number) => number) =>
    EXPOENTES.map((e) => Math.log10(Math.max(f(10 ** e), 1e-3)));
  const sLinear = serie((x) => tempoLinear(x, linearMs));
  const sLog = serie((x) => tempoLogaritmico(x, logMs));
  const yMin = Math.floor(Math.min(...sLinear, ...sLog));
  const yMax = Math.ceil(Math.max(...sLinear, ...sLog));
  const gx = (e: number) => M.esq + ((e - 1) / 9) * (LARGURA - M.esq - M.dir);
  const gy = (v: number) =>
    ALTURA - M.base - ((v - yMin) / Math.max(yMax - yMin, 1)) * (ALTURA - M.topo - M.base);
  const ticksY = Array.from({ length: yMax - yMin + 1 }, (_, i) => yMin + i).filter(
    (_, i, arr) => arr.length <= 8 || i % 2 === 0,
  );

  const vencedor = tLinear < tLog ? "linear" : "log";

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Constantes escondidas</h1>
        <p className="text-zinc-400">
          A notação Big O descarta a constante: O(n) significa &quot;n vezes algum
          tempo fixo&quot;. Quase sempre isso basta, mas às vezes a constante
          decide quem vence. Imagine uma busca simples que gasta 1 ms por item
          e uma busca binária que gasta 1 s por passo (porque, por exemplo,
          cada passo exige uma operação muito mais pesada). Para listas
          pequenas, a &quot;pior&quot; busca ganha.
        </p>
        <Explicacao
          simples={EXPLICACOES.constantesBigO.simples}
          tecnica={EXPLICACOES.constantesBigO.tecnica}
        />
      </header>

      <section className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Tempo por passo da busca simples, O(n) (ms)
            <input
              className={inputClass}
              type="number"
              min={0.001}
              step="any"
              value={linearMs}
              onChange={(e) => setLinearMs(Math.max(0.001, Number(e.target.value) || 0.001))}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Tempo por passo da busca binária, O(log n) (ms)
            <input
              className={inputClass}
              type="number"
              min={0.001}
              step="any"
              value={logMs}
              onChange={(e) => setLogMs(Math.max(0.001, Number(e.target.value) || 0.001))}
            />
          </label>
        </div>
        <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
          <span className="flex items-center justify-between">
            Tamanho da lista
            <span className="font-mono text-lg text-emerald-400">{fmtN(n)}</span>
          </span>
          <input
            type="range"
            min={1}
            max={10}
            value={expoente}
            onChange={(e) => setExpoente(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <span className="text-xs text-zinc-500">de 10 até 10 bilhões de itens</span>
        </label>
      </section>

      <section className="fade-up flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat
            label="Busca simples"
            value={formatarDuracao(tLinear)}
            tone={vencedor === "linear" ? "text-emerald-400" : "text-zinc-300"}
          />
          <Stat
            label="Busca binária"
            value={formatarDuracao(tLog)}
            tone={vencedor === "log" ? "text-emerald-400" : "text-zinc-300"}
          />
          <Stat
            label="Mais rápida aqui"
            value={vencedor === "linear" ? "Busca simples" : "Busca binária"}
            tone="text-amber-400"
            pequeno
          />
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-400">
          {cruzamento === null
            ? "Com essas constantes, a busca binária nunca chega a compensar na faixa testada."
            : `A busca binária só passa a compensar a partir de cerca de ${fmtN(cruzamento)} itens. Abaixo disso, a constante maior pesa mais que o crescimento mais lento.`}
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex flex-wrap gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="h-0.5 w-4 rounded bg-sky-400" /> Busca simples
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-0.5 w-4 rounded bg-emerald-400" /> Busca binária
            </span>
            <span className="text-zinc-500">eixo vertical em escala logarítmica</span>
          </div>
          <GraficoRolavel minLargura={LARGURA}>
          <svg
            viewBox={`0 0 ${LARGURA} ${ALTURA}`}
            className="mx-auto w-full max-w-2xl"
            role="img"
            aria-label="Tempo de cada busca conforme o tamanho da lista"
          >
            {ticksY.map((v) => (
              <g key={v}>
                <line x1={M.esq} x2={LARGURA - M.dir} y1={gy(v)} y2={gy(v)} className="stroke-zinc-800" />
                <text
                  x={M.esq - 6}
                  y={gy(v)}
                  textAnchor="end"
                  dominantBaseline="central"
                  fontSize={10}
                  className="fill-zinc-500"
                >
                  {formatarDuracao(10 ** v)}
                </text>
              </g>
            ))}
            {EXPOENTES.map((e) => (
              <text
                key={e}
                x={gx(e)}
                y={ALTURA - 10}
                textAnchor="middle"
                fontSize={10}
                className="fill-zinc-500"
              >
                10{e === 1 ? "" : `^${e}`}
              </text>
            ))}
            <polyline
              fill="none"
              stroke="#38bdf8"
              strokeWidth={2}
              points={EXPOENTES.map((e, i) => `${gx(e)},${gy(sLinear[i])}`).join(" ")}
            />
            <polyline
              fill="none"
              stroke="#34d399"
              strokeWidth={2}
              points={EXPOENTES.map((e, i) => `${gx(e)},${gy(sLog[i])}`).join(" ")}
            />
            <line
              x1={gx(expoente)}
              x2={gx(expoente)}
              y1={M.topo}
              y2={ALTURA - M.base}
              className="stroke-zinc-400"
              strokeDasharray="4 4"
            />
          </svg>
          </GraficoRolavel>
        </div>

        <div className="flex flex-col gap-3 text-sm text-zinc-400">
          <h2 className="text-lg font-semibold text-zinc-100">Por que isso importa</h2>
          <p>
            O mesmo raciocínio explica por que o quicksort e a ordenação por
            mesclagem, ambos O(n log n) em média, não têm o mesmo desempenho na
            prática: segundo o livro, o quicksort costuma ter uma constante
            menor e por isso costuma ser mais rápido. Isso depende da
            implementação e do hardware, então vale medir em vez de supor.
            Escolher bem o pivô evita o pior caso do quicksort.
          </p>
          <p>
            A lição do livro: Big O diz como o custo cresce, não quanto tempo
            leva. Use-o para comparar algoritmos com crescimentos diferentes e,
            quando o crescimento é o mesmo, olhe também para as constantes.
          </p>
        </div>
      </section>
    </main>
  );
}
