import { BinarySearch } from "@/components/lessons/binary-search";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/app/busca-binaria");

export default function Page() {
  return <BinarySearch />;
}
