import { Quicksort } from "@/components/lessons/quicksort";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/quicksort");

export default function Page() {
  return <Quicksort />;
}
