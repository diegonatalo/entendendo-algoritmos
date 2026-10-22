"use client";

import { recomendar } from "@/functions/recomendacao";
import { Metodo, Usuario } from "@/@types/recomendacao";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";

const FILMES = ["Velocidade Máxima", "Noite de Risadas", "Cartas ao Vento", "Galáxia Zero", "A Casa Escura"];
const FILME_NOVO = "Horizonte Azul";

// notas de 1 a 5 inventadas para este exemplo
const VOCE = [5, 4, 2, 5, 1];

const OUTROS: Usuario[] = [
  { nome: "Bia", notas: [2, 1, 1, 2, 1], notaNova: 5 },
  { nome: "Caio", notas: [4, 4, 4, 4, 4], notaNova: 2 },
  { nome: "Davi", notas: [5, 5, 5, 5, 5], notaNova: 3 },
  { nome: "Eva", notas: [1, 5, 5, 1, 5], notaNova: 1 },
];

const METODOS: Record<Metodo, { titulo: string; explicacao: string; unidade: string }> = {
  euclidiana: {
    titulo: "Distância comum",
    explicacao:
      "Compara as notas diretamente. Funciona se todos usam a escala do mesmo jeito, mas falha quando uns dão sempre notas altas e outros sempre baixas.",
    unidade: "distância",
  },
  normalizada: {
    titulo: "Notas normalizadas",
    explicacao:
      "Subtrai de cada nota a média da própria pessoa antes de comparar. Assim, o que conta é o quanto ela gostou de cada filme em relação ao seu padrão.",
    unidade: "distância",
  },
  cosseno: {
    titulo: "Similaridade do cosseno",
    explicacao:
      "Compara a direção das notas, não o tamanho. Vai de −1 a 1: quanto mais perto de 1, mais parecidos os gostos, mesmo com escalas diferentes.",
    unidade: "similaridade",
  },
};

const num = (n: number) => n.toFixed(2).replace(".", ",");

export default function RecomendacaoFilmes() {
  const [metodo, setMetodo] = useState<Metodo>("euclidiana");
  const [k, setK] = useState(1);

  const resultado = recomendar(VOCE, OUTROS, metodo, k);
  const previsoes = (Object.keys(METODOS) as Metodo[]).map((m) => ({
    metodo: m,
    previsao: recomendar(VOCE, OUTROS, m, k).previsao,
    vizinhos: recomendar(VOCE, OUTROS, m, k).escolhidos.map((v) => v.usuario.nome),
  }));

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">KNN: recomendação de filmes</h1>
        <p className="text-zinc-400">
          O livro usa o KNN para recomendar filmes: cada pessoa vira um ponto
          cujas coordenadas são as notas que deu, e quem tem gostos parecidos
          fica por perto. Para prever a nota de um filme que você ainda não viu,
          tira-se a média das notas dos vizinhos. O ponto delicado é medir a
          semelhança: nem todo mundo usa a escala de notas do mesmo jeito.
        </p>
        <Explicacao
          simples={EXPLICACOES.recomendacaoFilmes.simples}
          tecnica={EXPLICACOES.recomendacaoFilmes.tecnica}
          codigo={CODIGOS.recomendacao}
        />
      </header>

      <section className="fade-up flex flex-col gap-4">
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/60 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Pessoa</th>
                {FILMES.map((f) => (
                  <th key={f} className="px-3 py-3 text-center font-medium">
                    {f}
                  </th>
                ))}
                <th className="px-3 py-3 text-center font-medium text-emerald-400">{FILME_NOVO}</th>
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
              {OUTROS.map((u) => (
                <tr key={u.nome} className="border-t border-zinc-800">
                  <td className="px-4 py-3 font-sans text-zinc-300">{u.nome}</td>
                  {u.notas.map((n, i) => (
                    <td key={i} className="px-3 py-3 text-center text-zinc-300">{n}</td>
                  ))}
                  <td className="px-3 py-3 text-center text-emerald-400">{u.notaNova}</td>
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
            {(Object.keys(METODOS) as Metodo[]).map((m) => (
              <button
                key={m}
                onClick={() => setMetodo(m)}
                className={`cursor-pointer rounded-xl border px-4 py-2 text-sm transition-colors ${
                  m === metodo
                    ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                    : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                {METODOS[m].titulo}
              </button>
            ))}
          </div>
          <p className="text-sm text-zinc-400">{METODOS[metodo].explicacao}</p>
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            <span className="flex items-center justify-between">
              Número de vizinhos (k)
              <span className="font-mono text-lg text-emerald-400">{k}</span>
            </span>
            <input
              type="range"
              min={1}
              max={OUTROS.length}
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </label>
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="text-xs uppercase tracking-wider text-zinc-500">
            Mais parecidos com você ({METODOS[metodo].unidade})
          </div>
          <ol className="flex flex-col gap-1 text-sm">
            {resultado.ranking.map((v, i) => {
              const escolhido = i < k;
              return (
                <li
                  key={v.usuario.nome}
                  className={`flex items-center gap-3 rounded-lg px-3 py-1.5 ${
                    escolhido ? "bg-emerald-500/10 text-zinc-100" : "bg-zinc-900 text-zinc-500"
                  }`}
                >
                  <span className="w-5 font-mono text-xs">{i + 1}.</span>
                  <span className="w-14">{v.usuario.nome}</span>
                  <span className="font-mono text-xs">{num(v.medida)}</span>
                  <span className="ml-auto font-mono text-xs">
                    {escolhido ? `deu ${v.usuario.notaNova} a ${FILME_NOVO}` : "fora dos k vizinhos"}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="text-sm text-zinc-400">
            Nota prevista para <span className="text-zinc-200">{FILME_NOVO}</span>:
          </div>
          <div className="mt-1 text-3xl font-semibold text-emerald-400">
            {num(resultado.previsao)}
          </div>
          <div className="mt-1 font-mono text-xs text-zinc-500">
            média de {resultado.escolhidos.map((v) => v.usuario.notaNova).join(" + ")} ÷ {k}
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
              {previsoes.map((p) => (
                <tr key={p.metodo} className="border-t border-zinc-800">
                  <td className="px-4 py-3 text-zinc-300">{METODOS[p.metodo].titulo}</td>
                  <td className="px-4 py-3 text-zinc-400">{p.vizinhos.join(", ")}</td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-400">{num(p.previsao)}</td>
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
