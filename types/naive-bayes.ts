export type Mensagem = {
  texto: string;
  spam: boolean;
};

export type ModeloBayes = {
  contagem: { spam: Record<string, number>; normal: Record<string, number> };
  palavrasPorClasse: { spam: number; normal: number };
  mensagensPorClasse: { spam: number; normal: number };
  vocabulario: Set<string>;
};

export type PalavraAnalisada = {
  palavra: string;
  conhecida: boolean;
  pSpam: number;
  pNormal: number;
};

export type ResultadoBayes = {
  palavras: PalavraAnalisada[];
  probSpam: number;
  priorSpam: number;
};
