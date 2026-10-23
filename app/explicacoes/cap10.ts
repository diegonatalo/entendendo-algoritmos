import { p, titulo, lista, destaque, type Explicacao } from "./blocos";

export const EXPLICACOES_CAP10 = {
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
} satisfies Record<string, Explicacao>;
