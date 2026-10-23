import { p, titulo, lista, destaque, type Explicacao } from "./blocos";

export const EXPLICACOES_CAP06 = {
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
} satisfies Record<string, Explicacao>;
