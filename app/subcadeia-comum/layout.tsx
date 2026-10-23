import { metadataDaPagina } from "../metadata";

export const metadata = metadataDaPagina("/subcadeia-comum");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
