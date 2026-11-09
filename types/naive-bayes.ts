export type Message = {
  text: string;
  spam: boolean;
};

export type BayesModel = {
  count: { spam: Record<string, number>; normal: Record<string, number> };
  wordsByCategory: { spam: number; normal: number };
  messagesByCategory: { spam: number; normal: number };
  vocabulary: Set<string>;
};

export type AnalyzedWord = {
  word: string;
  known: boolean;
  pSpam: number;
  pNormal: number;
};

export type BayesResult = {
  words: AnalyzedWord[];
  spamProbability: number;
  priorSpam: number;
};
