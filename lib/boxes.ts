import { Box, BoxStep, BoxesResult } from "@/types/boxes";

export const TARGET = "chave";

// nomes das caixas onde dá para esconder a chave
export const KEY_LOCATIONS: { id: string; label: string }[] = [
  { id: "azul1", label: "Caixa azul 1" },
  { id: "azul2p", label: "Caixa pequena (dentro da azul 2)" },
  { id: "vermelha1", label: "Caixa vermelha 1" },
];

// monta o conjunto de caixas; a chave fica na caixa indicada (ou em nenhuma)
export function createBoxes(keyLocation: string | null): Box {
  const com = (id: string, items: string[]) =>
    id === keyLocation ? [...items, TARGET] : items;

  return {
    id: "grande",
    name: "Caixa grande",
    items: ["meias"],
    boxes: [
      {
        id: "azul",
        name: "Caixa azul",
        items: ["livro"],
        boxes: [
          { id: "azul1", name: "Caixa azul 1", items: com("azul1", ["cabo"]), boxes: [] },
          {
            id: "azul2",
            name: "Caixa azul 2",
            items: ["fotos"],
            boxes: [
              {
                id: "azul2p",
                name: "Caixa pequena",
                items: com("azul2p", ["moeda"]),
                boxes: [],
              },
            ],
          },
        ],
      },
      {
        id: "vermelha",
        name: "Caixa vermelha",
        items: ["roupas"],
        boxes: [
          {
            id: "vermelha1",
            name: "Caixa vermelha 1",
            items: com("vermelha1", ["jogo"]),
            boxes: [],
          },
        ],
      },
      { id: "verde", name: "Caixa verde", items: ["velas"], boxes: [] },
    ],
  };
}

// busca recursiva: abre a caixa, procura o alvo nos itens e repete em cada caixa dentro dela
export function searchKey(root: Box): BoxesResult {
  const stack: string[] = [];
  const scannedItems: string[] = [];
  const steps: BoxStep[] = [];
  const names = new Map<string, string>();

  function mapValues(box: Box) {
    names.set(box.id, box.name);
    box.boxes.forEach(mapValues);
  }
  mapValues(root);

  function register(type: BoxStep["type"], current: string, description: string) {
    steps.push({
      type,
      current,
      stack: [...stack],
      scannedItems: [...scannedItems],
      description,
    });
  }

  function lookup(box: Box): string | null {
    stack.push(box.id);
    register(
      "abre",
      box.id,
      box.boxes.length > 0
        ? `Abre "${box.name}": ${box.boxes.length} ${box.boxes.length === 1 ? "caixa" : "caixas"} dentro. Procura a chave nos itens`
        : `Abre "${box.name}": não tem caixas dentro (caso base). Procura a chave nos itens`,
    );

    if (box.items.includes(TARGET)) {
      register("didFind", box.id, `Achou a chave em "${box.name}"!`);
      return box.id;
    }

    for (const child of box.boxes) {
      const foundItem = lookup(child);
      if (foundItem !== null) return foundItem;
    }

    scannedItems.push(box.id);
    stack.pop();
    const parent = stack.length > 0 ? names.get(stack[stack.length - 1]) : null;
    register(
      "volta",
      parent ? stack[stack.length - 1] : box.id,
      parent
        ? `Nada em "${box.name}": fecha e volta para "${parent}"`
        : `Nada em "${box.name}" e não há mais caixas: a chave não está aqui`,
    );
    return null;
  }

  const foundAt = lookup(root);
  return { steps, foundAt };
}
