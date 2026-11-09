export type Step = {
  attempt: number;
  currentArray: number[];
  middle: number;
  middleValue: number;
};

export type SearchResult = {
  index: number;
  attempts: number;
  maxAttempts: number;
  steps: Step[];
};
