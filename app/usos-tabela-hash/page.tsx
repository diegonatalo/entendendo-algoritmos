"use client";

import {
  CUSTO_ACERTO_MS,
  CUSTO_FALHA_MS,
  consultarCache,
  votar,
} from "@/functions/usosHash";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";
import { Stat, botaoPrimario } from "../components/ui";

const inputClass =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30";

const botaoSecundario =
  "cursor-pointer rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100";

const NOMES_EXEMPLO = [
  "ana", "bruno", "carla", "diego", "elisa", "fabio", "gabi", "hugo", "iris", "joao",
];

const PAGINAS = ["/inicio", "/produtos", "/sobre", "/contato"];

type EntradaVoto = { nome: string; aceito: boolean; comparacoesLista: number };
type EntradaCache = { url: string; acerto: boolean; custoMs: number };

export default function UsosTabelaHash() {
  const [votantes, setVotantes] = useState<string[]>([]);
  const [votos, setVotos] = useState<EntradaVoto[]>([]);
  const [cache, setCache] = useState<string[]>([]);
  const [acessos, setAcessos] = useState<EntradaCache[]>([]);

  function registrarVoto(nome: string, base: string[]): string[] {
    const r = votar(base, nome);
    setVotos((v) => [
      { nome: nome.trim().toLowerCase(), aceito: r.aceito, comparacoesLista: r.comparacoesLista },
      ...v,
    ]);
    return r.votantes;
  }

  function acessar(url: string) {
    const r = consultarCache(cache, url);
    setCache(r.cache);
    setAcessos((a) => [{ url, acerto: r.acerto, custoMs: r.custoMs }, ...a]);
  }

  const totalLista = votos.reduce((s, v) => s + v.comparacoesLista, 0);
  const rejeitados = votos.filter((v) => !v.aceito).length;

  const acertos = acessos.filter((a) => a.acerto).length;
  const tempoComCache = acessos.reduce((s, a) => s + a.custoMs, 0);
  const tempoSemCache = acessos.length * CUSTO_FALHA_MS;

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-14 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Usos da tabela hash</h1>
        <p className="text-zinc-400">
          Além de guardar pares chave → valor, a tabela hash resolve, em tempo
          O(1), dois problemas práticos que o livro destaca: saber se algo já
          foi visto (duplicatas) e guardar respostas para não repetir um
          trabalho caro (cache).
        </p>
        <Explicacao
          simples={EXPLICACOES.usosTabelaHash.simples}
          tecnica={EXPLICACOES.usosTabelaHash.tecnica}
          codigo={CODIGOS.usosHash}
        />
      </header>

      <section className="fade-up flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">1. Detectar duplicatas: a votação</h2>
          <p className="text-sm text-zinc-400">
            Cada pessoa só pode votar uma vez. Antes de aceitar um voto, o
            sistema precisa saber se o nome já votou. Em uma lista, é preciso
            comparar com cada nome; em uma tabela hash, é uma única consulta.
          </p>
        </div>

        <form
          className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            const nome = e.currentTarget.nome.value.trim();
            if (!nome) return;
            setVotantes(registrarVoto(nome, votantes));
            e.currentTarget.reset();
          }}
        >
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Nome do eleitor
            <input className={inputClass} name="nome" placeholder="Ex.: ana" />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className={`${botaoPrimario} flex-1`}>
              Votar
            </button>
            <button
              type="button"
              className={botaoSecundario}
              onClick={() => {
                let atual = votantes;
                for (const nome of [...NOMES_EXEMPLO, "ana", "carla", "joao"]) {
                  atual = registrarVoto(nome, atual);
                }
                setVotantes(atual);
              }}
            >
              Carregar votos de exemplo
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-xl px-4 py-2 text-sm text-zinc-500 hover:text-zinc-300"
              onClick={() => {
                setVotantes([]);
                setVotos([]);
              }}
            >
              Limpar
            </button>
          </div>
        </form>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Votos aceitos" value={String(votantes.length)} tone="text-emerald-400" />
          <Stat label="Duplicatas barradas" value={String(rejeitados)} tone="text-red-400" />
          <Stat
            label="Comparações: lista × hash"
            value={`${totalLista} × ${votos.length}`}
            tone="text-amber-400"
          />
        </div>

        {votos.length > 0 && (
          <ol className="flex max-h-72 flex-col gap-1 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3 text-sm">
            {votos.map((v, i) => (
              <li
                key={votos.length - i}
                className="flex items-center gap-3 rounded-lg bg-zinc-900 px-3 py-1.5"
              >
                <span className="w-16 font-mono text-zinc-200">{v.nome}</span>
                <span className={v.aceito ? "text-emerald-400" : "text-red-400"}>
                  {v.aceito ? "voto aceito" : "já votou: barrado"}
                </span>
                <span className="ml-auto font-mono text-xs text-zinc-500">
                  lista: {v.comparacoesLista}{" "}
                  {v.comparacoesLista === 1 ? "comparação" : "comparações"} · hash: 1 consulta
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="fade-up flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">2. Guardar respostas: o cache</h2>
          <p className="text-sm text-zinc-400">
            Gerar uma página no servidor é caro. O cache é uma tabela hash cuja
            chave é o endereço da página e cujo valor é a página pronta: se já
            está lá, devolve na hora; senão, gera, guarda e devolve. Neste
            exemplo, buscar no servidor custa {CUSTO_FALHA_MS} ms e usar o cache
            custa {CUSTO_ACERTO_MS} ms.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="text-sm text-zinc-300">Acessar uma página</div>
          <div className="flex flex-wrap gap-2">
            {PAGINAS.map((p) => (
              <button key={p} className={botaoSecundario} onClick={() => acessar(p)}>
                {p}
              </button>
            ))}
            <button
              className="cursor-pointer rounded-xl px-4 py-2 text-sm text-zinc-500 hover:text-zinc-300"
              onClick={() => {
                setCache([]);
                setAcessos([]);
              }}
            >
              Limpar
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat
            label="Acertos no cache"
            value={`${acertos} de ${acessos.length}`}
            tone="text-emerald-400"
          />
          <Stat label="Tempo com cache" value={`${tempoComCache} ms`} tone="text-emerald-400" />
          <Stat label="Tempo sem cache" value={`${tempoSemCache} ms`} tone="text-amber-400" />
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="text-xs uppercase tracking-wider text-zinc-500">
            Guardado no cache
          </div>
          <div className="flex min-h-9 flex-wrap gap-1.5">
            {cache.length === 0 ? (
              <span className="text-xs text-zinc-600">vazio</span>
            ) : (
              cache.map((url) => (
                <span key={url} className="rounded-lg bg-zinc-800 px-2.5 py-1.5 font-mono text-xs text-zinc-300">
                  {url}
                </span>
              ))
            )}
          </div>
        </div>

        {acessos.length > 0 && (
          <ol className="flex max-h-72 flex-col gap-1 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3 text-sm">
            {acessos.map((a, i) => (
              <li
                key={acessos.length - i}
                className="flex items-center gap-3 rounded-lg bg-zinc-900 px-3 py-1.5"
              >
                <span className="w-24 font-mono text-zinc-200">{a.url}</span>
                <span className={a.acerto ? "text-emerald-400" : "text-amber-400"}>
                  {a.acerto ? "acerto: veio do cache" : "falha: buscou no servidor e guardou"}
                </span>
                <span className="ml-auto font-mono text-xs text-zinc-500">{a.custoMs} ms</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
