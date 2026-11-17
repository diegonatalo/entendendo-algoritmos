import { BreadthFirstSearch } from "@/components/lessons/breadth-first-search";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/busca-em-largura");

export default function Page() {
  return <BreadthFirstSearch />;
}
