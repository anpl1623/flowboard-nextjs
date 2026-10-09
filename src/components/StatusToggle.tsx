"use client";

import { useFormStatus } from "react-dom";
import { updateWorkflowStatus } from "@/app/actions";
import type { WorkflowStatus } from "@/lib/types";

type Props = {
  id: string;
  name: string;
  status: WorkflowStatus;
};

export function StatusToggle({ id, name, status }: Props) {
  const next: WorkflowStatus = status === "active" ? "paused" : "active";
  // A plain form posting to the server action works even before JS hydrates.
  return (
    <form action={updateWorkflowStatus.bind(null, id, next)} className="relative z-10">
      <SwitchButton name={name} status={status} next={next} />
    </form>
  );
}

function SwitchButton({
  name,
  status,
  next,
}: {
  name: string;
  status: WorkflowStatus;
  next: WorkflowStatus;
}) {
  const { pending } = useFormStatus();
  // While the request is in flight, show where it is going so the click feels instant.
  const shown = pending ? next : status;
  const on = shown === "active";

  return (
    <button
      type="submit"
      role="switch"
      aria-checked={on}
      aria-label={`${name} automation`}
      aria-busy={pending}
      disabled={pending}
      className="group inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-md px-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-wait"
    >
      <span
        aria-hidden="true"
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${
          on ? "bg-success" : "bg-muted-foreground/40"
        } ${pending ? "opacity-60" : ""}`}
      >
        <span
          className={`size-4 rounded-full bg-card shadow-sm transition-transform duration-200 ${
            on ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className={`w-14 text-left ${on ? "text-success" : "text-muted-foreground"}`}>
        {on ? "Active" : "Paused"}
      </span>
    </button>
  );
}
