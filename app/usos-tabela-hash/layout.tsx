import { metadataDaPagina } from "../../lib/metadata";

export const metadata = metadataDaPagina("/usos-tabela-hash");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
