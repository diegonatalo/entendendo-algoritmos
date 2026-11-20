import { DijkstraSwaps } from "@/components/lessons/dijkstra-swaps";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/app/dijkstra-trocas");

export default function Page() {
  return <DijkstraSwaps />;
}
