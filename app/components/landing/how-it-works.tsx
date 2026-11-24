import { BookOpen, ClipboardCheck, LineChart } from "lucide-react";

const STEPS = [
  {
    icon: BookOpen,
    title: "Pick a course",
    body: "Browse the catalogue by topic and start with the course that fits where you are.",
  },
  {
    icon: ClipboardCheck,
    title: "Learn lesson by lesson",
    body: "Short lessons with video and written notes, and quizzes to check what stuck.",
  },
  {
    icon: LineChart,
    title: "Track your progress",
    body: "Your dashboard shows what you have finished and where to pick up next.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-muted/50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Learn on your own schedule. Every course is self-paced.
        </p>
        <ol className="mt-12 grid gap-10 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <step.icon className="size-5 text-primary" />
                </div>
                <span className="text-sm font-semibold text-muted-foreground">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
