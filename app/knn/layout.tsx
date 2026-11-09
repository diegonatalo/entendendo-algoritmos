import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/knn");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
