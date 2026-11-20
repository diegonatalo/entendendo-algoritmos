import { NextSteps } from "@/components/lessons/next-steps";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/app/proximos-passos");

export default function Page() {
  return <NextSteps />;
}
