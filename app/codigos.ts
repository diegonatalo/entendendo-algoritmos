// Trechos de código mostrados nas páginas. São versões enxutas dos algoritmos, sem o
// registro de passos que as funções em /functions fazem para animar a tela.
// Cada trecho é testado contra a função real correspondente (veja a pasta de verificação).

export const CODIGOS = {
  buscaBinaria: `function buscaBinaria(lista, alvo) {
  let inicio = 0;
  let fim = lista.length - 1;

  while (inicio <= fim) {
    const meio = Math.floor((inicio + fim) / 2);

    if (lista[meio] === alvo) return meio;   // achou
    if (lista[meio] < alvo) inicio = meio + 1;   // descarta a metade esquerda
    else fim = meio - 1;                         // descarta a metade direita
  }

  return -1;   // não está na lista
}`,

  arraysListas: `// Array: inserir na posição i desloca todos os itens seguintes
function inserirNoArray(array, i, valor) {
  for (let j = array.length; j > i; j--) {
    array[j] = array[j - 1];   // um passo por item deslocado
  }
  array[i] = valor;
}

// Lista encadeada: cada nó aponta para o próximo
function inserirNaLista(cabeca, i, valor) {
  const novo = { valor, proximo: null };

  if (i === 0) {                 // início: nada a percorrer
    novo.proximo = cabeca;
    return novo;
  }

  let anterior = cabeca;
  for (let k = 0; k < i - 1; k++) {
    anterior = anterior.proximo;   // um passo por nó percorrido
  }
  novo.proximo = anterior.proximo; // só dois ponteiros mudam
  anterior.proximo = novo;
  return cabeca;
}`,

  ordenacaoSelecao: `function indiceDoMenor(lista) {
  let menor = 0;
  for (let i = 1; i < lista.length; i++) {
    if (lista[i] < lista[menor]) menor = i;
  }
  return menor;
}

function ordenacaoSelecao(lista) {
  const restantes = [...lista];
  const ordenados = [];

  while (restantes.length > 0) {
    const i = indiceDoMenor(restantes);          // acha o menor
    ordenados.push(restantes.splice(i, 1)[0]);   // move para a lista ordenada
  }

  return ordenados;
}`,

  fatorial: `function fatorial(n) {
  if (n <= 1) return 1;        // caso base
  return n * fatorial(n - 1);  // caso recursivo
}`,

  caixas: `function procurar(caixa) {
  if (caixa.itens.includes("chave")) return caixa;   // achou

  for (const filha of caixa.caixas) {
    const achada = procurar(filha);                  // caso recursivo
    if (achada) return achada;
  }

  return null;                                       // caso base: nada aqui
}`,

  divisaoConquista: `// Terreno de a × b: o lado do maior quadrado que o divide por igual é o MDC
function mdc(a, b) {
  if (b === 0) return a;      // caso base: sobrou só quadrados
  return mdc(b, a % b);       // caso recursivo: repete com o que sobrou
}

// Soma de uma lista: primeiro item + soma do resto
function soma(lista) {
  if (lista.length === 0) return 0;   // caso base
  const [primeiro, ...resto] = lista;
  return primeiro + soma(resto);      // caso recursivo
}`,

  quicksort: `function quicksort(lista) {
  if (lista.length < 2) return lista;   // caso base

  const meio = Math.floor(lista.length / 2);
  const pivo = lista[meio];                          // pivô no meio
  const resto = lista.filter((_, i) => i !== meio);  // lista sem o pivô

  const menores = resto.filter((n) => n <= pivo);
  const maiores = resto.filter((n) => n > pivo);

  return [...quicksort(menores), pivo, ...quicksort(maiores)];
}`,

  mesclagem: `function mesclagem(lista) {
  if (lista.length < 2) return lista;   // caso base

  const meio = Math.floor(lista.length / 2);
  const esquerda = mesclagem(lista.slice(0, meio));
  const direita = mesclagem(lista.slice(meio));

  return juntar(esquerda, direita);
}

// junta duas listas já ordenadas
function juntar(a, b) {
  const resultado = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    resultado.push(a[i] <= b[j] ? a[i++] : b[j++]);
  }

  return [...resultado, ...a.slice(i), ...b.slice(j)];
}`,

  // ── Capítulo 5 ─────────────────────────────────────────────────────────────

  tabelaHash: `function funcaoHash(chave, tamanho) {
  let soma = 0;
  for (let i = 0; i < chave.length; i++) {
    soma += chave.charCodeAt(i);   // soma os códigos das letras
  }
  return soma % tamanho;           // posição (balde) da chave
}

function inserir(tabela, chave, valor) {
  const balde = tabela[funcaoHash(chave, tabela.length)];
  const existente = balde.find((e) => e.chave === chave);

  if (existente) existente.valor = valor;   // chave repetida: atualiza
  else balde.push({ chave, valor });        // colisão? entra na lista do balde
}

function buscar(tabela, chave) {
  const balde = tabela[funcaoHash(chave, tabela.length)];
  return balde.find((e) => e.chave === chave)?.valor;   // só compara dentro do balde
}`,

  usosHash: `// Duplicatas: um conjunto (tabela hash) responde "já vi?" em uma consulta
function votar(jaVotaram, nome) {
  const chave = nome.trim().toLowerCase();
  if (jaVotaram.has(chave)) return false;   // já votou: barra
  jaVotaram.add(chave);
  return true;
}

// Cache: se a página já está guardada, devolve na hora
function acessar(cache, url, buscarNoServidor) {
  if (cache.has(url)) return cache.get(url);   // acerto

  const pagina = buscarNoServidor(url);        // falha: caro
  cache.set(url, pagina);                      // guarda para a próxima vez
  return pagina;
}`,

  // ── Capítulo 6 ─────────────────────────────────────────────────────────────

  buscaEmLargura: `function buscaEmLargura(grafo, inicio, alvo) {
  const fila = [inicio];
  const verificados = [];
  const pai = { [inicio]: null };   // quem descobriu cada nó

  while (fila.length > 0) {
    const atual = fila.shift();                   // primeiro a entrar, primeiro a sair
    if (verificados.includes(atual)) continue;    // já verificado: ignora
    verificados.push(atual);

    if (atual === alvo) {
      const caminho = [];
      for (let no = atual; no !== null; no = pai[no]) caminho.unshift(no);
      return caminho;                             // caminho com menos arestas
    }

    for (const vizinho of grafo[atual] ?? []) {
      fila.push(vizinho);
      if (!(vizinho in pai)) pai[vizinho] = atual;
    }
  }

  return null;   // não existe caminho
}`,

  ordenacaoTopologica: `// grafo[a] = tarefas que só podem começar depois de a
function ordenacaoTopologica(grafo) {
  const tarefas = Object.keys(grafo);
  const faltam = {};   // quantas dependências ainda faltam para cada tarefa
  for (const t of tarefas) faltam[t] = 0;
  for (const t of tarefas) for (const d of grafo[t]) faltam[d]++;

  const fila = tarefas.filter((t) => faltam[t] === 0);   // já estão livres
  const ordem = [];

  while (fila.length > 0) {
    const atual = fila.shift();
    ordem.push(atual);

    for (const d of grafo[atual]) {
      faltam[d]--;
      if (faltam[d] === 0) fila.push(d);   // ficou livre
    }
  }

  return ordem.length === tarefas.length ? ordem : null;   // null: há ciclo
}`,

  // ── Capítulo 7 ─────────────────────────────────────────────────────────────

  dijkstra: `function dijkstra(grafo, inicio, fim) {
  const custos = {};
  const pais = {};
  for (const no in grafo) {
    custos[no] = Infinity;
    pais[no] = null;
  }
  custos[inicio] = 0;
  const processados = new Set();

  while (true) {
    // acha o nó mais barato ainda não processado
    let atual = null;
    for (const no in custos) {
      if (processados.has(no) || custos[no] === Infinity) continue;
      if (atual === null || custos[no] < custos[atual]) atual = no;
    }
    if (atual === null) break;

    // atualiza o custo dos vizinhos, se passar por aqui for mais barato
    for (const [vizinho, peso] of Object.entries(grafo[atual])) {
      if (custos[atual] + peso < custos[vizinho]) {
        custos[vizinho] = custos[atual] + peso;
        pais[vizinho] = atual;
      }
    }
    processados.add(atual);
  }

  if (custos[fim] === Infinity) return null;   // sem caminho
  const caminho = [];
  for (let no = fim; no !== null; no = pais[no]) caminho.unshift(no);
  return { custo: custos[fim], caminho };
}`,

  bellmanFord: `function bellmanFord(nos, arestas, inicio) {
  const custos = {};
  for (const no of nos) custos[no] = no === inicio ? 0 : Infinity;

  // relaxa todas as arestas V - 1 vezes
  for (let rodada = 1; rodada < nos.length; rodada++) {
    for (const { de, para, peso } of arestas) {
      if (custos[de] + peso < custos[para]) {
        custos[para] = custos[de] + peso;
      }
    }
  }

  // uma rodada extra: se ainda melhora, existe um ciclo negativo
  const cicloNegativo = arestas.some(
    ({ de, para, peso }) => custos[de] + peso < custos[para],
  );

  return { custos, cicloNegativo };
}`,

  // ── Capítulo 8 ─────────────────────────────────────────────────────────────

  calendario: `function calendarioGuloso(aulas) {
  // a aula que termina primeiro vem antes
  const ordenadas = [...aulas].sort((a, b) => a.fim - b.fim);
  const escolhidas = [];
  let ultimoFim = -Infinity;

  for (const aula of ordenadas) {
    if (aula.inicio >= ultimoFim) {   // não conflita com a última escolhida
      escolhidas.push(aula.nome);
      ultimoFim = aula.fim;
    }
  }

  return escolhidas;
}`,

  coberturaGulosa: `function coberturaGulosa(universo, conjuntos) {
  const faltam = new Set(universo);
  const escolhidos = [];

  while (faltam.size > 0) {
    // o conjunto que cobre mais itens ainda não cobertos
    let melhor = null;
    let melhorQtd = 0;
    for (const [nome, itens] of Object.entries(conjuntos)) {
      const novos = itens.filter((i) => faltam.has(i)).length;
      if (novos > melhorQtd) {
        melhor = nome;
        melhorQtd = novos;
      }
    }

    if (melhor === null) break;   // sobrou algo que nenhum conjunto cobre
    escolhidos.push(melhor);
    conjuntos[melhor].forEach((i) => faltam.delete(i));
  }

  return escolhidos;
}`,

  caixeiro: `const distancia = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function comprimento(cidades, rota) {
  let total = 0;
  for (let i = 0; i < rota.length; i++) {
    total += distancia(cidades[rota[i]], cidades[rota[(i + 1) % rota.length]]);   // volta ao início
  }
  return total;
}

// Aproximação gulosa: sempre vai para a cidade não visitada mais próxima
function vizinhoMaisProximo(cidades) {
  const rota = [0];
  while (rota.length < cidades.length) {
    const atual = cidades[rota[rota.length - 1]];
    let proxima = -1;
    for (let i = 0; i < cidades.length; i++) {
      if (rota.includes(i)) continue;
      if (proxima === -1 || distancia(atual, cidades[i]) < distancia(atual, cidades[proxima])) {
        proxima = i;
      }
    }
    rota.push(proxima);
  }
  return rota;
}

// Força bruta: testa todas as (n - 1)! ordens possíveis
function forcaBruta(cidades) {
  let melhor = null;
  let menor = Infinity;

  function permutar(rota, restantes) {
    if (restantes.length === 0) {
      const c = comprimento(cidades, rota);
      if (c < menor) {
        menor = c;
        melhor = rota;
      }
      return;
    }
    for (let i = 0; i < restantes.length; i++) {
      permutar([...rota, restantes[i]], restantes.filter((_, j) => j !== i));
    }
  }

  permutar([0], cidades.map((_, i) => i).slice(1));
  return melhor;
}`,

  // ── Capítulo 9 ─────────────────────────────────────────────────────────────

  mochila: `function mochila(itens, capacidade) {
  // tabela[i][c - 1]: melhor valor usando os itens 0..i com capacidade c
  const tabela = itens.map(() => Array(capacidade).fill(0));

  for (let i = 0; i < itens.length; i++) {
    const { peso, valor } = itens[i];

    for (let c = 1; c <= capacidade; c++) {
      const sem = i > 0 ? tabela[i - 1][c - 1] : 0;   // linha de cima: sem o item
      const sobra = c - peso;
      let com = 0;                                     // com o item (se couber)
      if (sobra >= 0) {
        com = valor + (i > 0 && sobra > 0 ? tabela[i - 1][sobra - 1] : 0);
      }
      tabela[i][c - 1] = Math.max(sem, com);
    }
  }

  return tabela[itens.length - 1][capacidade - 1];
}`,

  subcadeia: `// consecutiva = true: subcadeia (sem buracos); false: subsequência
function subcadeiaComum(a, b, consecutiva) {
  const t = Array.from({ length: a.length }, () => Array(b.length).fill(0));
  const celula = (i, j) => (i < 0 || j < 0 ? 0 : t[i][j]);
  let maior = 0;

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (a[i] === b[j]) {
        t[i][j] = celula(i - 1, j - 1) + 1;   // letras iguais: diagonal + 1
      } else {
        t[i][j] = consecutiva
          ? 0                                                   // quebrou a sequência
          : Math.max(celula(i - 1, j), celula(i, j - 1));      // herda o melhor vizinho
      }
      maior = Math.max(maior, t[i][j]);
    }
  }

  return consecutiva ? maior : celula(a.length - 1, b.length - 1);   // tamanho da resposta
}`,

  // ── Capítulo 10 ────────────────────────────────────────────────────────────

  knn: `function knn(pontos, novo, k) {
  const vizinhos = pontos
    .map((p) => ({ ...p, distancia: Math.hypot(p.x - novo.x, p.y - novo.y) }))
    .sort((a, b) => a.distancia - b.distancia)   // mais próximos primeiro
    .slice(0, k);

  const votos = {};
  for (const v of vizinhos) votos[v.classe] = (votos[v.classe] ?? 0) + 1;

  // a classe mais votada (em empate, a do vizinho mais próximo)
  return Object.entries(votos).sort((a, b) => b[1] - a[1])[0][0];
}`,

  regressaoKnn: `function regressaoKnn(pontos, novo, k) {
  const vizinhos = pontos
    .map((p) => ({ ...p, distancia: Math.hypot(p.x - novo.x, p.y - novo.y) }))
    .sort((a, b) => a.distancia - b.distancia)
    .slice(0, k);

  // em vez de votar, tira a média dos valores dos vizinhos
  return vizinhos.reduce((soma, v) => soma + v.valor, 0) / vizinhos.length;
}`,

  recomendacao: `function distancia(a, b) {
  return Math.sqrt(a.reduce((s, x, i) => s + (x - b[i]) ** 2, 0));
}

// desconta o jeito de cada pessoa dar nota (mais alto ou mais baixo)
function normalizar(notas) {
  const media = notas.reduce((s, n) => s + n, 0) / notas.length;
  return notas.map((n) => n - media);
}

// compara a direção das notas, não o tamanho: de -1 a 1
function cosseno(a, b) {
  const produto = a.reduce((s, x, i) => s + x * b[i], 0);
  const norma = (v) => Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  return produto / (norma(a) * norma(b));
}

// distância normalizada = distância entre as notas já normalizadas
const distanciaNormalizada = (a, b) => distancia(normalizar(a), normalizar(b));`,

  ocr: `// cada imagem é uma lista de pixels (0 ou 1); a distância é quantos pixels diferem
function reconhecerDigito(pixels, treino, k) {
  const vizinhos = treino
    .map((ex) => ({
      digito: ex.digito,
      distancia: ex.pixels.reduce((s, p, i) => s + (p !== pixels[i] ? 1 : 0), 0),
    }))
    .sort((a, b) => a.distancia - b.distancia)
    .slice(0, k);

  const votos = {};
  for (const v of vizinhos) votos[v.digito] = (votos[v.digito] ?? 0) + 1;

  // dígito mais votado (em empate, o do vizinho mais próximo)
  const maisVotos = Math.max(...Object.values(votos));
  return vizinhos.find((v) => votos[v.digito] === maisVotos).digito;
}`,

  naiveBayes: `const tokenizar = (texto) =>
  texto.toLowerCase().split(/[^\\p{L}]+/u).filter((p) => p.length >= 2);

function treinar(mensagens) {
  const m = { spam: {}, normal: {}, totalSpam: 0, totalNormal: 0, nSpam: 0, nNormal: 0, vocabulario: new Set() };

  for (const { texto, spam } of mensagens) {
    const contagem = spam ? m.spam : m.normal;
    spam ? m.nSpam++ : m.nNormal++;
    for (const p of tokenizar(texto)) {
      contagem[p] = (contagem[p] ?? 0) + 1;
      spam ? m.totalSpam++ : m.totalNormal++;
      m.vocabulario.add(p);
    }
  }
  return m;
}

function chanceDeSpam(m, mensagem) {
  const palavras = tokenizar(mensagem).filter((p) => m.vocabulario.has(p));
  const v = m.vocabulario.size;
  let logSpam = Math.log(m.nSpam / (m.nSpam + m.nNormal));     // ponto de partida
  let logNormal = Math.log(m.nNormal / (m.nSpam + m.nNormal));

  for (const p of palavras) {
    // suavização de Laplace: soma 1 para nenhuma palavra zerar a conta
    logSpam += Math.log(((m.spam[p] ?? 0) + 1) / (m.totalSpam + v));
    logNormal += Math.log(((m.normal[p] ?? 0) + 1) / (m.totalNormal + v));
  }

  return 1 / (1 + Math.exp(logNormal - logSpam));   // logaritmos → probabilidade
}`,
} as const;
