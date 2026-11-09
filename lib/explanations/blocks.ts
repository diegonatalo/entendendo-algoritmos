// Blocos de texto das explicações: "simples" (analogia e intuição) e "técnica"
// (como funciona, por que está correto, custo e limites).

export type Block =
  | { type: "p"; text: string }
  | { type: "title"; text: string }
  | { type: "list"; items: string[] }
  | { type: "highlight"; text: string };

export type Explanation = { simple: Block[]; technique: Block[] };

export const p = (text: string): Block => ({ type: "p", text });
export const title = (text: string): Block => ({ type: "title", text });
export const list = (...items: string[]): Block => ({ type: "list", items });
export const highlight = (text: string): Block => ({ type: "highlight", text });
