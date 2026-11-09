// tempo = constante × número de passos. O Big O ignora a constante, mas ela decide
// quem vence quando n é pequeno.
export const tempoLinear = (n: number, constanteMs: number) => n * constanteMs;
export const tempoLogaritmico = (n: number, constanteMs: number) =>
  Math.log2(n) * constanteMs;

// menor n (aproximado) a partir do qual o algoritmo O(log n) passa a ser mais rápido
// que o O(n), dadas as constantes de cada um
export function pontoDeCruzamento(linearMs: number, logMs: number): number | null {
  const linearPerde = (n: number) => tempoLinear(n, linearMs) > tempoLogaritmico(n, logMs);

  let n = 2;
  while (n < 1e15) {
    if (linearPerde(n)) {
      // a busca em passos de 2% só delimita o cruzamento; refina entre o último tamanho
      // em que o linear ainda ganhava e este, para achar o menor n exato
      let baixo = Math.max(2, Math.floor(n / 1.02));
      let alto = Math.ceil(n);
      while (baixo < alto) {
        const meio = Math.floor((baixo + alto) / 2);
        if (linearPerde(meio)) alto = meio;
        else baixo = meio + 1;
      }
      return alto;
    }
    n *= 1.02;
  }
  return null;
}

export function formatarDuracao(ms: number): string {
  if (ms < 1000) return `${ms < 10 ? ms.toFixed(1).replace(".", ",") : Math.round(ms)} ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1).replace(".", ",")} s`;
  const min = s / 60;
  if (min < 60) return `${min.toFixed(1).replace(".", ",")} min`;
  const h = min / 60;
  if (h < 24) return `${h.toFixed(1).replace(".", ",")} h`;
  const dias = h / 24;
  if (dias < 365) return `${dias.toFixed(1).replace(".", ",")} dias`;
  const anos = dias / 365;
  return anos < 1e6
    ? `${Math.round(anos).toLocaleString("pt-BR")} anos`
    : "mais de 1 milhão de anos";
}
