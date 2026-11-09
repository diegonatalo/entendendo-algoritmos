import {
  Message,
  BayesModel,
  AnalyzedWord,
  BayesResult,
} from "@/types/naive-bayes";

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}]+/u)
    .filter((p) => p.length >= 2);
}

export function train(messages: Message[]): BayesModel {
  const model: BayesModel = {
    count: { spam: {}, normal: {} },
    wordsByCategory: { spam: 0, normal: 0 },
    messagesByCategory: { spam: 0, normal: 0 },
    vocabulary: new Set(),
  };

  for (const { text, spam } of messages) {
    const category = spam ? "spam" : "normal";
    model.messagesByCategory[category]++;
    for (const word of tokenize(text)) {
      model.count[category][word] = (model.count[category][word] ?? 0) + 1;
      model.wordsByCategory[category]++;
      model.vocabulary.add(word);
    }
  }

  return model;
}

// Naive Bayes: "ingênuo" porque trata cada palavra como independente das outras.
// P(spam | palavras) ∝ P(spam) × Π P(palavra | spam), com suavização de Laplace
// (soma 1 a cada contagem) para que uma palavra nunca vista em uma classe não zere tudo.
export function classify(model: BayesModel, text: string): BayesResult {
  const vocabularySize = model.vocabulary.size;
  const totalMessages =
    model.messagesByCategory.spam + model.messagesByCategory.normal;
  const priorSpam = model.messagesByCategory.spam / totalMessages;
  const priorNormal = 1 - priorSpam;

  const probability = (word: string, category: "spam" | "normal") =>
    ((model.count[category][word] ?? 0) + 1) /
    (model.wordsByCategory[category] + vocabularySize);

  const words: AnalyzedWord[] = tokenize(text).map((word) => ({
    word,
    known: model.vocabulary.has(word),
    pSpam: probability(word, "spam"),
    pNormal: probability(word, "normal"),
  }));

  // trabalha com logaritmos para não perder precisão multiplicando muitos números pequenos
  let spamLog = Math.log(priorSpam);
  let normalLog = Math.log(priorNormal);
  for (const p of words) {
    if (!p.known) continue;
    spamLog += Math.log(p.pSpam);
    normalLog += Math.log(p.pNormal);
  }

  const largest = Math.max(spamLog, normalLog);
  const spamFlag = Math.exp(spamLog - largest);
  const isNormal = Math.exp(normalLog - largest);

  return { words, spamProbability: spamFlag / (spamFlag + isNormal), priorSpam };
}
