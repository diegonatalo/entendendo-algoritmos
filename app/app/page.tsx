import type { Metadata } from "next";
import { ChaptersScreen } from "@/components/chapters-screen";

export const metadata: Metadata = { title: "Capítulos", alternates: { canonical: "/app" } };

export default function Page() {
  return <ChaptersScreen />;
}
