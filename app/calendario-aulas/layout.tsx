import { metadataDaPagina } from "../../lib/metadata";

export const metadata = metadataDaPagina("/calendario-aulas");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
