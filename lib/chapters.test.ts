import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { chapters } from "@/lib/chapters";
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
