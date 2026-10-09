import type { RunStatus } from "@/lib/types";

// Text label alongside color, so status never relies on color alone.
export function RunStatusBadge({ status }: { status: RunStatus }) {
  const ok = status === "success";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium leading-none ring-1 ring-inset ${
        ok ? "bg-success-soft text-success ring-success/25" : "bg-danger-soft text-danger ring-danger/25"
      }`}
    >
      <span aria-hidden="true" className={`size-1.5 rounded-full ${ok ? "bg-success" : "bg-danger"}`} />
      {ok ? "Success" : "Failed"}
    </span>
  );
}
