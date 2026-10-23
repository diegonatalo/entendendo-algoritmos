"use client";

import { dijkstra } from "@/functions/dijkstra";
import { GrafoPonderado } from "@/@types/dijkstra";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";
import { ControlesPassos, GraficoRolavel, Legenda, Stat, botaoPrimario } from "../components/ui";

// cada aresta é uma troca: o peso é o dinheiro a pagar além do item entregue
const TROCAS: GrafoPonderado = {
  livro: { LP: 5, pôster: 0 },
  LP: { baixo: 15, bateria: 20 },
  pôster: { baixo: 30, bateria: 35 },
  baixo: { piano: 20 },
  bateria: { piano: 10 },
  piano: {},
};

const POSICOES: Record<string, { x: number; y: number }> = {
  livro: { x: 55, y: 150 },
  LP: { x: 205, y: 55 },
  pôster: { x: 205, y: 245 },
  baixo: { x: 355, y: 55 },
  bateria: { x: 355, y: 245 },
  piano: { x: 505, y: 150 },
};

const INICIO = "livro";
const FIM = "piano";
const RAIO = 30;
const nomes = Object.keys(TROCAS);

const corDoTipo = {
  inicio: "text-zinc-300",
  processa: "text-amber-400",
  fim: "text-emerald-400",
};

const fmt = (custo: number) => (custo === Infinity ? "∞" : `R$ ${custo}`);

