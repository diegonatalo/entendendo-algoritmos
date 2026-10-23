"use client";

import { inputClass } from "../components/ui";
import { custoInserir, custoLer, custoRemover } from "@/functions/estruturas";
import { Operacao, ResultadoOperacao } from "@/@types/estruturas";
import { useState } from "react";
import { Explicacao } from "../components/explicacao";
import { CODIGOS } from "../codigos";
import { EXPLICACOES } from "../explicacoes";

const MAX = 12;

type Ultimo = {
  operacao: Operacao;
  indice: number;
  resultado: ResultadoOperacao;
};

const botao =
  "cursor-pointer rounded-xl border border-zinc-700 px-4 py-2.5 text-sm text-zinc-200 transition-colors hover:border-emerald-500/60 hover:text-emerald-300";

export default function ArraysListas() {
  const [valores, setValores] = useState<number[]>([10, 20, 30, 40, 50]);
  const [ultimo, setUltimo] = useState<Ultimo | null>(null);
  const [erro, setErro] = useState("");

  const n = valores.length;

  function executar(operacao: Operacao, form: HTMLFormElement) {
    const indice = Number(form.posicao.value);
    const valor = Number(form.valor.value);
    const limite = operacao === "inserir" ? n : n - 1;

    if (!Number.isInteger(indice) || indice < 0 || indice > limite) {
      setErro(
        n === 0 && operacao !== "inserir"
          ? "A estrutura está vazia."
          : `Escolha uma posição de 0 a ${limite}.`,
      );
      return;
    }
    if (operacao === "inserir") {
      if (n >= MAX) {
        setErro(`No máximo ${MAX} itens.`);
        return;
      }
      if (form.valor.value === "" || !Number.isFinite(valor)) {
        setErro("Digite o valor a inserir.");
        return;
      }
    }
    setErro("");

    if (operacao === "ler") {
      setUltimo({ operacao, indice, resultado: custoLer(n, indice) });
    } else if (operacao === "inserir") {
      setUltimo({ operacao, indice, resultado: custoInserir(n, indice) });
      setValores([...valores.slice(0, indice), valor, ...valores.slice(indice)]);
    } else {
      setUltimo({ operacao, indice, resultado: custoRemover(n, indice) });
      setValores(valores.filter((_, i) => i !== indice));
    }
  }

  // posições a destacar na estrutura já atualizada
  function marcas(tipo: "array" | "lista") {
    if (!ultimo) return { percorridos: new Set<number>(), alterados: new Set<number>() };
    const { operacao, indice, resultado } = ultimo;
    const tocados = resultado[tipo].tocados;

    if (operacao === "ler") {
      return { percorridos: new Set(tocados), alterados: new Set([indice]) };
    }
    if (tipo === "array") {
      return operacao === "inserir"
        ? { percorridos: new Set(tocados.map((t) => t + 1)), alterados: new Set([indice]) }
        : { percorridos: new Set(tocados.map((t) => t - 1)), alterados: new Set<number>() };
    }
    return operacao === "inserir"
      ? { percorridos: new Set(tocados), alterados: new Set([indice]) }
      : {
          percorridos: new Set(tocados),
          alterados: new Set(indice > 0 ? [indice - 1] : []),
        };
  }

  const marcasArray = marcas("array");
  const marcasLista = marcas("lista");

  const classeCelula = (
    i: number,
    m: { percorridos: Set<number>; alterados: Set<number> },
  ) =>
    m.alterados.has(i)
      ? "bg-amber-500 font-semibold text-amber-950"
      : m.percorridos.has(i)
        ? "bg-sky-900 text-sky-100 ring-1 ring-sky-500"
        : "bg-zinc-800 text-zinc-200";

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Arrays e listas encadeadas
        </h1>
        <p className="text-zinc-400">
          Em um array os itens ficam lado a lado na memória; em uma lista
          encadeada cada nó aponta para o próximo e pode estar em qualquer
          lugar. Cada estrutura é boa em uma coisa: experimente ler, inserir e
          remover e compare os passos.
        </p>
        <Explicacao
          simples={EXPLICACOES.arraysListas.simples}
          tecnica={EXPLICACOES.arraysListas.tecnica}
          codigo={CODIGOS.arraysListas}
        />
      </header>

      <form
        className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Posição (índice)
            <input
              className={inputClass}
              name="posicao"
              type="number"
              min={0}
              defaultValue={0}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
            Valor (para inserir)
            <input
              className={inputClass}
              name="valor"
              type="number"
              defaultValue={99}
            />
          </label>
        </div>
        {erro && <p className="text-sm text-red-400">{erro}</p>}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className={botao}
            onClick={(e) => executar("ler", e.currentTarget.form!)}
          >
            Ler posição
          </button>
          <button
            type="button"
            className={botao}
            onClick={(e) => executar("inserir", e.currentTarget.form!)}
          >
            Inserir na posição
          </button>
          <button
            type="button"
            className={botao}
            onClick={(e) => executar("remover", e.currentTarget.form!)}
          >
            Remover da posição
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-xl px-4 py-2.5 text-sm text-zinc-500 hover:text-zinc-300"
            onClick={() => {
              setValores([10, 20, 30, 40, 50]);
              setUltimo(null);
              setErro("");
            }}
          >
            Reiniciar
          </button>
        </div>
      </form>

      <section className="fade-up flex flex-col gap-6">
        <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-sky-900 ring-1 ring-sky-500" />
            Percorrido ou deslocado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-amber-500" />
            Item lido, inserido ou ponto de alteração
          </span>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-semibold">Array</h2>
            {ultimo && (
              <span className="font-mono text-lg text-amber-400">
                {ultimo.resultado.array.passos}{" "}
                {ultimo.resultado.array.passos === 1 ? "passo" : "passos"}
              </span>
            )}
          </div>
          <div className="flex flex-wrap">
            {valores.length === 0 && (
              <span className="text-sm text-zinc-600">vazio</span>
            )}
            {valores.map((v, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-12 items-center justify-center border border-zinc-700 font-mono text-sm transition-colors ${classeCelula(i, marcasArray)}`}
                >
                  {v}
                </div>
                <span className="mt-1 font-mono text-[10px] text-zinc-600">
                  {i}
                </span>
              </div>
            ))}
          </div>
          {ultimo && (
            <p className="text-sm text-zinc-400">
              {ultimo.resultado.array.descricao}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-semibold">Lista encadeada</h2>
            {ultimo && (
              <span className="font-mono text-lg text-sky-400">
                {ultimo.resultado.lista.passos}{" "}
                {ultimo.resultado.lista.passos === 1 ? "passo" : "passos"}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-y-3">
            {valores.map((v, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`flex h-11 min-w-12 items-center justify-center rounded-lg px-3 font-mono text-sm transition-colors ${classeCelula(i, marcasLista)}`}
                >
                  {v}
                </div>
                <span className="px-1.5 text-zinc-600">→</span>
              </div>
            ))}
            <span className="font-mono text-xs text-zinc-600">null</span>
          </div>
          {ultimo && (
            <p className="text-sm text-zinc-400">
              {ultimo.resultado.lista.descricao}
            </p>
          )}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/60 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Operação</th>
                <th className="px-4 py-3 font-medium">Array</th>
                <th className="px-4 py-3 font-medium">Lista encadeada</th>
              </tr>
            </thead>
            <tbody className="font-mono text-zinc-300">
              <tr className="border-t border-zinc-800">
                <td className="px-4 py-3 font-sans">Ler</td>
                <td className="px-4 py-3 text-emerald-400">O(1)</td>
                <td className="px-4 py-3 text-amber-400">O(n)</td>
              </tr>
              <tr className="border-t border-zinc-800">
                <td className="px-4 py-3 font-sans">Inserir</td>
                <td className="px-4 py-3 text-amber-400">O(n)</td>
                <td className="px-4 py-3 text-emerald-400">O(1)*</td>
              </tr>
              <tr className="border-t border-zinc-800">
                <td className="px-4 py-3 font-sans">Remover</td>
                <td className="px-4 py-3 text-amber-400">O(n)</td>
                <td className="px-4 py-3 text-emerald-400">O(1)*</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-zinc-500">
          * Na lista, inserir e remover são O(1) quando você já está na posição
          (por exemplo, no início). Chegar a uma posição do meio ainda exige
          percorrer os nós, como mostra a contagem de passos acima.
        </p>
      </section>
    </main>
  );
}
