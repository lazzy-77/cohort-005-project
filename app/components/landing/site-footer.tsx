import { Link } from "react-router";

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
