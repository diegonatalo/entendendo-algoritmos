// Fonte dos cartões de compartilhamento. O gerador de imagens só traz uma fonte regular e
// não lê woff2, então a Bricolage Grotesque em TTF é baixada do Google Fonts no build.
// Se o download falhar, os cartões saem com a fonte padrão em vez de quebrar o build.

export type OgFont = { name: string; data: ArrayBuffer; weight: 400 | 700 | 800; style: "normal" };

const FAMILY = "Bricolage Grotesque";
const WEIGHTS = [400, 800] as const;

/** O endereço do arquivo de fonte dentro do CSS do Google Fonts. */
export const fontUrlFromCss = (css: string): string | null =>
  /src:\s*url\((['"]?)([^)'"]+)\1\)\s*format\((['"])(truetype|opentype)\3\)/.exec(css)?.[2] ?? null;

const loadWeight = async (weight: (typeof WEIGHTS)[number]): Promise<OgFont> => {
  const query = `family=${FAMILY.replace(/ /g, "+")}:wght@${weight}`;
  const css = await fetch(`https://fonts.googleapis.com/css2?${query}`, { signal: AbortSignal.timeout(8000) }).then(
    (r) => r.text(),
  );
  const url = fontUrlFromCss(css);
  if (!url) throw new Error("Google Fonts não devolveu um TTF");
  const data = await fetch(url, { signal: AbortSignal.timeout(8000) }).then((r) => r.arrayBuffer());
  return { name: FAMILY, data, weight, style: "normal" };
};

let cache: Promise<OgFont[]> | null = null;

/** As fontes dos cartões, baixadas uma vez por build. Lista vazia se não deu para baixar. */
export const ogFonts = (): Promise<OgFont[]> => {
  cache ??= Promise.all(WEIGHTS.map(loadWeight)).catch((error) => {
    console.warn("Cartões de compartilhamento sem a fonte da marca:", error);
    return [];
  });
  return cache;
};

export const OG_FONT_FAMILY = FAMILY;
