// leitura e geração de listas de números digitadas nos formulários

// "3, 5; 8 2" vira [3, 5, 8, 2]; texto que não é número vira NaN para a página validar
export function lerNumeros(texto: string): number[] {
  return texto.split(/[\s,;]+/).filter(Boolean).map(Number);
}

export function numerosAleatorios(quantidade: number): string {
  return Array.from({ length: quantidade }, () =>
    Math.floor(Math.random() * 99 + 1),
  ).join(", ");
}
