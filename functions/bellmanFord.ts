import {
  Aresta,
  PassoBellmanFord,
  ResultadoBellmanFord,
  ResultadoDijkstraSimples,
} from "@/@types/bellmanFord";

const fmt = (custo: number) => (custo === Infinity ? "∞" : String(custo));

function montarCaminho(
  pais: Record<string, string | null>,
  fim: string,
  custos: Record<string, number>,
): string[] | null {
  if (custos[fim] === Infinity) return null;
  const caminho: string[] = [];
  for (let no: string | null = fim; no !== null; no = pais[no]) {
    caminho.unshift(no);
  }
  return caminho;
}

function iniciar(nos: string[], inicio: string) {
  const custos: Record<string, number> = {};
  const pais: Record<string, string | null> = {};
  for (const no of nos) {
    custos[no] = no === inicio ? 0 : Infinity;
    pais[no] = null;
  }
  return { custos, pais };
}

// Dijkstra como no capítulo 7: uma vez processado, o custo de um nó é considerado final.
// Com pesos negativos essa suposição falha.
export function dijkstraSimples(
  nos: string[],
  arestas: Aresta[],
  inicio: string,
  fim: string,
): ResultadoDijkstraSimples {
  const { custos, pais } = iniciar(nos, inicio);
  const processados = new Set<string>();

  for (;;) {
    let atual: string | null = null;
    for (const no of nos) {
      if (processados.has(no) || custos[no] === Infinity) continue;
      if (atual === null || custos[no] < custos[atual]) atual = no;
    }
    if (atual === null) break;

    processados.add(atual);
    for (const { de, para, peso } of arestas) {
      if (de === atual && !processados.has(para) && custos[atual] + peso < custos[para]) {
        custos[para] = custos[atual] + peso;
        pais[para] = atual;
      }
    }
  }

  const caminho = montarCaminho(pais, fim, custos);
  return { custos, caminho, custoTotal: caminho ? custos[fim] : null };
}

// Bellman-Ford: relaxa todas as arestas (V - 1) vezes. Aceita pesos negativos e
// detecta ciclos negativos com uma rodada extra.
export function bellmanFord(
  nos: string[],
  arestas: Aresta[],
  inicio: string,
  fim: string,
): ResultadoBellmanFord {
  const { custos, pais } = iniciar(nos, inicio);
  const passos: PassoBellmanFord[] = [];

  function registrar(
    rodada: number,
    aresta: Aresta | null,
    melhorou: boolean,
    descricao: string,
  ) {
    passos.push({
      rodada,
      aresta,
      melhorou,
      custos: { ...custos },
      pais: { ...pais },
      descricao,
    });
  }

  registrar(0, null, false, `Custo de ${inicio} = 0; os demais começam em ∞`);

  for (let rodada = 1; rodada <= nos.length - 1; rodada++) {
    for (const aresta of arestas) {
      const { de, para, peso } = aresta;
      const novo = custos[de] === Infinity ? Infinity : custos[de] + peso;
      if (novo < custos[para]) {
        const antes = custos[para];
        custos[para] = novo;
        pais[para] = de;
        registrar(
          rodada,
          aresta,
          true,
          `Rodada ${rodada}: ${de} → ${para} (${peso}) melhora ${para}: ${fmt(antes)} → ${novo}`,
        );
      } else {
        registrar(
          rodada,
          aresta,
          false,
          `Rodada ${rodada}: ${de} → ${para} (${peso}) não melhora ${para} (${fmt(custos[para])})`,
        );
      }
    }
  }

  // uma rodada extra: se algo ainda melhora, existe um ciclo de peso negativo
  const cicloNegativo = arestas.some(
    ({ de, para, peso }) => custos[de] !== Infinity && custos[de] + peso < custos[para],
  );

  registrar(
    nos.length,
    null,
    false,
    cicloNegativo
      ? "Rodada extra: ainda dá para melhorar custos, então há um ciclo negativo e não existe menor caminho"
      : "Rodada extra: nada melhora, os custos são finais",
  );

  return {
    passos,
    custos: { ...custos },
    caminho: cicloNegativo ? null : montarCaminho(pais, fim, custos),
    cicloNegativo,
  };
}
