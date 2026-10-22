import {
  ChamadaSoma,
  PassoEuclides,
  QuadradoTerreno,
  ResultadoEuclides,
} from "@/@types/euclides";

// divide o terreno em quadrados: o maior quadrado que cabe, e repete no que sobra.
// O lado do último quadrado é o maior divisor comum (MDC) das duas medidas.
export function euclides(larguraInicial: number, alturaInicial: number): ResultadoEuclides {
  let largura = larguraInicial;
  let altura = alturaInicial;
  let x = 0;
  let y = 0;
  const passos: PassoEuclides[] = [];
  const quadrados: QuadradoTerreno[] = [];

  while (largura > 0 && altura > 0) {
    const passo = passos.length;
    const horizontal = largura >= altura;
    const lado = horizontal ? altura : largura;
    const quantidade = horizontal
      ? Math.floor(largura / altura)
      : Math.floor(altura / largura);

    for (let k = 0; k < quantidade; k++) {
      quadrados.push({
        x: horizontal ? x + k * lado : x,
        y: horizontal ? y : y + k * lado,
        lado,
        passo,
      });
    }

    const larguraAntes = largura;
    const alturaAntes = altura;
    if (horizontal) {
      x += quantidade * lado;
      largura -= quantidade * lado;
    } else {
      y += quantidade * lado;
      altura -= quantidade * lado;
    }

    const sobra = largura > 0 && altura > 0;
    passos.push({
      largura: larguraAntes,
      altura: alturaAntes,
      lado,
      quantidade,
      descricao: sobra
        ? `Terreno ${larguraAntes}×${alturaAntes}: cabem ${quantidade} ${quantidade === 1 ? "quadrado" : "quadrados"} de ${lado}×${lado}. Sobra ${largura}×${altura}`
        : `Terreno ${larguraAntes}×${alturaAntes}: cabem ${quantidade} ${quantidade === 1 ? "quadrado" : "quadrados"} de ${lado}×${lado} e não sobra nada. O MDC é ${lado}`,
    });
  }

  return {
    passos,
    quadrados,
    mdc: passos[passos.length - 1].lado,
  };
}

// soma recursiva: soma(lista) = primeiro + soma(resto); caso base: lista vazia = 0
export function somaRecursiva(lista: number[]): ChamadaSoma[] {
  return Array.from({ length: lista.length + 1 }, (_, i) => {
    const restante = lista.slice(i);
    return {
      profundidade: i,
      lista: restante,
      resultado: restante.reduce((soma, n) => soma + n, 0),
    };
  });
}
