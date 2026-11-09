import {
  Lesson,
  CalendarStep,
  CalendarResult,
} from "@/types/calendar";

export function formatClock(hour: number): string {
  const h = Math.floor(hour);
  const min = Math.round((hour - h) * 60);
  return `${h}:${String(min).padStart(2, "0")}`;
}

// guloso: sempre pega a aula que termina primeiro e não conflita com as já escolhidas
export function greedyCalendar(lessons: Lesson[]): CalendarResult {
  const sortedItems = [...lessons].sort((a, b) => a.end - b.end);
  const chosenItems: string[] = [];
  const steps: CalendarStep[] = [];
  let lastEnd = -Infinity;

  for (const lesson of sortedItems) {
    const accepted = lesson.start >= lastEnd;
    if (accepted) {
      chosenItems.push(lesson.name);
      lastEnd = lesson.end;
    }

    steps.push({
      lesson,
      accepted,
      chosenItems: [...chosenItems],
      description: accepted
        ? `${lesson.name} (${formatClock(lesson.start)}–${formatClock(lesson.end)}) termina cedo e não conflita: entra`
        : `${lesson.name} (${formatClock(lesson.start)}–${formatClock(lesson.end)}) começa antes de ${formatClock(lastEnd)}: conflita, fica de fora`,
    });
  }

  return { sortedItems, steps, chosenItems };
}
