"use server";

import { revalidatePath } from "next/cache";
import { getWorkflow, setWorkflowStatus, setWorkflowTrigger } from "@/lib/data";
import type { WorkflowStatus } from "@/lib/types";

const STATUSES: readonly WorkflowStatus[] = ["active", "paused"];

// Takes the desired status rather than "toggle", so a double submit or a stale
// second tab can't flip the workflow back to where it started.
export async function updateWorkflowStatus(id: unknown, status: unknown): Promise<void> {
  // Arguments arrive from the client and can be tampered with, so check them.
  if (typeof id !== "string" || !getWorkflow(id)) {
    throw new Error("Unknown workflow.");
  }
  if (!STATUSES.includes(status as WorkflowStatus)) {
    throw new Error("Invalid status.");
  }

  setWorkflowStatus(id, status as WorkflowStatus);

  revalidatePath("/");
  revalidatePath(`/workflows/${id}`);
}

export async function updateWorkflowTrigger(id: unknown, formDataOrDetail: unknown): Promise<void> {
  if (typeof id !== "string" || !getWorkflow(id)) {
    throw new Error("Unknown workflow.");
  }

  let detail: string | undefined;
  if (formDataOrDetail instanceof FormData) {
    const raw = formDataOrDetail.get("trigger");
    if (typeof raw === "string") detail = raw.trim();
  } else if (typeof formDataOrDetail === "string") {
    detail = formDataOrDetail.trim();
  }

  if (!detail) {
    throw new Error("Trigger detail cannot be empty.");
  }

  setWorkflowTrigger(id, detail);

  revalidatePath("/");
  revalidatePath(`/workflows/${id}`);
}

