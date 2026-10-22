import {
  ItemMochila,
  PassoMochila,
  ResultadoGulosoMochila,
  ResultadoMochila,
} from "@/@types/mochila";

const dinheiro = (n: number) => n.toLocaleString("pt-BR");

// programação dinâmica: tabela[i][c-1] = melhor valor usando os itens 0..i
// em uma mochila de capacidade c
export function mochila(
  itens: ItemMochila[],
  capacidade: number,
  unidade = "kg",
): ResultadoMochila {
  const tabela: number[][] = itens.map(() => Array(capacidade).fill(0));
  const passos: PassoMochila[] = [];

  for (let i = 0; i < itens.length; i++) {
    const { nome, peso, valor } = itens[i];

    for (let c = 1; c <= capacidade; c++) {
      const acima = i > 0 ? tabela[i - 1][c - 1] : 0;
      const sobra = c - peso;

      let comItem: number | null = null;
      let descricao: string;

      if (sobra >= 0) {
        const restante = sobra === 0 || i === 0 ? 0 : tabela[i - 1][sobra - 1];
        comItem = valor + restante;
        descricao = `${nome} em ${c} ${unidade}: máx(${dinheiro(acima)} sem o item, ${dinheiro(valor)} + ${dinheiro(restante)} com a sobra de ${sobra} ${unidade}) = ${dinheiro(Math.max(acima, comItem))}`;
      } else {
        descricao = `${nome} (${peso} ${unidade}) não cabe em ${c} ${unidade}: mantém ${dinheiro(acima)}`;
      }

      const melhor = comItem !== null ? Math.max(acima, comItem) : acima;
      tabela[i][c - 1] = melhor;
      passos.push({
        linha: i,
        coluna: c - 1,
        valor: melhor,
        acima,
        comItem,
        usouItem: comItem !== null && comItem > acima,
        descricao,
      });
    }
  }

  // caminho de volta: onde o valor mudou em relação à linha de cima, o item entrou
  const escolhidos: string[] = [];
  const celulasEscolhidas: [number, number][] = [];
  let c = capacidade;
  for (let i = itens.length - 1; i >= 0 && c > 0; i--) {
    const acima = i > 0 ? tabela[i - 1][c - 1] : 0;
    if (tabela[i][c - 1] !== acima) {
      escolhidos.unshift(itens[i].nome);
      celulasEscolhidas.push([i, c - 1]);
      c -= itens[i].peso;
    }
  }

  return {
    tabela,
    passos,
    escolhidos,
    celulasEscolhidas,
    valorTotal: itens.length > 0 ? tabela[itens.length - 1][capacidade - 1] : 0,
  };
}

// guloso: pega sempre o item mais valioso que ainda cabe
export function mochilaGulosa(
  itens: ItemMochila[],
  capacidade: number,
): ResultadoGulosoMochila {
  const escolhidos: string[] = [];
  let sobra = capacidade;
  let valorTotal = 0;

  for (const item of [...itens].sort((a, b) => b.valor - a.valor)) {
    if (item.peso <= sobra) {
      escolhidos.push(item.nome);
      sobra -= item.peso;
      valorTotal += item.valor;
    }
  }

  return { escolhidos, valorTotal };
}
