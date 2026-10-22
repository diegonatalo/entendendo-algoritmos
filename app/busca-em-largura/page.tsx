"use client";

import { buscaEmLargura } from "@/functions/buscaEmLargura";
import { Grafo } from "@/@types/grafo";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";
import { GraficoRolavel } from "../components/ui";

// rede de amigos do exemplo do livro (arestas dirigidas)
const GRAFO: Grafo = {
  voce: ["alice", "bob", "claire"],
  alice: ["peggy"],
  bob: ["anuj", "peggy"],
  claire: ["thom", "jonny"],
  anuj: [],
  peggy: [],
  thom: [],
  jonny: [],
};

const POSICOES: Record<string, { x: number; y: number }> = {
  voce: { x: 70, y: 170 },
  alice: { x: 230, y: 50 },
  bob: { x: 230, y: 170 },
  claire: { x: 230, y: 290 },
  peggy: { x: 400, y: 50 },
  anuj: { x: 400, y: 150 },
  thom: { x: 400, y: 250 },
  jonny: { x: 400, y: 340 },
};

const RAIO = 26;
const nomes = Object.keys(GRAFO);

const selectClass =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-100 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30";

const botao =
  "cursor-pointer whitespace-nowrap rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-700 disabled:hover:text-zinc-300";

const corDoTipo = {
  inicio: "text-zinc-300",
  visita: "text-amber-400",
  ignora: "text-zinc-500",
  achou: "text-emerald-400",
  fim: "text-red-400",
};

export default function BuscaEmLargura() {
  const [inicio, setInicio] = useState("voce");
  const [alvo, setAlvo] = useState("thom");
  const [resultado, setResultado] = useState<ReturnType<
    typeof buscaEmLargura
  > | null>(null);
  const [passoAtual, setPassoAtual] = useState(0);

  const passo = resultado?.passos[passoAtual];
  const noCaminho = (nome: string) =>
    passo?.tipo === "achou" && resultado?.caminho?.includes(nome);
  const arestaNoCaminho = (de: string, para: string) => {
    if (passo?.tipo !== "achou" || !resultado?.caminho) return false;
    const i = resultado.caminho.indexOf(de);
    return i !== -1 && resultado.caminho[i + 1] === para;
  };

  function estiloDoNo(nome: string) {
    if (noCaminho(nome)) return "fill-emerald-500 stroke-emerald-300";
    if (passo && passo.atual === nome) return "fill-amber-500 stroke-amber-300";
    if (passo?.visitados.includes(nome)) return "fill-sky-900 stroke-sky-500";
    if (passo?.fila.includes(nome))
      return "fill-violet-950 stroke-violet-400";
    return "fill-zinc-800 stroke-zinc-600";
  }

  function textoDoNo(nome: string) {
    if (noCaminho(nome)) return "fill-emerald-950";
    if (passo && passo.atual === nome) return "fill-amber-950";
    return "fill-zinc-100";
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Busca em largura</h1>
        <p className="text-zinc-400">
          Em um grafo, a busca em largura usa uma fila para verificar primeiro
          os vizinhos diretos, depois os vizinhos dos vizinhos, e assim por
          diante. Assim encontra o caminho com menos arestas. Custo: O(V + E).
        </p>
        <Explicacao
          simples={EXPLICACOES.buscaEmLargura.simples}
          tecnica={EXPLICACOES.buscaEmLargura.tecnica}
          codigo={CODIGOS.buscaEmLargura}
        />
      </header>

      <form
        className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          setResultado(buscaEmLargura(GRAFO, inicio, alvo));
          setPassoAtual(0);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Começar em
            <select
              className={selectClass}
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
            >
              {nomes.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Procurar por
            <select
              className={selectClass}
              value={alvo}
              onChange={(e) => setAlvo(e.target.value)}
            >
              {nomes.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>
        <button
          className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:bg-emerald-600"
          type="submit"
        >
          Buscar
        </button>
      </form>

      {resultado && passo && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Caminho"
              value={
                resultado.caminho
                  ? resultado.caminho.join(" → ")
                  : "Não existe"
              }
              tone={resultado.caminho ? "text-emerald-400" : "text-red-400"}
              pequeno
            />
            <Stat
              label="Arestas no caminho"
              value={resultado.caminho ? String(resultado.caminho.length - 1) : "—"}
              tone="text-amber-400"
            />
            <Stat
              label="Passo"
              value={`${passoAtual + 1} / ${resultado.passos.length}`}
              tone="text-zinc-100"
            />
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
            <Legenda cor="bg-amber-500" texto="Sendo verificado" />
            <Legenda cor="bg-sky-900 ring-1 ring-sky-500" texto="Já verificado" />
            <Legenda cor="bg-violet-950 ring-1 ring-violet-400" texto="Na fila" />
            <Legenda cor="bg-emerald-500" texto="Caminho" />
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

            <GraficoRolavel minLargura={470}>
            <svg
              viewBox="0 0 470 390"
              className="mx-auto w-full max-w-xl"
              role="img"
              aria-label="Grafo da rede de amigos"
            >
              <defs>
                <marker
                  id="seta"
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
                  id="seta-ok"
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
                GRAFO[de].map((para) => {
                  const a = POSICOES[de];
                  const b = POSICOES[para];
                  const dx = b.x - a.x;
                  const dy = b.y - a.y;
                  const d = Math.hypot(dx, dy);
                  const ok = arestaNoCaminho(de, para);
                  return (
                    <line
                      key={`${de}-${para}`}
                      x1={a.x + (dx / d) * RAIO}
                      y1={a.y + (dy / d) * RAIO}
                      x2={b.x - (dx / d) * (RAIO + 2)}
                      y2={b.y - (dy / d) * (RAIO + 2)}
                      strokeWidth={ok ? 3 : 1.5}
                      className={ok ? "stroke-emerald-400" : "stroke-zinc-600"}
                      markerEnd={`url(#${ok ? "seta-ok" : "seta"})`}
                    />
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
                    fontSize={11}
                    className={`font-mono ${textoDoNo(nome)}`}
                  >
                    {nome}
                  </text>
                </g>
              ))}
            </svg>
            </GraficoRolavel>

            <div className="grid gap-3 sm:grid-cols-2">
              <Lista titulo="Fila (próximo à esquerda)" itens={passo.fila} />
              <Lista titulo="Já verificados" itens={passo.visitados} />
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

function Lista({ titulo, itens }: { titulo: string; itens: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs uppercase tracking-wider text-zinc-500">
        {titulo}
      </div>
      <div className="flex min-h-9 flex-wrap gap-1.5">
        {itens.length === 0 ? (
          <span className="text-xs text-zinc-600">vazia</span>
        ) : (
          itens.map((n, i) => (
            <span
              key={i}
              className="rounded-lg bg-zinc-800 px-2.5 py-1.5 font-mono text-xs text-zinc-300"
            >
              {n}
            </span>
          ))
        )}
      </div>
    </div>
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
