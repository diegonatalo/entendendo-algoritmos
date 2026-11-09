import { p, titulo, lista, destaque, type Explicacao } from "./blocos";

export const EXPLICACOES_CAP09 = {
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
} satisfies Record<string, Explicacao>;
