"use client";

import { recommend } from "@/lib/recommendation";
import { Method, User } from "@/types/recommendation";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";

const MOVIES = ["Velocidade Máxima", "Noite de Risadas", "Cartas ao Vento", "Galáxia Zero", "A Casa Escura"];
const NEW_MOVIE = "Horizonte Azul";

// notas de 1 a 5 inventadas para este exemplo
const VOCE = [5, 4, 2, 5, 1];

const OTHERS: User[] = [
  { name: "Bia", ratings: [2, 1, 1, 2, 1], newRating: 5 },
  { name: "Caio", ratings: [4, 4, 4, 4, 4], newRating: 2 },
  { name: "Davi", ratings: [5, 5, 5, 5, 5], newRating: 3 },
  { name: "Eva", ratings: [1, 5, 5, 1, 5], newRating: 1 },
];

const METHODS: Record<Method, { title: string; explanation: string; unit: string }> = {
  euclidean: {
    title: "Distância comum",
    explanation:
      "Compara as notas diretamente. Funciona se todos usam a escala do mesmo jeito, mas falha quando uns dão sempre notas altas e outros sempre baixas.",
    unit: "distância",
  },
  normalized: {
    title: "Notas normalizadas",
    explanation:
      "Subtrai de cada nota a média da própria pessoa antes de comparar. Assim, o que conta é o quanto ela gostou de cada filme em relação ao seu padrão.",
    unit: "distância",
  },
  cosine: {
    title: "Similaridade do cosseno",
    explanation:
      "Compara a direção das notas, não o tamanho. Vai de −1 a 1: quanto mais perto de 1, mais parecidos os gostos, mesmo com escalas diferentes.",
    unit: "similaridade",
  },
};

const num = (n: number) => n.toFixed(2).replace(".", ",");

export default function MovieRecommendation() {
  const [method, setMethod] = useState<Method>("euclidean");
  const [k, setK] = useState(1);

  const result = recommend(VOCE, OTHERS, method, k);
  const predictions = (Object.keys(METHODS) as Method[]).map((m) => ({
    method: m,
    prediction: recommend(VOCE, OTHERS, m, k).prediction,
    neighbors: recommend(VOCE, OTHERS, m, k).chosenSet.map((v) => v.user.name),
  }));

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">KNN: recomendação de filmes</h1>
        <p className="text-zinc-400">
          O livro usa o KNN para recomendar filmes: cada pessoa vira um ponto
          cujas coordenadas são as notas que deu, e quem tem gostos parecidos
          fica por perto. Para prever a nota de um filme que você ainda não viu,
          tira-se a média das notas dos vizinhos. O ponto delicado é medir a
          semelhança: nem todo mundo usa a escala de notas do mesmo jeito.
        </p>
        <Explanation
          simple={EXPLANATIONS.movieRecommendation.simple}
          technique={EXPLANATIONS.movieRecommendation.technique}
          code={CODES.recommendation}
        />
      </header>

      <section className="fade-up flex flex-col gap-4">
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/60 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Pessoa</th>
                {MOVIES.map((f) => (
                  <th key={f} className="px-3 py-3 text-center font-medium">
                    {f}
                  </th>
                ))}
                <th className="px-3 py-3 text-center font-medium text-emerald-400">{NEW_MOVIE}</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              <tr className="border-t border-zinc-800 bg-emerald-500/5">
                <td className="px-4 py-3 font-sans font-medium text-emerald-300">Você</td>
                {VOCE.map((n, i) => (
                  <td key={i} className="px-3 py-3 text-center text-zinc-100">{n}</td>
                ))}
                <td className="px-3 py-3 text-center text-zinc-400">?</td>
              </tr>
              {OTHERS.map((u) => (
                <tr key={u.name} className="border-t border-zinc-800">
                  <td className="px-4 py-3 font-sans text-zinc-300">{u.name}</td>
                  {u.ratings.map((n, i) => (
                    <td key={i} className="px-3 py-3 text-center text-zinc-300">{n}</td>
                  ))}
                  <td className="px-3 py-3 text-center text-emerald-400">{u.newRating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-zinc-500">
          Quem é parecido com você? Bia tem o mesmo gosto, só dá notas mais
          baixas. Caio e Davi dão notas altas a tudo. Eva tem gosto oposto.
        </p>
      </section>

      <section className="fade-up flex flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(METHODS) as Method[]).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`cursor-pointer rounded-xl border px-4 py-2 text-sm transition-colors ${
                  m === method
                    ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                    : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                {METHODS[m].title}
              </button>
            ))}
          </div>
          <p className="text-sm text-zinc-400">{METHODS[method].explanation}</p>
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            <span className="flex items-center justify-between">
              Número de vizinhos (k)
              <span className="font-mono text-lg text-emerald-400">{k}</span>
            </span>
            <input
              type="range"
              min={1}
              max={OTHERS.length}
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </label>
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="text-xs uppercase tracking-wider text-zinc-500">
            Mais parecidos com você ({METHODS[method].unit})
          </div>
          <ol className="flex flex-col gap-1 text-sm">
            {result.ranking.map((v, i) => {
              const chosenOne = i < k;
              return (
                <li
                  key={v.user.name}
                  className={`flex items-center gap-3 rounded-lg px-3 py-1.5 ${
                    chosenOne ? "bg-emerald-500/10 text-zinc-100" : "bg-zinc-900 text-zinc-500"
                  }`}
                >
                  <span className="w-5 font-mono text-xs">{i + 1}.</span>
                  <span className="w-14">{v.user.name}</span>
                  <span className="font-mono text-xs">{num(v.measure)}</span>
                  <span className="ml-auto font-mono text-xs">
                    {chosenOne ? `deu ${v.user.newRating} a ${NEW_MOVIE}` : "fora dos k vizinhos"}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="text-sm text-zinc-400">
            Nota prevista para <span className="text-zinc-200">{NEW_MOVIE}</span>:
          </div>
          <div className="mt-1 text-3xl font-semibold text-emerald-400">
            {num(result.prediction)}
          </div>
          <div className="mt-1 font-mono text-xs text-zinc-500">
            média de {result.chosenSet.map((v) => v.user.newRating).join(" + ")} ÷ {k}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/60 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Método (k = {k})</th>
                <th className="px-4 py-3 font-medium">Vizinhos</th>
                <th className="px-4 py-3 text-right font-medium">Nota prevista</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((p) => (
                <tr key={p.method} className="border-t border-zinc-800">
                  <td className="px-4 py-3 text-zinc-300">{METHODS[p.method].title}</td>
                  <td className="px-4 py-3 text-zinc-400">{p.neighbors.join(", ")}</td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-400">{num(p.prediction)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-zinc-400">
          Com k = 1, a distância comum escolhe Caio, que dá nota 4 a tudo e
          nada tem a ver com o seu gosto. A normalização e o cosseno acham Bia,
          que gosta e desgosta dos mesmos filmes que você.
        </p>
      </section>

      <section className="fade-up flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-sm text-zinc-400">
        <h2 className="text-lg font-semibold text-zinc-100">Escolher boas características</h2>
        <p>
          O resultado do KNN depende dos atributos escolhidos. Eles devem ter
          relação direta com o que se quer prever e não podem ser enviesados:
          se todos os filmes avaliados forem de um único gênero, o sistema só
          aprenderá os gostos daquele gênero. Neste exemplo, as características
          são as notas de 5 filmes, e a previsão é de um sexto. Os dados são
          inventados por mim, não os do livro.
        </p>
      </section>
    </main>
  );
}
