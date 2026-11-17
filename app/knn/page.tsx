import { Knn } from "@/components/lessons/knn";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/knn");

export default function Page() {
  return <Knn />;
}
