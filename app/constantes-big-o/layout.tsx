import { metadataDaPagina } from "../metadata";

export const metadata = metadataDaPagina("/constantes-big-o");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
