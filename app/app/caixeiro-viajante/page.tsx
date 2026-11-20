import { TravelingSalesman } from "@/components/lessons/traveling-salesman";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/app/caixeiro-viajante");

export default function Page() {
  return <TravelingSalesman />;
}
