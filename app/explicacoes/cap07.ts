import { p, titulo, lista, destaque, type Explicacao } from "./blocos";

export const EXPLICACOES_CAP07 = {
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
} satisfies Record<string, Explicacao>;
