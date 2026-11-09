import { ImageResponse } from "next/og";
import { chapters } from "@/lib/chapters";
import { SITE_NAME } from "@/lib/site";

// Cartão de compartilhamento (1200×630) de cada página, gerado no build:
// /og/busca-binaria, /og/quicksort… e /og/start para a página inicial.

export function generateStaticParams() {
  return [{ slug: "start" }, ...chapters.map((c) => ({ slug: c.href.slice(1) }))];
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const page = chapters.find((c) => c.href === `/${slug}`);
  if (!page && slug !== "start") return new Response("Not found", { status: 404 });

  const label = page ? `CAPÍTULO ${page.number}` : "VISUALIZAÇÕES INTERATIVAS";
  const title = page ? page.title : "Veja os algoritmos acontecendo";
  const description = page ? page.description : "Visualizações interativas, passo a passo.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#fafafa",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 12% 0%, rgba(16,185,129,0.35), rgba(9,9,11,0) 55%), radial-gradient(circle at 100% 100%, rgba(56,189,248,0.22), rgba(9,9,11,0) 50%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 600 }}>
          <span style={{ color: "#34d399", marginRight: 14 }}>{"</>"}</span>
          {SITE_NAME}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, letterSpacing: 4, color: "#34d399", marginBottom: 20 }}>
            {label}
          </div>
          <div
            style={{
              fontSize: title.length <= 18 ? 104 : title.length <= 24 ? 88 : 76,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: -3,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 34, lineHeight: 1.35, color: "#a1a1aa", marginTop: 28, maxWidth: 980 }}>
            {description}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {["Passo a passo", "Simples e Técnica", "Código de cada algoritmo"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                padding: "10px 22px",
                fontSize: 24,
                color: "#d4d4d8",
                border: "1px solid #27272a",
                borderRadius: 999,
                backgroundColor: "rgba(24,24,27,0.75)",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
