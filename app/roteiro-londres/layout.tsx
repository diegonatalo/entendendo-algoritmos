import { metadataDaPagina } from "../metadata";

export const metadata = metadataDaPagina("/roteiro-londres");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
