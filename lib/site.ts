/** URL pública do site. Para outro domínio, defina NEXT_PUBLIC_SITE_URL no build. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://entendendo-algoritmos.vercel.app"
).replace(/\/+$/, "");

/** Repositório público, no rodapé. */
export const SOURCE_URL = "https://github.com/diegonatalo/entendendo-algoritmos";

export const SITE_NAME = "Entendendo Algoritmos";
export const SITE_DESCRIPTION =
  "Visualizações interativas, passo a passo, para entender como cada algoritmo toma suas decisões.";
