"use client";

import { rotaForcaBruta, rotaVizinhoMaisProximo } from "@/functions/caixeiro";
import { Cidade, Rota } from "@/@types/caixeiro";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";
import { Stat } from "../components/ui";

const CIDADES: Cidade[] = [
  { nome: "A", x: 30, y: 42 },
  { nome: "B", x: 54, y: 89 },
  { nome: "C", x: 73, y: 91 },
  { nome: "D", x: 59, y: 11 },
  { nome: "E", x: 55, y: 47 },
  { nome: "F", x: 49, y: 66 },
  { nome: "G", x: 8, y: 87 },
  { nome: "H", x: 24, y: 82 },
  { nome: "I", x: 62, y: 77 },
];

function fatorial(n: number): number {
  return n <= 1 ? 1 : n * fatorial(n - 1);
}

function Mapa({
  cidades,
  rota,
  cor,
  titulo,
}: {
  cidades: Cidade[];
  rota: Rota;
  cor: string;
  titulo: string;
}) {
  const pontos = rota.ordem.map((i) => cidades[i]);
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-semibold">{titulo}</h2>
        <span className="font-mono text-sm text-zinc-300">
          {rota.comprimento.toFixed(1).replace(".", ",")}
        </span>
      </div>
      <svg viewBox="-8 -8 116 116" className="w-full" role="img" aria-label={titulo}>
        <rect
          x={-8}
          y={-8}
          width={116}
          height={116}
          rx={3}
          className="fill-zinc-950"
        />
        <polygon
          points={pontos.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke={cor}
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
        {cidades.map((c, i) => (
          <g key={c.nome}>
            <circle
              cx={c.x}
              cy={c.y}
              r={4.2}
              className={i === 0 ? "fill-zinc-100" : "fill-zinc-800"}
              stroke={cor}
              strokeWidth={0.8}
            />
            <text
              x={c.x}
              y={c.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={4.5}
              className={`font-mono font-semibold ${i === 0 ? "fill-zinc-950" : "fill-zinc-100"}`}
            >
              {c.nome}
            </text>
          </g>
        ))}
      </svg>
      <p className="font-mono text-xs text-zinc-500">
        {rota.ordem.map((i) => cidades[i].nome).join(" → ")} → {cidades[0].nome}
      </p>
    </div>
  );
}

export default function CaixeiroViajante() {
  const [n, setN] = useState(7);

  const { cidades, gulosa, otima } = useMemo(() => {
    const cidades = CIDADES.slice(0, n);
    return {
      cidades,
      gulosa: rotaVizinhoMaisProximo(cidades),
      otima: rotaForcaBruta(cidades),
    };
  }, [n]);

  const excesso = (gulosa.comprimento / otima.comprimento - 1) * 100;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Caixeiro-viajante</h1>
        <p className="text-zinc-400">
          Visitar todas as cidades e voltar ao início pelo caminho mais curto. É
          um problema NP-completo: não se conhece algoritmo rápido que garanta
          a melhor rota. A força bruta testa todas as ordens, cuja quantidade
          cresce como o fatorial. A alternativa é uma aproximação gulosa.
        </p>
        <Explicacao
          simples={EXPLICACOES.caixeiroViajante.simples}
          tecnica={EXPLICACOES.caixeiroViajante.tecnica}
          codigo={CODIGOS.caixeiro}
        />
      </header>

      <section className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <label className="flex items-center justify-between text-sm text-zinc-300">
          <span>Número de cidades</span>
          <span className="font-mono text-lg text-emerald-400">{n}</span>
        </label>
        <input
          type="range"
          min={4}
          max={CIDADES.length}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="w-full accent-emerald-500"
          aria-label="Número de cidades"
        />
      </section>

      <section className="fade-up flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat
            label="Rotas testadas (força bruta)"
            value={otima.permutacoes.toLocaleString("pt-BR")}
            tone="text-amber-400"
          />
          <Stat
            label="Rotas testadas (guloso)"
            value="1"
            tone="text-emerald-400"
          />
          <Stat
            label="Guloso é mais longo em"
            value={
              excesso < 0.05 ? "0%" : `${excesso.toFixed(1).replace(".", ",")}%`
            }
            tone={excesso < 0.05 ? "text-emerald-400" : "text-rose-400"}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Mapa
            cidades={cidades}
            rota={gulosa}
            cor="#fbbf24"
            titulo="Vizinho mais próximo (guloso)"
          />
          <Mapa
            cidades={cidades}
            rota={otima}
            cor="#34d399"
            titulo="Melhor rota (força bruta)"
          />
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-400">
          Com {n} cidades há {fatorial(n - 1).toLocaleString("pt-BR")} rotas
          para testar ((n − 1)!). Com 10 cidades seriam{" "}
          {fatorial(9).toLocaleString("pt-BR")}; com 15, mais de 87 bilhões.
          Por isso, para problemas NP-completos, o livro recomenda aceitar uma
          solução aproximada em vez da exata. O guloso nem sempre acha a melhor
          rota, mas custa quase nada. A cidade A (branca) é o ponto de partida
          e de chegada.
        </div>
      </section>

      <section className="fade-up flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Como reconhecer um problema NP-completo</h2>
          <p className="text-sm text-zinc-400">
            Provar que um problema é NP-completo é difícil, mas o livro dá
            pistas práticas para suspeitar. São regras de bolso, não provas.
          </p>
        </div>

        <ol className="grid gap-3 md:grid-cols-2">
          {[
            {
              titulo: "Rápido com poucos itens, lento com muitos",
              texto:
                "Se o seu algoritmo roda bem com 5 itens e fica impraticável com 20, desconfie. Arraste o controle acima de 4 para 9 cidades e veja o número de rotas disparar.",
            },
            {
              titulo: "Pede \"todas as combinações de X\"",
              texto:
                "Se a solução óbvia é testar todas as ordens ou todos os subconjuntos, como a força bruta desta página, o problema pode ser NP-completo.",
            },
            {
              titulo: "Envolve uma sequência ou um conjunto",
              texto:
                "Se a dificuldade está em escolher uma sequência (como a ordem das cidades) ou um conjunto (como as estações de rádio que cobrem todos os estados), suspeite.",
            },
            {
              titulo: "Dá para reformular como um problema conhecido?",
              texto:
                "Se você consegue reescrever o seu problema como o do caixeiro-viajante ou como a cobertura de conjuntos, ele também é NP-completo.",
            },
          ].map((dica, i) => (
            <li
              key={dica.titulo}
              className="flex flex-col gap-1.5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4"
            >
              <span className="font-mono text-xs text-emerald-400">Pista {i + 1}</span>
              <h3 className="text-sm font-semibold text-zinc-100">{dica.titulo}</h3>
              <p className="text-sm text-zinc-400">{dica.texto}</p>
            </li>
          ))}
        </ol>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-400">
          <span className="text-zinc-200">E agora?</span> Para um problema
          NP-completo não se conhece um algoritmo rápido que garanta a melhor
          solução. A saída recomendada é usar uma aproximação: o vizinho mais
          próximo aqui e a escolha gulosa das estações na página do{" "}
          <Link
            href="/algoritmo-guloso"
            className="text-emerald-400 underline-offset-2 hover:underline"
          >
            algoritmo guloso
          </Link>
          . Elas são rápidas e chegam perto, mas nem sempre acham o melhor
          resultado.
        </div>
      </section>
    </main>
  );
}
