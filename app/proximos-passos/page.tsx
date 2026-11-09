import Link from "next/link";
import { Explanation } from "@/components/explanation";
import { EXPLANATIONS } from "@/lib/explanations";

type Topic = {
  title: string;
  summary: string;
  connection: { text: string; href: string };
};

const TOPICS: Topic[] = [
  {
    title: "Árvores",
    summary:
      "Uma árvore de busca binária guarda os itens de forma que cada comparação descarta metade dos que sobram, como a busca binária, mas sem o custo de inserir no meio de um array. Bancos de dados costumam usar variações, como as árvores B.",
    connection: { text: "Busca binária e Arrays e listas", href: "/busca-binaria" },
  },
  {
    title: "Índices invertidos",
    summary:
      "Uma tabela hash que liga cada palavra às páginas em que ela aparece. É a ideia básica por trás de um mecanismo de busca: em vez de ler todas as páginas, consulta-se a palavra.",
    connection: { text: "Tabelas hash", href: "/tabela-hash" },
  },
  {
    title: "Transformada de Fourier",
    summary:
      "Separa um sinal, como uma música, nas frequências que o compõem. Serve para compressão de áudio, reconhecimento de música e análise de sinais.",
    connection: { text: "Sem equivalente neste app", href: "/" },
  },
  {
    title: "Algoritmos paralelos",
    summary:
      "Dividir o trabalho entre vários processadores. Quase sempre é mais difícil do que parece: o ganho raramente é proporcional ao número de núcleos, e dividir e juntar o trabalho também tem custo.",
    connection: { text: "Quicksort", href: "/quicksort" },
  },
  {
    title: "MapReduce",
    summary:
      "Um modelo para distribuir cálculos em muitas máquinas. A função map transforma cada item de forma independente e a função reduce junta os resultados, por exemplo para contar palavras em milhões de documentos.",
    connection: { text: "Dividir para conquistar", href: "/dividir-conquistar" },
  },
  {
    title: "Filtros de Bloom e HyperLogLog",
    summary:
      "Estruturas probabilísticas que trocam um pouco de precisão por muito menos memória. Um filtro de Bloom pode dar falsos positivos (diz que viu algo que não viu), mas nunca falsos negativos. O HyperLogLog estima quantos itens distintos existem.",
    connection: { text: "Tabelas hash", href: "/tabela-hash" },
  },
  {
    title: "Funções SHA e hash sensível à localidade",
    summary:
      "O SHA é uma família de funções hash seguras: dá para comparar arquivos ou verificar senhas sem guardar o conteúdo original. Já o hash sensível à localidade faz o contrário: entradas parecidas geram hashes parecidos, útil para detectar documentos semelhantes.",
    connection: { text: "Tabelas hash", href: "/tabela-hash" },
  },
  {
    title: "Troca de chaves Diffie-Hellman",
    summary:
      "Permite que duas pessoas combinem uma chave secreta por um canal que outros podem espiar. Faz parte da base da criptografia de chave pública, usada nas conexões seguras da internet.",
    connection: { text: "Sem equivalente neste app", href: "/" },
  },
  {
    title: "Programação linear",
    summary:
      "Maximiza (ou minimiza) um objetivo sujeito a restrições, como obter o maior lucro com recursos limitados. O algoritmo Simplex resolve esse tipo de problema, e os algoritmos de grafos do livro são casos particulares dele.",
    connection: { text: "Algoritmo de Dijkstra", href: "/dijkstra" },
  },
];

export default function NextSteps() {
  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Próximos passos</h1>
        <p className="text-zinc-400">
          O último capítulo do livro apresenta, de forma rápida, assuntos para
          estudar depois de dominar o básico. Aqui vai um resumo de cada um,
          sem demonstração interativa: são pontos de partida, não explicações
          completas.
        </p>
        <Explanation
          simple={EXPLANATIONS.nextSteps.simple}
          technique={EXPLANATIONS.nextSteps.technique}
        />
      </header>

      <section className="fade-up grid gap-4 sm:grid-cols-2">
        {TOPICS.map((t) => (
          <article
            key={t.title}
            className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
          >
            <h2 className="text-lg font-semibold">{t.title}</h2>
            <p className="text-sm leading-relaxed text-zinc-400">{t.summary}</p>
            <p className="mt-auto text-xs text-zinc-500">
              Relacionado:{" "}
              {t.connection.href === "/" ? (
                <span>{t.connection.text}</span>
              ) : (
                <Link
                  href={t.connection.href}
                  className="text-emerald-400 underline-offset-2 hover:underline"
                >
                  {t.connection.text}
                </Link>
              )}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
