import { describe, expect, it } from "vitest";
import { HIT_COST_MS, MISS_COST_MS, queryCache, vote } from "@/lib/hash-uses";
import { createTable, hashFunction, insert, loadFactor, resize, search } from "@/lib/hash-table";
import { greedyCoverage, optimalCoverage } from "@/lib/set-coverage";
import { insertCost, readCost, removeCost } from "@/lib/structures";

describe("hashFunction", () => {
  it("soma os códigos dos caracteres e tira o módulo do tamanho", () => {
    expect(hashFunction("ab", 10)).toEqual({ sum: 97 + 98, index: 5 });
  });

  it("é determinística e fica dentro da tabela", () => {
    for (const key of ["maçã", "banana", "", "xyz"]) {
      const { index } = hashFunction(key, 7);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(7);
      expect(hashFunction(key, 7)).toEqual(hashFunction(key, 7));
    }
  });

  it("anagramas colidem, porque a função só soma", () => {
    expect(hashFunction("abc", 11).index).toBe(hashFunction("cba", 11).index);
  });
});

describe("tabela hash", () => {
  it("createTable cria baldes vazios", () => {
    expect(createTable(3)).toEqual([[], [], []]);
  });

  it("insert não altera a tabela original", () => {
    const table = createTable(5);
    insert(table, "a", "1");
    expect(table.flat()).toHaveLength(0);
  });

  it("insert e search guardam e acham o valor", () => {
    let table = createTable(5);
    table = insert(table, "maçã", "R$ 3").table;
    expect(search(table, "maçã").value).toBe("R$ 3");
    expect(search(table, "pera").value).toBeUndefined();
  });

  it("detecta colisão e encadeia no mesmo balde", () => {
    const table = createTable(5);
    const first = insert(table, "abc", "1");
    const second = insert(first.table, "cba", "2");
    expect(first.collision).toBe(false);
    expect(second.collision).toBe(true);
    expect(second.table[second.index]).toHaveLength(2);
    expect(search(second.table, "cba")).toMatchObject({ value: "2", comparisons: 2 });
  });

  it("inserir a mesma chave atualiza o valor sem colisão", () => {
    const first = insert(createTable(5), "a", "1");
    const again = insert(first.table, "a", "2");
    expect(again).toMatchObject({ updated: true, collision: false });
    expect(again.table.flat()).toEqual([{ key: "a", value: "2" }]);
  });

  it("uma busca sem sucesso ainda conta as comparações do balde", () => {
    let table = createTable(1);
    table = insert(table, "a", "1").table;
    table = insert(table, "b", "2").table;
    expect(search(table, "z")).toMatchObject({ comparisons: 2 });
    expect(search(table, "z").value).toBeUndefined();
  });

  it("resize mantém todos os itens num tamanho novo", () => {
    let table = createTable(2);
    for (const key of ["a", "b", "c", "d", "e"]) table = insert(table, key, key.toUpperCase()).table;
    const bigger = resize(table, 11);
    expect(bigger).toHaveLength(11);
    for (const key of ["a", "b", "c", "d", "e"]) expect(search(bigger, key).value).toBe(key.toUpperCase());
  });

  it("loadFactor é itens ÷ baldes", () => {
    let table = createTable(4);
    table = insert(table, "a", "1").table;
    table = insert(table, "b", "2").table;
    expect(loadFactor(table)).toBe(0.5);
  });
});

describe("usos da tabela hash", () => {
  it("vote aceita o primeiro voto e recusa o repetido, ignorando caixa e espaços", () => {
    const first = vote([], "  Ana ");
    expect(first).toMatchObject({ isAccepted: true, voters: ["ana"] });
    const again = vote(first.voters, "ANA");
    expect(again).toMatchObject({ isAccepted: false, voters: ["ana"], listComparisons: 1 });
  });

  it("vote conta as comparações que uma lista faria", () => {
    expect(vote(["a", "b", "c"], "d").listComparisons).toBe(3);
    expect(vote(["a", "b", "c"], "c").listComparisons).toBe(3);
  });

  it("queryCache custa pouco no acerto e muito no erro, e guarda a página", () => {
    const miss = queryCache([], "/home");
    expect(miss).toEqual({ hit: false, cache: ["/home"], costMs: MISS_COST_MS });
    const hit = queryCache(miss.cache, "/home");
    expect(hit).toEqual({ hit: true, cache: ["/home"], costMs: HIT_COST_MS });
    expect(MISS_COST_MS).toBeGreaterThan(HIT_COST_MS);
  });
});

