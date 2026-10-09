export type WorkflowStatus = "active" | "paused";

export type TriggerType = "schedule" | "webhook" | "manual";

export type Trigger = {
  type: TriggerType;
  // Human-readable detail, e.g. "Every day at 02:00" or "POST /hooks/stripe".
  detail: string;
};

export type StepKind = "trigger" | "transform" | "action";

export type Step = {
  kind: StepKind;
  label: string;
};

export type RunStatus = "success" | "failed";

export type Run = {
  id: string;
  startedAt: string; // ISO 8601
  durationMs: number;
  status: RunStatus;
  message: string;
};

export type Workflow = {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: WorkflowStatus;
  trigger: Trigger;
  steps: Step[];
  runs: Run[]; // newest first
};
