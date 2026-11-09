import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/filtro-spam");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
