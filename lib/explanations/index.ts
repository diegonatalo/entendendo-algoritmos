// Explicações de cada algoritmo, uma por página, separadas por capítulo.
// Para uma página nova, acrescente a chave no arquivo do capítulo (capNN.ts).
import { EXPLANATIONS_CH01 } from "./ch01";
import { EXPLANATIONS_CH02 } from "./ch02";
import { EXPLANATIONS_CH03 } from "./ch03";
import { EXPLANATIONS_CH04 } from "./ch04";
import { EXPLANATIONS_CH05 } from "./ch05";
import { EXPLANATIONS_CH06 } from "./ch06";
import { EXPLANATIONS_CH07 } from "./ch07";
import { EXPLANATIONS_CH08 } from "./ch08";
import { EXPLANATIONS_CH09 } from "./ch09";
import { EXPLANATIONS_CH10 } from "./ch10";
import { EXPLANATIONS_CH11 } from "./ch11";

export type { Block as Bloco, Explanation as Explicacao } from "./blocks";

export const EXPLANATIONS = {
  ...EXPLANATIONS_CH01,
  ...EXPLANATIONS_CH02,
  ...EXPLANATIONS_CH03,
  ...EXPLANATIONS_CH04,
  ...EXPLANATIONS_CH05,
  ...EXPLANATIONS_CH06,
  ...EXPLANATIONS_CH07,
  ...EXPLANATIONS_CH08,
  ...EXPLANATIONS_CH09,
  ...EXPLANATIONS_CH10,
  ...EXPLANATIONS_CH11,
};
