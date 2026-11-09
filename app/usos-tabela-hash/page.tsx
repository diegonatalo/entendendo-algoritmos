"use client";

import {
  HIT_COST_MS,
  MISS_COST_MS,
  queryCache,
  vote,
} from "@/lib/hash-uses";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";
import { Stat, primaryButton, inputClass } from "@/components/ui";

const secondaryButton =
  "cursor-pointer rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100";

const EXAMPLE_NAMES = [
  "ana", "bruno", "carla", "diego", "elisa", "fabio", "gabi", "hugo", "iris", "joao",
];

const PAGES = ["/inicio", "/produtos", "/sobre", "/contato"];

type VoteEntry = { name: string; isAccepted: boolean; listComparisons: number };
type CacheEntry = { url: string; hit: boolean; costMs: number };

export default function HashTableUses() {
  const [voters, setVoters] = useState<string[]>([]);
  const [votes, setVotes] = useState<VoteEntry[]>([]);
  const [cache, setCache] = useState<string[]>([]);
  const [accesses, setAccesses] = useState<CacheEntry[]>([]);

  function registerVote(name: string, base: string[]): string[] {
    const r = vote(base, name);
    setVotes((v) => [
      { name: name.trim().toLowerCase(), isAccepted: r.isAccepted, listComparisons: r.listComparisons },
      ...v,
    ]);
    return r.voters;
  }

  function access(url: string) {
    const r = queryCache(cache, url);
    setCache(r.cache);
    setAccesses((a) => [{ url, hit: r.hit, costMs: r.costMs }, ...a]);
  }

  const listTotal = votes.reduce((s, v) => s + v.listComparisons, 0);
  const rejectedItems = votes.filter((v) => !v.isAccepted).length;

  const hits = accesses.filter((a) => a.hit).length;
  const timeWithCache = accesses.reduce((s, a) => s + a.costMs, 0);
  const timeWithoutCache = accesses.length * MISS_COST_MS;

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
        <Explanation
          simple={EXPLANATIONS.hashTableUses.simple}
          technique={EXPLANATIONS.hashTableUses.technique}
          code={CODES.hashUses}
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
            const name = e.currentTarget.userName.value.trim();
            if (!name) return;
            setVoters(registerVote(name, voters));
            e.currentTarget.reset();
          }}
        >
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Nome do eleitor
            <input className={inputClass} name="userName" placeholder="Ex.: ana" />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className={`${primaryButton} flex-1`}>
              Votar
            </button>
            <button
              type="button"
              className={secondaryButton}
              onClick={() => {
                let current = voters;
                for (const name of [...EXAMPLE_NAMES, "ana", "carla", "joao"]) {
                  current = registerVote(name, current);
                }
                setVoters(current);
              }}
            >
              Carregar votos de exemplo
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-xl px-4 py-2 text-sm text-zinc-500 hover:text-zinc-300"
              onClick={() => {
                setVoters([]);
                setVotes([]);
              }}
            >
              Limpar
            </button>
          </div>
        </form>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Votos aceitos" value={String(voters.length)} tone="text-emerald-400" />
          <Stat label="Duplicatas barradas" value={String(rejectedItems)} tone="text-red-400" />
          <Stat
            label="Comparações: lista × hash"
            value={`${listTotal} × ${votes.length}`}
            tone="text-amber-400"
          />
        </div>

        {votes.length > 0 && (
          <ol className="flex max-h-72 flex-col gap-1 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3 text-sm">
            {votes.map((v, i) => (
              <li
                key={votes.length - i}
                className="flex items-center gap-3 rounded-lg bg-zinc-900 px-3 py-1.5"
              >
                <span className="w-16 font-mono text-zinc-200">{v.name}</span>
                <span className={v.isAccepted ? "text-emerald-400" : "text-red-400"}>
                  {v.isAccepted ? "voto aceito" : "já votou: barrado"}
                </span>
                <span className="ml-auto font-mono text-xs text-zinc-500">
                  lista: {v.listComparisons}{" "}
                  {v.listComparisons === 1 ? "comparação" : "comparações"} · hash: 1 consulta
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
            exemplo, buscar no servidor custa {MISS_COST_MS} ms e usar o cache
            custa {HIT_COST_MS} ms.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="text-sm text-zinc-300">Acessar uma página</div>
          <div className="flex flex-wrap gap-2">
            {PAGES.map((p) => (
              <button key={p} className={secondaryButton} onClick={() => access(p)}>
                {p}
              </button>
            ))}
            <button
              className="cursor-pointer rounded-xl px-4 py-2 text-sm text-zinc-500 hover:text-zinc-300"
              onClick={() => {
                setCache([]);
                setAccesses([]);
              }}
            >
              Limpar
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat
            label="Acertos no cache"
            value={`${hits} de ${accesses.length}`}
            tone="text-emerald-400"
          />
          <Stat label="Tempo com cache" value={`${timeWithCache} ms`} tone="text-emerald-400" />
          <Stat label="Tempo sem cache" value={`${timeWithoutCache} ms`} tone="text-amber-400" />
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

        {accesses.length > 0 && (
          <ol className="flex max-h-72 flex-col gap-1 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3 text-sm">
            {accesses.map((a, i) => (
              <li
                key={accesses.length - i}
                className="flex items-center gap-3 rounded-lg bg-zinc-900 px-3 py-1.5"
              >
                <span className="w-24 font-mono text-zinc-200">{a.url}</span>
                <span className={a.hit ? "text-emerald-400" : "text-amber-400"}>
                  {a.hit ? "acerto: veio do cache" : "falha: buscou no servidor e guardou"}
                </span>
                <span className="ml-auto font-mono text-xs text-zinc-500">{a.costMs} ms</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
