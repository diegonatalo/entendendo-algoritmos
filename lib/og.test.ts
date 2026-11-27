import { describe, expect, it } from "vitest";
import { chapters } from "@/lib/chapters";
import { ogCard, ogSlugs, ogTitleSize } from "@/lib/og";

describe("ogSlugs", () => {
  it("tem a landing e uma imagem por página", () => {
    const slugs = ogSlugs();
    expect(slugs[0]).toBe("start");
    expect(slugs).toHaveLength(chapters.length + 1);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("ogCard", () => {
  it("a landing traz o título com o trecho marcado", () => {
    const card = ogCard("start");
    expect(card?.marked).toBe("Em movimento");
    expect(card?.description).toContain(String(chapters.length));
  });

  it("cada página traz capítulo, nome do assunto e código", () => {
    const card = ogCard("quicksort");
    expect(card?.title).toBe("Quicksort");
    expect(card?.label).toBe("CAPÍTULO 4 · DIVIDIR PARA CONQUISTAR · 4.2");
  });

  it("todas as páginas têm cartão", () => {
    for (const slug of ogSlugs()) expect(ogCard(slug), slug).not.toBeNull();
  });

  it("slug desconhecido não tem cartão", () => {
    expect(ogCard("nao-existe")).toBeNull();
  });
});

describe("ogTitleSize", () => {
  it("diminui com o tamanho do título", () => {
    expect(ogTitleSize("Quicksort")).toBeGreaterThan(ogTitleSize("Dijkstra: livro por piano"));
    expect(ogTitleSize("Dijkstra: livro por piano")).toBeGreaterThan(ogTitleSize("Algoritmo no papel é abstrato. Em movimento, faz sentido."));
  });
});
