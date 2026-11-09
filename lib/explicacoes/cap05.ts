import { p, titulo, lista, destaque, type Explicacao } from "./blocos";

export const EXPLICACOES_CAP05 = {
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
} satisfies Record<string, Explicacao>;
