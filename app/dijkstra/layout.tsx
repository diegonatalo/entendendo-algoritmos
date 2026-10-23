import { metadataDaPagina } from "../metadata";

export const metadata = metadataDaPagina("/dijkstra");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
