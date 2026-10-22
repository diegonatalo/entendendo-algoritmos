export type Aula = {
  nome: string;
  inicio: number;
  fim: number;
};

export type PassoCalendario = {
  aula: Aula;
  aceita: boolean;
  escolhidas: string[];
  descricao: string;
};

export type ResultadoCalendario = {
  ordenadas: Aula[];
  passos: PassoCalendario[];
  escolhidas: string[];
};
