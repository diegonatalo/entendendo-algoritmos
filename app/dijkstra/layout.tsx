import { metadataDaPagina } from "../../lib/metadata";

export const metadata = metadataDaPagina("/dijkstra");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
