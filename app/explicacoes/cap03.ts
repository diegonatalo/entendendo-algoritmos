import { p, titulo, lista, destaque, type Explicacao } from "./blocos";

export const EXPLICACOES_CAP03 = {
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
} satisfies Record<string, Explicacao>;
