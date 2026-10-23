import { ImageResponse } from "next/og";
import { capitulos } from "../../capitulos";
import { NOME_DO_SITE } from "../../site";

// Cartão de compartilhamento (1200×630) de cada página, gerado no build:
// /og/busca-binaria, /og/quicksort… e /og/inicio para a página inicial.
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: "inicio" }, ...capitulos.map((c) => ({ slug: c.href.slice(1) }))];
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const pagina = capitulos.find((c) => c.href === `/${slug}`);

  const etiqueta = pagina ? `CAPÍTULO ${pagina.numero}` : "VISUALIZAÇÕES INTERATIVAS";
  const titulo = pagina ? pagina.titulo : "Veja os algoritmos acontecendo";
  const descricao = pagina ? pagina.descricao : "Visualizações interativas, passo a passo.";

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
          {NOME_DO_SITE}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, letterSpacing: 4, color: "#34d399", marginBottom: 20 }}>
            {etiqueta}
          </div>
          <div
            style={{
              fontSize: titulo.length <= 18 ? 104 : titulo.length <= 24 ? 88 : 76,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: -3,
            }}
          >
            {titulo}
          </div>
          <div style={{ fontSize: 34, lineHeight: 1.35, color: "#a1a1aa", marginTop: 28, maxWidth: 980 }}>
            {descricao}
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
