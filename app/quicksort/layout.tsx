import { metadataDaPagina } from "../metadata";

export const metadata = metadataDaPagina("/quicksort");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
