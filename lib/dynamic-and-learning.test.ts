import { describe, expect, it } from "vitest";
import { createBoxes, KEY_LOCATIONS, searchKey, TARGET } from "@/lib/boxes";
import { formatClock, greedyCalendar } from "@/lib/calendar";
import { commonSubstring } from "@/lib/common-substring";
import { crossingPoint, formatDuration, linearTime, logarithmicTime } from "@/lib/constants";
import { curves, formatSteps, formatTime } from "@/lib/big-o";
import { distance, knn, knnRegression } from "@/lib/knn";
import { greedyKnapsack, knapsack } from "@/lib/knapsack";
import { classify, tokenize, train } from "@/lib/naive-bayes";
import { digitModel, HEIGHT, recognizeDigit, TRAINING, WIDTH } from "@/lib/ocr";
import { cosineSimilarity, euclideanDistance, normalize, recommend } from "@/lib/recommendation";
import { bruteForceRoute, nearestNeighborRoute, routeLength } from "@/lib/salesman";

describe("knapsack (programação dinâmica)", () => {
  const items = [
    { name: "violão", weight: 1, value: 1500 },
    { name: "som", weight: 4, value: 3000 },
    { name: "notebook", weight: 3, value: 2000 },
  ];

  it("acha o valor máximo e os itens escolhidos", () => {
    const result = knapsack(items, 4);
    expect(result.totalValue).toBe(3500);
    expect(result.chosenSet.sort()).toEqual(["notebook", "violão"]);
  });

  it("o valor da última célula é o total", () => {
    const result = knapsack(items, 4);
    expect(result.table.at(-1)!.at(-1)).toBe(result.totalValue);
  });

  it("o valor nunca diminui com mais capacidade", () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8].map((capacity) => knapsack(items, capacity).totalValue);
    expect(values).toEqual([...values].sort((a, b) => a - b));
  });

  it("registra um passo por célula da tabela", () => {
    expect(knapsack(items, 4).steps).toHaveLength(items.length * 4);
  });

  it("o guloso pelo valor pode perder para a programação dinâmica", () => {
    const greedy = greedyKnapsack(items, 4);
    expect(greedy.chosenSet).toEqual(["som"]);
    expect(greedy.totalValue).toBe(3000);
    expect(knapsack(items, 4).totalValue).toBeGreaterThan(greedy.totalValue);
  });

  it("sem itens o valor é zero", () => {
    expect(knapsack([], 4).totalValue).toBe(0);
  });

  it("item que não cabe é ignorado", () => {
    expect(knapsack([{ name: "pesado", weight: 10, value: 99 }], 4).totalValue).toBe(0);
  });
});

describe("commonSubstring", () => {
  it("subcadeia exige letras consecutivas", () => {
    const result = commonSubstring("fish", "hish", "substring");
    expect(result.result).toBe("ish");
    expect(result.resultCells).toEqual([[1, 1], [2, 2], [3, 3]]);
  });

  it("subsequência aceita buracos", () => {
    expect(commonSubstring("fosh", "fish", "subsequence").result).toBe("fsh");
  });

  it("sem letras em comum o resultado é vazio", () => {
    expect(commonSubstring("abc", "xyz", "substring").result).toBe("");
    expect(commonSubstring("abc", "xyz", "subsequence").result).toBe("");
  });

  it("a subsequência é pelo menos tão longa quanto a subcadeia", () => {
    const a = "algoritmo";
    const b = "logaritmo";
    expect(commonSubstring(a, b, "subsequence").result.length).toBeGreaterThanOrEqual(
      commonSubstring(a, b, "substring").result.length,
    );
  });

  it("textos iguais dão o texto inteiro", () => {
    expect(commonSubstring("casa", "casa", "substring").result).toBe("casa");
    expect(commonSubstring("casa", "casa", "subsequence").result).toBe("casa");
  });

  it("registra um passo por célula", () => {
    expect(commonSubstring("abc", "ab", "substring").steps).toHaveLength(6);
  });
});

