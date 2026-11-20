import { Quicksort } from "@/components/lessons/quicksort";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/app/quicksort");

export default function Page() {
  return <Quicksort />;
}
