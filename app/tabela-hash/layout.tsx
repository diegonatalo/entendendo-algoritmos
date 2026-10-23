import { metadataDaPagina } from "../metadata";

export const metadata = metadataDaPagina("/tabela-hash");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
