"use client";

import { lerNumeros } from "../entrada";
import { euclides, somaRecursiva } from "@/functions/euclides";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";
import { ControlesPassos, Stat, botaoPrimario, inputClass } from "../components/ui";

const MAX_MEDIDA = 2000;

const PALETA = ["#34d399", "#38bdf8", "#a78bfa", "#fbbf24", "#fb7185", "#2dd4bf"];

export default function DividirConquistar() {
  const [medidas, setMedidas] = useState<{ largura: number; altura: number } | null>(null);
  const [passoAtual, setPassoAtual] = useState(0);
  const [erro, setErro] = useState("");

  const [textoLista, setTextoLista] = useState("2, 4, 6");
  const [lista, setLista] = useState([2, 4, 6]);
  const [erroLista, setErroLista] = useState("");

  const resultado = medidas ? euclides(medidas.largura, medidas.altura) : null;
  const passo = resultado?.passos[passoAtual];
  const chamadas = somaRecursiva(lista);

  function handleTerreno(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const largura = Number(e.currentTarget.largura.value);
    const altura = Number(e.currentTarget.altura.value);
    if (
      !Number.isInteger(largura) || !Number.isInteger(altura) ||
      largura < 1 || altura < 1 || largura > MAX_MEDIDA || altura > MAX_MEDIDA
    ) {
      setErro(`Use números inteiros de 1 a ${MAX_MEDIDA}.`);
      return;
    }
    setErro("");
    setMedidas({ largura, altura });
    setPassoAtual(0);
  }

  function handleLista(e: React.FormEvent) {
    e.preventDefault();
    const numeros = lerNumeros(textoLista);
    if (numeros.length > 8 || numeros.some((n) => !Number.isFinite(n))) {
      setErroLista("Digite até 8 números, separados por vírgula.");
      return;
    }
    setErroLista("");
    setLista(numeros);
  }

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dividir para conquistar</h1>
        <p className="text-zinc-400">
          Uma técnica recursiva para resolver problemas: (1) descubra o caso
          base mais simples; (2) reduza o problema até ele virar o caso base.
          O quicksort usa essa técnica. Aqui estão os dois exemplos que o livro
          usa para introduzi-la.
        </p>
        <Explicacao
          simples={EXPLICACOES.divisaoConquista.simples}
          tecnica={EXPLICACOES.divisaoConquista.tecnica}
          codigo={CODIGOS.divisaoConquista}
        />
      </header>

      <section className="fade-up flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">1. O terreno e o algoritmo de Euclides</h2>
          <p className="text-sm text-zinc-400">
            Divida um terreno retangular em quadrados iguais, os maiores
            possíveis. Caso base: quando um lado divide o outro, o terreno já é
            feito de quadrados iguais. Senão, corte o maior quadrado que cabe e
            repita com a sobra. O lado final é o maior divisor comum (MDC) das
            duas medidas.
          </p>
        </div>

        <form
          className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
          onSubmit={handleTerreno}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
              Largura
              <input
                className={inputClass}
                name="largura"
                type="number"
                min={1}
                max={MAX_MEDIDA}
                defaultValue={1680}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
              Altura
              <input
                className={inputClass}
                name="altura"
                type="number"
                min={1}
                max={MAX_MEDIDA}
                defaultValue={640}
              />
            </label>
          </div>
          {erro && <p className="text-sm text-red-400">{erro}</p>}
          <button className={botaoPrimario} type="submit">
            Dividir o terreno
          </button>
        </form>

        {resultado && medidas && passo && (
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat
                label="MDC"
                value={String(resultado.mdc)}
                tone="text-emerald-400"
              />
              <Stat
                label="Quadrados no fim"
                value={String(resultado.quadrados.length)}
                tone="text-amber-400"
              />
              <Stat
                label="Passo"
                value={`${passoAtual + 1} / ${resultado.passos.length}`}
                tone="text-zinc-100"
              />
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium text-amber-400">{passo.descricao}</p>
                <ControlesPassos passoAtual={passoAtual} total={resultado.passos.length} onChange={setPassoAtual} />
              </div>

              <svg
                viewBox={`0 0 ${medidas.largura} ${medidas.altura}`}
                className="mx-auto max-h-96 w-full max-w-xl rounded-lg bg-zinc-950"
                role="img"
                aria-label="Terreno dividido em quadrados"
              >
                {resultado.quadrados
                  .filter((q) => q.passo <= passoAtual)
                  .map((q, i) => (
                    <rect
                      key={i}
                      x={q.x}
                      y={q.y}
                      width={q.lado}
                      height={q.lado}
                      fill={PALETA[q.passo % PALETA.length]}
                      fillOpacity={q.passo === passoAtual ? 0.95 : 0.45}
                      stroke="#09090b"
                      strokeWidth={Math.max(medidas.largura, medidas.altura) / 300}
                    />
                  ))}
              </svg>
              <p className="text-xs text-zinc-500">
                O quadrado novo de cada passo aparece mais forte; os anteriores
                ficam mais claros.
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="fade-up flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">2. Soma recursiva de uma lista</h2>
          <p className="text-sm text-zinc-400">
            Caso base: a lista vazia soma 0. Caso recursivo: o primeiro item
            mais a soma do resto. A recursão desce até a lista vazia e depois os
            resultados voltam somando.
          </p>
        </div>

        <form
          className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
          onSubmit={handleLista}
        >
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Números a somar
            <input
              className={inputClass}
              value={textoLista}
              onChange={(e) => setTextoLista(e.target.value)}
              placeholder="Ex.: 2, 4, 6"
            />
          </label>
          {erroLista && <p className="text-sm text-red-400">{erroLista}</p>}
          <button className={botaoPrimario} type="submit">
            Somar recursivamente
          </button>
        </form>

        <ol className="flex flex-col gap-1.5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 font-mono text-sm">
          {chamadas.map((c) => {
            const [primeiro, ...resto] = c.lista;
            const base = c.lista.length === 0;
            return (
              <li
                key={c.profundidade}
                style={{ paddingLeft: `${c.profundidade * 1.25}rem` }}
                className={base ? "text-sky-400" : "text-zinc-300"}
              >
                soma([{c.lista.join(", ")}]) ={" "}
                {base ? (
                  <span>0 <span className="text-zinc-500">(caso base)</span></span>
                ) : (
                  <span>
                    {primeiro} + soma([{resto.join(", ")}]) ={" "}
                    <span className="text-emerald-400">{c.resultado}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}
