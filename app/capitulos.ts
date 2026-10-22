export type Capitulo = {
  numero: number;
  titulo: string;
  href: string;
  descricao: string;
};

// um capítulo pode ter mais de uma página; as páginas ficam agrupadas pelo número
export const capitulos: Capitulo[] = [
  {
    numero: 1,
    titulo: "Busca binária",
    href: "/busca-binaria",
    descricao:
      "Encontre um número dividindo o espaço de busca ao meio a cada tentativa.",
  },
  {
    numero: 1,
    titulo: "Notação Big O",
    href: "/big-o",
    descricao: "Compare como o custo de cada algoritmo cresce com o tamanho da entrada.",
  },
  {
    numero: 2,
    titulo: "Arrays e listas encadeadas",
    href: "/arrays-listas",
    descricao: "Veja o custo de ler, inserir e remover em cada estrutura.",
  },
  {
    numero: 2,
    titulo: "Ordenação por seleção",
    href: "/ordenacao-selecao",
    descricao: "Ordene uma lista escolhendo o menor elemento a cada rodada.",
  },
  {
    numero: 3,
    titulo: "Recursão",
    href: "/recursao",
    descricao: "Acompanhe a pilha de chamadas do fatorial, passo a passo.",
  },
  {
    numero: 3,
    titulo: "Caixas dentro de caixas",
    href: "/caixas-recursao",
    descricao: "Procure uma chave em caixas aninhadas e veja a recursão em ação.",
  },
  {
    numero: 4,
    titulo: "Dividir para conquistar",
    href: "/dividir-conquistar",
    descricao:
      "Divida um terreno em quadrados (Euclides) e some uma lista recursivamente.",
  },
  {
    numero: 4,
    titulo: "Quicksort",
    href: "/quicksort",
    descricao:
      "Veja a árvore de recursão: pivô, menores, maiores e a junção final.",
  },
  {
    numero: 4,
    titulo: "Quicksort × mesclagem",
    href: "/quicksort-mesclagem",
    descricao: "Compare as comparações do quicksort e do merge sort em três tipos de entrada.",
  },
  {
    numero: 4,
    titulo: "Constantes escondidas",
    href: "/constantes-big-o",
    descricao: "Veja uma busca \"pior\" vencer outra quando a lista é pequena.",
  },
  {
    numero: 5,
    titulo: "Tabelas hash",
    href: "/tabela-hash",
    descricao: "Insira e busque chaves e veja baldes, colisões e fator de carga.",
  },
  {
    numero: 5,
    titulo: "Usos da tabela hash",
    href: "/usos-tabela-hash",
    descricao: "Barre votos duplicados e acelere acessos com um cache.",
  },
  {
    numero: 6,
    titulo: "Busca em largura",
    href: "/busca-em-largura",
    descricao: "Acompanhe a fila e o caminho mais curto em um grafo de amigos.",
  },
  {
    numero: 6,
    titulo: "Ordenação topológica",
    href: "/ordenacao-topologica",
    descricao: "Ordene tarefas que dependem umas das outras e detecte ciclos.",
  },
  {
    numero: 7,
    titulo: "Algoritmo de Dijkstra",
    href: "/dijkstra",
    descricao: "Ache o caminho mais barato em um grafo com pesos nas arestas.",
  },
  {
    numero: 7,
    titulo: "Bellman-Ford",
    href: "/bellman-ford",
    descricao: "Veja o Dijkstra errar com pesos negativos e como o Bellman-Ford resolve.",
  },
  {
    numero: 7,
    titulo: "Dijkstra: livro por piano",
    href: "/dijkstra-trocas",
    descricao: "Ache a série de trocas mais barata, com e sem ciclos no grafo.",
  },
  {
    numero: 8,
    titulo: "Calendário de aulas",
    href: "/calendario-aulas",
    descricao: "A introdução ao guloso: escolha as aulas que terminam primeiro.",
  },
  {
    numero: 8,
    titulo: "Algoritmo guloso",
    href: "/algoritmo-guloso",
    descricao:
      "Cubra todos os itens com poucas estações e compare com a solução exata.",
  },
  {
    numero: 8,
    titulo: "Caixeiro-viajante",
    href: "/caixeiro-viajante",
    descricao: "Um problema NP-completo: compare a força bruta com o guloso.",
  },
  {
    numero: 9,
    titulo: "Programação dinâmica",
    href: "/programacao-dinamica",
    descricao:
      "Preencha a tabela da mochila célula por célula e compare com o guloso.",
  },
  {
    numero: 9,
    titulo: "Roteiro em Londres",
    href: "/roteiro-londres",
    descricao: "Escolha as atrações que cabem no tempo e somam a maior nota.",
  },
  {
    numero: 9,
    titulo: "Subcadeia comum",
    href: "/subcadeia-comum",
    descricao: "Compare duas palavras preenchendo a tabela de letras em comum.",
  },
  {
    numero: 10,
    titulo: "K-vizinhos mais próximos",
    href: "/knn",
    descricao: "Clique no gráfico e veja a fruta ser classificada pelos vizinhos.",
  },
  {
    numero: 10,
    titulo: "KNN: regressão",
    href: "/knn-regressao",
    descricao: "Estime um número, como os pães de uma padaria, pela média dos vizinhos.",
  },
  {
    numero: 10,
    titulo: "Recomendação de filmes",
    href: "/recomendacao-filmes",
    descricao: "Compare distância comum, normalização e cosseno para achar gostos parecidos.",
  },
  {
    numero: 10,
    titulo: "OCR com KNN",
    href: "/ocr-knn",
    descricao: "Desenhe um dígito e veja o KNN reconhecê-lo pelos pixels.",
  },
  {
    numero: 10,
    titulo: "Filtro de spam",
    href: "/filtro-spam",
    descricao: "Classifique mensagens com Naive Bayes e veja o peso de cada palavra.",
  },
  {
    numero: 11,
    titulo: "Próximos passos",
    href: "/proximos-passos",
    descricao: "Um resumo dos assuntos que o livro sugere estudar depois.",
  },
];
