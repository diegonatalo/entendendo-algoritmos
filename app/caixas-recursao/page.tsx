"use client";

import {
  ALVO,
  LOCAIS_DA_CHAVE,
  buscarChave,
  criarCaixas,
} from "@/functions/caixas";
import { Caixa, PassoCaixa } from "@/@types/caixas";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";
import { Legenda, Stat, botaoNavegacao, botaoPrimario } from "../components/ui";

const selectClass =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-100 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30";

function CaixaVisual({
  caixa,
  passo,
  executado,
  encontradaEm,
}: {
  caixa: Caixa;
  passo: PassoCaixa;
  executado: boolean;
  encontradaEm: string | null;
}) {
  const noPasso = passo.atual === caixa.id;
  const emFim = passo.tipo === "achou" && encontradaEm === caixa.id;
  const aberta = executado && passo.pilha.includes(caixa.id);
  const vasculhada = executado && passo.vasculhadas.includes(caixa.id);

  const estilo = emFim
    ? "border-emerald-500 bg-emerald-500/10"
    : noPasso && aberta
      ? "border-amber-500 bg-amber-500/10"
      : aberta
        ? "border-sky-500/60 bg-sky-500/5"
        : vasculhada
          ? "border-zinc-700 bg-zinc-900/60 opacity-60"
          : "border-zinc-800 bg-zinc-900/40";

  return (
    <div className={`flex flex-col gap-2 rounded-xl border p-3 transition-colors ${estilo}`}>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-medium text-zinc-200">📦 {caixa.nome}</span>
        {caixa.itens.map((item) => (
          <span
            key={item}
            className={`rounded-md px-2 py-0.5 font-mono text-xs ${
              item === ALVO
                ? "bg-emerald-500 font-semibold text-emerald-950"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {item === ALVO ? "🔑 chave" : item}
          </span>
        ))}
        {vasculhada && <span className="text-xs text-zinc-500">vasculhada</span>}
      </div>
      {caixa.caixas.length > 0 && (
        <div className="ml-4 flex flex-col gap-2 border-l border-zinc-800 pl-3">
          {caixa.caixas.map((filha) => (
            <CaixaVisual
              key={filha.id}
              caixa={filha}
              passo={passo}
              executado={executado}
              encontradaEm={encontradaEm}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CaixasRecursao() {
  const [local, setLocal] = useState<string>("azul2p");
  const [executado, setExecutado] = useState(false);
  const [passoAtual, setPassoAtual] = useState(0);

  const raiz = criarCaixas(local === "nenhuma" ? null : local);
  const resultado = buscarChave(raiz);
  const passo = resultado.passos[passoAtual];
  const final = passoAtual === resultado.passos.length - 1;
  const nomeDe = (id: string) => {
    const achar = (c: Caixa): string | null =>
      c.id === id ? c.nome : c.caixas.map(achar).find((n) => n !== null) ?? null;
    return achar(raiz) ?? id;
  };

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Caixas dentro de caixas</h1>
        <p className="text-zinc-400">
          O exemplo clássico de recursão: procurar uma chave em uma caixa que
          contém outras caixas, que contêm outras. Em vez de controlar a
          lista de caixas por conta própria, a função se chama para cada
          caixa interna. Quando não há mais caixas dentro, é o caso base.
        </p>
        <Explicacao
          simples={EXPLICACOES.caixasRecursao.simples}
          tecnica={EXPLICACOES.caixasRecursao.tecnica}
          codigo={CODIGOS.caixas}
        />
      </header>

      <div className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
          Onde está a chave?
          <select
            className={selectClass}
            value={local}
            onChange={(e) => {
              setLocal(e.target.value);
              setExecutado(false);
              setPassoAtual(0);
            }}
          >
            {LOCAIS_DA_CHAVE.map((l) => (
              <option key={l.id} value={l.id}>
                {l.rotulo}
              </option>
            ))}
            <option value="nenhuma">Em nenhuma caixa</option>
          </select>
        </label>
        <button
          className={botaoPrimario}
          onClick={() => {
            setExecutado(true);
            setPassoAtual(0);
          }}
        >
          Procurar a chave
        </button>
      </div>

      <section className="fade-up flex flex-col gap-6">
        {executado && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Resultado"
              value={
                final
                  ? resultado.encontradaEm
                    ? "Encontrada"
                    : "Não encontrada"
                  : "Procurando…"
              }
              tone={final && !resultado.encontradaEm ? "text-red-400" : "text-emerald-400"}
            />
            <Stat
              label="Caixas abertas agora"
              value={String(passo.pilha.length)}
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
          <Legenda cor="bg-amber-500" texto="Caixa sendo vasculhada" />
          <Legenda cor="bg-sky-500/40" texto="Aberta, esperando as de dentro" />
          <Legenda cor="bg-zinc-700" texto="Já vasculhada" />
          <Legenda cor="bg-emerald-500" texto="Achou" />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          {executado && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p
                className={`text-sm font-medium ${passo.tipo === "achou" ? "text-emerald-400" : "text-amber-400"}`}
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
                  onClick={() => setPassoAtual(resultado.passos.length - 1)}
                >
                  Ir ao fim
                </button>
              </div>
            </div>
          )}

          <CaixaVisual
            caixa={raiz}
            passo={passo}
            executado={executado}
            encontradaEm={resultado.encontradaEm}
          />

          {executado && (
            <div className="flex flex-col gap-2">
              <div className="text-xs uppercase tracking-wider text-zinc-500">
                Pilha de chamadas (a última é a caixa em uso)
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {passo.pilha.length === 0 ? (
                  <span className="text-xs text-zinc-600">vazia</span>
                ) : (
                  passo.pilha.map((id, i) => (
                    <span key={id} className="flex items-center gap-1.5">
                      {i > 0 && <span className="text-zinc-600">→</span>}
                      <span
                        className={`rounded-lg px-2.5 py-1.5 text-xs ${
                          i === passo.pilha.length - 1
                            ? "bg-amber-500 font-semibold text-amber-950"
                            : "bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {nomeDe(id)}
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
