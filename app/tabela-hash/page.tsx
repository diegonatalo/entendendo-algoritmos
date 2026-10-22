"use client";

import {
  buscar,
  criarTabela,
  fatorDeCarga,
  funcaoHash,
  inserir,
  redimensionar,
} from "@/functions/tabelaHash";
import { TabelaHash } from "@/@types/hash";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";

const TAMANHO_INICIAL = 8;

const inputClass =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30";

const botaoSecundario =
  "cursor-pointer rounded-xl border border-zinc-700 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100";

const botaoPrimario =
  "cursor-pointer rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:bg-emerald-600";

const EXEMPLO: [string, string][] = [
  ["maca", "R$ 0,67"],
  ["leite", "R$ 1,49"],
  ["pao", "R$ 0,25"],
  ["ovo", "R$ 0,50"],
  ["arroz", "R$ 3,20"],
  ["cafe", "R$ 4,80"],
  ["sal", "R$ 0,99"],
  ["oleo", "R$ 2,10"],
];

type Destaque = {
  indice: number;
  tom: "ok" | "colisao" | "falha";
  chave: string;
  mensagem: string;
};

export default function TabelaHashPage() {
  const [tabela, setTabela] = useState<TabelaHash>(() =>
    criarTabela(TAMANHO_INICIAL),
  );
  const [destaque, setDestaque] = useState<Destaque | null>(null);

  const total = tabela.flat().length;
  const carga = fatorDeCarga(tabela);

  function explicarHash(chave: string) {
    const { soma, indice } = funcaoHash(chave, tabela.length);
    return `hash("${chave}") = ${soma} % ${tabela.length} = ${indice}`;
  }

  function handleInserir(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const chave = form.chave.value.trim();
    const valor = form.valor.value.trim();
    if (!chave) return;

    const r = inserir(tabela, chave, valor);
    setTabela(r.tabela);
    setDestaque({
      indice: r.indice,
      tom: r.colisao ? "colisao" : "ok",
      chave,
      mensagem: `${explicarHash(chave)}. ${
        r.atualizou
          ? "A chave já existia: valor atualizado."
          : r.colisao
            ? "Colisão! O balde já tinha itens, então a chave entra na lista."
            : "Balde vazio: chave guardada."
      }`,
    });
    form.reset();
  }

  function handleBuscar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const chave = e.currentTarget.busca.value.trim();
    if (!chave) return;

    const r = buscar(tabela, chave);
    const achou = r.valor !== undefined;
    setDestaque({
      indice: r.indice,
      tom: achou ? "ok" : "falha",
      chave,
      mensagem: `${explicarHash(chave)}. ${
        achou
          ? `Encontrado após ${r.comparacoes} ${r.comparacoes === 1 ? "comparação" : "comparações"}: ${r.valor}.`
          : r.comparacoes === 0
            ? "Balde vazio: a chave não está na tabela."
            : `Percorreu ${r.comparacoes} ${r.comparacoes === 1 ? "item" : "itens"} do balde e não achou a chave.`
      }`,
    });
  }

  function carregarExemplo() {
    let nova = criarTabela(TAMANHO_INICIAL);
    for (const [chave, valor] of EXEMPLO) {
      nova = inserir(nova, chave, valor).tabela;
    }
    setTabela(nova);
    setDestaque(null);
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Tabelas hash</h1>
        <p className="text-zinc-400">
          Uma função hash transforma a chave em um número, que indica o balde
          onde o valor fica guardado. Busca, inserção e remoção levam O(1) no
          caso médio. Quando duas chaves caem no mesmo balde, há uma colisão e
          os itens formam uma lista.
        </p>
        <p className="font-mono text-sm text-zinc-500">
          hash(chave) = soma dos códigos dos caracteres % tamanho da tabela
        </p>
        <Explicacao
          simples={EXPLICACOES.tabelaHash.simples}
          tecnica={EXPLICACOES.tabelaHash.tecnica}
          codigo={CODIGOS.tabelaHash}
        />
      </header>

      <div className="fade-up grid gap-4 md:grid-cols-2">
        <form
          className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
          onSubmit={handleInserir}
        >
          <h2 className="text-sm font-medium text-zinc-300">Inserir</h2>
          <div className="grid grid-cols-2 gap-3">
            <input
              className={inputClass}
              name="chave"
              placeholder="Chave (ex.: maca)"
              required
            />
            <input
              className={inputClass}
              name="valor"
              placeholder="Valor (ex.: R$ 0,67)"
            />
          </div>
          <button className={botaoPrimario} type="submit">
            Inserir
          </button>
        </form>

        <form
          className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
          onSubmit={handleBuscar}
        >
          <h2 className="text-sm font-medium text-zinc-300">Buscar</h2>
          <input
            className={inputClass}
            name="busca"
            placeholder="Chave a buscar"
            required
          />
          <button className={botaoPrimario} type="submit">
            Buscar
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-3">
        <button className={botaoSecundario} onClick={carregarExemplo}>
          Carregar exemplo
        </button>
        <button
          className={botaoSecundario}
          onClick={() => {
            setTabela(redimensionar(tabela, tabela.length * 2));
            setDestaque(null);
          }}
          disabled={tabela.length >= 64}
        >
          Dobrar tamanho da tabela
        </button>
        <button
          className={botaoSecundario}
          onClick={() => {
            setTabela(criarTabela(TAMANHO_INICIAL));
            setDestaque(null);
          }}
        >
          Limpar
        </button>
      </div>

      <section className="fade-up flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Itens" value={String(total)} tone="text-zinc-100" />
          <Stat
            label="Baldes"
            value={String(tabela.length)}
            tone="text-zinc-100"
          />
          <Stat
            label="Fator de carga"
            value={carga.toFixed(2)}
            tone={carga > 0.75 ? "text-red-400" : "text-emerald-400"}
          />
        </div>
        {carga > 0.75 && (
          <p className="text-sm text-red-400">
            Fator de carga alto: aumentam as colisões. Experimente dobrar o
            tamanho da tabela.
          </p>
        )}

        {destaque && (
          <p
            className={`rounded-xl border px-4 py-3 text-sm ${
              destaque.tom === "ok"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                : destaque.tom === "colisao"
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
                  : "border-red-500/40 bg-red-500/10 text-red-200"
            }`}
          >
            {destaque.mensagem}
          </p>
        )}

        <ol className="flex flex-col gap-2">
          {tabela.map((balde, i) => {
            const ativo = destaque?.indice === i;
            return (
              <li
                key={i}
                className={`flex items-center gap-3 rounded-xl border p-2 transition-colors ${
                  ativo
                    ? "border-amber-500/60 bg-amber-500/5"
                    : "border-zinc-800 bg-zinc-900/40"
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 font-mono text-sm text-zinc-400">
                  {i}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {balde.length === 0 ? (
                    <span className="text-xs text-zinc-600">vazio</span>
                  ) : (
                    balde.map((entrada, j) => (
                      <div key={entrada.chave} className="flex items-center gap-2">
                        {j > 0 && <span className="text-zinc-600">→</span>}
                        <span
                          className={`rounded-lg px-3 py-1.5 font-mono text-xs ${
                            ativo && entrada.chave === destaque?.chave
                              ? "bg-amber-500 font-semibold text-amber-950"
                              : "bg-zinc-800 text-zinc-300"
                          }`}
                        >
                          {entrada.chave}
                          {entrada.valor && (
                            <span className="ml-2 opacity-70">
                              {entrada.valor}
                            </span>
                          )}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className={`mt-1 text-2xl font-semibold ${tone}`}>{value}</div>
    </div>
  );
}
