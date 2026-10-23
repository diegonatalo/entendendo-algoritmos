"use client";

import { ordenacaoTopologica } from "@/functions/ordenacaoTopologica";
import { GrafoDependencias } from "@/@types/topologica";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";
import { ControlesPassos, GraficoRolavel, Legenda, Stat, botaoPrimario } from "../components/ui";

// "a: [b]" significa que a precisa acontecer antes de b
const ROTINA: GrafoDependencias = {
  acordar: ["exercitar", "escovar dentes", "fazer lanche"],
  exercitar: ["tomar banho"],
  "escovar dentes": ["sair"],
  "fazer lanche": ["sair"],
  "tomar banho": ["vestir"],
  vestir: ["sair"],
  sair: [],
};

const POSICOES: Record<string, { x: number; y: number }> = {
  acordar: { x: 70, y: 150 },
  exercitar: { x: 240, y: 50 },
  "escovar dentes": { x: 240, y: 150 },
  "fazer lanche": { x: 240, y: 250 },
  "tomar banho": { x: 410, y: 50 },
  vestir: { x: 570, y: 50 },
  sair: { x: 570, y: 220 },
};

const MEIA_LARGURA = 52;
const MEIA_ALTURA = 17;
const nomes = Object.keys(ROTINA);

// ponto onde a reta do centro de a para b cruza a borda do retângulo de a
function naBorda(a: { x: number; y: number }, b: { x: number; y: number }, folga: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.min(
    (MEIA_LARGURA + folga) / Math.abs(dx || 1e-9),
    (MEIA_ALTURA + folga) / Math.abs(dy || 1e-9),
  );
  return { x: a.x + dx * t, y: a.y + dy * t };
}

