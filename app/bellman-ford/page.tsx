"use client";

import { bellmanFord, dijkstraSimples } from "@/functions/bellmanFord";
import { Aresta } from "@/@types/bellmanFord";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";
import { GraficoRolavel, Legenda, Stat, botaoNavegacao, botaoPrimario } from "../components/ui";

const NOS = ["inicio", "a", "b", "fim"];
const INICIO = "inicio";
const FIM = "fim";

const ARESTAS_BASE: Aresta[] = [
  { de: "inicio", para: "a", peso: 2 },
  { de: "inicio", para: "b", peso: 3 },
  { de: "b", para: "a", peso: -2 },
  { de: "a", para: "fim", peso: 4 },
  { de: "b", para: "fim", peso: 6 },
];

const ARESTA_CICLO: Aresta = { de: "a", para: "b", peso: 1 };

const POSICOES: Record<string, { x: number; y: number }> = {
  inicio: { x: 70, y: 150 },
  a: { x: 240, y: 50 },
  b: { x: 240, y: 250 },
  fim: { x: 410, y: 150 },
};

const RAIO = 28;
const fmt = (custo: number) => (custo === Infinity ? "∞" : String(custo));
const mesmaAresta = (x: Aresta | null, y: Aresta) =>
  x !== null && x.de === y.de && x.para === y.para;

