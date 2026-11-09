export type Box = {
  id: string;
  name: string;
  items: string[];
  boxes: Box[];
};

export type BoxStep = {
  type: "abre" | "didFind" | "volta";
  current: string;
  stack: string[];
  scannedItems: string[];
  description: string;
};

export type BoxesResult = {
  steps: BoxStep[];
  foundAt: string | null;
};
