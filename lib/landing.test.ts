import { describe, expect, it } from "vitest";
import { chapters } from "@/lib/chapters";
import { PERKS, STEPS, chapterCount, tableOfContents } from "@/lib/landing";

describe("landing", () => {
  it("conta os capítulos distintos", () => {
    expect(chapterCount()).toBeGreaterThan(0);
  });

  it("tem 3 passos e 3 vantagens", () => {
    expect(STEPS).toHaveLength(3);
    expect(PERKS).toHaveLength(3);
  });

  it("o sumário tem um item por capítulo e todas as páginas, sem repetir", () => {
    const toc = tableOfContents();
    expect(toc).toHaveLength(chapterCount());
    expect(toc.flatMap((entry) => entry.pages)).toEqual(chapters);
    expect(toc.every((entry) => entry.pages.every((page) => page.number === entry.number))).toBe(true);
  });
});
