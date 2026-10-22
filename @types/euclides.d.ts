export type QuadradoTerreno = {
  x: number;
  y: number;
  lado: number;
  passo: number;
};

export type PassoEuclides = {
  largura: number;
  altura: number;
  lado: number;
  quantidade: number;
  descricao: string;
};

export type ResultadoEuclides = {
  passos: PassoEuclides[];
  quadrados: QuadradoTerreno[];
  mdc: number;
};

export type ChamadaSoma = {
  profundidade: number;
  lista: number[];
  resultado: number;
};
