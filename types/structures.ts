export type Operation = "read" | "insert" | "remove";

export type StructureCost = {
  steps: number;
  description: string;
  // posições percorridas ou deslocadas
  touched: number[];
  // posição que sofre a alteração principal
  target: number;
};

export type OperationResult = {
  array: StructureCost;
  list: StructureCost;
};
