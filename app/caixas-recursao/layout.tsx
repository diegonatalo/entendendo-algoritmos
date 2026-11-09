import { metadataDaPagina } from "@/lib/metadata";

export const metadata = metadataDaPagina("/caixas-recursao");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
