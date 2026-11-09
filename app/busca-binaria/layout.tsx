import { metadataDaPagina } from "@/lib/metadata";

export const metadata = metadataDaPagina("/busca-binaria");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
