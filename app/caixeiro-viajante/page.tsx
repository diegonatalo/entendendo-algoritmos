import { TravelingSalesman } from "@/components/lessons/traveling-salesman";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/caixeiro-viajante");

export default function Page() {
  return <TravelingSalesman />;
}
