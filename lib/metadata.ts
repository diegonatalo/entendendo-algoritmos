import type { Metadata } from "next";
import { chapters } from "./chapters";
import { SITE_NAME } from "./site";

// compartilhado pelo layout raiz e por cada página (o openGraph de uma página substitui
// o do layout por inteiro, então ele precisa repetir os campos comuns)
export function openGraphBase(title: string, description: string, path: string, image: string) {
  return {
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "pt_BR",
      title,
      description,
      url: path,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  } satisfies Metadata;
}

// título, descrição e cartão de compartilhamento de cada página vêm do registro único
// em capitulos.ts; a imagem é gerada em app/og/[slug]/route.tsx
export function pageMetadata(href: string): Metadata {
  const page = chapters.find((c) => c.href === href);
  if (!page) throw new Error(`Página não registrada em capitulos.ts: ${href}`);
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: href },
    ...openGraphBase(
      `${page.title} · ${SITE_NAME}`,
      page.description,
      href,
      `/og${href}`,
    ),
  };
}
