import { p, titulo, lista, destaque, type Explicacao } from "./blocos";

export const EXPLICACOES_CAP02 = {
  arraysListas: {
    simples: [
      p("Pense em duas formas de guardar uma fila de pessoas. No array, elas estão em cadeiras numeradas, lado a lado, como em um cinema. Para chegar à cadeira 37, você vai direto, sem passar pelas outras. Mas, para encaixar alguém no meio, todos os que vêm depois precisam levantar e deslizar uma cadeira."),
      p("Na lista encadeada é uma caça ao tesouro: cada pista diz onde está a próxima, e as pessoas podem estar em qualquer lugar. Inserir alguém é só mudar o que duas pistas dizem. Mas, para chegar à pista 37, você segue as 36 anteriores."),
      titulo("Quem é melhor em quê"),
      lista(
        "Ler um item pela posição: o array ganha (um passo).",
        "Inserir ou remover: a lista ganha, porque ninguém precisa deslizar, desde que você já esteja no ponto certo.",
        "Na prática, a escolha depende de qual operação o seu programa faz mais.",
      ),
      destaque("Na animação: azul é o que foi percorrido ou deslocado e âmbar é o ponto de alteração. Insira no início, depois leia o último item e compare os passos de cada estrutura."),
    ],
    tecnica: [
      titulo("Como cada uma guarda os dados"),
      lista(
        "Array: bloco contínuo de memória. O endereço do item i é base + i × tamanho, então ler qualquer posição é O(1).",
        "Lista encadeada: cada nó guarda o valor e uma referência ao próximo, e os nós podem estar espalhados na memória. Chegar ao item i exige seguir i referências: O(n).",
      ),
      titulo("Custo das operações"),
      lista(
        "Inserir ou remover na posição i de um array com n itens desloca n − i itens: O(n). No fim custa O(1) amortizado, em arrays que crescem dobrando a capacidade.",
        "Em uma lista, inserir ou remover é O(1) depois de chegar ao nó anterior, o que custa i passos. No início, i = 0, então é O(1) de verdade. Mantendo uma referência para o último nó, inserir no fim também fica em O(1).",
        "Na página, os passos contados são n − i + 1 no array (deslocamentos mais a gravação) e i + 1 na lista (percurso mais a troca de referências).",
      ),
      titulo("Detalhes e limites"),
      lista(
        "O asterisco do O(1)* da tabela lembra que a lista só é rápida se você já estiver na posição: achar o ponto de inserção custa O(n).",
        "Em uma lista duplamente encadeada (cada nó guarda também o anterior), remover um nó em O(1) é possível quando se tem o próprio nó, sem percorrer a lista.",
        "Em hardware real, arrays costumam ser mais rápidos do que o Big O sugere, porque itens vizinhos ficam no cache do processador; nós espalhados pela memória não aproveitam isso.",
        "Em JavaScript, Array é uma estrutura dinâmica; os exemplos desta página são modelos conceituais, não o que o motor faz por dentro.",
      ),
    ],
  },

  ordenacaoSelecao: {
    simples: [
      p("Imagine uma pilha de cartas bagunçadas na mesa. Você procura a menor carta e a coloca na sua mão. Depois procura a menor entre as que sobraram e coloca ao lado. Repete até a mesa ficar vazia: a sua mão está ordenada."),
      p("É isso que o algoritmo faz: a cada rodada, olha todos os itens que sobraram, acha o menor e o move para a lista ordenada."),
      titulo("Por que fica lento"),
      p("Cada rodada precisa olhar quase todos os itens que restam. Com 10 itens são 45 comparações; com 100, 4.950; com 1.000, quase 500 mil. Dobrar a lista quadruplica o trabalho."),
      destaque("Na animação: os quadrados verdes, à esquerda, já estão ordenados, o âmbar é o menor da rodada e os cinzas ainda esperam. A parte cinza encolhe a cada rodada."),
    ],
    tecnica: [
      titulo("Como funciona"),
      p("Mantém duas listas: a ordenada e a dos restantes. A cada rodada acha o índice do menor dos restantes, remove-o e o acrescenta ao fim da lista ordenada. Invariante: depois de k rodadas, a lista ordenada contém os k menores itens, em ordem, e nenhum dos restantes é menor que o último deles. Quando não restam itens, tudo está ordenado."),
      titulo("Custo"),
      lista(
        "Comparações: (n − 1) + (n − 2) + … + 0 = n(n − 1)/2, ou seja, Θ(n²). O número é o mesmo para qualquer entrada: melhor, médio e pior caso coincidem, mesmo com a lista já ordenada.",
        "Movimentos: n remoções e inserções. A versão in-place, que troca o menor com o item da posição atual, faz no máximo n − 1 trocas.",
        "Espaço: esta versão cria uma nova lista, O(n) extra; a in-place usa O(1).",
      ),
      titulo("Detalhes e limites"),
      lista(
        "Estabilidade: esta versão é estável, porque escolhe a primeira ocorrência do menor valor e preserva a ordem relativa dos demais. A versão in-place com troca não é estável.",
        "Quando usar: quase nunca em produção, pois é O(n²) sempre. Serve para ensinar a ideia de ordenar e tem uma vantagem rara, as poucas trocas, útil quando escrever é caro.",
        "Alternativas: quicksort e mesclagem, em O(n log n) em geral.",
      ),
    ],
  },
} satisfies Record<string, Explicacao>;
