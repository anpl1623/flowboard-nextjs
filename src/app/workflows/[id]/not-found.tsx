import Link from "next/link";

export default function WorkflowNotFound() {
  return (
    <div className="motion-rise flex flex-col items-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-8 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5M8.5 8.5l5 5M13.5 8.5l-5 5" />
      </svg>
      <h1 className="mt-4 text-xl font-semibold tracking-tight">Workflow not found</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">It may have been removed, or the link is wrong.</p>
      <Link
        href="/"
        className="mt-5 inline-flex min-h-11 items-center rounded-lg border border-border bg-card px-4 text-sm font-medium shadow-card transition-[transform,box-shadow] duration-(--dur-fast) ease-(--ease-out) hover:-translate-y-px hover:shadow-lift active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Back to all workflows
      </Link>
    </div>
  );
}
