"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { updateWorkflowTrigger } from "@/app/actions";
import { TriggerIcon } from "@/components/TriggerIcon";
import type { Trigger } from "@/lib/types";

type Props = {
  id: string;
  trigger: Trigger;
};

const SCHEDULE_PRESETS = [
  "Every 5 minutes",
  "Every 15 minutes",
  "Every 30 minutes",
  "Every hour",
  "Every day at 02:00",
  "Every day at 08:00",
  "Mondays at 08:00",
];

export function TriggerEditor({ id, trigger }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(formData: FormData) {
    setError(null);
    try {
      await updateWorkflowTrigger(id, formData);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update trigger");
    }
  }

  if (isEditing) {
    return (
      <form action={handleAction} className="space-y-2">
        <div className="flex items-center gap-1.5">
          <TriggerIcon type={trigger.type} className="size-4 shrink-0 text-muted-foreground" />
          <input
            name="trigger"
            type="text"
            defaultValue={trigger.detail}
            required
            autoFocus
            list={`schedule-presets-${id}`}
            aria-label="Trigger schedule"
            placeholder={trigger.type === "schedule" ? "e.g. Every 15 minutes" : "e.g. POST /hooks/..."}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setError(null);
                setIsEditing(false);
              }
            }}
            className="h-8 w-full min-w-0 rounded-md border border-border bg-background px-2.5 font-mono text-xs text-foreground shadow-2xs transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          {trigger.type === "schedule" && (
            <datalist id={`schedule-presets-${id}`}>
              {SCHEDULE_PRESETS.map((preset) => (
                <option key={preset} value={preset} />
              ))}
            </datalist>
          )}
        </div>

        {error && (
          <p role="alert" className="text-xs text-danger">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => {
              setError(null);
              setIsEditing(false);
            }}
            className="inline-flex h-7 cursor-pointer items-center justify-center rounded-md border border-border bg-card px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
          >
            Cancel
          </button>
          <SaveButton />
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between gap-1.5">
      <span className="flex min-w-0 items-center gap-1.5">
        <TriggerIcon type={trigger.type} className="shrink-0" />
        <span className="truncate" title={trigger.detail}>
          {trigger.detail}
        </span>
      </span>
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="group inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
        aria-label={`Edit trigger: ${trigger.detail}`}
        title="Edit trigger"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-3 transition-transform duration-(--dur-fast) ease-(--ease-out) group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
        <span className="text-[11px]">Edit</span>
      </button>
    </div>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-7 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-foreground px-2.5 text-xs font-medium text-background transition-opacity hover:opacity-90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:cursor-wait disabled:opacity-50"
    >
      {pending ? (
        <>
          <span
            aria-hidden="true"
            className="size-3 animate-spin rounded-full border-2 border-background border-t-transparent"
          />
          <span>Saving...</span>
        </>
      ) : (
        "Save"
      )}
    </button>
  );
}
