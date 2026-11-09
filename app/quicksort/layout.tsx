import { metadataDaPagina } from "@/lib/metadata";

export const metadata = metadataDaPagina("/quicksort");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
