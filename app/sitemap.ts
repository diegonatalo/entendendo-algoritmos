import type { MetadataRoute } from "next";
import { capitulos } from "./capitulos";
import { SITE_URL } from "./site";

// a home e todas as páginas registradas em capitulos.ts; página nova entra sozinha
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: new URL("/", SITE_URL).href },
    ...capitulos.map((c) => ({ url: new URL(c.href, SITE_URL).href })),
  ];
}
