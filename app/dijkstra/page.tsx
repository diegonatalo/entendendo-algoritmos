"use client";

import { dijkstra } from "@/functions/dijkstra";
import { GrafoPonderado } from "@/@types/dijkstra";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";
import { GraficoRolavel } from "../components/ui";

// grafo do exemplo do livro (arestas dirigidas, com pesos)
const GRAFO: GrafoPonderado = {
  inicio: { a: 6, b: 2 },
  a: { fim: 1 },
  b: { a: 3, fim: 5 },
  fim: {},
};

const INICIO = "inicio";
const FIM = "fim";

const POSICOES: Record<string, { x: number; y: number }> = {
  inicio: { x: 70, y: 150 },
  a: { x: 240, y: 50 },
  b: { x: 240, y: 250 },
  fim: { x: 410, y: 150 },
};

const RAIO = 28;
const nomes = Object.keys(GRAFO);

const botao =
  "cursor-pointer whitespace-nowrap rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-700 disabled:hover:text-zinc-300";

const corDoTipo = {
  inicio: "text-zinc-300",
  processa: "text-amber-400",
  fim: "text-emerald-400",
};

const formatar = (custo: number) => (custo === Infinity ? "∞" : String(custo));

export default function Dijkstra() {
  const [resultado, setResultado] = useState<ReturnType<
    typeof dijkstra
  > | null>(null);
  const [passoAtual, setPassoAtual] = useState(0);

  const passo = resultado?.passos[passoAtual];
  const final = passo?.tipo === "fim" && resultado?.caminho;

  const noCaminho = (nome: string) => final && resultado.caminho?.includes(nome);
  const arestaNoCaminho = (de: string, para: string) => {
    if (!final || !resultado.caminho) return false;
    const i = resultado.caminho.indexOf(de);
    return i !== -1 && resultado.caminho[i + 1] === para;
  };

  function estiloDoNo(nome: string) {
    if (noCaminho(nome)) return "fill-emerald-500 stroke-emerald-300";
    if (passo?.atual === nome) return "fill-amber-500 stroke-amber-300";
    if (passo?.processados.includes(nome))
      return "fill-sky-900 stroke-sky-500";
    return "fill-zinc-800 stroke-zinc-600";
  }

  function textoDoNo(nome: string) {
    if (noCaminho(nome)) return "fill-emerald-950";
    if (passo?.atual === nome) return "fill-amber-950";
    return "fill-zinc-100";
  }

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Algoritmo de Dijkstra
        </h1>
        <p className="text-zinc-400">
          Encontra o caminho de menor custo em um grafo com pesos nas arestas.
          A cada passo, escolhe o nó mais barato ainda não processado e
          atualiza o custo dos vizinhos. Não funciona com pesos negativos.
        </p>
        <p className="text-sm text-zinc-500">
          O caminho com menos arestas (inicio → a → fim) não é o mais barato:
          veja como o algoritmo descobre isso.
        </p>
        <Explicacao
          simples={EXPLICACOES.dijkstra.simples}
          tecnica={EXPLICACOES.dijkstra.tecnica}
          codigo={CODIGOS.dijkstra}
        />
      </header>

      <div className="fade-up">
        <button
          className="w-full cursor-pointer rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:bg-emerald-600"
          onClick={() => {
            setResultado(dijkstra(GRAFO, INICIO, FIM));
            setPassoAtual(0);
          }}
        >
          Executar de {INICIO} até {FIM}
        </button>
      </div>

      {resultado && passo && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Menor custo"
              value={
                resultado.custoTotal !== null
                  ? String(resultado.custoTotal)
                  : "—"
              }
              tone="text-emerald-400"
            />
            <Stat
              label="Caminho"
              value={resultado.caminho ? resultado.caminho.join(" → ") : "—"}
              tone="text-zinc-100"
              pequeno
            />
            <Stat
              label="Passo"
              value={`${passoAtual + 1} / ${resultado.passos.length}`}
              tone="text-zinc-100"
            />
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
            <Legenda cor="bg-amber-500" texto="Nó mais barato (atual)" />
            <Legenda cor="bg-sky-900 ring-1 ring-sky-500" texto="Já processado" />
            <Legenda cor="bg-emerald-500" texto="Caminho final" />
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={`text-sm font-medium ${corDoTipo[passo.tipo]}`}>
                {passo.descricao}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  className={botao}
                  disabled={passoAtual === 0}
                  onClick={() => setPassoAtual((p) => p - 1)}
                >
                  ← Anterior
                </button>
                <button
                  className={botao}
                  disabled={passoAtual === resultado.passos.length - 1}
                  onClick={() => setPassoAtual((p) => p + 1)}
                >
                  Próximo →
                </button>
              </div>
            </div>

            <GraficoRolavel minLargura={480}>
            <svg
              viewBox="0 0 480 300"
              className="mx-auto w-full max-w-xl"
              role="img"
              aria-label="Grafo ponderado do exemplo"
            >
              <defs>
                <marker
                  id="seta-d"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M0,0 L10,5 L0,10 z" className="fill-zinc-500" />
                </marker>
                <marker
                  id="seta-d-ok"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M0,0 L10,5 L0,10 z" className="fill-emerald-400" />
                </marker>
              </defs>

              {nomes.flatMap((de) =>
                Object.entries(GRAFO[de]).map(([para, peso]) => {
                  const a = POSICOES[de];
                  const b = POSICOES[para];
                  const dx = b.x - a.x;
                  const dy = b.y - a.y;
                  const d = Math.hypot(dx, dy);
                  const ok = arestaNoCaminho(de, para);
                  // rótulo deslocado para o lado da aresta
                  const lx = (a.x + b.x) / 2 + (dy / d) * 14;
                  const ly = (a.y + b.y) / 2 - (dx / d) * 14;
                  return (
                    <g key={`${de}-${para}`}>
                      <line
                        x1={a.x + (dx / d) * RAIO}
                        y1={a.y + (dy / d) * RAIO}
                        x2={b.x - (dx / d) * (RAIO + 2)}
                        y2={b.y - (dy / d) * (RAIO + 2)}
                        strokeWidth={ok ? 3 : 1.5}
                        className={ok ? "stroke-emerald-400" : "stroke-zinc-600"}
                        markerEnd={`url(#${ok ? "seta-d-ok" : "seta-d"})`}
                      />
                      <text
                        x={lx}
                        y={ly}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={13}
                        className={`font-mono font-semibold ${ok ? "fill-emerald-300" : "fill-zinc-400"}`}
                      >
                        {peso}
                      </text>
                    </g>
                  );
                }),
              )}

              {nomes.map((nome) => (
                <g key={nome}>
                  <circle
                    cx={POSICOES[nome].x}
                    cy={POSICOES[nome].y}
                    r={RAIO}
                    strokeWidth={2}
                    className={`transition-colors ${estiloDoNo(nome)}`}
                  />
                  <text
                    x={POSICOES[nome].x}
                    y={POSICOES[nome].y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={12}
                    className={`font-mono ${textoDoNo(nome)}`}
                  >
                    {nome}
                  </text>
                </g>
              ))}
            </svg>
            </GraficoRolavel>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="py-2 pr-4 font-medium">Nó</th>
                    <th className="py-2 pr-4 font-medium">Custo</th>
                    <th className="py-2 pr-4 font-medium">Pai</th>
                    <th className="py-2 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {nomes.map((nome) => (
                    <tr key={nome} className="border-t border-zinc-800">
                      <td className="py-2 pr-4 text-zinc-300">{nome}</td>
                      <td
                        className={`py-2 pr-4 ${passo.custos[nome] === Infinity ? "text-zinc-600" : "text-amber-400"}`}
                      >
                        {formatar(passo.custos[nome])}
                      </td>
                      <td className="py-2 pr-4 text-zinc-400">
                        {passo.pais[nome] ?? "—"}
                      </td>
                      <td className="py-2 text-xs text-zinc-500">
                        {passo.processados.includes(nome)
                          ? "processado"
                          : "pendente"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <ol className="flex flex-col gap-1 text-sm">
            {resultado.passos.map((p, i) => (
              <li key={i}>
                <button
                  onClick={() => setPassoAtual(i)}
                  className={`w-full cursor-pointer rounded-lg px-3 py-1.5 text-left transition-colors hover:bg-zinc-800/60 ${
                    i === passoAtual
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-500"
                  }`}
                >
                  <span className="mr-2 font-mono text-xs">{i + 1}.</span>
                  {p.descricao}
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}

function Stat({
  label,
  value,
  tone,
  pequeno,
}: {
  label: string;
  value: string;
  tone: string;
  pequeno?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div
        className={`mt-1 font-semibold ${pequeno ? "text-base leading-8" : "text-2xl"} ${tone}`}
      >
        {value}
      </div>
    </div>
  );
}

function Legenda({ cor, texto }: { cor: string; texto: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded ${cor}`} />
      {texto}
    </span>
  );
}
