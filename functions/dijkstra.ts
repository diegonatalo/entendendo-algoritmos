import {
  GrafoPonderado,
  PassoDijkstra,
  ResultadoDijkstra,
} from "@/@types/dijkstra";

const formatar = (custo: number) => (custo === Infinity ? "∞" : String(custo));

export function dijkstra(
  grafo: GrafoPonderado,
  inicio: string,
  fim: string,
): ResultadoDijkstra {
  const nos = Object.keys(grafo);
  const custos: Record<string, number> = {};
  const pais: Record<string, string | null> = {};
  const processados: string[] = [];
  const passos: PassoDijkstra[] = [];

  for (const no of nos) {
    custos[no] = no === inicio ? 0 : Infinity;
    pais[no] = null;
  }

  function registrar(
    tipo: PassoDijkstra["tipo"],
    atual: string | null,
    descricao: string,
  ) {
    passos.push({
      tipo,
      atual,
      custos: { ...custos },
      pais: { ...pais },
      processados: [...processados],
      descricao,
    });
  }

  function maisBarato(): string | null {
    let menor: string | null = null;
    for (const no of nos) {
      if (processados.includes(no) || custos[no] === Infinity) continue;
      if (menor === null || custos[no] < custos[menor]) menor = no;
    }
    return menor;
  }

  registrar("inicio", null, `Custo de ${inicio} = 0; os demais começam em ∞`);

  let atual = maisBarato();
  while (atual !== null) {
    const mudancas: string[] = [];
    for (const [vizinho, peso] of Object.entries(grafo[atual])) {
      const novoCusto = custos[atual] + peso;
      if (novoCusto < custos[vizinho]) {
        mudancas.push(
          `${vizinho}: ${formatar(custos[vizinho])} → ${novoCusto}`,
        );
        custos[vizinho] = novoCusto;
        pais[vizinho] = atual;
      }
    }
    processados.push(atual);

    registrar(
      "processa",
      atual,
      `Nó mais barato: ${atual} (custo ${custos[atual]}). ${
        mudancas.length > 0
          ? `Atualiza ${mudancas.join("; ")}`
          : "Nenhum custo melhorou"
      }`,
    );

    atual = maisBarato();
  }

  if (custos[fim] === Infinity) {
    registrar("fim", null, `Não existe caminho de ${inicio} até ${fim}`);
    return { passos, caminho: null, custoTotal: null };
  }

  const caminho: string[] = [];
  for (let no: string | null = fim; no !== null; no = pais[no]) {
    caminho.unshift(no);
  }
  registrar(
    "fim",
    null,
    `Caminho mais barato: ${caminho.join(" → ")}, custo ${custos[fim]}`,
  );
  return { passos, caminho, custoTotal: custos[fim] };
}
