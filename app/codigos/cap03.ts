export const CODIGOS_CAP03 = {
  fatorial: `function fatorial(n) {
  if (n <= 1) return 1;        // caso base
  return n * fatorial(n - 1);  // caso recursivo
}`,

  caixas: `function procurar(caixa) {
  if (caixa.itens.includes("chave")) return caixa;   // achou

  for (const filha of caixa.caixas) {
    const achada = procurar(filha);                  // caso recursivo
    if (achada) return achada;
  }

  return null;                                       // caso base: nada aqui
}`,
} as const;
