import { describe, expect, it } from "vitest";
import { FEATURED_HREFS, PERKS, STEPS, chapterCount, featuredChapters } from "@/lib/landing";

describe("landing", () => {
  it("as páginas em destaque existem", () => {
    expect(featuredChapters().map((c) => c.href)).toEqual(FEATURED_HREFS);
  });

  it("conta os capítulos distintos", () => {
    expect(chapterCount()).toBeGreaterThan(0);
  });

  it("tem 3 passos e 3 vantagens", () => {
    expect(STEPS).toHaveLength(3);
    expect(PERKS).toHaveLength(3);
  });
});
