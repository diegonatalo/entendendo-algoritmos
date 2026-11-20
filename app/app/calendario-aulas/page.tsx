import { LessonCalendar } from "@/components/lessons/lesson-calendar";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/app/calendario-aulas");

export default function Page() {
  return <LessonCalendar />;
}
