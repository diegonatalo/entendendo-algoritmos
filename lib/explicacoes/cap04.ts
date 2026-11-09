import { p, titulo, lista, destaque, type Explicacao } from "./blocos";

export const EXPLICACOES_CAP04 = {
  divisaoConquista: {
    simples: [
      p("Dividir para conquistar é um jeito de resolver problemas: em vez de atacar o problema grande de uma vez, você o reduz a um problema menor do mesmo tipo e repete, até chegar a um caso tão simples que a resposta é óbvia."),
      p("No terreno, a ideia é cobrir um retângulo com quadrados iguais, os maiores possíveis. Corte o maior quadrado que cabe; sobra um retângulo menor; repita nele. Quando não sobra nada, o lado do último quadrado é o maior que serve para o terreno todo. Em 1.680 × 640 são 5 passos e o lado é 80."),
      p("Na soma de uma lista, o problema menor é a soma do resto da lista: soma = primeiro + soma do resto. Uma lista vazia soma 0, e esse é o caso mais simples."),
      destaque("Na animação do terreno: cada passo acrescenta quadrados de uma cor nova, e o mais recente aparece mais forte. O último quadrado dá a medida do lado final."),
    ],
    tecnica: [
      titulo("A técnica"),
      p("Dividir para conquistar tem três etapas: dividir o problema em subproblemas menores do mesmo tipo, resolvê-los recursivamente (o caso base é o problema trivial) e combinar as respostas. Aqui há dois exemplos simples: o algoritmo de Euclides só reduz o problema, sem combinar nada, e a soma combina com uma adição. O quicksort e a mesclagem seguem o mesmo molde."),
      titulo("Algoritmo de Euclides"),
      lista(
        "mdc(a, b) = mdc(b, a mod b), com mdc(a, 0) = a. Cortar quadrados do terreno é subtrair o menor lado do maior repetidamente; a divisão dá o mesmo resultado de uma vez só.",
        "Correção: os divisores comuns de a e b são exatamente os de b e a mod b, então o maior deles não muda ao reduzir o problema.",
        "Custo: O(log min(a, b)) passos. Pelo teorema de Lamé, nunca passa de cerca de 5 vezes o número de dígitos do menor valor. O pior caso são números de Fibonacci consecutivos: para valores até 1.000, o máximo é 14 passos, no par (987, 610).",
      ),
      titulo("Soma recursiva"),
      lista(
        "T(n) = T(n − 1) + O(1) dá O(n) chamadas e uma pilha de profundidade n.",
        "No código do exemplo, [primeiro, ...resto] copia a lista a cada chamada, então o custo real é O(n²). Passar um índice em vez de copiar resolve e volta a O(n).",
      ),
      titulo("Quando serve"),
      p("Quando os subproblemas são independentes e menores. Se eles se repetem e se sobrepõem, é melhor guardar as respostas: programação dinâmica (capítulo 9). Para estimar o custo, escreve-se uma recorrência: a busca binária é T(n) = T(n/2) + O(1) = O(log n) e a mesclagem é T(n) = 2T(n/2) + O(n) = O(n log n)."),
    ],
  },

  quicksort: {
    simples: [
      p("Imagine organizar uma fila de pessoas por altura. Você escolhe uma pessoa como referência, o pivô. Quem é mais baixo vai para a esquerda dela e quem é mais alto vai para a direita. Agora você tem dois grupos menores, e o pivô já está no lugar certo."),
      p("Repita a mesma ideia em cada grupo: escolha um pivô, separe em menores e maiores. Quando um grupo tem só uma pessoa, ou nenhuma, não há o que organizar. No fim, juntar tudo (esquerda, pivô, direita) dá a fila ordenada."),
      p("Resolver um problema grande resolvendo dois menores do mesmo tipo se chama dividir para conquistar."),
      titulo("O que muda a velocidade"),
      p("Tudo depende do pivô. Se ele cai perto do meio, cada divisão corta o trabalho pela metade e a ordenação é rápida. Se você pega sempre o primeiro e a fila já está em ordem, o pivô é sempre o menor: um grupo fica vazio e o outro quase do tamanho original. A divisão não ajuda e o trabalho explode."),
      destaque("Na animação: o quadrado âmbar é o pivô, os grupos azuis são os menores e os roxos os maiores. Troque a escolha do pivô para \"primeiro\" e ordene 1, 2, 3, 4, 5, 6 para ver a árvore virar uma escada."),
    ],
    tecnica: [
      titulo("Como funciona"),
      p("Escolhe um pivô e separa os demais em menores (≤ pivô) e maiores (> pivô). Ordena cada parte recursivamente e devolve menores + pivô + maiores. O caso base são as listas com menos de 2 elementos, que já estão ordenadas. A versão da página cria listas novas a cada chamada; as versões in-place trocam elementos dentro do mesmo array (esquemas de Lomuto ou de Hoare)."),
      titulo("Por que está correto"),
      p("Depois do particionamento, todo elemento de \"menores\" é ≤ pivô e todo elemento de \"maiores\" é > pivô. Logo, o pivô já está na posição final (a posição |menores|) e as duas partes podem ser ordenadas de forma independente. Por indução no tamanho da lista: cada parte é menor que a original, porque o pivô sai de ambas, então a recursão termina; e, se as partes voltam ordenadas, a concatenação também está."),
      titulo("Custo"),
      lista(
        "Cada particionamento faz n − 1 comparações. O custo total é a soma sobre os níveis da recursão.",
        "Melhor caso e caso médio: partes de tamanho parecido, cerca de log₂ n níveis, O(n log n). Com pivô aleatório, o número esperado de comparações é cerca de 2 n ln n ≈ 1,39 n log₂ n para qualquer entrada.",
        "Pior caso: o pivô é sempre o menor ou o maior, uma parte fica vazia e há n níveis. São (n − 1) + (n − 2) + … + 1 = n(n − 1) / 2 comparações, O(n²). Na página, com 1.000 itens já ordenados, o pivô no primeiro elemento faz 499.500 comparações, contra 7.987 com o pivô no meio.",
        "Espaço: esta versão aloca listas novas a cada chamada, memória extra proporcional ao tamanho da lista. A versão in-place usa só a pilha de recursão: O(log n) em média e O(n) no pior caso (dá para reduzir a O(log n) recursando primeiro na parte menor).",
      ),
      titulo("Detalhes e limites"),
      lista(
        "Elementos iguais ao pivô vão todos para \"menores\" nesta versão. Se a lista inteira tiver valores iguais, cada chamada separa só o pivô e o custo vira O(n²). O particionamento em três vias (menores, iguais, maiores) resolve.",
        "Não é estável: elementos iguais podem trocar de ordem entre si.",
        "Estratégias de pivô: o primeiro elemento (simples, mas ruim em listas ordenadas), o do meio, um aleatório ou a mediana de três valores. Nenhuma elimina o pior caso para toda entrada possível, mas o pivô aleatório o torna muito improvável.",
        "Comparado com a mesclagem: a mesclagem garante O(n log n) e é estável, mas usa O(n) de memória extra. Segundo o livro, o quicksort costuma ser mais rápido na prática. Veja a página \"Quicksort × mesclagem\".",
      ),
    ],
  },

  quicksortMesclagem: {
    simples: [
      p("Imagine duas pilhas de cartas já ordenadas. Para juntá-las é fácil: olhe a carta de cima de cada pilha e vá pegando a menor. É assim que a ordenação por mesclagem trabalha. Ela divide o baralho ao meio, de novo e de novo, até sobrar uma carta em cada pilha (uma carta sozinha já está ordenada), e depois vai juntando as pilhas, sempre ordenadas."),
      titulo("Qual a diferença para o quicksort"),
      lista(
        "O quicksort faz o trabalho ao dividir: separa pelo pivô, e juntar é só colar as partes.",
        "A mesclagem divide sem pensar, sempre ao meio, e faz o trabalho ao juntar.",
      ),
      p("Por isso a mesclagem tem sempre o mesmo ritmo, enquanto o quicksort depende de a escolha do pivô ser boa. A tabela mostra isso: o pior caso do quicksort aparece em vermelho."),
      destaque("Na página: arraste o tamanho da lista e compare as colunas. Mais abaixo, a árvore mostra as divisões (em cima) e as junções (em verde, embaixo)."),
    ],
    tecnica: [
      titulo("Como funciona"),
      p("A mesclagem divide a lista ao meio, ordena cada metade recursivamente e junta as duas metades ordenadas percorrendo-as com dois índices, sempre copiando o menor dos dois itens da frente. O caso base são as listas com menos de 2 itens."),
      titulo("Custo"),
      lista(
        "Juntar duas listas com m itens no total faz no máximo m − 1 comparações. Há cerca de log₂ n níveis, então são no máximo cerca de n log₂ n comparações. Pela recorrência T(n) = 2T(n/2) + Θ(n), o custo é Θ(n log n) em todos os casos, sem depender da ordem da entrada.",
        "Espaço: O(n) extra, porque a junção cria uma lista nova. O quicksort in-place usa só a pilha.",
        "Estabilidade: é estável. Em caso de empate a junção pega o item da esquerda (a[i] <= b[j]), preservando a ordem original dos iguais.",
      ),
      titulo("Comparando com o quicksort"),
      lista(
        "Quicksort: O(n log n) no caso médio e O(n²) no pior. Na tabela, o pivô no primeiro elemento com a entrada já ordenada faz n(n − 1)/2 comparações.",
        "Contar comparações não é medir tempo. Nas listas aleatórias, a mesclagem até faz menos comparações, mas o tempo depende também de copiar e alocar listas e da memória. Segundo o livro, o quicksort costuma ser mais rápido na prática, e isso é uma questão de constantes.",
        "Escolha: use mesclagem quando precisar de garantia O(n log n), de estabilidade ou ao ordenar dados em lista encadeada ou em disco; use quicksort (com bom pivô) em arrays na memória quando a velocidade média importa.",
        "Bibliotecas reais costumam usar híbridos. Python e o motor V8 do JavaScript usam o Timsort, baseado em mesclagem.",
      ),
    ],
  },

  constantesBigO: {
    simples: [
      p("Big O ignora quanto tempo leva cada passo: só olha como o número de passos cresce. Quase sempre isso é o que importa, mas nem sempre."),
      p("É como escolher entre ir a pé e de caminhão. O caminhão é muito mais rápido em longas distâncias, mas, para ir à padaria da esquina, a pé chega antes: o caminhão leva tempo para ligar. Esse \"tempo para ligar\" é a constante."),
      p("Na página, a busca simples gasta 1 ms por item e a busca binária, que dá poucos passos, gasta 1 s por passo. Com 1.000 itens, a simples leva 1 s e a binária 10 s. Só em listas com mais de uns 14 mil itens a binária passa a compensar."),
      destaque("Na página: mude os tempos por passo e o tamanho da lista. O gráfico usa escala logarítmica no eixo vertical, e o ponto onde as linhas se cruzam é onde a binária passa a ganhar."),
    ],
    tecnica: [
      titulo("O que o Big O deixa de fora"),
      p("O tempo real é cerca de c · g(n), em que g(n) é a contagem de passos (a classe) e c é o custo de cada passo. O Big O descarta c. Para n grande o crescimento domina, mas para n pequeno a constante pode decidir: esse é o n₀ da definição formal, o tamanho a partir do qual vale a ordem das classes."),
      titulo("O cruzamento da página"),
      lista(
        "Com custo cA por passo linear e cB por passo logarítmico, o cruzamento é a solução de cA · n = cB · log₂ n. Não há fórmula elementar; calcula-se numericamente.",
        "Com 1 ms e 1 s, o cruzamento fica em n = 13.747: abaixo disso a busca simples é mais rápida e, acima, a binária.",
        "Como a razão entre as constantes é de 1.000, o cruzamento só aparece em listas grandes. Se as constantes fossem iguais, a binária ganharia já em listas minúsculas.",
      ),
      titulo("Onde as constantes aparecem"),
      lista(
        "Quicksort e mesclagem são ambos O(n log n) em média: o que os separa é o custo por passo (cópias, alocação, cache), não a classe.",
        "O custo de uma operação varia muito: um acesso ao cache, à memória, ao disco ou à rede difere em ordens de grandeza, e isso vira constante.",
        "Regra prática: use o Big O para escolher entre crescimentos diferentes e meça (benchmark) quando as classes forem iguais ou os dados forem pequenos.",
      ),
    ],
  },
} satisfies Record<string, Explicacao>;
