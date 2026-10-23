// Endereço público do site, usado para montar os links absolutos das tags Open Graph.
// Para publicar em outro domínio, defina NEXT_PUBLIC_SITE_URL no ambiente do build.
export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://entendendo-algoritmos.vercel.app",
);

export const NOME_DO_SITE = "Entendendo Algoritmos";
export const DESCRICAO_DO_SITE =
  "Visualizações interativas, passo a passo, para entender como cada algoritmo toma suas decisões.";
