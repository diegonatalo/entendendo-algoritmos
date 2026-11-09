import { metadataDaPagina } from "../../lib/metadata";

export const metadata = metadataDaPagina("/proximos-passos");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
