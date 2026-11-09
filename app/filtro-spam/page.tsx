"use client";

import { classify, train } from "@/lib/naive-bayes";
import { Message } from "@/types/naive-bayes";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";
import { Stat } from "@/components/ui";

const TRAINING: Message[] = [
  { text: "ganhe dinheiro rápido agora", spam: true },
  { text: "promoção imperdível clique aqui e ganhe prêmio", spam: true },
  { text: "você ganhou um prêmio grátis clique agora", spam: true },
  { text: "dinheiro fácil oferta grátis", spam: true },
  { text: "compre agora promoção desconto grátis", spam: true },
  { text: "clique aqui para receber seu prêmio", spam: true },
  { text: "oferta imperdível desconto exclusivo agora", spam: true },
  { text: "reunião amanhã às dez na sala", spam: false },
  { text: "segue o relatório do projeto em anexo", spam: false },
  { text: "vamos almoçar amanhã com a equipe", spam: false },
  { text: "o documento está em anexo para revisão", spam: false },
  { text: "confirmo a reunião de segunda", spam: false },
  { text: "obrigado pelo envio do relatório", spam: false },
  { text: "podemos conversar sobre o projeto amanhã", spam: false },
];

const EXAMPLES = [
  "Clique aqui e ganhe um prêmio grátis",
  "Confirmo a reunião de amanhã sobre o projeto",
  "Oferta de desconto: reunião de vendas",
  "Olá, tudo bem?",
];

const MODEL = train(TRAINING);

const pct = (n: number) => `${(n * 100).toFixed(1).replace(".", ",")}%`;
const num = (n: number) => n.toFixed(3).replace(".", ",");

export default function SpamFilter() {
  const [text, setText] = useState(EXAMPLES[0]);
  const result = text.trim() ? classify(MODEL, text) : null;
  const knownItems = result?.words.filter((p) => p.known).length ?? 0;

  const spam = result ? result.spamProbability >= 0.5 : false;

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
        <Explanation
          simple={EXPLANATIONS.spamFilter.simple}
          technique={EXPLANATIONS.spamFilter.technique}
          code={CODES.naiveBayes}
        />
      </header>

      <section className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
          Mensagem a classificar
          <textarea
            className="min-h-24 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-100 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={300}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((e) => (
            <button
              key={e}
              onClick={() => setText(e)}
              className="cursor-pointer rounded-xl border border-zinc-700 px-3 py-2.5 text-xs text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
            >
              {e}
            </button>
          ))}
        </div>
      </section>

      {result && (
        <section className="fade-up flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Classificação"
              value={knownItems === 0 ? "Sem palavras conhecidas" : spam ? "Spam" : "Mensagem normal"}
              tone={knownItems === 0 ? "text-zinc-400" : spam ? "text-red-400" : "text-emerald-400"}
              small={knownItems === 0}
            />
            <Stat label="Chance de spam" value={pct(result.spamProbability)} tone="text-amber-400" />
            <Stat
              label="Palavras conhecidas"
              value={`${knownItems} de ${result.words.length}`}
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
                style={{ width: `${result.spamProbability * 100}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500">
              Antes de ler a mensagem, o filtro já parte de {pct(result.priorSpam)} de
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
                {result.words.map((p, i) => {
                  const ratio = p.pSpam / p.pNormal;
                  return (
                    <tr key={i} className="border-t border-zinc-800">
                      <td className="px-4 py-2.5 text-zinc-200">{p.word}</td>
                      {p.known ? (
                        <>
                          <td className="px-4 py-2.5 text-right text-zinc-400">{num(p.pSpam)}</td>
                          <td className="px-4 py-2.5 text-right text-zinc-400">{num(p.pNormal)}</td>
                          <td
                            className={`px-4 py-2.5 font-sans ${
                              ratio > 1.01 ? "text-red-400" : ratio < 0.99 ? "text-emerald-400" : "text-zinc-500"
                            }`}
                          >
                            {ratio > 1.01 ? "spam" : ratio < 0.99 ? "normal" : "neutra"}
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
          {TRAINING.length} mensagens inventadas para este exemplo; o vocabulário
          tem {MODEL.vocabulary.size} palavras distintas. Palavras que não
          aparecem aqui são ignoradas, e a probabilidade usa suavização de
          Laplace (soma 1 a cada contagem) para nenhuma classe zerar o resultado.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {[true, false].map((isSpam) => (
            <div
              key={String(isSpam)}
              className="flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4"
            >
              <div className={`text-xs font-medium uppercase tracking-wider ${isSpam ? "text-red-400" : "text-emerald-400"}`}>
                {isSpam ? "Spam" : "Normal"}
              </div>
              <ul className="flex flex-col gap-1 text-sm text-zinc-400">
                {TRAINING.filter((m) => m.spam === isSpam).map((m) => (
                  <li key={m.text}>
                    {m.text}
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
