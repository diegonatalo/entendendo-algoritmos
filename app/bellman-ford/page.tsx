import { BellmanFord } from "@/components/lessons/bellman-ford";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/bellman-ford");

export default function Page() {
  return <BellmanFord />;
}
