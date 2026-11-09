import type { MetadataRoute } from "next";
import { chapters } from "@/lib/chapters";
import { SITE_URL } from "@/lib/site";

// a home e todas as páginas registradas em capitulos.ts; página nova entra sozinha
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: new URL("/", SITE_URL).href },
    ...chapters.map((c) => ({ url: new URL(c.href, SITE_URL).href })),
  ];
}
