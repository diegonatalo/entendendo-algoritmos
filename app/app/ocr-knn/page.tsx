import { OcrKnn } from "@/components/lessons/ocr-knn";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/app/ocr-knn");

export default function Page() {
  return <OcrKnn />;
}
