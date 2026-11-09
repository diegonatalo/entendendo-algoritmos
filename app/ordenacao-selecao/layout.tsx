import { metadataDaPagina } from "../../lib/metadata";

export const metadata = metadataDaPagina("/ordenacao-selecao");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
