import Link from "next/link";
import { Explicacao } from "../components/explicacao";
import { EXPLICACOES } from "../explicacoes";

type Topico = {
  titulo: string;
  resumo: string;
  conexao: { texto: string; href: string };
};

const TOPICOS: Topico[] = [
  {
    titulo: "Árvores",
    resumo:
      "Uma árvore de busca binária guarda os itens de forma que cada comparação descarta metade dos que sobram, como a busca binária, mas sem o custo de inserir no meio de um array. Bancos de dados costumam usar variações, como as árvores B.",
    conexao: { texto: "Busca binária e Arrays e listas", href: "/busca-binaria" },
  },
  {
    titulo: "Índices invertidos",
    resumo:
      "Uma tabela hash que liga cada palavra às páginas em que ela aparece. É a ideia básica por trás de um mecanismo de busca: em vez de ler todas as páginas, consulta-se a palavra.",
    conexao: { texto: "Tabelas hash", href: "/tabela-hash" },
  },
  {
    titulo: "Transformada de Fourier",
    resumo:
      "Separa um sinal, como uma música, nas frequências que o compõem. Serve para compressão de áudio, reconhecimento de música e análise de sinais.",
    conexao: { texto: "Sem equivalente neste app", href: "/" },
  },
  {
    titulo: "Algoritmos paralelos",
    resumo:
      "Dividir o trabalho entre vários processadores. Quase sempre é mais difícil do que parece: o ganho raramente é proporcional ao número de núcleos, e dividir e juntar o trabalho também tem custo.",
    conexao: { texto: "Quicksort", href: "/quicksort" },
  },
  {
    titulo: "MapReduce",
    resumo:
      "Um modelo para distribuir cálculos em muitas máquinas. A função map transforma cada item de forma independente e a função reduce junta os resultados, por exemplo para contar palavras em milhões de documentos.",
    conexao: { texto: "Dividir para conquistar", href: "/dividir-conquistar" },
  },
  {
    titulo: "Filtros de Bloom e HyperLogLog",
    resumo:
      "Estruturas probabilísticas que trocam um pouco de precisão por muito menos memória. Um filtro de Bloom pode dar falsos positivos (diz que viu algo que não viu), mas nunca falsos negativos. O HyperLogLog estima quantos itens distintos existem.",
    conexao: { texto: "Tabelas hash", href: "/tabela-hash" },
  },
  {
    titulo: "Funções SHA e hash sensível à localidade",
    resumo:
      "O SHA é uma família de funções hash seguras: dá para comparar arquivos ou verificar senhas sem guardar o conteúdo original. Já o hash sensível à localidade faz o contrário: entradas parecidas geram hashes parecidos, útil para detectar documentos semelhantes.",
    conexao: { texto: "Tabelas hash", href: "/tabela-hash" },
  },
  {
    titulo: "Troca de chaves Diffie-Hellman",
    resumo:
      "Permite que duas pessoas combinem uma chave secreta por um canal que outros podem espiar. Faz parte da base da criptografia de chave pública, usada nas conexões seguras da internet.",
    conexao: { texto: "Sem equivalente neste app", href: "/" },
  },
  {
    titulo: "Programação linear",
    resumo:
      "Maximiza (ou minimiza) um objetivo sujeito a restrições, como obter o maior lucro com recursos limitados. O algoritmo Simplex resolve esse tipo de problema, e os algoritmos de grafos do livro são casos particulares dele.",
    conexao: { texto: "Algoritmo de Dijkstra", href: "/dijkstra" },
  },
];

export default function ProximosPassos() {
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
        <Explicacao
          simples={EXPLICACOES.proximosPassos.simples}
          tecnica={EXPLICACOES.proximosPassos.tecnica}
        />
      </header>

      <section className="fade-up grid gap-4 sm:grid-cols-2">
        {TOPICOS.map((t) => (
          <article
            key={t.titulo}
            className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
          >
            <h2 className="text-lg font-semibold">{t.titulo}</h2>
            <p className="text-sm leading-relaxed text-zinc-400">{t.resumo}</p>
            <p className="mt-auto text-xs text-zinc-500">
              Relacionado:{" "}
              {t.conexao.href === "/" ? (
                <span>{t.conexao.texto}</span>
              ) : (
                <Link
                  href={t.conexao.href}
                  className="text-emerald-400 underline-offset-2 hover:underline"
                >
                  {t.conexao.texto}
                </Link>
              )}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
