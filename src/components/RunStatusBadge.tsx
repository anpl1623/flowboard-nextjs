import type { RunStatus } from "@/lib/types";

// Text label alongside color, so status never relies on color alone.
export function RunStatusBadge({ status }: { status: RunStatus }) {
  const ok = status === "success";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
        ok ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
      }`}
    >
      <span aria-hidden="true" className={`size-1.5 rounded-full ${ok ? "bg-success" : "bg-danger"}`} />
      {ok ? "Success" : "Failed"}
    </span>
  );
}
