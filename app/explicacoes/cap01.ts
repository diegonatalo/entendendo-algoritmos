import { p, titulo, lista, destaque, type Explicacao } from "./blocos";

export const EXPLICACOES_CAP01 = {
  buscaBinaria: {
    simples: [
      p("Imagine que um amigo pensou em um número de 1 a 100 e você precisa descobrir qual é. Você não vai chutar 1, depois 2, depois 3. Você chuta 50 e ele responde \"maior\" ou \"menor\". Com uma única resposta, metade das possibilidades some."),
      p("A busca binária faz isso em uma lista: olha o item do meio. Se for o que você procura, acabou. Se for menor que o procurado, tudo à esquerda está fora de questão; se for maior, tudo à direita. Repete com a metade que sobrou, até achar ou não sobrar nada."),
      p("Só funciona se a lista estiver em ordem, como um dicionário: é isso que permite abrir no meio e saber para que lado ir."),
      titulo("Por que é tão rápida"),
      lista(
        "Em 100 itens, no máximo 7 tentativas.",
        "Em 1 milhão de itens, no máximo 20.",
        "Em 1 bilhão de itens, no máximo 30.",
      ),
      p("Procurando um por um, seriam até 100, 1 milhão e 1 bilhão de tentativas."),
      destaque("Na animação: cada linha é uma tentativa e a caixa âmbar é o item do meio. Veja a lista encolher pela metade na linha seguinte. Experimente um alvo na ponta e um alvo que não está na lista."),
    ],
    tecnica: [
      titulo("Como funciona"),
      p("Mantém um intervalo [início, fim] onde o alvo ainda pode estar. A cada iteração calcula meio = ⌊(início + fim) / 2⌋ e compara lista[meio] com o alvo: se forem iguais, devolve o índice; se lista[meio] for menor, o alvo só pode estar à direita (início = meio + 1); se for maior, à esquerda (fim = meio − 1)."),
      titulo("Por que está correto"),
      lista(
        "Invariante: se o alvo está na lista, ele está em lista[início..fim]. Vale no começo, com o intervalo inteiro, e se mantém a cada passo: como a lista está ordenada, tudo o que é descartado é menor que o alvo ou maior que ele.",
        "Término: a cada passo o intervalo perde pelo menos metade dos itens, então chega ao vazio (início > fim) em um número finito de passos. Intervalo vazio mais o invariante significa que o alvo não está na lista, e a função devolve −1.",
      ),
      titulo("Custo"),
      lista(
        "Tempo: O(log n). No pior caso são ⌊log₂ n⌋ + 1 iterações, que é o \"máximo de tentativas\" mostrado na página.",
        "Espaço: O(1) na versão iterativa; a recursiva usa O(log n) de pilha.",
        "Cada iteração faz uma comparação de custo constante, o que exige acesso direto ao índice (array). Em uma lista encadeada, chegar ao meio custa O(n) e a vantagem se perde.",
      ),
      titulo("Detalhes e limites"),
      lista(
        "Pré-condição: lista ordenada. Ordenar antes custa O(n log n), então só compensa se a busca for repetida muitas vezes.",
        "Valores repetidos: devolve a posição de uma ocorrência, não necessariamente a primeira.",
        "Lista vazia ou alvo ausente: devolve −1 (a página mostra \"Não encontrado\").",
        "Em linguagens com inteiros de tamanho fixo, início + fim pode estourar; prefira início + ⌊(fim − início) / 2⌋. Em JavaScript isso não ocorre.",
        "Quando não usar: dados não ordenados, listas bem pequenas (a busca simples é igualmente rápida e mais simples) ou coleções que mudam o tempo todo e teriam de ser reordenadas.",
      ),
    ],
  },

  bigO: {
    simples: [
      p("Big O responde a uma pergunta: se a quantidade de dados dobrar, o quanto o trabalho do algoritmo cresce? Ele não mede segundos, porque isso depende do computador. Mede o ritmo de crescimento."),
      p("Pense em procurar uma palavra em um livro. Ler página por página dá o dobro de trabalho se o livro dobrar de tamanho. Abrir no meio e escolher uma metade, como na busca binária, precisa de só um passo a mais quando o livro dobra."),
      titulo("As classes mais comuns"),
      lista(
        "O(log n): dobrar a entrada custa só mais um passo. Exemplo: busca binária.",
        "O(n): dobrar a entrada dobra o trabalho. Exemplo: ler uma lista inteira.",
        "O(n log n): um pouco mais que o dobro. Exemplo: quicksort (caso médio) e mesclagem.",
        "O(n²): dobrar a entrada quadruplica o trabalho. Exemplo: ordenação por seleção.",
        "O(n!): cada item a mais multiplica o trabalho. Exemplo: testar todas as rotas do caixeiro-viajante.",
      ),
      destaque("Na página: arraste o tamanho n e compare as linhas do gráfico. A linha do O(n!) já sai do gráfico perto de n = 6, e a tabela mostra quanto tempo cada classe levaria se cada operação durasse 1 ms."),
    ],
    tecnica: [
      titulo("Definição"),
      p("Dizemos que f(n) = O(g(n)) se existem constantes c > 0 e n₀ tais que f(n) ≤ c · g(n) para todo n ≥ n₀. Na prática, descartam-se constantes e termos menores: 3n² + 5n + 2 = O(n²). A base do logaritmo também some (log₂ n e log₁₀ n diferem por uma constante), por isso se escreve só O(log n)."),
      titulo("Ordem das classes"),
      p("Da menor para a maior: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!). Quando n dobra, O(log n) soma 1 passo, O(n) dobra, O(n log n) fica um pouco acima do dobro e O(n²) quadruplica. Quando n aumenta em 1, n! passa a (n + 1)!, ou seja, o custo é multiplicado por n + 1."),
      titulo("O que é medido"),
      lista(
        "Por padrão, o pior caso: um limite superior que vale para qualquer entrada de tamanho n. Também existem o melhor caso e o caso médio (o quicksort é O(n log n) no médio e O(n²) no pior).",
        "O tempo é contado em operações básicas, supostas de custo constante. O mesmo raciocínio vale para a memória extra usada.",
        "Big O é um limite superior. Para um limite inferior usa-se Ω e, para um limite justo, Θ; em conversa informal, O costuma ser usado no lugar de Θ.",
      ),
      titulo("Limites do modelo"),
      lista(
        "Só vale a partir de um n₀: para entradas pequenas, o algoritmo de crescimento maior pode ser mais rápido. Veja a página \"Constantes escondidas\".",
        "Duas classes iguais (por exemplo, quicksort e mesclagem, ambos O(n log n)) não dizem qual é mais rápido: a diferença está nas constantes.",
        "Ignora o hardware: cache, memória e disco mudam o tempo real sem mudar a classe.",
      ),
    ],
  },
} satisfies Record<string, Explicacao>;