export default function OrdenacaoTopologica() {
  const [comCiclo, setComCiclo] = useState(false);
  const [executado, setExecutado] = useState(false);
  const [passoAtual, setPassoAtual] = useState(0);

  // o ciclo faz "vestir" ser pré-requisito de "exercitar", que já leva a "vestir"
  const grafo: GrafoDependencias = comCiclo
    ? { ...ROTINA, vestir: [...ROTINA.vestir, "exercitar"] }
    : ROTINA;

  const resultado = ordenacaoTopologica(grafo);
  const passo = resultado.passos[passoAtual];
  const final = passoAtual === resultado.passos.length - 1;

  function estiloDoNo(nome: string) {
    if (!executado) return "fill-zinc-800 stroke-zinc-600";
    if (final && resultado.presos.includes(nome)) return "fill-red-950 stroke-red-500";
    if (passo.atual === nome) return "fill-amber-500 stroke-amber-300";
    if (passo.ordem.includes(nome)) return "fill-sky-900 stroke-sky-500";
    if (passo.fila.includes(nome)) return "fill-violet-950 stroke-violet-400";
    return "fill-zinc-800 stroke-zinc-600";
  }

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Ordenação topológica</h1>
        <p className="text-zinc-400">
          Quando as tarefas dependem umas das outras, uma ordenação topológica
          é uma ordem em que cada tarefa vem depois de todas as suas
          dependências. O algoritmo repete: faça uma tarefa que não espera por
          mais nada e libere as que dependiam dela. Só existe se o grafo não
          tiver ciclos.
        </p>
        <Explicacao
          simples={EXPLICACOES.ordenacaoTopologica.simples}
          tecnica={EXPLICACOES.ordenacaoTopologica.tecnica}
          codigo={CODIGOS.ordenacaoTopologica}
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
            Criar dependência circular: &quot;vestir&quot; passa a ser pré-requisito de
            &quot;exercitar&quot;, que já leva a &quot;vestir&quot;.
          </span>
        </label>
        <button
          className={botaoPrimario}
          onClick={() => {
            setExecutado(true);
            setPassoAtual(0);
          }}
        >
          Ordenar tarefas
        </button>
      </div>

      <section className="fade-up flex flex-col gap-6">
        {executado && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Resultado"
              value={final ? (resultado.temCiclo ? "Impossível" : "Ordem válida") : "Em andamento"}
              tone={final && resultado.temCiclo ? "text-red-400" : "text-emerald-400"}
            />
            <Stat
              label="Tarefas na ordem"
              value={`${passo.ordem.length} / ${nomes.length}`}
              tone="text-amber-400"
            />
            <Stat
              label="Passo"
              value={`${passoAtual + 1} / ${resultado.passos.length}`}
              tone="text-zinc-100"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
          <Legenda cor="bg-amber-500" texto="Tarefa feita agora" />
          <Legenda cor="bg-sky-900 ring-1 ring-sky-500" texto="Já na ordem" />
          <Legenda cor="bg-violet-950 ring-1 ring-violet-400" texto="Livre (na fila)" />
          <Legenda cor="bg-red-950 ring-1 ring-red-500" texto="Presa em ciclo" />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          {executado && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p
                className={`text-sm font-medium ${final && resultado.temCiclo ? "text-red-400" : "text-amber-400"}`}
              >
                {passo.descricao}
              </p>
              <ControlesPassos passoAtual={passoAtual} total={resultado.passos.length} onChange={setPassoAtual} />
            </div>
          )}

          <GraficoRolavel minLargura={640}>
          <svg viewBox="0 -45 640 335" className="w-full" role="img" aria-label="Grafo de dependências da rotina da manhã">
            <defs>
              <marker id="seta-t" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" className="fill-zinc-500" />
              </marker>
            </defs>
            {nomes.flatMap((de) =>
              grafo[de].map((para) => {
                const a = POSICOES[de];
                const b = POSICOES[para];
                // arestas longas na horizontal contornam os nós do meio por cima
                if (a.y === b.y && Math.abs(a.x - b.x) > 200) {
                  const topo = a.y - MEIA_ALTURA;
                  return (
                    <path
                      key={`${de}-${para}`}
                      d={`M ${a.x} ${topo} Q ${(a.x + b.x) / 2} ${topo - 70} ${b.x + (a.x > b.x ? 10 : -10)} ${topo - 3}`}
                      fill="none"
                      strokeWidth={1.5}
                      className="stroke-zinc-600"
                      markerEnd="url(#seta-t)"
                    />
                  );
                }
                const inicio = naBorda(POSICOES[de], POSICOES[para], 0);
                const fim = naBorda(POSICOES[para], POSICOES[de], 3);
                return (
                  <line
                    key={`${de}-${para}`}
                    x1={inicio.x}
                    y1={inicio.y}
                    x2={fim.x}
                    y2={fim.y}
                    strokeWidth={1.5}
                    className="stroke-zinc-600"
                    markerEnd="url(#seta-t)"
                  />
                );
              }),
            )}
            {nomes.map((nome) => (
              <g key={nome}>
                <rect
                  x={POSICOES[nome].x - MEIA_LARGURA}
                  y={POSICOES[nome].y - MEIA_ALTURA}
                  width={MEIA_LARGURA * 2}
                  height={MEIA_ALTURA * 2}
                  rx={9}
                  strokeWidth={2}
                  className={`transition-colors ${estiloDoNo(nome)}`}
                />
                <text
                  x={POSICOES[nome].x}
                  y={POSICOES[nome].y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                  className={passo.atual === nome && executado ? "fill-amber-950" : "fill-zinc-100"}
                >
                  {nome}
                </text>
                {executado && (
                  <g>
                    <circle
                      cx={POSICOES[nome].x + MEIA_LARGURA - 2}
                      cy={POSICOES[nome].y - MEIA_ALTURA}
                      r={8}
                      className="fill-zinc-950 stroke-zinc-600"
                    />
                    <text
                      x={POSICOES[nome].x + MEIA_LARGURA - 2}
                      y={POSICOES[nome].y - MEIA_ALTURA}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={10}
                      className="fill-zinc-300 font-mono"
                    >
                      {passo.grausEntrada[nome]}
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>
          </GraficoRolavel>
          {executado && (
            <p className="text-xs text-zinc-500">
              O número no canto de cada tarefa é quantas dependências ainda
              faltam. Quando chega a 0, a tarefa fica livre.
            </p>
          )}

          {executado && (
            <div className="flex flex-col gap-2">
              <div className="text-xs uppercase tracking-wider text-zinc-500">
                Ordem até agora
              </div>
              <div className="flex min-h-9 flex-wrap items-center gap-1.5">
                {passo.ordem.length === 0 ? (
                  <span className="text-xs text-zinc-600">vazia</span>
                ) : (
                  passo.ordem.map((n, i) => (
                    <span key={n} className="flex items-center gap-1.5">
                      {i > 0 && <span className="text-zinc-600">→</span>}
                      <span className="rounded-lg bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-200">
                        {n}
                      </span>
                    </span>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
