import { SpamFilter } from "@/components/lessons/spam-filter";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/app/filtro-spam");

export default function Page() {
  return <SpamFilter />;
}
