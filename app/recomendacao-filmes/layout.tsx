import { metadataDaPagina } from "../metadata";

export const metadata = metadataDaPagina("/recomendacao-filmes");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
