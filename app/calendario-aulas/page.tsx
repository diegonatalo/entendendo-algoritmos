import { LessonCalendar } from "@/components/lessons/lesson-calendar";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/calendario-aulas");

export default function Page() {
  return <LessonCalendar />;
}
