import { metadataDaPagina } from "@/lib/metadata";

export const metadata = metadataDaPagina("/recursao");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
