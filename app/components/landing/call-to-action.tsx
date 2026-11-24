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
