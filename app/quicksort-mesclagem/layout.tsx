import { metadataDaPagina } from "../../lib/metadata";

export const metadata = metadataDaPagina("/quicksort-mesclagem");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
