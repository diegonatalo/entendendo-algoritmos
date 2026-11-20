import { HashTablePage } from "@/components/lessons/hash-table-page";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/app/tabela-hash");

export default function Page() {
  return <HashTablePage />;
}
