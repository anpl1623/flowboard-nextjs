"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert" className="rounded-lg border border-danger/40 bg-danger-soft p-6 text-sm text-danger">
      <p className="font-semibold">Something went wrong.</p>
      <p className="mt-1">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 min-h-11 cursor-pointer rounded-md border border-danger/40 px-3 font-medium hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Try again
      </button>
    </div>
  );
}
