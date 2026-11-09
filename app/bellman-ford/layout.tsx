import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/bellman-ford");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
