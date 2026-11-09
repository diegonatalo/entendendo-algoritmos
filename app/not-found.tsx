import type { Metadata } from "next";
import { NotFoundPage } from "@/components/not-found-page";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

export default function NotFound() {
  return <NotFoundPage />;
}
