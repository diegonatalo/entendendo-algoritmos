export type Lesson = {
  name: string;
  start: number;
  end: number;
};

export type CalendarStep = {
  lesson: Lesson;
  accepted: boolean;
  chosenItems: string[];
  description: string;
};

export type CalendarResult = {
  sortedItems: Lesson[];
  steps: CalendarStep[];
  chosenItems: string[];
};