export default function BellmanFord() {
  const [comCiclo, setComCiclo] = useState(false);
  const [executado, setExecutado] = useState(false);
  const [passoAtual, setPassoAtual] = useState(0);

  const arestas = comCiclo ? [...ARESTAS_BASE, ARESTA_CICLO] : ARESTAS_BASE;
  const bf = bellmanFord(NOS, arestas, INICIO, FIM);
  const dj = dijkstraSimples(NOS, arestas, INICIO, FIM);

  const passo = bf.passos[passoAtual];
  const final = passoAtual === bf.passos.length - 1;
  const mostrarCaminho = final && bf.caminho;

  const noCaminho = (de: string, para: string) => {
    if (!mostrarCaminho || !bf.caminho) return false;
    const i = bf.caminho.indexOf(de);
    return i !== -1 && bf.caminho[i + 1] === para;
  };

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Bellman-Ford</h1>
        <p className="text-zinc-400">
          O Dijkstra assume que, ao processar um nó, o custo dele já é o
          menor possível. Com pesos negativos (um desconto, um reembolso) isso
          deixa de ser verdade. O Bellman-Ford não faz essa suposição: relaxa
          todas as arestas várias vezes e, se ainda melhorar depois do limite,
          há um ciclo negativo.
        </p>
        <Explicacao
          simples={EXPLICACOES.bellmanFord.simples}
          tecnica={EXPLICACOES.bellmanFord.tecnica}
          codigo={CODIGOS.bellmanFord}
        />
      </header>

      <div className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={comCiclo}
            onChange={(e) => {
              setComCiclo(e.target.checked);
              setExecutado(false);
              setPassoAtual(0);
            }}
            className="mt-0.5 h-5 w-5 shrink-0 accent-emerald-500"
          />
          <span>
            Adicionar a aresta a → b (peso 1). Com b → a (−2), o ciclo a → b →
            a soma −1 e pode ser repetido para sempre.
          </span>
        </label>
        <button
          className={botaoPrimario}
          onClick={() => {
            setExecutado(true);
            setPassoAtual(0);
          }}
        >
          Comparar Dijkstra e Bellman-Ford
        </button>
      </div>

      {executado && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Stat
              label="Dijkstra encontrou"
              value={
                dj.caminho
                  ? `${dj.custoTotal} (${dj.caminho.join(" → ")})`
                  : "sem caminho"
              }
              tone="text-amber-400"
              pequeno
            />
            <Stat
              label="Bellman-Ford encontrou"
              value={
                bf.cicloNegativo
                  ? "ciclo negativo: sem menor caminho"
                  : bf.caminho
                    ? `${bf.custos[FIM]} (${bf.caminho.join(" → ")})`
                    : "sem caminho"
              }
              tone={bf.cicloNegativo ? "text-red-400" : "text-emerald-400"}
              pequeno
            />
          </div>

          {!bf.cicloNegativo && dj.custoTotal !== null && dj.custoTotal !== bf.custos[FIM] && (
            <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              O Dijkstra errou: tratou o custo de &quot;a&quot; como final ao processá-lo e nunca
              reviu esse valor, então perdeu o caminho inicio → b → a → fim, mais barato
              por causa da aresta negativa.
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
            <Legenda cor="bg-amber-500" texto="Aresta sendo relaxada" />
            <Legenda cor="bg-emerald-500" texto="Caminho final" />
            <Legenda cor="bg-red-400" texto="Peso negativo" />
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p
                className={`text-sm font-medium ${passo.melhorou ? "text-emerald-400" : "text-zinc-300"}`}
              >
                {passo.descricao}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  className={botaoNavegacao}
                  disabled={passoAtual === 0}
                  onClick={() => setPassoAtual((p) => p - 1)}
                >
                  ← Anterior
                </button>
                <button
                  className={botaoNavegacao}
                  disabled={final}
                  onClick={() => setPassoAtual((p) => p + 1)}
                >
                  Próximo →
                </button>
                <button
                  className={botaoNavegacao}
                  disabled={final}
                  onClick={() => setPassoAtual(bf.passos.length - 1)}
                >
                  Ir ao fim
                </button>
              </div>
            </div>
            <p className="text-xs text-zinc-500">
              Passo {passoAtual + 1} de {bf.passos.length}
            </p>

            <GraficoRolavel minLargura={480}>
            <svg viewBox="0 0 480 300" className="mx-auto w-full max-w-xl" role="img" aria-label="Grafo com pesos negativos">
              <defs>
                {[
                  ["seta-bf", "fill-zinc-500"],
                  ["seta-bf-ok", "fill-emerald-400"],
                  ["seta-bf-at", "fill-amber-400"],
                ].map(([id, cls]) => (
                  <marker key={id} id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" className={cls} />
                  </marker>
                ))}
              </defs>

              {arestas.map((aresta) => {
                const { de, para, peso } = aresta;
                const a = POSICOES[de];
                const b = POSICOES[para];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const d = Math.hypot(dx, dy);
                // arestas em sentidos opostos ficam lado a lado
                const oposta = arestas.some((o) => o.de === para && o.para === de);
                const desvio = oposta ? 9 : 0;
                const ox = (dy / d) * desvio;
                const oy = (-dx / d) * desvio;
                const ok = noCaminho(de, para);
                const atual = mesmaAresta(passo.aresta, aresta);
                const cor = atual ? "stroke-amber-400" : ok ? "stroke-emerald-400" : "stroke-zinc-600";
                const marcador = atual ? "seta-bf-at" : ok ? "seta-bf-ok" : "seta-bf";
                const lx = (a.x + b.x) / 2 + (dy / d) * (oposta ? 24 : 15);
                const ly = (a.y + b.y) / 2 - (dx / d) * (oposta ? 24 : 15);
                return (
                  <g key={`${de}-${para}`}>
                    <line
                      x1={a.x + (dx / d) * RAIO + ox}
                      y1={a.y + (dy / d) * RAIO + oy}
                      x2={b.x - (dx / d) * (RAIO + 2) + ox}
                      y2={b.y - (dy / d) * (RAIO + 2) + oy}
                      strokeWidth={atual || ok ? 3 : 1.5}
                      className={cor}
                      markerEnd={`url(#${marcador})`}
                    />
                    <text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={13}
                      className={`font-mono font-semibold ${peso < 0 ? "fill-red-400" : "fill-zinc-400"}`}
                    >
                      {peso}
                    </text>
                  </g>
                );
              })}

              {NOS.map((nome) => (
                <g key={nome}>
                  <circle
                    cx={POSICOES[nome].x}
                    cy={POSICOES[nome].y}
                    r={RAIO}
                    strokeWidth={2}
                    className={`transition-colors ${
                      mostrarCaminho && bf.caminho?.includes(nome)
                        ? "fill-emerald-500 stroke-emerald-300"
                        : "fill-zinc-800 stroke-zinc-600"
                    }`}
                  />
                  <text
                    x={POSICOES[nome].x}
                    y={POSICOES[nome].y - 5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={11}
                    className={`font-mono ${mostrarCaminho && bf.caminho?.includes(nome) ? "fill-emerald-950" : "fill-zinc-100"}`}
                  >
                    {nome}
                  </text>
                  <text
                    x={POSICOES[nome].x}
                    y={POSICOES[nome].y + 9}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={10}
                    className={`font-mono font-semibold ${mostrarCaminho && bf.caminho?.includes(nome) ? "fill-emerald-950" : "fill-amber-400"}`}
                  >
                    {fmt(passo.custos[nome])}
                  </text>
                </g>
              ))}
            </svg>
            </GraficoRolavel>
            <p className="text-xs text-zinc-500">
              O número dentro de cada nó é o melhor custo conhecido até ali.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
