import Link from "next/link";

export default function WorkflowNotFound() {
  return (
    <div className="rounded-lg border border-dashed border-border p-10 text-center">
      <h1 className="text-lg font-semibold">Workflow not found</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        It may have been removed, or the link is wrong.
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Back to all workflows
      </Link>
    </div>
  );
}
