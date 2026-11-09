export type DigitExample = {
  digit: number;
  pixels: number[];
};

export type DigitNeighbor = {
  example: DigitExample;
  distance: number;
};

export type OcrResult = {
  neighbors: DigitNeighbor[];
  votes: number[];
  digit: number;
};
