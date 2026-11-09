import { metadataDaPagina } from "../../lib/metadata";

export const metadata = metadataDaPagina("/arrays-listas");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
