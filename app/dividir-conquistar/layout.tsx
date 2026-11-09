import { metadataDaPagina } from "../../lib/metadata";

export const metadata = metadataDaPagina("/dividir-conquistar");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
