import type { MetadataRoute } from "next";
import { chapters } from "@/lib/chapters";
import { SITE_URL } from "@/lib/site";

// a home e todas as páginas registradas em chapters.ts; página nova entra sozinha
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = ["/", ...chapters.map((c) => c.href)];
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
  }));
}
