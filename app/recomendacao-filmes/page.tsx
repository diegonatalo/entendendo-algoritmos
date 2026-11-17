import { MovieRecommendation } from "@/components/lessons/movie-recommendation";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/recomendacao-filmes");

export default function Page() {
  return <MovieRecommendation />;
}
