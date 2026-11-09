"use client";

import { greedyCalendar, formatClock } from "@/lib/calendar";
import { Lesson } from "@/types/calendar";
import { useState } from "react";
import { Explanation } from "@/components/explanation";
import { CODES } from "@/lib/codes";
import { EXPLANATIONS } from "@/lib/explanations";
import { StepControls, Legend, Stat, primaryButton } from "@/components/ui";

type Example = {
  title: string;
  description: string;
  lessons: Lesson[];
};

const EXAMPLES: Example[] = [
  {
    title: "Aulas do livro",
    description:
      "Você quer assistir ao maior número possível de aulas em uma sala, sem sobreposição de horários.",
    lessons: [
      { name: "Arte", start: 9, end: 10 },
      { name: "Inglês", start: 9.5, end: 10.5 },
      { name: "Matemática", start: 10, end: 11 },
      { name: "Computação", start: 10.5, end: 11.5 },
      { name: "Música", start: 11, end: 12 },
    ],
  },
  {
    title: "Mais aulas",
    description:
      "Aulas de durações bem diferentes. Terminar cedo importa mais que começar cedo ou ser curta.",
    lessons: [
      { name: "A", start: 8, end: 12 },
      { name: "B", start: 8, end: 9 },
      { name: "C", start: 9, end: 10.5 },
      { name: "D", start: 9.5, end: 11 },
      { name: "E", start: 11, end: 12 },
      { name: "F", start: 10, end: 13 },
      { name: "G", start: 12, end: 14 },
    ],
  },
];

export default function LessonCalendar() {
  const [index, setIndex] = useState(0);
  const [executed, setExecuted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const example = EXAMPLES[index];
  const result = greedyCalendar(example.lessons);
  const step = result.steps[currentStep];
  const final = currentStep === result.steps.length - 1;

  const minimum = Math.min(...example.lessons.map((a) => a.start));
  const maximum = Math.max(...example.lessons.map((a) => a.end));
  const pos = (hour: number) => ((hour - minimum) / (maximum - minimum)) * 100;

  function lessonState(name: string): "current" | "accepted" | "rejected" | "pending" {
    const i = result.steps.findIndex((p) => p.lesson.name === name);
    if (!executed || i > currentStep) return "pending";
    if (i === currentStep && !final) return "current";
    return result.steps[i].accepted ? "accepted" : "rejected";
  }

  const colors = {
    current: "bg-amber-500 text-amber-950",
    accepted: "bg-emerald-500 text-emerald-950",
    rejected: "bg-zinc-800 text-zinc-500 line-through",
    pending: "bg-zinc-800 text-zinc-300",
  };

  // mostra as aulas na ordem em que o guloso as examina (fim mais cedo primeiro)
  const order = executed ? result.sortedItems : example.lessons;

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="fade-up flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Calendário de aulas</h1>
        <p className="text-zinc-400">
          O problema que apresenta o algoritmo guloso: escolha a aula que
          termina primeiro, depois a próxima que começa depois dela, e repita.
          Aqui a estratégia gulosa chega à resposta ótima, mas só porque este
          problema tem essa propriedade.
        </p>
        <Explanation
          simple={EXPLANATIONS.lessonCalendar.simple}
          technique={EXPLANATIONS.lessonCalendar.technique}
          code={CODES.calendar}
        />
      </header>

      <div className="fade-up flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((e, i) => (
            <button
              key={e.title}
              onClick={() => {
                setIndex(i);
                setExecuted(false);
                setCurrentStep(0);
              }}
              className={`cursor-pointer rounded-xl border px-4 py-2 text-sm transition-colors ${
                i === index
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                  : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              {e.title}
            </button>
          ))}
        </div>
        <p className="text-sm text-zinc-400">{example.description}</p>
        <button
          className={primaryButton}
          onClick={() => {
            setExecuted(true);
            setCurrentStep(0);
          }}
        >
          Executar algoritmo guloso
        </button>
      </div>

      <section className="fade-up flex flex-col gap-6">
        {executed && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Aulas escolhidas"
              value={String(step.chosenItems.length)}
              tone="text-emerald-400"
            />
            <Stat
              label="Escolhidas"
              value={step.chosenItems.join(", ") || "—"}
              tone="text-zinc-100"
              small
            />
            <Stat
              label="Passo"
              value={`${currentStep + 1} / ${result.steps.length}`}
              tone="text-zinc-100"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
          <Legend color="bg-amber-500" text="Sendo examinada" />
          <Legend color="bg-emerald-500" text="Escolhida" />
          <Legend color="bg-zinc-800" text="Recusada ou ainda não examinada" />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          {executed && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p
                className={`text-sm font-medium ${step.accepted ? "text-emerald-400" : "text-zinc-300"}`}
              >
                {step.description}
              </p>
              <StepControls currentStep={currentStep} total={result.steps.length} onChange={setCurrentStep} />
            </div>
          )}

          <div className="relative flex flex-col gap-1.5 pt-6">
            {Array.from(
              { length: Math.floor(maximum) - Math.ceil(minimum) + 1 },
              (_, i) => Math.ceil(minimum) + i,
            ).map((hour) => (
              <div
                key={hour}
                className="absolute top-0 bottom-0 border-l border-zinc-800"
                style={{ left: `${pos(hour)}%` }}
              >
                <span className="absolute -top-0 -translate-x-1/2 font-mono text-[10px] text-zinc-600">
                  {hour}h
                </span>
              </div>
            ))}
            {order.map((lesson) => (
              <div key={lesson.name} className="relative h-9">
                <div
                  className={`absolute flex h-9 items-center overflow-hidden rounded-lg px-2 text-xs font-medium transition-colors ${colors[lessonState(lesson.name)]}`}
                  style={{
                    left: `${pos(lesson.start)}%`,
                    width: `${pos(lesson.end) - pos(lesson.start)}%`,
                  }}
                  title={`${lesson.name}: ${formatClock(lesson.start)}–${formatClock(lesson.end)}`}
                >
                  <span className="truncate">
                    {lesson.name}{" "}
                    <span className="font-mono opacity-70">
                      {formatClock(lesson.start)}–{formatClock(lesson.end)}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
          {executed && (
            <p className="text-xs text-zinc-500">
              As aulas estão ordenadas pelo horário de término, que é a ordem em
              que o guloso as examina.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
