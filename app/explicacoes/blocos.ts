// Blocos de texto das explicações: "simples" (analogia e intuição) e "técnica"
// (como funciona, por que está correto, custo e limites).

export type Bloco =
  | { tipo: "p"; texto: string }
  | { tipo: "titulo"; texto: string }
  | { tipo: "lista"; itens: string[] }
  | { tipo: "destaque"; texto: string };

export type Explicacao = { simples: Bloco[]; tecnica: Bloco[] };

export const p = (texto: string): Bloco => ({ tipo: "p", texto });
export const titulo = (texto: string): Bloco => ({ tipo: "titulo", texto });
export const lista = (...itens: string[]): Bloco => ({ tipo: "lista", itens });
export const destaque = (texto: string): Bloco => ({ tipo: "destaque", texto });
