import { Dijkstra } from "@/components/lessons/dijkstra";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/app/dijkstra");

export default function Page() {
  return <Dijkstra />;
}