describe("structures: custo de array e lista ligada", () => {
  it("ler no array é sempre 1 passo; na lista cresce com a posição", () => {
    expect(readCost(10, 0).array.steps).toBe(1);
    expect(readCost(10, 9).array.steps).toBe(1);
    expect(readCost(10, 0).list.steps).toBe(1);
    expect(readCost(10, 9).list.steps).toBe(10);
    expect(readCost(10, 4).list.touched).toEqual([0, 1, 2, 3]);
  });

  it("inserir no início é barato na lista e caro no array", () => {
    const cost = insertCost(10, 0);
    expect(cost.list.steps).toBe(1);
    expect(cost.array.steps).toBe(11);
    expect(cost.array.touched).toHaveLength(10);
  });

  it("inserir no fim é barato no array e caro na lista", () => {
    const cost = insertCost(10, 10);
    expect(cost.array.steps).toBe(1);
    expect(cost.array.touched).toEqual([]);
    expect(cost.list.steps).toBe(11);
  });

  it("remover o último é barato no array; o primeiro é barato na lista", () => {
    expect(removeCost(10, 9).array.steps).toBe(1);
    expect(removeCost(10, 0).list.steps).toBe(1);
    expect(removeCost(10, 0).array.steps).toBe(10);
  });

  it("as descrições usam singular e plural", () => {
    expect(readCost(5, 0).list.description).toContain("1 nó ");
    expect(readCost(5, 2).list.description).toContain("3 nós");
    expect(insertCost(5, 4).array.description).toContain("1 item ");
    expect(insertCost(5, 2).array.description).toContain("3 itens");
  });
});

describe("cobertura de conjuntos", () => {
  const universe = ["a", "b", "c", "d", "e", "f"];
  const sets = {
    S1: ["a", "b", "c"],
    S2: ["c", "d"],
    S3: ["d", "e", "f"],
    S4: ["a", "e"],
  };

  it("o guloso cobre tudo escolhendo o conjunto com mais itens novos", () => {
    const result = greedyCoverage(universe, sets);
    expect(result.complete).toBe(true);
    expect(result.solution).toEqual(["S1", "S3"]);
  });

  it("a solução gulosa cobre todo o universo", () => {
    const covered = new Set(greedyCoverage(universe, sets).solution.flatMap((name) => sets[name as keyof typeof sets]));
    expect(universe.every((item) => covered.has(item))).toBe(true);
  });

  it("o guloso avisa quando é impossível cobrir", () => {
    const result = greedyCoverage(["a", "z"], { S1: ["a"] });
    expect(result.complete).toBe(false);
    expect(result.steps.at(-1)!.description).toContain("Não é possível cobrir: z");
  });

  it("o passo inicial e o final sempre existem", () => {
    const { steps } = greedyCoverage(universe, sets);
    expect(steps[0].type).toBe("start");
    expect(steps.at(-1)!.type).toBe("end");
  });

  it("o ótimo acha o menor número de conjuntos e conta 2^n − 1 combinações", () => {
    const result = optimalCoverage(universe, sets);
    expect(result.solution).toHaveLength(2);
    expect(result.testedCombinations).toBe(2 ** 4 - 1);
  });

  it("o ótimo devolve null quando nada cobre o universo", () => {
    expect(optimalCoverage(["a", "z"], { S1: ["a"] }).solution).toBeNull();
  });

  it("o guloso nem sempre é ótimo", () => {
    const hard = {
      grande: ["1", "2", "3", "4"],
      esquerda: ["1", "2", "5"],
      direita: ["3", "4", "6"],
    };
    const items = ["1", "2", "3", "4", "5", "6"];
    expect(greedyCoverage(items, hard).solution).toHaveLength(3);
    expect(optimalCoverage(items, hard).solution).toHaveLength(2);
  });
});
