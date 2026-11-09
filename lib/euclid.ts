import {
  SumCall,
  EuclidStep,
  TerrainSquare,
  EuclidResult,
} from "@/types/euclid";

// divide o terreno em quadrados: o maior quadrado que cabe, e repete no que sobra.
// O lado do último quadrado é o maior divisor comum (MDC) das duas medidas.
export function euclid(initialWidth: number, initialHeight: number): EuclidResult {
  let width = initialWidth;
  let height = initialHeight;
  let x = 0;
  let y = 0;
  const steps: EuclidStep[] = [];
  const squares: TerrainSquare[] = [];

  while (width > 0 && height > 0) {
    const step = steps.length;
    const horizontal = width >= height;
    const side = horizontal ? height : width;
    const quantity = horizontal
      ? Math.floor(width / height)
      : Math.floor(height / width);

    for (let k = 0; k < quantity; k++) {
      squares.push({
        x: horizontal ? x + k * side : x,
        y: horizontal ? y : y + k * side,
        side,
        step,
      });
    }

    const previousWidth = width;
    const previousHeight = height;
    if (horizontal) {
      x += quantity * side;
      width -= quantity * side;
    } else {
      y += quantity * side;
      height -= quantity * side;
    }

    const leftover = width > 0 && height > 0;
    steps.push({
      width: previousWidth,
      height: previousHeight,
      side,
      quantity,
      description: leftover
        ? `Terreno ${previousWidth}×${previousHeight}: cabem ${quantity} ${quantity === 1 ? "quadrado" : "quadrados"} de ${side}×${side}. Sobra ${width}×${height}`
        : `Terreno ${previousWidth}×${previousHeight}: cabem ${quantity} ${quantity === 1 ? "quadrado" : "quadrados"} de ${side}×${side} e não sobra nada. O MDC é ${side}`,
    });
  }

  return {
    steps,
    squares,
    gcd: steps[steps.length - 1].side,
  };
}

// soma recursiva: soma(lista) = primeiro + soma(resto); caso base: lista vazia = 0
export function recursiveSum(list: number[]): SumCall[] {
  return Array.from({ length: list.length + 1 }, (_, i) => {
    const remaining = list.slice(i);
    return {
      depth: i,
      list: remaining,
      result: remaining.reduce((sum, n) => sum + n, 0),
    };
  });
}
