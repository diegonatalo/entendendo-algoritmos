import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { chapterGroups, chapters, neighbors, pageCode } from "@/lib/chapters";
import { pageMetadata } from "@/lib/metadata";

describe("chapters", () => {
  it("hrefs são únicos", () => {
    expect(new Set(chapters.map((c) => c.href)).size).toBe(chapters.length);
  });

  it("cada capítulo aponta para uma página que existe em app/", () => {
    for (const { href } of chapters) {
      expect(existsSync(join(process.cwd(), "app", href, "page.tsx")), href).toBe(true);
    }
  });

  it("título e descrição não estão vazios", () => {
    for (const c of chapters) {
      expect(c.title.trim(), c.href).not.toBe("");
      expect(c.description.trim(), c.href).not.toBe("");
    }
  });
});

describe("chapterGroups", () => {
  it("cada capítulo tem um nome e as páginas ficam na ordem original", () => {
    const groups = chapterGroups();
    expect(groups.flatMap((g) => g.pages)).toEqual(chapters);
    expect(groups.every((g) => g.name.trim() !== "")).toBe(true);
    expect(groups.every((g) => g.pages.every((p) => p.number === g.number))).toBe(true);
  });

  it("os números dos capítulos não se repetem", () => {
    const numbers = chapterGroups().map((g) => g.number);
    expect(new Set(numbers).size).toBe(numbers.length);
  });
});

describe("pageCode", () => {
  it("numera a página dentro do capítulo", () => {
    const quicksort = chapters.find((c) => c.href === "/app/quicksort")!;
    expect(pageCode(chapters[0])).toBe("1.1");
    expect(pageCode(quicksort)).toBe("4.2");
  });
});

describe("neighbors", () => {
  it("dá a página anterior e a seguinte", () => {
    expect(neighbors(chapters[1].href)).toEqual({ previous: chapters[0], next: chapters[2] });
  });

  it("a primeira não tem anterior e a última não tem seguinte", () => {
    expect(neighbors(chapters[0].href).previous).toBeUndefined();
    expect(neighbors(chapters.at(-1)!.href).next).toBeUndefined();
  });

  it("página desconhecida não tem vizinhas", () => {
    expect(neighbors("/nao-existe")).toEqual({});
  });
});

describe("pageMetadata", () => {
  it("usa o registro e aponta a imagem para /og", () => {
    const [first] = chapters;
    const meta = pageMetadata(first.href);
    expect(meta.title).toBe(first.title);
    expect(meta.alternates?.canonical).toBe(first.href);
  });

  it("falha para página não registrada", () => {
    expect(() => pageMetadata("/nao-existe")).toThrow();
  });
});
