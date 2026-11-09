export type Chapter = {
  number: number;
  title: string;
  href: string;
  description: string;
};

// um capítulo pode ter mais de uma página; as páginas ficam agrupadas pelo número
export const chapters: Chapter[] = [
  {
    number: 1,
    title: "Busca binária",
    href: "/busca-binaria",
    description:
      "Encontre um número dividindo o espaço de busca ao meio a cada tentativa.",
  },
  {
    number: 1,
    title: "Notação Big O",
    href: "/big-o",
    description: "Compare como o custo de cada algoritmo cresce com o tamanho da entrada.",
  },
  {
    number: 2,
    title: "Arrays e listas encadeadas",
    href: "/arrays-listas",
    description: "Veja o custo de ler, inserir e remover em cada estrutura.",
  },
  {
    number: 2,
    title: "Ordenação por seleção",
    href: "/ordenacao-selecao",
    description: "Ordene uma lista escolhendo o menor elemento a cada rodada.",
  },
  {
    number: 3,
    title: "Recursão",
    href: "/recursao",
    description: "Acompanhe a pilha de chamadas do fatorial, passo a passo.",
  },
  {
    number: 3,
    title: "Caixas dentro de caixas",
    href: "/caixas-recursao",
    description: "Procure uma chave em caixas aninhadas e veja a recursão em ação.",
  },
  {
    number: 4,
    title: "Dividir para conquistar",
    href: "/dividir-conquistar",
    description:
      "Divida um terreno em quadrados (Euclides) e some uma lista recursivamente.",
  },
  {
    number: 4,
    title: "Quicksort",
    href: "/quicksort",
    description:
      "Veja a árvore de recursão: pivô, menores, maiores e a junção final.",
  },
  {
    number: 4,
    title: "Quicksort × mesclagem",
    href: "/quicksort-mesclagem",
    description: "Compare as comparações do quicksort e do merge sort em três tipos de entrada.",
  },
  {
    number: 4,
    title: "Constantes escondidas",
    href: "/constantes-big-o",
    description: "Veja uma busca \"pior\" vencer outra quando a lista é pequena.",
  },
  {
    number: 5,
    title: "Tabelas hash",
    href: "/tabela-hash",
    description: "Insira e busque chaves e veja baldes, colisões e fator de carga.",
  },
  {
    number: 5,
    title: "Usos da tabela hash",
    href: "/usos-tabela-hash",
    description: "Barre votos duplicados e acelere acessos com um cache.",
  },
  {
    number: 6,
    title: "Busca em largura",
    href: "/busca-em-largura",
    description: "Acompanhe a fila e o caminho mais curto em um grafo de amigos.",
  },
  {
    number: 6,
    title: "Ordenação topológica",
    href: "/ordenacao-topologica",
    description: "Ordene tarefas que dependem umas das outras e detecte ciclos.",
  },
  {
    number: 7,
    title: "Algoritmo de Dijkstra",
    href: "/dijkstra",
    description: "Ache o caminho mais barato em um grafo com pesos nas arestas.",
  },
  {
    number: 7,
    title: "Bellman-Ford",
    href: "/bellman-ford",
    description: "Veja o Dijkstra errar com pesos negativos e como o Bellman-Ford resolve.",
  },
  {
    number: 7,
    title: "Dijkstra: livro por piano",
    href: "/dijkstra-trocas",
    description: "Ache a série de trocas mais barata, com e sem ciclos no grafo.",
  },
  {
    number: 8,
    title: "Calendário de aulas",
    href: "/calendario-aulas",
    description: "A introdução ao guloso: escolha as aulas que terminam primeiro.",
  },
  {
    number: 8,
    title: "Algoritmo guloso",
    href: "/algoritmo-guloso",
    description:
      "Cubra todos os itens com poucas estações e compare com a solução exata.",
  },
  {
    number: 8,
    title: "Caixeiro-viajante",
    href: "/caixeiro-viajante",
    description: "Um problema NP-completo: compare a força bruta com o guloso.",
  },
  {
    number: 9,
    title: "Programação dinâmica",
    href: "/programacao-dinamica",
    description:
      "Preencha a tabela da mochila célula por célula e compare com o guloso.",
  },
  {
    number: 9,
    title: "Roteiro em Londres",
    href: "/roteiro-londres",
    description: "Escolha as atrações que cabem no tempo e somam a maior nota.",
  },
  {
    number: 9,
    title: "Subcadeia comum",
    href: "/subcadeia-comum",
    description: "Compare duas palavras preenchendo a tabela de letras em comum.",
  },
  {
    number: 10,
    title: "K-vizinhos mais próximos",
    href: "/knn",
    description: "Clique no gráfico e veja a fruta ser classificada pelos vizinhos.",
  },
  {
    number: 10,
    title: "KNN: regressão",
    href: "/knn-regressao",
    description: "Estime um número, como os pães de uma padaria, pela média dos vizinhos.",
  },
  {
    number: 10,
    title: "Recomendação de filmes",
    href: "/recomendacao-filmes",
    description: "Compare distância comum, normalização e cosseno para achar gostos parecidos.",
  },
  {
    number: 10,
    title: "OCR com KNN",
    href: "/ocr-knn",
    description: "Desenhe um dígito e veja o KNN reconhecê-lo pelos pixels.",
  },
  {
    number: 10,
    title: "Filtro de spam",
    href: "/filtro-spam",
    description: "Classifique mensagens com Naive Bayes e veja o peso de cada palavra.",
  },
  {
    number: 11,
    title: "Próximos passos",
    href: "/proximos-passos",
    description: "Um resumo dos assuntos que o livro sugere estudar depois.",
  },
];
