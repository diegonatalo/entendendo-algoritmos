import { metadataDaPagina } from "../metadata";

export const metadata = metadataDaPagina("/busca-binaria");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