describe("greedyCalendar", () => {
  const lessons = [
    { name: "Arte", start: 9, end: 10 },
    { name: "Inglês", start: 9.5, end: 10.5 },
    { name: "Matemática", start: 10, end: 11 },
    { name: "Ciência", start: 10.5, end: 11.5 },
    { name: "Música", start: 11, end: 12 },
  ];

  it("escolhe o máximo de aulas sem conflito", () => {
    expect(greedyCalendar(lessons).chosenItems).toEqual(["Arte", "Matemática", "Música"]);
  });

  it("ordena por horário de término", () => {
    const ends = greedyCalendar(lessons).sortedItems.map((l) => l.end);
    expect(ends).toEqual([...ends].sort((a, b) => a - b));
  });

  it("aulas que se encostam (fim = início) não conflitam", () => {
    expect(greedyCalendar([{ name: "A", start: 8, end: 9 }, { name: "B", start: 9, end: 10 }]).chosenItems).toEqual([
      "A",
      "B",
    ]);
  });

  it("explica a rejeição de uma aula", () => {
    const rejected = greedyCalendar(lessons).steps.find((step) => !step.accepted)!;
    expect(rejected.description).toContain("conflita");
  });

  it("formatClock mostra horas e minutos", () => {
    expect(formatClock(9)).toBe("9:00");
    expect(formatClock(10.5)).toBe("10:30");
    expect(formatClock(8.25)).toBe("8:15");
  });
});

describe("caixas (busca recursiva)", () => {
  it("acha a chave em cada lugar possível", () => {
    for (const { id } of KEY_LOCATIONS) {
      expect(searchKey(createBoxes(id)).foundAt, id).toBe(id);
    }
  });

  it("devolve null quando a chave não está em nenhuma caixa", () => {
    const result = searchKey(createBoxes(null));
    expect(result.foundAt).toBeNull();
    expect(result.steps.at(-1)!.type).toBe("returns");
  });

  it("a chave só aparece na caixa indicada", () => {
    const withTarget = (box: ReturnType<typeof createBoxes>): number =>
      box.items.filter((item) => item === TARGET).length + box.boxes.reduce((n, child) => n + withTarget(child), 0);
    expect(withTarget(createBoxes("azul1"))).toBe(1);
    expect(withTarget(createBoxes(null))).toBe(0);
  });

  it("abre e fecha caixas em ordem: a pilha esvazia quando não acha", () => {
    const { steps } = searchKey(createBoxes(null));
    const opened = steps.filter((s) => s.type === "opens").length;
    const closed = steps.filter((s) => s.type === "returns").length;
    expect(opened).toBe(closed);
    expect(steps.at(-1)!.stack).toEqual([]);
  });

  it("quando acha, para de abrir as outras caixas", () => {
    const found = searchKey(createBoxes("azul1"));
    const notFound = searchKey(createBoxes(null));
    expect(found.steps.length).toBeLessThan(notFound.steps.length);
    expect(found.steps.at(-1)!.type).toBe("didFind");
  });
});

describe("Big O", () => {
  it("cada curva cresce com n e o log é a mais lenta", () => {
    for (const curve of curves) expect(curve.steps(16), curve.id).toBeGreaterThan(curve.steps(8));
    const at = (id: string) => curves.find((c) => c.id === id)!.steps(10);
    expect(at("log")).toBeLessThan(at("n"));
    expect(at("n")).toBeLessThan(at("nlog"));
    expect(at("nlog")).toBeLessThan(at("n2"));
    expect(at("n2")).toBeLessThan(at("fat"));
  });

  it("os valores conhecidos batem", () => {
    const at = (id: string, n: number) => curves.find((c) => c.id === id)!.steps(n);
    expect(at("log", 8)).toBe(3);
    expect(at("n2", 5)).toBe(25);
    expect(at("fat", 5)).toBe(120);
    expect(at("nlog", 8)).toBe(24);
  });

  it("ids são únicos", () => {
    expect(new Set(curves.map((c) => c.id)).size).toBe(curves.length);
  });

  it("formatSteps usa vírgula, milhar e notação científica", () => {
    expect(formatSteps(3)).toBe("3");
    expect(formatSteps(2.5)).toBe("2,5");
    expect(formatSteps(12_345)).toBe("12.345");
    expect(formatSteps(2e12)).toBe("2,0 × 10^12");
  });

  it("formatTime escolhe a unidade pelo tamanho", () => {
    expect(formatTime(500)).toBe("500 ms");
    expect(formatTime(1500)).toBe("1,5 s");
    expect(formatTime(90_000)).toBe("1,5 min");
    expect(formatTime(5_400_000)).toBe("1,5 h");
    expect(formatTime(1e30)).toBe("mais que a idade do universo");
  });
});

