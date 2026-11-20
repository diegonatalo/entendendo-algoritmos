import { LondonItinerary } from "@/components/lessons/london-itinerary";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/app/roteiro-londres");

export default function Page() {
  return <LondonItinerary />;
}
