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
      className="inline-flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2.5 text-sm font-medium transition-[background-color,transform] duration-(--dur-fast) ease-(--ease-out) hover:bg-muted active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-wait"
    >
      {/* Layers, bottom to top: glow, paused track, active track (fades in), pending shimmer, thumb. */}
      <span aria-hidden="true" className="relative h-5 w-9 shrink-0">
        <span
          className={`absolute -inset-1 rounded-full bg-success/30 blur-sm transition-opacity duration-(--dur-base) ${
            on ? "opacity-100" : "opacity-0"
          }`}
        />
        <span className="absolute inset-0 rounded-full bg-muted-foreground/60" />
        <span
          className={`absolute inset-0 rounded-full bg-success transition-opacity duration-(--dur-base) ${
            on ? "opacity-100" : "opacity-0"
          }`}
        />
        {pending && (
          <span className="absolute inset-0 overflow-hidden rounded-full motion-reduce:hidden">
            <span className="absolute inset-0 animate-[shimmer_1s_linear_infinite] bg-linear-to-r from-transparent via-card/60 to-transparent" />
          </span>
        )}
        {/* The spring easing overshoots its end point a little, which reads as the thumb "snapping" in. */}
        <span
          className={`absolute left-0 top-0.5 size-4 rounded-full bg-card shadow-card transition-transform duration-300 ease-(--ease-spring) ${
            on ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className={`flex w-[4.5rem] items-center gap-2 ${on ? "text-success" : "text-muted-foreground"}`}>
        <span className="relative flex size-2 shrink-0">
          {on && (
            <span className="absolute inset-0 animate-[pulse-ring_2s_var(--ease-out)_infinite] rounded-full bg-success motion-reduce:hidden" />
          )}
          <span className={`relative size-2 rounded-full transition-colors duration-(--dur-base) ${on ? "bg-success" : "bg-muted-foreground"}`} />
        </span>
        {on ? "Active" : "Paused"}
      </span>
    </button>
  );
}
