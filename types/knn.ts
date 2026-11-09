export type Classe = "laranja" | "toranja";

export type PontoKnn = {
  x: number;
  y: number;
  classe: Classe;
};

export type Vizinho = {
  ponto: PontoKnn;
  distancia: number;
};

export type PontoRegressao = {
  x: number;
  y: number;
  valor: number;
};

export type VizinhoRegressao = {
  ponto: PontoRegressao;
  distancia: number;
};

export type ResultadoRegressao = {
  vizinhos: VizinhoRegressao[];
  media: number;
};

export type ResultadoKnn = {
  vizinhos: Vizinho[];
  votos: Record<Classe, number>;
  classe: Classe;
};
