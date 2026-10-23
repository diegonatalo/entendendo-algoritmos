"use client";

import { classificar, treinar } from "@/functions/naiveBayes";
import { Mensagem } from "@/@types/naiveBayes";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";
import { Stat } from "../components/ui";

const TREINO: Mensagem[] = [
  { texto: "ganhe dinheiro rápido agora", spam: true },
  { texto: "promoção imperdível clique aqui e ganhe prêmio", spam: true },
  { texto: "você ganhou um prêmio grátis clique agora", spam: true },
  { texto: "dinheiro fácil oferta grátis", spam: true },
  { texto: "compre agora promoção desconto grátis", spam: true },
  { texto: "clique aqui para receber seu prêmio", spam: true },
  { texto: "oferta imperdível desconto exclusivo agora", spam: true },
  { texto: "reunião amanhã às dez na sala", spam: false },
  { texto: "segue o relatório do projeto em anexo", spam: false },
  { texto: "vamos almoçar amanhã com a equipe", spam: false },
  { texto: "o documento está em anexo para revisão", spam: false },
  { texto: "confirmo a reunião de segunda", spam: false },
  { texto: "obrigado pelo envio do relatório", spam: false },
  { texto: "podemos conversar sobre o projeto amanhã", spam: false },
];

const EXEMPLOS = [
  "Clique aqui e ganhe um prêmio grátis",
  "Confirmo a reunião de amanhã sobre o projeto",
  "Oferta de desconto: reunião de vendas",
  "Olá, tudo bem?",
];

const MODELO = treinar(TREINO);

const pct = (n: number) => `${(n * 100).toFixed(1).replace(".", ",")}%`;
const num = (n: number) => n.toFixed(3).replace(".", ",");

export default function FiltroSpam() {
  const [texto, setTexto] = useState(EXEMPLOS[0]);
  const resultado = texto.trim() ? classificar(MODELO, texto) : null;
  const conhecidas = resultado?.palavras.filter((p) => p.conhecida).length ?? 0;

  const spam = resultado ? resultado.probSpam >= 0.5 : false;

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Filtro de spam: Naive Bayes</h1>
        <p className="text-zinc-400">
          O livro apresenta o Naive Bayes como um classificador simples e
          eficaz, usado em filtros de spam. Ele conta quantas vezes cada
          palavra aparece em mensagens de spam e em mensagens normais e, para
          uma mensagem nova, combina as probabilidades de todas as suas
          palavras. É &quot;ingênuo&quot; porque trata as palavras como se fossem
          independentes umas das outras.
        </p>
        <Explicacao
          simples={EXPLICACOES.filtroSpam.simples}
          tecnica={EXPLICACOES.filtroSpam.tecnica}
          codigo={CODIGOS.naiveBayes}
        />
      </header>

      <section className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
          Mensagem a classificar
          <textarea
            className="min-h-24 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-100 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            maxLength={300}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {EXEMPLOS.map((e) => (
            <button
              key={e}
              onClick={() => setTexto(e)}
              className="cursor-pointer rounded-xl border border-zinc-700 px-3 py-2.5 text-xs text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
            >
              {e}
            </button>
          ))}
        </div>
      </section>

      {resultado && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Classificação"
              value={conhecidas === 0 ? "Sem palavras conhecidas" : spam ? "Spam" : "Mensagem normal"}
              tone={conhecidas === 0 ? "text-zinc-400" : spam ? "text-red-400" : "text-emerald-400"}
              pequeno={conhecidas === 0}
            />
            <Stat label="Chance de spam" value={pct(resultado.probSpam)} tone="text-amber-400" />
            <Stat
              label="Palavras conhecidas"
              value={`${conhecidas} de ${resultado.palavras.length}`}
              tone="text-zinc-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Normal</span>
              <span>Spam</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-emerald-500/30">
              <div
                className="h-full bg-red-500 transition-all"
                style={{ width: `${resultado.probSpam * 100}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500">
              Antes de ler a mensagem, o filtro já parte de {pct(resultado.priorSpam)} de
              chance de spam, a proporção de spam no treino.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900/60 text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Palavra</th>
                  <th className="px-4 py-3 text-right font-medium">P(palavra | spam)</th>
                  <th className="px-4 py-3 text-right font-medium">P(palavra | normal)</th>
                  <th className="px-4 py-3 font-medium">Puxa para</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {resultado.palavras.map((p, i) => {
                  const razao = p.pSpam / p.pNormal;
                  return (
                    <tr key={i} className="border-t border-zinc-800">
                      <td className="px-4 py-2.5 text-zinc-200">{p.palavra}</td>
                      {p.conhecida ? (
                        <>
                          <td className="px-4 py-2.5 text-right text-zinc-400">{num(p.pSpam)}</td>
                          <td className="px-4 py-2.5 text-right text-zinc-400">{num(p.pNormal)}</td>
                          <td
                            className={`px-4 py-2.5 font-sans ${
                              razao > 1.01 ? "text-red-400" : razao < 0.99 ? "text-emerald-400" : "text-zinc-500"
                            }`}
                          >
                            {razao > 1.01 ? "spam" : razao < 0.99 ? "normal" : "neutra"}
                          </td>
                        </>
                      ) : (
                        <td colSpan={3} className="px-4 py-2.5 font-sans text-xs text-zinc-600">
                          nunca vista no treino: ignorada
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="fade-up flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Mensagens usadas no treino</h2>
        <p className="text-sm text-zinc-400">
          {TREINO.length} mensagens inventadas para este exemplo; o vocabulário
          tem {MODELO.vocabulario.size} palavras distintas. Palavras que não
          aparecem aqui são ignoradas, e a probabilidade usa suavização de
          Laplace (soma 1 a cada contagem) para nenhuma classe zerar o resultado.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {[true, false].map((ehSpam) => (
            <div
              key={String(ehSpam)}
              className="flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4"
            >
              <div className={`text-xs font-medium uppercase tracking-wider ${ehSpam ? "text-red-400" : "text-emerald-400"}`}>
                {ehSpam ? "Spam" : "Normal"}
              </div>
              <ul className="flex flex-col gap-1 text-sm text-zinc-400">
                {TREINO.filter((m) => m.spam === ehSpam).map((m) => (
                  <li key={m.texto}>
                    {m.texto}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
