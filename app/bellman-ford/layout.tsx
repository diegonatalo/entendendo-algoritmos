import { metadataDaPagina } from "@/lib/metadata";

export const metadata = metadataDaPagina("/bellman-ford");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
