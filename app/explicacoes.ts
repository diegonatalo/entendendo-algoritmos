// Explicações de cada algoritmo em dois níveis: "simples" (analogia e intuição) e
// "técnica" (como funciona, por que está correto, custo e limites).

export type Bloco =
  | { tipo: "p"; texto: string }
  | { tipo: "titulo"; texto: string }
  | { tipo: "lista"; itens: string[] }
  | { tipo: "destaque"; texto: string };

const p = (texto: string): Bloco => ({ tipo: "p", texto });
const titulo = (texto: string): Bloco => ({ tipo: "titulo", texto });
const lista = (...itens: string[]): Bloco => ({ tipo: "lista", itens });
const destaque = (texto: string): Bloco => ({ tipo: "destaque", texto });

export const EXPLICACOES = {
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

  // ── Capítulo 1 ─────────────────────────────────────────────────────────────

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

  // ── Capítulo 2 ─────────────────────────────────────────────────────────────

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

  // ── Capítulo 3 ─────────────────────────────────────────────────────────────

  recursao: {
    simples: [
      p("Recursão é quando uma tarefa se resolve pedindo a si mesma uma versão menor do mesmo problema. É como contar as pessoas de uma fila: você pergunta à pessoa de trás \"quantos há atrás de você?\", ela pergunta à de trás dela, e assim por diante. A última responde 0. De volta, cada uma soma 1 à resposta que recebeu."),
      p("No fatorial, 5! = 5 × 4!, e 4! = 4 × 3!, até chegar a 1! = 1. Aí as respostas voltam multiplicando."),
      titulo("As duas partes de toda recursão"),
      lista(
        "Caso base: a situação tão simples que se responde sem pedir mais nada. Sem ele, a função chamaria a si mesma para sempre.",
        "Caso recursivo: reduz o problema e chama a si mesma.",
      ),
      destaque("Na animação: a pilha mostra as chamadas que estão esperando, uma sobre a outra, e a âmbar, no topo, é a que está rodando. Avance os passos e veja a pilha crescer até o caso base e depois esvaziar."),
    ],
    tecnica: [
      titulo("Como funciona"),
      p("fatorial(n) = n × fatorial(n − 1), com fatorial(n) = 1 para n ≤ 1. O computador guarda cada chamada em uma pilha de chamadas: um quadro com o parâmetro n e o ponto onde continuar. A chamada mais recente fica no topo e só termina quando todas as que ela iniciou terminarem. Ao atingir o caso base, os quadros são desempilhados e cada um completa a multiplicação que estava pendente."),
      titulo("Por que está correto"),
      p("Por indução em n: o caso base devolve o valor certo (1! = 1) e, se fatorial(n − 1) estiver correto, então n × fatorial(n − 1) é o fatorial de n. Cada chamada recebe um n menor, então o caso base sempre é alcançado."),
      titulo("Custo"),
      lista(
        "Tempo: n chamadas e n multiplicações, O(n).",
        "Espaço: a pilha chega a n quadros, O(n). Um laço faz o mesmo cálculo em O(1) de memória.",
      ),
      titulo("Detalhes e limites"),
      lista(
        "Pilha limitada: recursão muito funda causa estouro de pilha (stack overflow). O limite depende do motor e da memória usada por chamada.",
        "Precisão: em JavaScript, o fatorial com números comuns (ponto flutuante) é exato até 22! e passa a arredondar em 23!. A página limita n a 15 por folga.",
        "Recursão de cauda (a chamada recursiva é a última operação) poderia reaproveitar o quadro, mas a maioria dos motores de JavaScript não faz essa otimização.",
        "Quando vale a pena: quando o problema tem estrutura recursiva (caixas dentro de caixas, árvores, dividir para conquistar). Para um contador simples, um laço é mais direto.",
      ),
    ],
  },

  caixasRecursao: {
    simples: [
      p("Você precisa achar uma chave em uma caixa que tem outras caixas dentro, que têm outras caixas dentro. Você não sabe quantas são nem quão fundo vai. O jeito natural: abra uma caixa e olhe os itens; se a chave estiver lá, acabou. Se não, abra cada caixa que está dentro dela e faça exatamente a mesma coisa."),
      p("Essa frase, \"faça a mesma coisa em cada caixa de dentro\", é a recursão. Quando uma caixa não tem mais caixas dentro, não há o que abrir: é o caso base, e você volta para a caixa de fora."),
      destaque("Na animação: âmbar é a caixa em que você está olhando, azul são as abertas que esperam as de dentro, cinza as já vasculhadas e verde onde achou a chave. A pilha embaixo mostra quais caixas estão abertas ao mesmo tempo."),
    ],
    tecnica: [
      titulo("Como funciona"),
      p("As caixas formam uma árvore: cada caixa tem itens e uma lista de caixas filhas. A função verifica os itens da caixa e, se não achar a chave, chama a si mesma para cada filha, na ordem, devolvendo o primeiro resultado encontrado. Percorrer um ramo até o fim antes de passar ao próximo é uma busca em profundidade (DFS), com retorno ao ponto anterior (backtracking) quando um ramo se esgota."),
      titulo("Por que está correto"),
      p("Por indução na altura da árvore: se a chave está na caixa ou em alguma descendente, a função a encontra, porque examina os itens da caixa e depois cada subárvore. Só devolve \"não achei\" (null) depois de vasculhar tudo."),
      titulo("Custo"),
      lista(
        "Tempo: cada caixa é visitada no máximo uma vez, então O(n), com n sendo o total de caixas e itens. Na página, achar a chave na primeira caixa interna leva 4 passos; sem chave, a busca percorre tudo em 16.",
        "Espaço: a pilha de chamadas tem a altura da árvore, O(h).",
      ),
      titulo("Detalhes e limites"),
      lista(
        "Alternativa sem recursão: uma pilha própria (continua sendo DFS) ou uma fila, que dá a busca em largura e acha primeiro as caixas mais rasas. Veja a página \"Busca em largura\".",
        "Se uma caixa puder conter, direta ou indiretamente, a si mesma (um ciclo), a recursão nunca termina. Nesse caso é preciso guardar as caixas já visitadas.",
        "Estruturas muito fundas podem estourar a pilha.",
      ),
    ],
  },

  // ── Capítulo 4 ─────────────────────────────────────────────────────────────

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

  // ── Capítulo 5 ─────────────────────────────────────────────────────────────

  tabelaHash: {
    simples: [
      p("Pense em um armário de gavetas numeradas. Para guardar um objeto, você aplica uma regra que transforma o nome dele em um número de gaveta; para achá-lo depois, aplica a mesma regra e abre direto aquela gaveta, sem procurar nas outras. Essa regra é a função hash, e cada gaveta é um balde."),
      p("Às vezes dois nomes caem na mesma gaveta. Isso é uma colisão, e a solução é guardar os dois lá, em fila. Na busca, você abre a gaveta certa e confere só os poucos itens dela."),
      titulo("Por que é rápida"),
      p("Em vez de olhar item por item, você vai direto à gaveta. Enquanto houver poucas colisões, guardar e achar leva praticamente o mesmo tempo, não importa se a tabela tem 10 ou 10 milhões de itens."),
      destaque("Na página: insira nomes e veja o balde em âmbar. Clique em \"Carregar exemplo\" e busque \"sal\": ele divide o balde 0 com \"pao\", e a busca compara os dois. Depois dobre a tabela e veja o que acontece com as colisões."),
    ],
    tecnica: [
      titulo("Como funciona"),
      p("Uma tabela hash é um array de baldes. A função hash converte a chave em um índice: aqui, a soma dos códigos dos caracteres, módulo o número de baldes. Inserir e buscar calculam o índice e percorrem só aquele balde. Cada balde é uma lista de pares (encadeamento separado), então chaves que caem no mesmo balde convivem. Inserir uma chave que já existe atualiza o valor."),
      titulo("Custo"),
      lista(
        "Tempo esperado O(1) para inserir, buscar e remover, desde que a função hash espalhe bem as chaves e o fator de carga α (itens ÷ baldes) fique limitado. Sob a hipótese de espalhamento uniforme, uma busca compara em média cerca de 1 + α/2 itens quando acha a chave e cerca de α quando não acha.",
        "Pior caso O(n): se todas as chaves caírem no mesmo balde, a tabela vira uma lista. Na página, as 6 permutações das letras de \"abc\" caem todas no mesmo balde (têm a mesma soma), e achar a última compara 6 itens.",
        "Redimensionar (dobrar os baldes e refazer o hash de todos os itens) custa O(n), mas, feito sempre que α passa de um limite, o custo por inserção continua O(1) amortizado. A página alerta acima de 0,75; regras de bolso comuns ficam entre 0,7 e 0,75.",
      ),
      titulo("Detalhes e limites"),
      lista(
        "A função desta página é fraca de propósito: anagramas têm a mesma soma e colidem em qualquer tamanho de tabela. Por isso dobrar a tabela de exemplo não separa \"pao\" e \"sal\" (soma 320 nas duas), e \"cafe\" e \"oleo\" (somas 399 e 431, que diferem por 32) continuam juntos com 8 e com 16 baldes.",
        "Uma boa função hash é determinística (mesma chave, mesmo índice), rápida e espalha as chaves de forma uniforme. As reais misturam os bits de cada caractere e a posição dele; a soma simples ignora a posição.",
        "Alternativa ao encadeamento: endereçamento aberto, em que, ao colidir, a chave vai para outro balde livre da própria tabela (por exemplo, o seguinte).",
        "A ordem dos itens não é preservada, e as chaves precisam ser comparáveis por igualdade. Em JavaScript, Map e Set são tabelas hash.",
      ),
    ],
  },

  usosTabelaHash: {
    simples: [
      p("A tabela hash resolve dois problemas do dia a dia de forma muito rápida."),
      titulo("Já vi isso antes?"),
      p("Numa votação, cada pessoa só pode votar uma vez. Se você guardar os nomes em uma lista, a cada voto precisa comparar com todos os nomes anteriores. Com uma tabela hash, você vai direto à gaveta daquele nome: se ele estiver lá, a pessoa já votou. O trabalho não cresce com o número de votantes."),
      titulo("Já respondi isso antes?"),
      p("Montar uma página de um site é trabalhoso para o servidor. O cache guarda a página pronta, com o endereço como chave. Na próxima visita ao mesmo endereço, o servidor devolve a página guardada na hora, sem refazer o trabalho."),
      destaque("Na página: clique em \"Carregar votos de exemplo\" e compare as comparações da lista com as consultas do hash. No cache, acesse o mesmo endereço duas vezes e veja o tempo cair na segunda."),
    ],
    tecnica: [
      titulo("Detectar duplicatas"),
      lista(
        "Um conjunto (Set) baseado em tabela hash responde \"já está aqui?\" em O(1) esperado. Em uma lista, a checagem é O(n); para n votos, o total é O(n²) contra O(n) com a tabela.",
        "Na página, com os 13 votos de exemplo, a lista soma 59 comparações contra 13 consultas na tabela, e a diferença cresce com o número de votos.",
        "A chave precisa identificar a pessoa: aqui o nome é normalizado (sem espaços nas pontas e em minúsculas), então dois eleitores com o mesmo nome seriam confundidos. Em um sistema real usa-se um identificador único.",
      ),
      titulo("Cache"),
      lista(
        "Padrão: se a chave está no cache, devolve (acerto); senão, calcula, guarda e devolve (falha). A taxa de acerto decide o ganho: o tempo médio é taxa × tempo do acerto + (1 − taxa) × tempo da falha.",
        "Os custos da página (1 ms no acerto e 800 ms na falha) são inventados para ilustrar.",
        "Um cache cresce sem limite se nada for removido; sistemas reais usam uma política de remoção, como descartar o item usado há mais tempo (LRU).",
        "A chave deve incluir tudo que muda a resposta (endereço, parâmetros, idioma). E o difícil costuma ser a invalidação: saber quando a página guardada ficou desatualizada.",
      ),
    ],
  },

  // ── Capítulo 6 ─────────────────────────────────────────────────────────────

  buscaEmLargura: {
    simples: [
      p("Imagine que você quer achar, na sua rede de amigos, alguém que faça determinada coisa. Primeiro você pergunta aos seus amigos diretos. Se nenhum serve, pergunta aos amigos deles, depois aos amigos dos amigos, e assim por diante, sempre ampliando o círculo, como as ondas de uma pedra jogada na água."),
      p("Para não se perder, usa-se uma fila: quem entra primeiro é verificado primeiro. Assim, todos os amigos diretos são verificados antes de qualquer amigo de amigo. E uma lista de quem já foi verificado evita repetir e evita andar em círculos."),
      titulo("O que ela garante"),
      p("A busca em largura acha o caminho com menos passos entre duas pessoas. Ela conta passos, não distância: se cada conexão tivesse um custo diferente, seria preciso o Dijkstra."),
      destaque("Na animação: âmbar é o nó verificado agora, azul os já verificados e roxo os que estão na fila. Na busca de \"voce\" até \"thom\", repare no passo em que \"peggy\" aparece pela segunda vez e é ignorada: dois amigos diferentes a indicaram."),
    ],
    tecnica: [
      titulo("Como funciona"),
      p("Mantém uma fila de nós a verificar, começando pelo ponto de partida, e uma lista dos já verificados. Retira o primeiro da fila; se já foi verificado, ignora. Se é o alvo, reconstrói o caminho seguindo os \"pais\" (quem descobriu cada nó). Senão, coloca todos os seus vizinhos no fim da fila e registra o pai de cada um na primeira vez que o vê. Se a fila esvazia, não há caminho."),
      titulo("Por que acha o menor caminho"),
      p("A fila faz os nós saírem em ordem não decrescente de distância ao ponto de partida: primeiro todos os de distância 1, depois todos os de distância 2, e assim por diante. Logo, a primeira vez que um nó é descoberto é por um caminho com o mínimo de arestas, e o pai registrado nessa hora forma esse caminho."),
      titulo("Custo"),
      lista(
        "Com uma fila de verdade e um conjunto para os visitados, o custo é O(V + E): cada nó e cada aresta são processados uma vez. Espaço O(V).",
        "A versão da página marca um nó como verificado ao retirá-lo da fila (como no livro), então um nó alcançável por vários caminhos entra na fila mais de uma vez: é por isso que aparece o passo \"já foi verificado: ignora\". Ela também usa uma lista com includes e shift, que custam O(n) cada, então o custo real é maior que O(V + E). Marcar ao enfileirar e usar um Set resolve as duas coisas.",
      ),
      titulo("Detalhes e limites"),
      lista(
        "Vale para arestas sem peso (ou todas iguais). Com pesos diferentes, use Dijkstra.",
        "Grafos com ciclos funcionam porque os visitados impedem voltar ao mesmo nó.",
        "O grafo da página é dirigido: uma amizade em um sentido não implica a do outro.",
        "Usos: menor número de passos entre dois pontos, componentes conectados e níveis de uma árvore.",
      ),
    ],
  },

  ordenacaoTopologica: {
    simples: [
      p("Pense na sua manhã: você precisa se vestir antes de sair, tomar banho antes de se vestir, acordar antes de tudo. Algumas tarefas dependem de outras. Uma ordenação topológica é uma ordem de fazer tudo que respeita essas dependências."),
      p("O método é simples: faça uma tarefa que não espera por mais nada, risque-a da lista e veja quais tarefas ficaram livres. Repita. Cada tarefa só entra na ordem quando todas as suas dependências já entraram."),
      titulo("E se der problema"),
      p("Se duas tarefas dependem uma da outra, mesmo que por um caminho longo (vestir precisa de exercitar, que precisa de vestir), nenhuma delas fica livre. Isso é um ciclo e, nesse caso, não existe ordem possível."),
      destaque("Na animação: o número no canto de cada tarefa é quantas dependências ainda faltam; quando chega a 0, ela fica livre (roxa). Marque a opção de dependência circular e veja as tarefas presas ficarem vermelhas."),
    ],
    tecnica: [
      titulo("Como funciona (algoritmo de Kahn)"),
      p("Para cada tarefa, conta o grau de entrada: quantas dependências ainda faltam. Começa com uma fila das tarefas de grau 0. Retira uma, coloca na ordem e diminui em 1 o grau de cada tarefa que dependia dela; as que chegam a 0 entram na fila. No final, se todas as tarefas estão na ordem, ela é válida; se sobraram tarefas, elas fazem parte de um ciclo ou dependem dele."),
      titulo("Por que está correto"),
      lista(
        "Um grafo dirigido sem ciclos (DAG) sempre tem pelo menos um nó sem dependências, e remover um nó não cria ciclos. Logo, o algoritmo nunca trava enquanto sobram nós.",
        "Uma tarefa só entra na ordem com grau 0, isto é, depois de todas as suas dependências, o que respeita cada aresta u → v.",
        "Se há um ciclo, nenhum de seus nós chega a grau 0, porque cada um espera por outro do ciclo. A ordem fica menor que o número de tarefas, e é assim que o ciclo é detectado.",
      ),
      titulo("Custo e detalhes"),
      lista(
        "Tempo O(V + E): cada tarefa e cada dependência são processadas uma vez. Espaço O(V).",
        "A ordem não é única. A rotina da página tem 20 ordens válidas entre as 5.040 possíveis; qual delas sai depende da ordem da fila.",
        "Alternativa: busca em profundidade (DFS), lendo os nós na ordem inversa do término.",
        "Usos: ordem de compilação e de instalação de pacotes, pré-requisitos de disciplinas e cronogramas de projeto.",
      ),
    ],
  },

  // ── Capítulo 7 ─────────────────────────────────────────────────────────────

  dijkstra: {
    simples: [
      p("Imagine um GPS que quer o caminho mais barato (em tempo, dinheiro ou distância) entre dois lugares. O caminho com menos paradas nem sempre é o mais barato: no exemplo da página, o caminho direto inicio → a → fim custa 7, mas passar por b e depois por a custa só 6."),
      p("O Dijkstra funciona assim: a cada passo, escolha o ponto mais barato de alcançar entre os que ainda não foram processados. Dali, veja se passar por ele melhora o custo dos vizinhos; se melhorar, atualize. Repita até processar todos."),
      titulo("Por que dá certo"),
      p("Se o ponto escolhido é o mais barato ainda pendente, qualquer outro caminho até ele passaria por pontos que já custam pelo menos o mesmo, e custos nunca são negativos. Então não dá para chegar a ele mais barato: o valor dele está definido."),
      destaque("Na animação: a tabela mostra o custo, quem veio antes (o pai) e o estado de cada nó. Siga os passos: em \"b\" os custos de \"a\" e de \"fim\" mudam, e o caminho final, o mais barato, fica em verde."),
    ],
    tecnica: [
      titulo("Como funciona"),
      p("Mantém um custo para cada nó (infinito, exceto o início = 0), o pai de cada um e o conjunto dos já processados. Em cada iteração escolhe o nó pendente de menor custo, relaxa suas arestas (se custo[u] + peso < custo[v], atualiza custo[v] e pai[v]) e o marca como processado. No fim, o caminho é reconstruído seguindo os pais a partir do destino."),
      titulo("Por que está correto"),
      p("Invariante: quando um nó u é escolhido, custo[u] já é a distância mínima até ele. Qualquer caminho alternativo precisa sair do conjunto processado por algum nó pendente x, com custo[x] ≥ custo[u] (u foi o mínimo), e os pesos restantes são ≥ 0, então esse caminho não é mais barato. O argumento depende de pesos não negativos: com pesos negativos ele falha."),
      titulo("Custo"),
      lista(
        "Esta versão procura o mínimo varrendo todos os nós: O(V² + E). Com uma fila de prioridade (heap binário), fica O((V + E) log V).",
        "É um algoritmo guloso que dá a resposta ótima, por causa do invariante acima.",
      ),
      titulo("Detalhes e limites"),
      lista(
        "Pesos negativos: o resultado pode estar errado. Veja a página \"Bellman-Ford\".",
        "Pesos zero são aceitos. Ciclos de peso positivo nunca melhoram um custo, então não atrapalham.",
        "Sem pesos (ou com todos iguais), a busca em largura faz o mesmo de forma mais simples.",
        "O algoritmo calcula o caminho mais barato do início até todos os nós alcançáveis, não só o destino. Dá para parar assim que o destino for processado.",
      ),
    ],
  },

  bellmanFord: {
    simples: [
      p("Imagine que algumas conexões dão desconto: ir de b para a custa −2, ou seja, você ganha 2. O Dijkstra assume que, ao chegar a um lugar pelo caminho mais barato conhecido, nunca vai achar um caminho melhor depois. Com descontos, isso pode falhar: um caminho que parece caro no começo pode compensar mais à frente."),
      p("O Bellman-Ford não confia nesse palpite. Ele repassa todas as conexões várias vezes, melhorando os custos sempre que acha um jeito mais barato. Depois de repetir o suficiente, os custos estão certos."),
      titulo("O perigo do ciclo negativo"),
      p("Se existe um circuito cujo custo total é negativo, dá para dar voltas nele e pagar cada vez menos, sem nunca parar. Nesse caso não existe caminho mais barato, e o Bellman-Ford percebe isso."),
      destaque("Na página: compare os resultados. No grafo padrão, o Dijkstra encontra custo 6 e o Bellman-Ford encontra 5 (inicio → b → a → fim). Marque a opção do ciclo e veja o aviso de ciclo negativo."),
    ],
    tecnica: [
      titulo("Como funciona"),
      p("Relaxar uma aresta u → v é testar se custo[u] + peso < custo[v] e, se for, atualizar custo[v]. O algoritmo relaxa todas as arestas, V − 1 vezes. Depois faz mais uma rodada: se algum custo ainda melhora, há um ciclo de peso negativo alcançável a partir do início."),
      titulo("Por que está correto"),
      p("Depois da rodada k, os custos estão corretos para todos os caminhos de no máximo k arestas (por indução: um caminho de k arestas é um de k − 1 arestas seguido de mais uma). Sem ciclos negativos, um caminho mais barato nunca precisa repetir nós, então tem no máximo V − 1 arestas, e V − 1 rodadas bastam. Se na rodada V ainda há melhora, existe um ciclo negativo, e então não há menor caminho (os custos podem cair indefinidamente)."),
      titulo("Custo"),
      lista(
        "Tempo O(V · E), mais lento que o Dijkstra, O((V + E) log V). Em troca, aceita pesos negativos e detecta ciclos negativos.",
        "Pode parar antes se uma rodada inteira não mudar nada.",
      ),
      titulo("Detalhes e limites"),
      lista(
        "Com pesos negativos, o Dijkstra nem sempre erra, mas não há garantia; a página mostra um caso em que ele erra.",
        "Aplicação clássica: câmbio de moedas. Um ciclo de trocas que termina com mais dinheiro do que começou (arbitragem) é um ciclo negativo quando se usam os logaritmos das taxas com o sinal trocado.",
        "Em um grafo não dirigido, qualquer aresta negativa já forma um ciclo negativo (ida e volta).",
      ),
    ],
  },

  dijkstraTrocas: {
    simples: [
      p("Aqui o grafo é de trocas: você tem um livro e quer um piano. Cada seta é uma troca possível, e o número é quanto dinheiro você paga a mais naquela troca. Qual é a série de trocas mais barata?"),
      p("É o mesmo Dijkstra, só que o \"custo\" é dinheiro em vez de distância. Das quatro séries possíveis, a mais barata é livro → LP → bateria → piano, por R$ 35. As outras custam 40, 45 e 50."),
      destaque("Na página: ligue a opção do ciclo (trocar o baixo de volta por um LP, por R$ 2) e rode de novo. O resultado não muda, porque voltar só gasta dinheiro à toa."),
    ],
    tecnica: [
      titulo("Modelagem"),
      p("Cada item é um nó e cada troca é uma aresta dirigida, com peso igual ao dinheiro pago. A série de trocas mais barata é o caminho de menor custo do livro ao piano. O algoritmo é o mesmo do Dijkstra; só o significado do peso muda."),
      titulo("Pontos importantes"),
      lista(
        "Pesos zero são aceitos: livro → pôster custa R$ 0 e o algoritmo o trata normalmente.",
        "Ciclos de peso positivo (como baixo → LP por R$ 2) nunca melhoram um custo, então não alteram o resultado nem impedem o término, porque cada nó é processado uma vez.",
        "Se uma troca desse lucro (peso negativo), o Dijkstra deixa de ser seguro: use o Bellman-Ford. Um ciclo de trocas com lucro total é uma oportunidade de arbitragem, ou seja, um ciclo negativo.",
        "Aqui o grafo tem poucos caminhos, então dá para conferir à mão: 35 (livro → LP → bateria → piano), 40, 45 e 50.",
      ),
    ],
  },

  // ── Capítulo 8 ─────────────────────────────────────────────────────────────

  calendarioAulas: {
    simples: [
      p("Você quer assistir ao maior número de aulas possível, mas só consegue estar em uma sala por vez e cada aula tem seu horário. Como decidir quais escolher?"),
      p("A regra gulosa é simples: escolha a aula que termina primeiro. Depois, entre as que começam quando ela já acabou, escolha de novo a que termina primeiro. Repita. Quem termina cedo deixa mais tempo livre para as próximas."),
      titulo("Por que não a mais curta, ou a que começa antes?"),
      p("Parecem boas ideias, mas falham. Uma aula que começa cedo e dura o dia todo ocupa o lugar de várias outras. Uma aula curta pode ficar bem no meio de duas aulas que caberiam juntas. O que importa é quando você fica livre de novo, ou seja, o horário de término."),
      destaque("Na animação: as aulas aparecem ordenadas pelo horário de término. Verde é a aula escolhida, cinza riscada é a que conflita com a anterior e âmbar é a que está sendo examinada agora."),
    ],
    tecnica: [
      titulo("Como funciona"),
      p("Ordena as aulas pelo horário de término e percorre a lista guardando o término da última aula escolhida: se a aula começa em um horário igual ou posterior a esse término, é escolhida e passa a ser a última; senão, é descartada. O custo é O(n log n), dominado pela ordenação, mais O(n) da varredura."),
      titulo("Por que está correto"),
      p("Argumento de troca: considere qualquer solução ótima e a aula g, que termina primeiro de todas. Se a solução ótima não usa g, troque a primeira aula dela por g: como g termina no mesmo horário ou antes, não surge conflito e o número de aulas não diminui. Logo, existe uma solução ótima que contém g. Removendo g e as aulas que conflitam com ela, sobra o mesmo problema, menor, e o argumento se repete."),
      titulo("Detalhes e limites"),
      lista(
        "Nem todo critério guloso funciona. Começar pelo início mais cedo falha: com uma aula de 0 a 10 e duas aulas curtas, de 1 a 3 e de 4 a 6, escolhe-se a longa e sai 1 aula; o ótimo são 2. Escolher a mais curta também falha: com as aulas 0–5, 4–7 e 6–11, a mais curta (4–7) conflita com as duas outras, e sai 1 aula; o ótimo são 2.",
        "Em empates no horário de término, qualquer desempate dá a quantidade máxima de aulas, mas pode mudar quais aulas entram.",
        "Aqui o guloso é ótimo; na cobertura de conjuntos e no caixeiro-viajante, não é. O que decide é o argumento de troca acima, não o fato de a estratégia ser gulosa.",
        "Na variante em que cada aula tem um valor e se quer o maior valor total, o guloso deixa de funcionar e a solução usa programação dinâmica.",
      ),
    ],
  },

  algoritmoGuloso: {
    simples: [
      p("Você quer cobrir todos os estados com sinal de rádio usando o menor número de estações. Cada estação cobre alguns estados. Testar todas as combinações possíveis seria enorme."),
      p("O jeito guloso é: escolha a estação que cobre mais estados ainda sem sinal, e repita com o que falta. É rápido e simples, e quase sempre dá um bom resultado. Mas pode errar: no segundo exemplo da página, a escolha \"óbvia\" usa 3 conjuntos quando 2 bastavam."),
      titulo("Guloso é uma aproximação"),
      p("Ele não promete a melhor resposta, só uma boa, em pouco tempo. Em problemas muito difíceis, uma boa resposta rápida costuma valer mais do que a perfeita que leva uma eternidade."),
      destaque("Na animação: a cada passo, cada estação mostra quantos estados novos cobriria, e a escolhida fica em âmbar. No quadro final, compare o resultado do guloso com o da força bruta."),
    ],
    tecnica: [
      titulo("Como funciona"),
      p("A cada iteração escolhe o conjunto que cobre o maior número de itens ainda descobertos, marca esses itens como cobertos e repete até cobrir tudo, ou até nenhum conjunto cobrir algo novo (e então a cobertura completa é impossível). Em empate, vale o primeiro da lista."),
      titulo("Custo"),
      lista(
        "Guloso: cada iteração examina todos os conjuntos e há no máximo uma iteração por item, então o custo é polinomial (da ordem de itens × conjuntos × tamanho dos conjuntos). O livro cita O(n²).",
        "Força bruta: testa todos os subconjuntos de conjuntos, 2ᵐ − 1 para m conjuntos (31 para os 5 conjuntos do exemplo do livro), o que logo se torna impraticável.",
      ),
      titulo("Qualidade da aproximação"),
      lista(
        "A cobertura de conjuntos é um problema NP-difícil: não se conhece algoritmo rápido que garanta o mínimo.",
        "O guloso tem garantia: nunca usa mais que (1 + ln n) vezes o ótimo, com n itens a cobrir.",
        "Numa simulação com 322 instâncias aleatórias pequenas, o guloso usou mais conjuntos que o ótimo em 41 delas (cerca de 13%) e nunca passou de 1,67 vez o ótimo.",
        "No segundo exemplo da página, o conjunto de 7 itens é escolhido primeiro e leva a 3 conjuntos, embora os dois conjuntos de 6 itens já cubram tudo.",
      ),
      titulo("Detalhes e limites"),
      lista(
        "O resultado pode depender da ordem dos conjuntos, por causa dos empates.",
        "Com poucos conjuntos, a força bruta ainda é viável e dá o mínimo exato; com muitos, só o guloso (ou outra aproximação) é prático.",
        "É a saída padrão para problemas NP-completos; veja a página \"Caixeiro-viajante\".",
      ),
    ],
  },

  caixeiroViajante: {
    simples: [
      p("Um caixeiro precisa visitar várias cidades, passar por cada uma uma vez e voltar ao ponto de partida, andando o menos possível. Qual é a melhor ordem de visita?"),
      p("Com 4 ou 5 cidades parece fácil. Mas o número de ordens possíveis explode: com 10 cidades são mais de 360 mil e com 15 são mais de 87 bilhões. Testar todas é inviável."),
      p("Uma saída é o atalho do vizinho mais próximo: de onde você está, vá sempre para a cidade ainda não visitada que fica mais perto. É rápido e dá um percurso razoável, mas costuma ser mais longo que o ideal."),
      destaque("Na página: arraste o número de cidades. À esquerda está a rota do atalho (âmbar) e à direita a melhor rota (verde). Repare como o atalho às vezes cruza o próprio caminho."),
    ],
    tecnica: [
      titulo("O problema"),
      p("O caixeiro-viajante (TSP) pede o circuito de menor comprimento que passa por todas as n cidades e volta à primeira. A versão de decisão é NP-completa e a de otimização é NP-difícil: não se conhece algoritmo polinomial que garanta a melhor rota."),
      titulo("As duas abordagens da página"),
      lista(
        "Força bruta: fixa a primeira cidade e testa as (n − 1)! ordens. Ela conta cada rota e a sua inversa separadamente; como o circuito é simétrico, bastaria testar metade, (n − 1)!/2.",
        "Vizinho mais próximo: a cada passo vai para a cidade não visitada mais próxima, O(n²). Não tem garantia de qualidade e pode ficar muito pior que o ótimo. Nas cidades da página, a rota gulosa fica entre cerca de 5% e 19% mais longa que a ótima (de 4 a 9 cidades).",
      ),
      titulo("Existem algoritmos melhores?"),
      lista(
        "Exatos, ainda exponenciais, mas bem menores que o fatorial: o algoritmo de Held-Karp (programação dinâmica sobre subconjuntos) resolve em O(n² · 2ⁿ). Para n = 20, são cerca de 4 × 10⁸ operações contra 1,2 × 10¹⁷ ordens da força bruta. Nas cidades da página ele dá o mesmo ótimo que a força bruta.",
        "Aproximados: para distâncias que obedecem à desigualdade triangular, o algoritmo de Christofides garante uma rota até 1,5 vez mais longa que a ótima. A heurística 2-opt melhora uma rota desfazendo cruzamentos, como o da rota gulosa da página.",
      ),
      titulo("Detalhes"),
      lista(
        "As cidades da página são pontos em um plano, com distância em linha reta.",
        "As pistas para reconhecer problemas desse tipo estão no fim da página.",
      ),
    ],
  },

  // ── Capítulo 9 ─────────────────────────────────────────────────────────────

  programacaoDinamica: {
    simples: [
      p("Você vai viajar com uma mochila que aguenta 4 kg e quer levar o que vale mais. Os itens são um violão (1 kg), um aparelho de som (4 kg) e um notebook (3 kg). Pegar o mais valioso à primeira vista, o som, não é a melhor escolha: violão e notebook juntos valem mais."),
      p("A programação dinâmica resolve isso respondendo antes a perguntas menores. Ela monta uma tabela: para cada item e cada capacidade, de 1 kg até o máximo, qual é o maior valor possível? Cada célula usa respostas de células já preenchidas: ou fica sem o item, ou leva o item e usa a melhor resposta para a capacidade que sobra."),
      p("Quando a tabela termina, a última célula é a resposta."),
      destaque("Na animação: a célula âmbar é a que está sendo calculada, e a mensagem acima mostra a conta. No fim, as células verdes marcam onde cada item entrou na solução."),
    ],
    tecnica: [
      titulo("Como funciona"),
      p("tabela[i][c] é o melhor valor usando os itens de 0 a i em uma mochila de capacidade c. Para cada célula: sem o item i, o valor é tabela[i − 1][c]; com ele (se couber, ou seja, c ≥ peso), é valor_i + tabela[i − 1][c − peso_i]. A célula guarda o maior dos dois. A resposta é a última célula. Para saber quais itens entraram, percorre-se a tabela de trás para frente: onde o valor difere do da linha de cima, o item entrou."),
      titulo("Por que está correto"),
      p("A solução ótima para (i, c) ou não usa o item i, e então é ótima para (i − 1, c), ou usa o item i, e o restante é ótimo para (i − 1, c − peso_i). Essa propriedade, a subestrutura ótima, permite montar a resposta a partir das menores. Como os mesmos subproblemas aparecem muitas vezes, guardá-los evita recalcular."),
      titulo("Custo"),
      lista(
        "Tempo e espaço O(n · W), com n itens e capacidade W: a tabela tem n × W células. É pseudo-polinomial: cresce com o valor numérico de W, não só com o tamanho da entrada, e o problema da mochila 0/1 é NP-difícil.",
        "Se só o valor máximo interessa, basta guardar a linha anterior: espaço O(W). Para recuperar os itens, é preciso a tabela inteira.",
      ),
      titulo("Detalhes e limites"),
      lista(
        "Os itens são indivisíveis (0/1). Se pudessem ser fracionados, o guloso pela razão valor/peso seria ótimo.",
        "O guloso da página escolhe pelo maior valor e erra: numa simulação com 1.500 mochilas aleatórias pequenas, ficou abaixo do ótimo em 280. Escolher pela razão valor/peso acerta nos dois exemplos da página, mas também falha: com capacidade 10 e itens de 6 kg (valor 30), 5 kg (24) e 5 kg (24), ele leva o primeiro e para em 30, enquanto os dois últimos valem 48.",
        "Os pesos precisam ser inteiros (ou convertidos em inteiros), pois indexam a tabela; por isso o roteiro em Londres usa meios dias.",
        "Vale a pena quando há subproblemas repetidos e subestrutura ótima; sem repetição, dividir para conquistar basta.",
      ),
    ],
  },

  roteiroLondres: {
    simples: [
      p("É a mesma ideia da mochila com outro disfarce: em vez de peso, cada atração ocupa tempo; em vez de valor, tem uma nota. Você tem 2 dias e quer a maior nota total."),
      p("Você não pode visitar metade de um museu: cada atração entra inteira ou fica de fora. A tabela vai testando, para cada atração e cada quantidade de tempo, qual é a melhor soma de notas possível."),
      p("Com 2 dias, o resultado é Abadia de Westminster, Galeria Nacional e Catedral de St. Paul, com nota total 24."),
      destaque("Na página: troque o tempo disponível ou ligue a Torre de Londres (uma atração que inventei) e veja só uma linha nova entrar na tabela, sem refazer o resto."),
    ],
    tecnica: [
      titulo("Modelagem"),
      p("É o problema da mochila 0/1: o tempo é o peso, a nota é o valor e o tempo total é a capacidade. Os tempos são contados em meios dias (1, 2 e 4) para serem inteiros, e a tabela tem uma coluna por meio dia. Com 5 atrações e 2 dias, são 5 × 4 = 20 células; com a Torre de Londres, 6 × 4 = 24."),
      titulo("Pontos importantes"),
      lista(
        "Acrescentar uma atração só acrescenta uma linha: cada célula nova usa apenas a linha de cima. Isso vale porque a tabela é montada item por item, em ordem.",
        "Com 2 dias, o melhor roteiro soma 24. Com a Torre (1 dia, nota 10, inventada para a página), soma 25: Westminster, St. Paul e Torre.",
        "O custo é O(n · W), com W em unidades de meio dia. A justificativa completa e as limitações estão na página \"Programação dinâmica\".",
      ),
    ],
  },

  subcadeiaComum: {
    simples: [
      p("Compare as palavras \"hish\" e \"fish\". Elas têm em comum o trecho \"ish\". Descobrir o maior trecho em comum entre duas palavras serve para corretores ortográficos, para comparar textos e até para comparar DNA."),
      p("A página monta uma tabela com uma linha para cada letra de uma palavra e uma coluna para cada letra da outra. Em cada célula pergunta: essas duas letras são iguais? Se forem, o trecho em comum cresce 1 em relação à célula da diagonal. Se não, o trecho se quebra e volta a 0."),
      titulo("Dois jeitos de comparar"),
      lista(
        "Subcadeia: as letras precisam ser vizinhas, sem buracos. É o exemplo do livro.",
        "Subsequência: as letras precisam estar na mesma ordem, mas podem ter outras no meio. Em \"abcde\" e \"ace\", a subsequência comum é \"ace\" (3), enquanto a maior subcadeia é só \"a\" (1).",
      ),
      destaque("Na página: escolha o modo, digite duas palavras e preencha a tabela passo a passo. No fim, as células verdes marcam a resposta."),
    ],
    tecnica: [
      titulo("Como funciona"),
      p("t[i][j] compara a[i] e b[j]. Se as letras são iguais, t[i][j] = t[i − 1][j − 1] + 1. Se são diferentes, na subcadeia (consecutiva) t[i][j] = 0 e, na subsequência, t[i][j] = máx(t[i − 1][j], t[i][j − 1]). O tamanho da resposta é o maior valor da tabela (subcadeia) ou a última célula (subsequência). A resposta em si é recuperada voltando pela tabela."),
      titulo("Por que está correto"),
      p("Subestrutura ótima: se as letras finais são iguais, a maior subsequência comum termina nelas e o resto é a maior subsequência comum dos prefixos menores; se são diferentes, a resposta é a melhor entre descartar a última letra de uma palavra ou a da outra. Na subcadeia, uma diferença quebra a sequência, e por isso o valor volta a 0."),
      titulo("Custo"),
      lista(
        "Tempo e espaço O(m · n), para palavras de tamanhos m e n.",
        "Só o tamanho da resposta pode ser calculado com O(min(m, n)) de espaço, guardando duas linhas; recuperar a resposta pede a tabela inteira.",
      ),
      titulo("Detalhes e limites"),
      lista(
        "A maior subsequência comum não é única: pode haver várias respostas do mesmo tamanho, e a página mostra uma delas.",
        "Ferramentas de comparação de arquivos (diff) usam variações desse algoritmo, aplicado a linhas em vez de letras.",
        "Um problema parente é a distância de edição (Levenshtein), que conta quantas inserções, remoções e trocas transformam uma palavra em outra. Usa uma tabela semelhante e está na base de muitos corretores ortográficos.",
      ),
    ],
  },

  // ── Capítulo 10 ────────────────────────────────────────────────────────────

  knnClassificacao: {
    simples: [
      p("Para saber se uma fruta é laranja ou toranja, olhe as frutas parecidas com ela. Na página, cada fruta é um ponto no gráfico: quanto mais à direita, maior; quanto mais acima, mais vermelha. Uma fruta nova cai em algum ponto, e você olha os k pontos mais próximos."),
      p("Entre esses vizinhos, vota-se: se a maioria é laranja, a fruta nova é classificada como laranja; se a maioria é toranja, como toranja. É a ideia de \"diga-me com quem andas e te direi quem és\"."),
      titulo("E o valor de k?"),
      p("Com k = 1, só o vizinho mais próximo decide, e um ponto fora do padrão atrapalha. Com k grande, a decisão fica mais estável, mas pode ignorar detalhes locais. Na página, passar de k = 1 para k = 9 muda a classe de cerca de 3,5% do gráfico, perto da fronteira entre os dois grupos."),
      destaque("Na página: clique no gráfico para colocar uma fruta e mexa no controle de k. As linhas ligam a fruta nova aos vizinhos, e o círculo tracejado mostra até onde eles estão."),
    ],
    tecnica: [
      titulo("Como funciona"),
      p("O KNN não tem fase de treino: ele guarda os exemplos. Para classificar um ponto novo, calcula a distância euclidiana até todos os exemplos, ordena, toma os k menores e devolve a classe mais votada. Em empate, a página escolhe a classe do vizinho mais próximo."),
      titulo("Custo"),
      lista(
        "Por consulta, O(n · d) para calcular as distâncias (n exemplos, d características) e O(n log n) para ordenar; uma seleção parcial ou um heap reduz a ordenação. É barato \"treinar\" e caro consultar.",
        "Estruturas espaciais (como árvores k-d) aceleram a consulta em poucas dimensões, mas perdem a vantagem quando d cresce.",
      ),
      titulo("Escolhas que importam"),
      lista(
        "k: valores pequenos dão fronteiras irregulares e sensíveis a ruído; valores grandes suavizam e podem misturar as classes. Escolhe-se testando com dados separados. Em problemas de duas classes, um k ímpar evita empates: com k = 4, o gráfico da página tem empate em cerca de 9% dos pontos.",
        "Escala das características: a distância soma diferenças, então uma característica com valores grandes domina as demais. É comum normalizar (por exemplo, pôr tudo entre 0 e 1) antes de calcular distâncias.",
        "Características irrelevantes e muitas dimensões prejudicam: com muitas dimensões, as distâncias entre os pontos ficam parecidas (a \"maldição da dimensionalidade\").",
        "Os dados da página são inventados e simples, de propósito.",
      ),
    ],
  },

  knnRegressao: {
    simples: [
      p("Além de classificar, o KNN também pode prever um número. Na página, cada ponto é um dia de uma padaria, descrito por movimento na rua e temperatura, com a quantidade de pães vendidos. Quantos pães fazer em um dia novo?"),
      p("A resposta vem de uma média: ache os k dias mais parecidos com o novo e tire a média dos pães que eles venderam. Por exemplo, se os três dias mais parecidos venderam 130, 118 e 103 pães, a previsão é 117."),
      destaque("Na página: clique no gráfico para criar um dia. Os números dentro dos pontos são os pães vendidos, e a previsão aparece no ponto verde."),
    ],
    tecnica: [
      titulo("Como funciona"),
      p("É o mesmo mecanismo da classificação, mas em vez de votar tira a média dos valores dos k vizinhos mais próximos: ŷ = (1/k) · Σ valores dos vizinhos."),
      titulo("Limites"),
      lista(
        "A previsão sempre fica entre o menor e o maior valor dos exemplos (na página, entre 52 e 205 pães): o KNN não extrapola além do que viu.",
        "Cada vizinho conta igual. Uma variação comum é ponderar pelo inverso da distância, dando mais peso aos mais próximos.",
        "É sensível a pontos fora do padrão (outliers), porque a média os incorpora. A mediana é mais robusta.",
        "As observações da classificação continuam valendo: escolha de k, escala das características e maldição da dimensionalidade.",
        "Os dados são inventados: o número de pães vem de uma fórmula com um pouco de variação, só para ilustrar.",
      ),
    ],
  },

  recomendacaoFilmes: {
    simples: [
      p("Para recomendar um filme, procure pessoas com gosto parecido com o seu e veja o que elas acharam dele. Cada pessoa é um ponto, descrito pelas notas que deu aos filmes, e as parecidas ficam por perto."),
      p("O problema é medir \"parecido\". Algumas pessoas dão nota 5 para tudo que gostam e 4 para o que é só ok; outras nunca passam de 3. Comparar só os números pode escolher a pessoa errada."),
      titulo("Três jeitos de medir"),
      lista(
        "Distância comum: compara as notas diretamente. Aqui aponta para o Caio, que dá 4 para tudo e nada tem a ver com o seu gosto.",
        "Notas normalizadas: desconta o jeito de cada um dar nota (a média dele). Aponta para a Bia, que gosta e desgosta dos mesmos filmes que você e só dá notas mais baixas.",
        "Cosseno: compara a direção das notas, não o tamanho. Também aponta para a Bia.",
      ),
      destaque("Na página: troque o método com k = 1 e veja a previsão mudar de 2,00 para 5,00. A tabela no fim compara os três métodos."),
    ],
    tecnica: [
      titulo("Como funciona"),
      p("Cada pessoa é um vetor com as notas dos filmes que o alvo também avaliou. Mede-se a semelhança entre os vetores, escolhem-se as k pessoas mais parecidas e a nota prevista do filme novo é a média das notas delas para ele."),
      titulo("As três medidas"),
      lista(
        "Distância euclidiana: raiz da soma dos quadrados das diferenças. É sensível ao nível geral das notas.",
        "Distância normalizada: subtrai de cada vetor a própria média antes de calcular a distância euclidiana. Compara o padrão de preferências, não o nível.",
        "Similaridade do cosseno: produto escalar dividido pelo produto das normas, de −1 a 1. Mede o ângulo entre os vetores. Com notas todas positivas ela tende a ser alta mesmo para gostos diferentes: aqui, Caio e Davi, que dão notas constantes, têm 0,90 com você, não muito abaixo dos 0,97 da Bia.",
        "O cosseno aplicado às notas já normalizadas é exatamente a correlação de Pearson: de −1 (gostos opostos) a 1 (mesmo padrão). Com a Bia dá 0,80 e com a Eva, −0,80. Quem dá a mesma nota a tudo fica sem correlação definida, porque não há padrão.",
      ),
      titulo("Detalhes e limites"),
      lista(
        "Pessoas que avaliam poucos filmes, ou filmes diferentes, dificultam a comparação. Aqui todas avaliaram os mesmos cinco filmes, para simplificar.",
        "Escolher bem as características é parte do problema: elas devem se relacionar com o que se quer prever e não ser enviesadas.",
        "Os dados são inventados.",
      ),
    ],
  },

  ocrKnn: {
    simples: [
      p("Para um computador \"ler\" um dígito escrito à mão, ele olha para os pixels. Aqui, cada número é uma grade pequena (5 colunas por 7 linhas) de quadrados acesos e apagados."),
      p("O KNN compara a sua grade com um conjunto de exemplos conhecidos, contando em quantos quadrados elas diferem. As mais parecidas \"votam\", e o dígito mais votado é o resultado."),
      titulo("O que atrapalha"),
      p("Se você apagar ou acender alguns quadrados, o dígito ainda costuma ser reconhecido: a grade continua parecida com o original. Mas, se o desenho inteiro deslizar um quadrado para o lado, quase tudo muda de lugar, e a comparação por pixels erra."),
      destaque("Na página: clique em um dígito (0 a 9) para carregar o modelo, apague ou acenda quadrados e veja o reconhecimento mudar. Os vizinhos aparecem em miniatura."),
    ],
    tecnica: [
      titulo("Como funciona"),
      p("Cada imagem vira um vetor de 35 características (os pixels, 0 ou 1). A distância é a de Hamming: o número de pixels em que duas imagens diferem. O treino tem 30 imagens: o modelo de cada dígito e duas versões com 3 pixels trocados. O dígito reconhecido é o mais votado entre os k vizinhos mais próximos."),
      titulo("Robustez medida"),
      lista(
        "Em simulações com o modelo de cada dígito e pixels trocados ao acaso (k = 5): 100% de acerto com 0 a 2 pixels trocados, cerca de 99% com 3, 97% com 4, 92% com 6 e 85% com 8. Com tão poucos exemplos por dígito, o valor de k muda pouco o acerto (entre 92% e 95% com 6 pixels trocados).",
        "Deslocamento: se o dígito é deslocado 1 pixel para o lado, a distância por pixels falha: só 1 dos 10 dígitos foi reconhecido. A distância compara posição por posição e não é invariante a deslocamentos.",
      ),
      titulo("Detalhes e limites"),
      lista(
        "Um OCR real não usa pixels brutos: extrai características mais robustas (bordas, contornos, proporções), centraliza e normaliza o tamanho da imagem e usa muito mais exemplos. É isso que dá resistência a deslocamentos e a variações de traço.",
        "Esta é uma demonstração: imagens minúsculas e só 3 exemplos por dígito.",
        "O custo de reconhecer é O(n · d): 30 exemplos × 35 pixels aqui. Com milhões de imagens, isso pede estruturas de busca aproximada.",
      ),
    ],
  },

  filtroSpam: {
    simples: [
      p("O filtro aprende com exemplos. Ele conta quantas vezes cada palavra aparece em mensagens de spam e em mensagens normais. \"Grátis\" aparece em spams e nunca em mensagens normais; \"reunião\" é o contrário."),
      p("Para uma mensagem nova, ele junta o que sabe de cada palavra: palavras típicas de spam puxam a chance para cima e palavras de mensagem normal puxam para baixo. No fim, sai uma chance de ser spam."),
      titulo("Por que \"ingênuo\""),
      p("O filtro trata cada palavra como se aparecesse sozinha, sem relação com as outras. Isso não é verdade (\"clique\" e \"aqui\" costumam vir juntas), mas mesmo assim o método funciona bem. O preço é que ele fica exagerado: a palavra \"grátis\" sozinha dá 80% de chance de spam, e repeti-la cinco vezes leva a 99,9%."),
      destaque("Na página: experimente os exemplos e veja, na tabela, para que lado cada palavra puxa. Palavras que não estavam no treino são ignoradas."),
    ],
    tecnica: [
      titulo("Como funciona"),
      p("Pelo teorema de Bayes, P(spam | palavras) é proporcional a P(spam) · Π P(palavra | spam), supondo que as palavras sejam independentes dada a classe (a hipótese \"ingênua\"). O mesmo cálculo vale para a classe normal, e a chance de spam é a proporção entre os dois resultados. Cada P(palavra | classe) é estimada pela contagem da palavra na classe dividida pelo total de palavras da classe."),
      titulo("Detalhes de implementação"),
      lista(
        "Suavização de Laplace: soma 1 a cada contagem e o tamanho do vocabulário ao total, para que uma palavra que nunca apareceu em uma classe não zere o produto.",
        "Logaritmos: multiplicar muitas probabilidades pequenas perde precisão. Somam-se os logaritmos e, no fim, converte-se de volta em probabilidade.",
        "O ponto de partida, P(spam), vem da proporção de spam no treino: aqui 50%, com 7 mensagens de cada tipo.",
        "Palavras fora do vocabulário do treino são ignoradas, e uma mensagem sem nenhuma palavra conhecida fica em 50%.",
      ),
      titulo("Custo e limites"),
      lista(
        "Treino: uma passada pelos dados, O(total de palavras). Classificação: O(palavras da mensagem). É muito barato.",
        "A hipótese de independência é falsa, o que deixa as probabilidades exageradas (pouco calibradas), embora a classificação em si costume ser boa. Na página, repetir \"grátis\" de 1 para 5 vezes leva a chance de 80% para 99,9%.",
        "Com 14 mensagens inventadas, o filtro é só um exemplo: filtros reais usam milhares de mensagens e outras características (remetente, links).",
      ),
    ],
  },

  // ── Capítulo 11 ────────────────────────────────────────────────────────────

  proximosPassos: {
    simples: [
      p("Este capítulo do livro aponta para onde seguir depois do básico. Cada tema abaixo é um assunto à parte, e você não precisa estudar todos: escolha o que combina com o que quer construir."),
      lista(
        "Buscas rápidas em dados que mudam: árvores.",
        "Fazer um buscador: índices invertidos.",
        "Trabalhar com som ou sinais: transformada de Fourier.",
        "Ganhar velocidade: algoritmos paralelos e MapReduce.",
        "Dados enormes e pouca memória: filtros de Bloom e HyperLogLog.",
        "Segurança: funções SHA e Diffie-Hellman.",
        "Otimizar com restrições: programação linear.",
      ),
      p("Os cartões abaixo resumem cada tema e indicam qual página do app tem a base necessária."),
    ],
    tecnica: [
      titulo("Um nível a mais, tema por tema"),
      lista(
        "Árvores: uma árvore de busca binária faz busca, inserção e remoção em O(h), com h a altura; balanceada (AVL, rubro-negra), h = O(log n). Bancos de dados costumam usar árvores B.",
        "Índices invertidos: mapeiam termo → lista de documentos. Uma consulta com várias palavras intersecciona essas listas.",
        "Transformada de Fourier: decompõe um sinal em frequências. A versão rápida (FFT) custa O(n log n), contra O(n²) do cálculo direto.",
        "Algoritmos paralelos: o ganho é limitado pela parte que não dá para paralelizar (lei de Amdahl) e pelo custo de coordenar o trabalho.",
        "MapReduce: o map transforma cada item de forma independente e o reduce agrega os resultados com a mesma chave. A independência é o que permite distribuir.",
        "Filtro de Bloom: tabela de bits e k funções hash; pode dar falso positivo, mas nunca falso negativo. O HyperLogLog estima quantos itens distintos existem com pouquíssima memória, com erro relativo em torno de 1,04/√m para m registradores.",
        "SHA: funções hash criptográficas (por exemplo, SHA-256, com saída de 256 bits), determinísticas e difíceis de inverter. O hash sensível à localidade faz o oposto: entradas parecidas geram hashes parecidos.",
        "Diffie-Hellman: dois lados chegam a um segredo comum trocando valores públicos; a segurança se apoia na dificuldade do logaritmo discreto.",
        "Programação linear: maximiza ou minimiza uma função linear sujeita a restrições lineares. O Simplex é eficiente na prática, e existem algoritmos de tempo polinomial (pontos interiores).",
      ),
      p("Esta página é um resumo: nenhum desses temas tem demonstração interativa aqui."),
    ],
  },
} satisfies Record<string, { simples: Bloco[]; tecnica: Bloco[] }>;
