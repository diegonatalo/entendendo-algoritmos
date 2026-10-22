import {
  Mensagem,
  ModeloBayes,
  PalavraAnalisada,
  ResultadoBayes,
} from "@/@types/naiveBayes";

export function tokenizar(texto: string): string[] {
  return texto
    .toLowerCase()
    .split(/[^\p{L}]+/u)
    .filter((p) => p.length >= 2);
}

export function treinar(mensagens: Mensagem[]): ModeloBayes {
  const modelo: ModeloBayes = {
    contagem: { spam: {}, normal: {} },
    palavrasPorClasse: { spam: 0, normal: 0 },
    mensagensPorClasse: { spam: 0, normal: 0 },
    vocabulario: new Set(),
  };

  for (const { texto, spam } of mensagens) {
    const classe = spam ? "spam" : "normal";
    modelo.mensagensPorClasse[classe]++;
    for (const palavra of tokenizar(texto)) {
      modelo.contagem[classe][palavra] = (modelo.contagem[classe][palavra] ?? 0) + 1;
      modelo.palavrasPorClasse[classe]++;
      modelo.vocabulario.add(palavra);
    }
  }

  return modelo;
}

// Naive Bayes: "ingênuo" porque trata cada palavra como independente das outras.
// P(spam | palavras) ∝ P(spam) × Π P(palavra | spam), com suavização de Laplace
// (soma 1 a cada contagem) para que uma palavra nunca vista em uma classe não zere tudo.
export function classificar(modelo: ModeloBayes, texto: string): ResultadoBayes {
  const tamanhoVocabulario = modelo.vocabulario.size;
  const totalMensagens =
    modelo.mensagensPorClasse.spam + modelo.mensagensPorClasse.normal;
  const priorSpam = modelo.mensagensPorClasse.spam / totalMensagens;
  const priorNormal = 1 - priorSpam;

  const probabilidade = (palavra: string, classe: "spam" | "normal") =>
    ((modelo.contagem[classe][palavra] ?? 0) + 1) /
    (modelo.palavrasPorClasse[classe] + tamanhoVocabulario);

  const palavras: PalavraAnalisada[] = tokenizar(texto).map((palavra) => ({
    palavra,
    conhecida: modelo.vocabulario.has(palavra),
    pSpam: probabilidade(palavra, "spam"),
    pNormal: probabilidade(palavra, "normal"),
  }));

  // trabalha com logaritmos para não perder precisão multiplicando muitos números pequenos
  let logSpam = Math.log(priorSpam);
  let logNormal = Math.log(priorNormal);
  for (const p of palavras) {
    if (!p.conhecida) continue;
    logSpam += Math.log(p.pSpam);
    logNormal += Math.log(p.pNormal);
  }

  const maior = Math.max(logSpam, logNormal);
  const eSpam = Math.exp(logSpam - maior);
  const eNormal = Math.exp(logNormal - maior);

  return { palavras, probSpam: eSpam / (eSpam + eNormal), priorSpam };
}
