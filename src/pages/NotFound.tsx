import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg rounded-3xl border bg-card p-10 text-center shadow-elevated">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/70">
          404 error
        </p>
        <h1 className="mt-4 text-4xl">Page not found</h1>
        <p className="mt-3 text-muted-foreground">
          The route you requested does not exist in this admin management system.
        </p>
        <Button asChild className="mt-8">
          <Link to="/">Return to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
