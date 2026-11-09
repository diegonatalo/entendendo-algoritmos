/** URL pública do site. Para outro domínio, defina NEXT_PUBLIC_SITE_URL no build. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://entendendo-algoritmos.vercel.app"
).replace(/\/+$/, "");

export const SITE_NAME = "Entendendo Algoritmos";
export const SITE_DESCRIPTION =
  "Visualizações interativas, passo a passo, para entender como cada algoritmo toma suas decisões.";
