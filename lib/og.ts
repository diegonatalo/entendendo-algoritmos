import { chapterGroups, chapters, pageCode } from "@/lib/chapters";
import { HERO } from "@/lib/landing";

/** O que vai no cartão de compartilhamento (1200×630) de uma página. */
export type OgCard = {
  /** Linha pequena acima do título. */
  label: string;
  /** Título; o trecho `marked` aparece com o marca-texto. */
  title: string;
  marked?: string;
  titleEnd?: string;
  description: string;
};

/** Slug da imagem de cada página: `/og/<slug>`, e `start` para a landing. */
export const ogSlugs = (): string[] => ["start", ...chapters.map((c) => c.href.replace(/^\/app\//, ""))];

/** Conteúdo do cartão, ou `null` para um slug que não existe. */
export const ogCard = (slug: string): OgCard | null => {
  if (slug === "start") {
    return {
      label: HERO.kicker.toUpperCase(),
      title: `${HERO.titleStart} `,
      marked: HERO.titleMarked,
      titleEnd: HERO.titleEnd,
      description: `${chapters.length} visualizações interativas, passo a passo.`,
    };
  }
  const page = chapters.find((c) => c.href === `/app/${slug}`);
  if (!page) return null;
  const group = chapterGroups().find((g) => g.number === page.number);
  return {
    label: `CAPÍTULO ${page.number} · ${group?.name.toUpperCase()} · ${pageCode(page)}`,
    title: page.title,
    description: page.description,
  };
};

/** Tamanho do título no cartão: quanto mais longo, menor. */
export const ogTitleSize = (title: string): number =>
  title.length <= 16 ? 112 : title.length <= 20 ? 92 : title.length <= 40 ? 76 : 64;
