import { TopologicalSort } from "@/components/lessons/topological-sort";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/app/ordenacao-topologica");

export default function Page() {
  return <TopologicalSort />;
}
