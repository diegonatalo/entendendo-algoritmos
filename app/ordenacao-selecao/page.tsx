import { SelectionSort } from "@/components/lessons/selection-sort";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/ordenacao-selecao");

export default function Page() {
  return <SelectionSort />;
}
