import type { Metadata } from "next";
import { capitulos } from "./capitulos";

// título e descrição de cada página vêm do registro único em capitulos.ts
export function metadataDaPagina(href: string): Metadata {
  const pagina = capitulos.find((c) => c.href === href);
  if (!pagina) throw new Error(`Página não registrada em capitulos.ts: ${href}`);
  return { title: pagina.titulo, description: pagina.descricao };
}
