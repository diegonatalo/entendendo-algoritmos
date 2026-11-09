import { metadataDaPagina } from "../../lib/metadata";

export const metadata = metadataDaPagina("/caixeiro-viajante");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