export default function DijkstraTrocas() {
  const [comCiclo, setComCiclo] = useState(false);
  const [executado, setExecutado] = useState(false);
  const [passoAtual, setPassoAtual] = useState(0);

  // aresta que fecha um ciclo: LP → baixo → LP
  const grafo: GrafoPonderado = comCiclo
    ? { ...TROCAS, baixo: { ...TROCAS.baixo, LP: 2 } }
    : TROCAS;

  const resultado = dijkstra(grafo, INICIO, FIM);
  const passo = resultado.passos[passoAtual];
  const final = passoAtual === resultado.passos.length - 1;
  const mostrarCaminho = final && resultado.caminho;

  const noCaminho = (nome: string) => mostrarCaminho && resultado.caminho?.includes(nome);
  const arestaNoCaminho = (de: string, para: string) => {
    if (!mostrarCaminho || !resultado.caminho) return false;
    const i = resultado.caminho.indexOf(de);
    return i !== -1 && resultado.caminho[i + 1] === para;
  };

  function estiloDoNo(nome: string) {
    if (!executado) return "fill-zinc-800 stroke-zinc-600";
    if (noCaminho(nome)) return "fill-emerald-500 stroke-emerald-300";
    if (passo.atual === nome) return "fill-amber-500 stroke-amber-300";
    if (passo.processados.includes(nome)) return "fill-sky-900 stroke-sky-500";
    return "fill-zinc-800 stroke-zinc-600";
  }

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dijkstra: trocando um livro por um piano</h1>
        <p className="text-zinc-400">
          O segundo exemplo do capítulo 7: você quer trocar um livro por um
          piano, passando por uma série de trocas, e cada troca exige pagar
          uma diferença em dinheiro. O caminho mais barato no grafo é a série
          de trocas mais econômica. O Dijkstra serve para qualquer custo, não
          só distância ou tempo, desde que não seja negativo.
        </p>
        <Explicacao
          simples={EXPLICACOES.dijkstraTrocas.simples}
          tecnica={EXPLICACOES.dijkstraTrocas.tecnica}
          codigo={CODIGOS.dijkstra}
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
            Criar um ciclo: permitir trocar o baixo de volta por um LP (R$ 2).
            Um ciclo de custo positivo só gasta dinheiro à toa, então o
            Dijkstra o ignora.
          </span>
        </label>
        <button
          className={botaoPrimario}
          onClick={() => {
            setExecutado(true);
            setPassoAtual(0);
          }}
        >
          Achar as trocas mais baratas
        </button>
      </div>

      {executado && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Custo mínimo"
              value={resultado.custoTotal !== null ? `R$ ${resultado.custoTotal}` : "—"}
              tone="text-emerald-400"
            />
            <Stat
              label="Trocas"
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
            <Legenda cor="bg-amber-500" texto="Item mais barato agora" />
            <Legenda cor="bg-sky-900 ring-1 ring-sky-500" texto="Já processado" />
            <Legenda cor="bg-emerald-500" texto="Trocas escolhidas" />
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={`text-sm font-medium ${corDoTipo[passo.tipo]}`}>{passo.descricao}</p>
              <ControlesPassos passoAtual={passoAtual} total={resultado.passos.length} onChange={setPassoAtual} />
            </div>

            <GraficoRolavel minLargura={560}>
            <svg viewBox="0 0 560 300" className="mx-auto w-full max-w-2xl" role="img" aria-label="Grafo de trocas do livro até o piano">
              <defs>
                {[
                  ["seta-tr", "fill-zinc-500"],
                  ["seta-tr-ok", "fill-emerald-400"],
                ].map(([id, cls]) => (
                  <marker key={id} id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" className={cls} />
                  </marker>
                ))}
              </defs>

              {nomes.flatMap((de) =>
                Object.entries(grafo[de]).map(([para, peso]) => {
                  const a = POSICOES[de];
                  const b = POSICOES[para];
                  const dx = b.x - a.x;
                  const dy = b.y - a.y;
                  const d = Math.hypot(dx, dy);
                  const oposta = grafo[para]?.[de] !== undefined;
                  const desvio = oposta ? 8 : 0;
                  const ox = (dy / d) * desvio;
                  const oy = (-dx / d) * desvio;
                  const ok = arestaNoCaminho(de, para);
                  const lx = a.x + dx * 0.4 + (dy / d) * (oposta ? 20 : 12) ;
                  const ly = a.y + dy * 0.4 - (dx / d) * (oposta ? 20 : 12);
                  return (
                    <g key={`${de}-${para}`}>
                      <line
                        x1={a.x + (dx / d) * RAIO + ox}
                        y1={a.y + (dy / d) * RAIO + oy}
                        x2={b.x - (dx / d) * (RAIO + 2) + ox}
                        y2={b.y - (dy / d) * (RAIO + 2) + oy}
                        strokeWidth={ok ? 3 : 1.5}
                        className={ok ? "stroke-emerald-400" : "stroke-zinc-600"}
                        markerEnd={`url(#${ok ? "seta-tr-ok" : "seta-tr"})`}
                      />
                      <text
                        x={lx}
                        y={ly}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={12}
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
                    y={POSICOES[nome].y - 5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={11}
                    className={noCaminho(nome) || passo.atual === nome ? "fill-zinc-950" : "fill-zinc-100"}
                  >
                    {nome}
                  </text>
                  <text
                    x={POSICOES[nome].x}
                    y={POSICOES[nome].y + 9}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={10}
                    className={`font-mono font-semibold ${noCaminho(nome) || passo.atual === nome ? "fill-zinc-950" : "fill-amber-400"}`}
                  >
                    {fmt(passo.custos[nome])}
                  </text>
                </g>
              ))}
            </svg>
            </GraficoRolavel>
            <p className="text-xs text-zinc-500">
              O número em cada seta é o dinheiro pago naquela troca; o valor
              dentro de cada item é o menor custo conhecido para chegar nele.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="py-2 pr-4 font-medium">Item</th>
                    <th className="py-2 pr-4 font-medium">Custo</th>
                    <th className="py-2 pr-4 font-medium">Veio de</th>
                    <th className="py-2 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {nomes.map((nome) => (
                    <tr key={nome} className="border-t border-zinc-800">
                      <td className="py-2 pr-4 text-zinc-300">{nome}</td>
                      <td className={`py-2 pr-4 ${passo.custos[nome] === Infinity ? "text-zinc-500" : "text-amber-400"}`}>
                        {fmt(passo.custos[nome])}
                      </td>
                      <td className="py-2 pr-4 text-zinc-400">{passo.pais[nome] ?? "—"}</td>
                      <td className="py-2 text-xs text-zinc-400">
                        {passo.processados.includes(nome) ? "processado" : "pendente"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </section>
      )}
    </main>
  );
}
