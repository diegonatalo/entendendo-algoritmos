import { ImageResponse } from "next/og";
import { ogCard, ogSlugs, ogTitleSize } from "@/lib/og";
import { OG_FONT_FAMILY, ogFonts } from "@/lib/og-font";
import { SITE_NAME } from "@/lib/site";

// Cartão de compartilhamento (1200×630) de cada página, gerado no build:
// /og/busca-binaria, /og/quicksort… e /og/start para a página inicial.
// Cores da identidade: tinta, esmeralda como marca-texto e violeta para os ponteiros.

const INK = "#0c0c10";
const SURFACE = "#131319";
const LINE = "#3a3a46";
const TEXT = "#f3f2ee";
const MUTED = "#b8b7c0";
const FAINT = "#8c8b96";
const EMERALD = "#34d399";
const VIOLET = "#a496ff";

// a busca binária no rodapé do cartão: três posições já descartadas, o meio aceso
const STRIP = [3, 8, 12, 17, 23, 29, 31, 37, 42];
const DISCARDED = 3;
const MIDDLE = 5;

export function generateStaticParams() {
  return ogSlugs().map((slug) => ({ slug }));
}

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = ogCard(slug);
  if (!card) return new Response("Not found", { status: 404 });

  const fullTitle = `${card.title}${card.marked ?? ""}${card.titleEnd ?? ""}`;
  const size = ogTitleSize(fullTitle);
  // cada palavra vira um bloco para o título quebrar linha; o trecho marcado fica junto
  const plain = (text: string) => text.split(" ").filter(Boolean).map((w) => ({ text: w, marked: false, tight: false }));
  const words = [
    ...plain(card.title),
    // a pontuação logo depois do trecho marcado fica colada nele, fora do marca-texto
    ...(card.marked ? [{ text: card.marked, marked: true, tight: Boolean(card.titleEnd?.match(/^[,.;:]/)) }] : []),
    ...plain(card.titleEnd ?? ""),
  ];
  const fonts = await ogFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 72px",
          fontFamily: fonts.length > 0 ? OG_FONT_FAMILY : undefined,
          color: TEXT,
          backgroundColor: INK,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.6px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 32, fontWeight: 700, letterSpacing: -1 }}>
            <div style={{ display: "flex", alignItems: "center", marginRight: 18 }}>
              <div style={{ width: 13, height: 22, border: `3px solid ${FAINT}`, borderRadius: 5 }} />
              <div style={{ width: 13, height: 44, backgroundColor: EMERALD, borderRadius: 5, margin: "0 5px" }} />
              <div style={{ width: 13, height: 22, border: `3px solid ${FAINT}`, borderRadius: 5 }} />
            </div>
            {SITE_NAME}
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              fontSize: 22,
              color: MUTED,
              border: `1px solid ${LINE}`,
              borderRadius: 999,
              backgroundColor: SURFACE,
            }}
          >
            Passo a passo · Simples e Técnica · Código
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, letterSpacing: 3, color: EMERALD, marginBottom: 22 }}>{card.label}</div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: size,
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: -size * 0.04,
              maxWidth: 1056,
            }}
          >
            {words.map((word, i) =>
              word.marked ? (
                <span
                  key={i}
                  style={{
                    backgroundColor: EMERALD,
                    color: INK,
                    padding: "0 14px",
                    borderRadius: 14,
                    marginRight: word.tight ? 4 : size * 0.22,
                  }}
                >
                  {word.text}
                </span>
              ) : (
                <span key={i} style={{ marginRight: size * 0.22 }}>
                  {word.text}
                </span>
              ),
            )}
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.35, color: MUTED, marginTop: 24, maxWidth: 940 }}>
            {card.description}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start" }}>
          {STRIP.map((n, i) => {
            const out = i < DISCARDED;
            const middle = i === MIDDLE;
            return (
              <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 10 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 62,
                    height: 54,
                    borderRadius: 12,
                    fontSize: 24,
                    fontWeight: middle ? 800 : 500,
                    color: middle ? INK : out ? FAINT : TEXT,
                    backgroundColor: middle ? EMERALD : out ? "transparent" : "#1c1c24",
                    border: `1.5px solid ${middle ? EMERALD : out ? "#25252f" : LINE}`,
                    opacity: out ? 0.45 : 1,
                    textDecoration: out ? "line-through" : "none",
                    marginTop: middle ? -8 : 0,
                  }}
                >
                  {n}
                </div>
                <div style={{ display: "flex", height: 26, fontSize: 18, fontWeight: 700, color: VIOLET, marginTop: 8 }}>
                  {middle ? "meio" : i === DISCARDED ? "início" : i === STRIP.length - 1 ? "fim" : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: fonts.length > 0 ? fonts : undefined },
  );
}
