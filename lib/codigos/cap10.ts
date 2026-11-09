export const CODIGOS_CAP10 = {
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
