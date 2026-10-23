import { metadataDaPagina } from "../metadata";

export const metadata = metadataDaPagina("/calendario-aulas");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