describe("constantes do Big O", () => {
  it("calculam o tempo como constante × passos", () => {
    expect(linearTime(100, 2)).toBe(200);
    expect(logarithmicTime(8, 10)).toBe(30);
  });

  it("crossingPoint acha o menor n em que o linear perde", () => {
    const n = crossingPoint(1, 10)!;
    expect(linearTime(n, 1)).toBeGreaterThan(logarithmicTime(n, 10));
    expect(linearTime(n - 1, 1)).toBeLessThanOrEqual(logarithmicTime(n - 1, 10));
  });

  it("crossingPoint é pequeno quando o log não é mais caro", () => {
    expect(crossingPoint(1, 1)).toBeLessThanOrEqual(4);
  });

  it("formatDuration escolhe a unidade pelo tamanho", () => {
    expect(formatDuration(5)).toBe("5,0 ms");
    expect(formatDuration(500)).toBe("500 ms");
    expect(formatDuration(2500)).toBe("2,5 s");
    expect(formatDuration(150_000)).toBe("2,5 min");
    expect(formatDuration(1e15)).toContain("anos");
  });
});

describe("knn", () => {
  const points = [
    { x: 1, y: 1, category: "laranja" as const },
    { x: 2, y: 1, category: "laranja" as const },
    { x: 8, y: 8, category: "toranja" as const },
    { x: 9, y: 8, category: "toranja" as const },
    { x: 9, y: 9, category: "toranja" as const },
  ];

  it("distance é euclidiana", () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  it("classifica pela maioria dos k vizinhos", () => {
    expect(knn(points, { x: 1.5, y: 1 }, 3).category).toBe("laranja");
    expect(knn(points, { x: 8.5, y: 8 }, 3).category).toBe("toranja");
  });

  it("devolve os vizinhos do mais perto para o mais longe, com os votos somando k", () => {
    const result = knn(points, { x: 1.5, y: 1 }, 3);
    const distances = result.neighbors.map((n) => n.distance);
    expect(distances).toEqual([...distances].sort((a, b) => a - b));
    expect(result.neighbors).toHaveLength(3);
    expect(result.votes.laranja + result.votes.toranja).toBe(3);
  });

  it("no empate vale a classe do vizinho mais próximo", () => {
    expect(knn(points, { x: 1.2, y: 1 }, 2).category).toBe("laranja");
    expect(knn(points, { x: 8.8, y: 8 }, 4).neighbors[0].point.category).toBe("toranja");
  });

  it("a regressão tira a média dos valores dos k vizinhos", () => {
    const result = knnRegression(
      [
        { x: 0, y: 0, value: 10 },
        { x: 1, y: 0, value: 20 },
        { x: 10, y: 10, value: 1000 },
      ],
      { x: 0.4, y: 0 },
      2,
    );
    expect(result.average).toBe(15);
    expect(result.neighbors).toHaveLength(2);
  });
});

describe("naive bayes", () => {
  const model = train([
    { text: "ganhe dinheiro rápido agora", spam: true },
    { text: "dinheiro fácil clique agora", spam: true },
    { text: "reunião amanhã na sala", spam: false },
    { text: "almoço amanhã com a equipe", spam: false },
  ]);

  it("tokenize ignora pontuação, caixa e palavras de uma letra", () => {
    expect(tokenize("Olá, MUNDO! É a vida.")).toEqual(["olá", "mundo", "vida"]);
    expect(tokenize("")).toEqual([]);
  });

  it("train conta mensagens, palavras e vocabulário por categoria", () => {
    expect(model.messagesByCategory).toEqual({ spam: 2, normal: 2 });
    expect(model.count.spam.agora).toBe(2);
    expect(model.count.normal.amanhã).toBe(2);
    expect(model.vocabulary.has("equipe")).toBe(true);
  });

  it("classifica spam e mensagem normal", () => {
    expect(classify(model, "dinheiro rápido agora").spamProbability).toBeGreaterThan(0.5);
    expect(classify(model, "reunião amanhã").spamProbability).toBeLessThan(0.5);
  });

  it("a probabilidade fica entre 0 e 1 e a prévia reflete o treino", () => {
    const result = classify(model, "dinheiro reunião");
    expect(result.spamProbability).toBeGreaterThan(0);
    expect(result.spamProbability).toBeLessThan(1);
    expect(result.priorSpam).toBe(0.5);
  });

  it("palavra desconhecida é marcada e não muda o resultado", () => {
    const withUnknown = classify(model, "dinheiro palavranova");
    expect(withUnknown.words.find((w) => w.word === "palavranova")!.known).toBe(false);
    expect(withUnknown.spamProbability).toBeCloseTo(classify(model, "dinheiro").spamProbability);
  });

  it("a suavização de Laplace evita probabilidade zero", () => {
    for (const word of classify(model, "dinheiro reunião").words) {
      expect(word.pSpam).toBeGreaterThan(0);
      expect(word.pNormal).toBeGreaterThan(0);
    }
  });
});

describe("ocr (KNN sobre pixels)", () => {
  it("cada dígito é uma grade 5 × 7", () => {
    for (let digit = 0; digit < 10; digit++) expect(digitModel(digit)).toHaveLength(WIDTH * HEIGHT);
  });

  it("os dez modelos são todos diferentes", () => {
    const models = new Set(Array.from({ length: 10 }, (_, d) => digitModel(d).join("")));
    expect(models.size).toBe(10);
  });

  it("o treino tem o modelo e duas variações por dígito, sempre iguais", () => {
    expect(TRAINING).toHaveLength(30);
    expect(TRAINING.filter((e) => e.digit === 3)).toHaveLength(3);
  });

  it("reconhece cada modelo perfeito", () => {
    for (let digit = 0; digit < 10; digit++) {
      expect(recognizeDigit(digitModel(digit), 3).digit, String(digit)).toBe(digit);
    }
  });

  it("tolera alguns pixels errados", () => {
    const pixels = [...digitModel(7)];
    pixels[0] = pixels[0] === 1 ? 0 : 1;
    pixels[10] = pixels[10] === 1 ? 0 : 1;
    expect(recognizeDigit(pixels, 3).digit).toBe(7);
  });

  it("os votos somam k", () => {
    const result = recognizeDigit(digitModel(1), 5);
    expect(result.votes.reduce((a, b) => a + b, 0)).toBe(5);
    expect(result.neighbors).toHaveLength(5);
  });
});

describe("recomendação", () => {
  it("euclideanDistance e cosineSimilarity", () => {
    expect(euclideanDistance([0, 0], [3, 4])).toBe(5);
    expect(cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1);
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
    expect(cosineSimilarity([1, 2], [-1, -2])).toBeCloseTo(-1);
  });

  it("normalize subtrai a média: quem dá notas altas e baixas passa a ser comparável", () => {
    expect(normalize([5, 4, 3])).toEqual([1, 0, -1]);
    expect(euclideanDistance(normalize([5, 4, 3]), normalize([3, 2, 1]))).toBe(0);
    expect(euclideanDistance([5, 4, 3], [3, 2, 1])).toBeGreaterThan(0);
  });

  const others = [
    { name: "A", ratings: [5, 4, 1], newRating: 5 },
    { name: "B", ratings: [1, 2, 5], newRating: 1 },
    { name: "C", ratings: [4, 5, 2], newRating: 4 },
  ];

  it("prevê pela média dos k mais parecidos", () => {
    const result = recommend([5, 5, 1], others, "euclidean", 2);
    expect(result.chosenSet).toHaveLength(2);
    expect(result.prediction).toBe(4.5);
    expect(result.ranking[0].user.name).toBe("A");
  });

  it("no cosseno o ranking vai do mais parecido (maior valor) ao menos", () => {
    const { ranking } = recommend([5, 4, 1], others, "cosine", 1);
    const values = ranking.map((r) => r.measure);
    expect(values).toEqual([...values].sort((a, b) => b - a));
  });

  it("nas distâncias o ranking vai do menor ao maior valor", () => {
    for (const method of ["euclidean", "normalized"] as const) {
      const values = recommend([5, 4, 1], others, method, 1).ranking.map((r) => r.measure);
      expect(values).toEqual([...values].sort((a, b) => a - b));
    }
  });
});

describe("caixeiro-viajante", () => {
  const square = [
    { name: "C1", x: 0, y: 0 },
    { name: "C2", x: 0, y: 10 },
    { name: "C3", x: 10, y: 10 },
    { name: "C4", x: 10, y: 0 },
  ];

  it("routeLength fecha o circuito voltando à origem", () => {
    expect(routeLength(square, [0, 1, 2, 3])).toBe(40);
    expect(routeLength(square, [0, 2, 1, 3])).toBeGreaterThan(40);
  });

  it("o vizinho mais próximo visita todas as cidades uma vez", () => {
    const { order } = nearestNeighborRoute(square);
    expect([...order].sort()).toEqual([0, 1, 2, 3]);
    expect(order[0]).toBe(0);
  });

  it("a força bruta acha o menor circuito e testa (n−1)! ordens", () => {
    const result = bruteForceRoute(square);
    expect(result.totalLength).toBe(40);
    expect(result.permutations).toBe(6);
  });

  it("a aproximação nunca é melhor que o ótimo", () => {
    const cities = [
      { name: "C5", x: 0, y: 0 },
      { name: "C6", x: 5, y: 1 },
      { name: "C7", x: 2, y: 7 },
      { name: "C8", x: 9, y: 6 },
      { name: "C9", x: 4, y: 4 },
    ];
    expect(nearestNeighborRoute(cities).totalLength).toBeGreaterThanOrEqual(bruteForceRoute(cities).totalLength);
    expect(bruteForceRoute(cities).permutations).toBe(24);
  });
});
