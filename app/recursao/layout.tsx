import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/recursao");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
