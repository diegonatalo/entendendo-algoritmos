// tempo = constante × número de passos. O Big O ignora a constante, mas ela decide
// quem vence quando n é pequeno.
export const linearTime = (n: number, constantMs: number) => n * constantMs;
export const logarithmicTime = (n: number, constantMs: number) =>
  Math.log2(n) * constantMs;

// menor n (aproximado) a partir do qual o algoritmo O(log n) passa a ser mais rápido
// que o O(n), dadas as constantes de cada um
export function crossingPoint(linearMs: number, logMs: number): number | null {
  const linearLoses = (n: number) => linearTime(n, linearMs) > logarithmicTime(n, logMs);

  let n = 2;
  while (n < 1e15) {
    if (linearLoses(n)) {
      // a busca em passos de 2% só delimita o cruzamento; refina entre o último tamanho
      // em que o linear ainda ganhava e este, para achar o menor n exato
      let low = Math.max(2, Math.floor(n / 1.02));
      let high = Math.ceil(n);
      while (low < high) {
        const middle = Math.floor((low + high) / 2);
        if (linearLoses(middle)) high = middle;
        else low = middle + 1;
      }
      return high;
    }
    n *= 1.02;
  }
  return null;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms < 10 ? ms.toFixed(1).replace(".", ",") : Math.round(ms)} ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1).replace(".", ",")} s`;
  const min = s / 60;
  if (min < 60) return `${min.toFixed(1).replace(".", ",")} min`;
  const h = min / 60;
  if (h < 24) return `${h.toFixed(1).replace(".", ",")} h`;
  const days = h / 24;
  if (days < 365) return `${days.toFixed(1).replace(".", ",")} dias`;
  const years = days / 365;
  return years < 1e6
    ? `${Math.round(years).toLocaleString("pt-BR")} anos`
    : "mais de 1 milhão de anos";
}
