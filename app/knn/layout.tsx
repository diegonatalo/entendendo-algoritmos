import { metadataDaPagina } from "../metadata";

export const metadata = metadataDaPagina("/knn");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
