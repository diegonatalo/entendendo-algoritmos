// Explicações de cada algoritmo, uma por página, separadas por capítulo.
// Para uma página nova, acrescente a chave no arquivo do capítulo (capNN.ts).
import { EXPLICACOES_CAP01 } from "./cap01";
import { EXPLICACOES_CAP02 } from "./cap02";
import { EXPLICACOES_CAP03 } from "./cap03";
import { EXPLICACOES_CAP04 } from "./cap04";
import { EXPLICACOES_CAP05 } from "./cap05";
import { EXPLICACOES_CAP06 } from "./cap06";
import { EXPLICACOES_CAP07 } from "./cap07";
import { EXPLICACOES_CAP08 } from "./cap08";
import { EXPLICACOES_CAP09 } from "./cap09";
import { EXPLICACOES_CAP10 } from "./cap10";
import { EXPLICACOES_CAP11 } from "./cap11";

export type { Bloco, Explicacao } from "./blocos";

export const EXPLICACOES = {
  ...EXPLICACOES_CAP01,
  ...EXPLICACOES_CAP02,
  ...EXPLICACOES_CAP03,
  ...EXPLICACOES_CAP04,
  ...EXPLICACOES_CAP05,
  ...EXPLICACOES_CAP06,
  ...EXPLICACOES_CAP07,
  ...EXPLICACOES_CAP08,
  ...EXPLICACOES_CAP09,
  ...EXPLICACOES_CAP10,
  ...EXPLICACOES_CAP11,
};
