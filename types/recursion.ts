export type Frame = {
  n: number;
  returnValue?: number;
};

export type RecursionStep = {
  type: "push" | "base" | "returns";
  description: string;
  stack: Frame[];
};

export type FactorialResult = {
  result: number;
  steps: RecursionStep[];
};
