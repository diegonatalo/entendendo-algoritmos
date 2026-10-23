import { p, titulo, lista, destaque, type Explicacao } from "./blocos";

export const EXPLICACOES_CAP08 = {
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
} satisfies Record<string, Explicacao>;
