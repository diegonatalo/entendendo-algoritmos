import { afterEach, describe, expect, it, vi } from "vitest";
import { fontUrlFromCss } from "@/lib/og-font";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("fontUrlFromCss", () => {
  it("acha o TTF no CSS do Google Fonts", () => {
    const css = `@font-face {
  font-family: 'Bricolage Grotesque';
  font-weight: 800;
  src: url(https://fonts.gstatic.com/s/bricolagegrotesque/v8/abc.ttf) format('truetype');
}`;
    expect(fontUrlFromCss(css)).toBe("https://fonts.gstatic.com/s/bricolagegrotesque/v8/abc.ttf");
  });

  it("ignora woff2, que o gerador de imagens não lê", () => {
    expect(fontUrlFromCss("src: url(https://x/abc.woff2) format('woff2');")).toBeNull();
  });
});

describe("ogFonts", () => {
  it("sem rede, devolve lista vazia em vez de falhar", async () => {
    vi.stubGlobal("fetch", () => Promise.reject(new Error("offline")));
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const { ogFonts } = await import("@/lib/og-font");
    await expect(ogFonts()).resolves.toEqual([]);
  });
});
