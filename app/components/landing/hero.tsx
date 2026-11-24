import { Link } from "react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { countLabel, countNoun } from "~/lib/count-label";
import type {
  CatalogueStats,
  FeaturedCourse,
} from "~/modules/landing/index.server";

export function Hero({
  stats,
  courses,
  signedIn,
}: {
  stats: CatalogueStats;
  courses: FeaturedCourse[];
  signedIn: boolean;
}) {
  return (
    <section
      className={cn(
        "mx-auto grid max-w-6xl items-center gap-16 px-6 py-20 lg:py-28",
        courses.length > 0 && "lg:grid-cols-[1.1fr_1fr]"
      )}
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Courses for developers
        </p>
        <h1 className="mt-4 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Learn to code,
          <br />
          <span className="text-muted-foreground">at your own pace.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Structured courses built by experienced instructors. Work through
          short lessons, check yourself with quizzes, and pick up where you left
          off.
        </p>
        <HeroActions signedIn={signedIn} />
        <CatalogueFigures stats={stats} />
      </div>
      <CatalogueWindow courses={courses} />
    </section>
  );
}

function HeroActions({ signedIn }: { signedIn: boolean }) {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-3">
      <Button asChild size="lg">
        <Link to="/courses">
          Browse Courses
          <ArrowRight className="ml-2 size-4" />
        </Link>
      </Button>
      <Button asChild size="lg" variant="outline">
        {signedIn ? (
          <Link to="/dashboard">Go to Dashboard</Link>
        ) : (
          <Link to="/signup">Create a free account</Link>
        )}
      </Button>
    </div>
  );
}

function CatalogueFigures({ stats }: { stats: CatalogueStats }) {
  return (
    <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-8">
      <Figure value={stats.courses} singular="course" plural="courses" />
      <Figure value={stats.lessons} singular="lesson" plural="lessons" />
      <Figure
        value={stats.instructors}
        singular="instructor"
        plural="instructors"
      />
      <Figure
        value={stats.categories}
        singular="category"
        plural="categories"
      />
    </dl>
  );
}

function Figure({
  value,
  singular,
  plural,
}: {
  value: number;
  singular: string;
  plural: string;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="order-last text-sm text-muted-foreground">
        {countNoun(value, singular, plural)}
      </dt>
      <dd className="text-3xl font-bold tracking-tight">{value}</dd>
    </div>
  );
}

function CatalogueWindow({ courses }: { courses: FeaturedCourse[] }) {
  if (courses.length === 0) return null;

  return (
    <aside className="relative" aria-label="New on Cadence">
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/5" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="ml-3 text-xs font-medium text-muted-foreground">
            New on Cadence
          </span>
        </div>
        <ul className="divide-y divide-border">
          {courses.map((course) => (
            <li key={course.id}>
              <Link
                to={`/courses/${course.slug}`}
                className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="size-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {course.categoryName}
                  </p>
                  <p className="mt-0.5 truncate font-semibold">
                    {course.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {course.instructorName} ·{" "}
                    {countLabel(course.lessonCount, "lesson", "lessons")}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
