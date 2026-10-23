import type { Metadata } from "next";
import { capitulos } from "./capitulos";
import { NOME_DO_SITE } from "./site";

// compartilhado pelo layout raiz e por cada página (o openGraph de uma página substitui
// o do layout por inteiro, então ele precisa repetir os campos comuns)
export function openGraphBase(titulo: string, descricao: string, caminho: string, imagem: string) {
  return {
    openGraph: {
      type: "website",
      siteName: NOME_DO_SITE,
      locale: "pt_BR",
      title: titulo,
      description: descricao,
      url: caminho,
      images: [{ url: imagem, width: 1200, height: 630, alt: titulo }],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descricao,
      images: [imagem],
    },
  } satisfies Metadata;
}

// título, descrição e cartão de compartilhamento de cada página vêm do registro único
// em capitulos.ts; a imagem é gerada em app/og/[slug]/route.tsx
export function metadataDaPagina(href: string): Metadata {
  const pagina = capitulos.find((c) => c.href === href);
  if (!pagina) throw new Error(`Página não registrada em capitulos.ts: ${href}`);
  return {
    title: pagina.titulo,
    description: pagina.descricao,
    alternates: { canonical: href },
    ...openGraphBase(
      `${pagina.titulo} · ${NOME_DO_SITE}`,
      pagina.descricao,
      href,
      `/og${href}`,
    ),
  };
}
