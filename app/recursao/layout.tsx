import { metadataDaPagina } from "../metadata";

export const metadata = metadataDaPagina("/recursao");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
