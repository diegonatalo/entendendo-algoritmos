import { metadataDaPagina } from "@/lib/metadata";

export const metadata = metadataDaPagina("/busca-em-largura");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
