import { metadataDaPagina } from "../metadata";

export const metadata = metadataDaPagina("/algoritmo-guloso");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
