import { Caixa, PassoCaixa, ResultadoCaixas } from "@/@types/caixas";

export const ALVO = "chave";

// nomes das caixas onde dá para esconder a chave
export const LOCAIS_DA_CHAVE: { id: string; rotulo: string }[] = [
  { id: "azul1", rotulo: "Caixa azul 1" },
  { id: "azul2p", rotulo: "Caixa pequena (dentro da azul 2)" },
  { id: "vermelha1", rotulo: "Caixa vermelha 1" },
];

// monta o conjunto de caixas; a chave fica na caixa indicada (ou em nenhuma)
export function criarCaixas(localDaChave: string | null): Caixa {
  const com = (id: string, itens: string[]) =>
    id === localDaChave ? [...itens, ALVO] : itens;

  return {
    id: "grande",
    nome: "Caixa grande",
    itens: ["meias"],
    caixas: [
      {
        id: "azul",
        nome: "Caixa azul",
        itens: ["livro"],
        caixas: [
          { id: "azul1", nome: "Caixa azul 1", itens: com("azul1", ["cabo"]), caixas: [] },
          {
            id: "azul2",
            nome: "Caixa azul 2",
            itens: ["fotos"],
            caixas: [
              {
                id: "azul2p",
                nome: "Caixa pequena",
                itens: com("azul2p", ["moeda"]),
                caixas: [],
              },
            ],
          },
        ],
      },
      {
        id: "vermelha",
        nome: "Caixa vermelha",
        itens: ["roupas"],
        caixas: [
          {
            id: "vermelha1",
            nome: "Caixa vermelha 1",
            itens: com("vermelha1", ["jogo"]),
            caixas: [],
          },
        ],
      },
      { id: "verde", nome: "Caixa verde", itens: ["velas"], caixas: [] },
    ],
  };
}

// busca recursiva: abre a caixa, procura o alvo nos itens e repete em cada caixa dentro dela
export function buscarChave(raiz: Caixa): ResultadoCaixas {
  const pilha: string[] = [];
  const vasculhadas: string[] = [];
  const passos: PassoCaixa[] = [];
  const nomes = new Map<string, string>();

  function mapear(caixa: Caixa) {
    nomes.set(caixa.id, caixa.nome);
    caixa.caixas.forEach(mapear);
  }
  mapear(raiz);

  function registrar(tipo: PassoCaixa["tipo"], atual: string, descricao: string) {
    passos.push({
      tipo,
      atual,
      pilha: [...pilha],
      vasculhadas: [...vasculhadas],
      descricao,
    });
  }

  function procurar(caixa: Caixa): string | null {
    pilha.push(caixa.id);
    registrar(
      "abre",
      caixa.id,
      caixa.caixas.length > 0
        ? `Abre "${caixa.nome}": ${caixa.caixas.length} ${caixa.caixas.length === 1 ? "caixa" : "caixas"} dentro. Procura a chave nos itens`
        : `Abre "${caixa.nome}": não tem caixas dentro (caso base). Procura a chave nos itens`,
    );

    if (caixa.itens.includes(ALVO)) {
      registrar("achou", caixa.id, `Achou a chave em "${caixa.nome}"!`);
      return caixa.id;
    }

    for (const filha of caixa.caixas) {
      const achada = procurar(filha);
      if (achada !== null) return achada;
    }

    vasculhadas.push(caixa.id);
    pilha.pop();
    const pai = pilha.length > 0 ? nomes.get(pilha[pilha.length - 1]) : null;
    registrar(
      "volta",
      pai ? pilha[pilha.length - 1] : caixa.id,
      pai
        ? `Nada em "${caixa.nome}": fecha e volta para "${pai}"`
        : `Nada em "${caixa.nome}" e não há mais caixas: a chave não está aqui`,
    );
    return null;
  }

  const encontradaEm = procurar(raiz);
  return { passos, encontradaEm };
}
