import { describe, expect, it } from "vitest";
import { chapters } from "@/lib/chapters";
import { DEMO_LIST, FAQ, PERKS, STEPS, chapterCount, maxAttempts, searchDemo, stats } from "@/lib/landing";

describe("landing", () => {
  it("conta os capítulos distintos", () => {
    expect(chapterCount()).toBe(11);
  });

  it("tem 3 passos, 3 níveis e perguntas com resposta", () => {
    expect(STEPS).toHaveLength(3);
    expect(PERKS).toHaveLength(3);
    expect(FAQ.length).toBeGreaterThan(0);
    expect(FAQ.every((q) => q.question.trim() && q.answer.trim())).toBe(true);
  });

  it("os números vêm do registro de capítulos", () => {
    const [chaptersStat, pagesStat] = stats();
    expect(chaptersStat.value).toBe(String(chapterCount()));
    expect(pagesStat.value).toBe(String(chapters.length));
  });
});

describe("maxAttempts", () => {
  it("é ⌊log₂ n⌋ + 1", () => {
    expect(maxAttempts(16)).toBe(5);
    expect(maxAttempts(100)).toBe(7);
    expect(maxAttempts(1_000_000_000)).toBe(30);
    expect(maxAttempts(0)).toBe(0);
  });
});

describe("searchDemo", () => {
  it("acha o 42 em 4 passos, cada um dentro do intervalo anterior", () => {
    const steps = searchDemo();
    expect(steps.map((s) => s.value)).toEqual([37, 61, 50, 42]);
    expect(steps.at(-1)?.found).toBe(true);
    for (const [i, step] of steps.entries()) {
      expect(step.middle).toBeGreaterThanOrEqual(step.start);
      expect(step.middle).toBeLessThanOrEqual(step.end);
      if (i > 0) expect(step.end - step.start).toBeLessThan(steps[i - 1].end - steps[i - 1].start);
    }
  });

  it("explica cada decisão", () => {
    const [first, second, , last] = searchDemo();
    expect(first.verdict).toContain("metade da esquerda");
    expect(second.verdict).toContain("metade da direita");
    expect(last.verdict).toContain("encontrado no 4º passo");
  });

  it("nunca passa do máximo de tentativas", () => {
    for (const target of DEMO_LIST) {
      expect(searchDemo(DEMO_LIST, target).length).toBeLessThanOrEqual(maxAttempts(DEMO_LIST.length));
    }
  });
});
