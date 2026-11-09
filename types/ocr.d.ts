export type ExemploDigito = {
  digito: number;
  pixels: number[];
};

export type VizinhoDigito = {
  exemplo: ExemploDigito;
  distancia: number;
};

export type ResultadoOcr = {
  vizinhos: VizinhoDigito[];
  votos: number[];
  digito: number;
};
