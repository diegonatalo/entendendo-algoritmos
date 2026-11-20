import { BellmanFord } from "@/components/lessons/bellman-ford";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/app/bellman-ford");

export default function Page() {
  return <BellmanFord />;
}
