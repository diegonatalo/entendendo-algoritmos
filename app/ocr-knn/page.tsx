"use client";

import {
  ALTURA,
  LARGURA,
  modeloDoDigito,
  reconhecerDigito,
} from "@/functions/ocr";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";
import { Stat } from "../components/ui";

const VAZIO = Array(LARGURA * ALTURA).fill(0);

function MiniGrade({ pixels }: { pixels: number[] }) {
  return (
    <div
      className="grid gap-px"
      style={{ gridTemplateColumns: `repeat(${LARGURA}, 0.5rem)` }}
      aria-hidden
    >
      {pixels.map((p, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-[1px] ${p ? "bg-zinc-200" : "bg-zinc-800"}`}
        />
      ))}
    </div>
  );
}

export default function OcrKnn() {
  const [pixels, setPixels] = useState<number[]>(modeloDoDigito(3));
  const [k, setK] = useState(5);

  const vazio = pixels.every((p) => p === 0);
  const resultado = vazio ? null : reconhecerDigito(pixels, k);
  const maxVotos = resultado ? Math.max(...resultado.votos) : 1;

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">OCR com KNN</h1>
        <p className="text-zinc-400">
          OCR é reconhecer caracteres em imagens. O livro mostra que o KNN
          resolve isso: cada imagem vira uma lista de características (aqui,
          os 35 pixels de uma grade 5 × 7) e o dígito é o mais comum entre as
          imagens de treino mais parecidas. Desenhe um número e veja quem são
          os vizinhos.
        </p>
        <Explicacao
          simples={EXPLICACOES.ocrKnn.simples}
          tecnica={EXPLICACOES.ocrKnn.tecnica}
          codigo={CODIGOS.ocr}
        />
      </header>

      <section className="fade-up grid gap-6 md:grid-cols-[auto_1fr]">
        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="text-sm text-zinc-300">Clique nos quadrados para desenhar</div>
          <div
            className="mx-auto grid gap-1"
            style={{ gridTemplateColumns: `repeat(${LARGURA}, 2.5rem)` }}
          >
            {pixels.map((p, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Pixel ${i + 1}: ${p ? "aceso" : "apagado"}`}
                aria-pressed={p === 1}
                onClick={() => setPixels(pixels.map((v, j) => (j === i ? 1 - v : v)))}
                className={`h-10 w-10 cursor-pointer rounded-md border transition-colors ${
                  p
                    ? "border-emerald-400 bg-emerald-500"
                    : "border-zinc-700 bg-zinc-900 hover:border-zinc-500"
                }`}
              />
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-xs uppercase tracking-wider text-zinc-500">
              Começar de um dígito
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 10 }, (_, d) => (
                <button
                  key={d}
                  onClick={() => setPixels(modeloDoDigito(d))}
                  className="h-8 w-8 cursor-pointer rounded-lg border border-zinc-700 font-mono text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
                >
                  {d}
                </button>
              ))}
              <button
                onClick={() => setPixels(VAZIO)}
                className="cursor-pointer rounded-lg px-3 text-sm text-zinc-500 hover:text-zinc-300"
              >
                Limpar
              </button>
            </div>
          </div>

          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            <span className="flex items-center justify-between">
              Número de vizinhos (k)
              <span className="font-mono text-lg text-emerald-400">{k}</span>
            </span>
            <input
              type="range"
              min={1}
              max={9}
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </label>
        </div>

        <div className="flex flex-col gap-4">
          {resultado ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Stat
                  label="Dígito reconhecido"
                  value={String(resultado.digito)}
                  tone="text-emerald-400"
                />
                <Stat
                  label="Pixels diferentes do vizinho mais próximo"
                  value={String(resultado.vizinhos[0].distancia)}
                  tone="text-amber-400"
                />
              </div>

              <div className="flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="text-xs uppercase tracking-wider text-zinc-500">
                  Votação entre os {k} vizinhos
                </div>
                {resultado.votos.map((v, d) =>
                  v > 0 ? (
                    <div key={d} className="flex items-center gap-3 text-sm">
                      <span className="w-4 font-mono text-zinc-300">{d}</span>
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className={`h-full transition-all ${d === resultado.digito ? "bg-emerald-500" : "bg-zinc-500"}`}
                          style={{ width: `${(v / maxVotos) * 100}%` }}
                        />
                      </div>
                      <span className="w-6 text-right font-mono text-zinc-400">{v}</span>
                    </div>
                  ) : null,
                )}
              </div>

              <div className="flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="text-xs uppercase tracking-wider text-zinc-500">
                  Vizinhos mais próximos
                </div>
                <ol className="flex flex-wrap gap-3">
                  {resultado.vizinhos.map((v, i) => (
                    <li
                      key={i}
                      className="flex flex-col items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 p-2"
                    >
                      <MiniGrade pixels={v.exemplo.pixels} />
                      <span className="font-mono text-xs text-zinc-300">
                        {v.exemplo.digito}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-600">
                        dist. {v.distancia}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <p className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-sm text-zinc-500">
              Desenhe algo na grade para reconhecer o dígito.
            </p>
          )}
        </div>
      </section>

      <p className="text-xs text-zinc-500">
        O treino tem 30 imagens: o modelo de cada dígito e duas versões com 3
        pixels trocados. A distância entre duas imagens é o número de pixels em
        que elas diferem. É uma demonstração simples: um OCR real usa imagens
        maiores e muito mais exemplos.
      </p>
    </main>
  );
}
