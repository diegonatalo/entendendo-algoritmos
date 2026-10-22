import { Cidade, ResultadoOtimo, Rota } from "@/@types/caixeiro";

const distancia = (a: Cidade, b: Cidade) => Math.hypot(a.x - b.x, a.y - b.y);

// comprimento do circuito fechado (volta à cidade inicial)
export function comprimentoRota(cidades: Cidade[], ordem: number[]): number {
  let total = 0;
  for (let i = 0; i < ordem.length; i++) {
    total += distancia(cidades[ordem[i]], cidades[ordem[(i + 1) % ordem.length]]);
  }
  return total;
}

// aproximação gulosa: sempre vai para a cidade não visitada mais próxima
export function rotaVizinhoMaisProximo(cidades: Cidade[]): Rota {
  const ordem = [0];
  const visitadas = new Set([0]);

  while (ordem.length < cidades.length) {
    const atual = cidades[ordem[ordem.length - 1]];
    let proxima = -1;
    for (let i = 0; i < cidades.length; i++) {
      if (visitadas.has(i)) continue;
      if (proxima === -1 || distancia(atual, cidades[i]) < distancia(atual, cidades[proxima])) {
        proxima = i;
      }
    }
    ordem.push(proxima);
    visitadas.add(proxima);
  }

  return { ordem, comprimento: comprimentoRota(cidades, ordem) };
}

// força bruta: testa todas as (n-1)! ordens possíveis, fixando a primeira cidade
export function rotaForcaBruta(cidades: Cidade[]): ResultadoOtimo {
  const n = cidades.length;
  let melhor: Rota = { ordem: [], comprimento: Infinity };
  let permutacoes = 0;

  function permutar(ordem: number[], restantes: number[]) {
    if (restantes.length === 0) {
      permutacoes++;
      const comprimento = comprimentoRota(cidades, ordem);
      if (comprimento < melhor.comprimento) {
        melhor = { ordem: [...ordem], comprimento };
      }
      return;
    }
    for (let i = 0; i < restantes.length; i++) {
      permutar(
        [...ordem, restantes[i]],
        [...restantes.slice(0, i), ...restantes.slice(i + 1)],
      );
    }
  }

  permutar([0], Array.from({ length: n - 1 }, (_, i) => i + 1));
  return { ...melhor, permutacoes };
}
