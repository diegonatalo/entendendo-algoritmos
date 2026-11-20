import { QuicksortMergeSort } from "@/components/lessons/quicksort-merge-sort";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/app/quicksort-mesclagem");

export default function Page() {
  return <QuicksortMergeSort />;
}
