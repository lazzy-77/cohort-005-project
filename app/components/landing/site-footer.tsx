import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";

export function CallToAction({ signedIn }: { signedIn: boolean }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="flex flex-col gap-8 rounded-2xl bg-primary px-8 py-12 text-primary-foreground sm:px-12 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Start your first course today
          </h2>
          <p className="mt-2 max-w-lg text-primary-foreground/80">
            Find a course, enrol, and work through it at whatever pace suits
            you.
          </p>
        </div>
        <Button asChild size="lg" variant="secondary">
          <Link to={signedIn ? "/dashboard" : "/signup"}>
            {signedIn ? "Go to Dashboard" : "Sign up"}
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-lg font-bold tracking-tight">Cadence</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Courses for developers, at your own pace.
          </p>
        </div>
        <nav className="flex gap-6 text-sm text-muted-foreground">
          <Link to="/courses" className="hover:text-foreground">
            Courses
          </Link>
        </nav>
      </div>
    </footer>
  );
}
