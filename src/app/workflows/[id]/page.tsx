import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RunStatusBadge } from "@/components/RunStatusBadge";
import { StatusToggle } from "@/components/StatusToggle";
import { TriggerIcon } from "@/components/TriggerIcon";
import { getWorkflow } from "@/lib/data";
import { formatDateTime, formatDuration, successRate, timeAgo } from "@/lib/format";
import type { StepKind } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const workflow = getWorkflow(id);
  return { title: workflow?.name ?? "Workflow not found" };
}

const STEP_LABELS: Record<StepKind, string> = {
  trigger: "Trigger",
  transform: "Transform",
  action: "Action",
};

export default async function WorkflowPage({ params }: Props) {
  const { id } = await params;
  const workflow = getWorkflow(id);
  if (!workflow) notFound();

  const lastRun = workflow.runs[0];
  const rate = successRate(workflow.runs);
  const avgDuration =
    workflow.runs.length > 0
      ? workflow.runs.reduce((sum, run) => sum + run.durationMs, 0) / workflow.runs.length
      : null;

  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        All workflows
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">{workflow.name}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{workflow.description}</p>
        </div>
        <div className="shrink-0 self-start rounded-lg border border-border bg-card px-2">
          <StatusToggle id={workflow.id} name={workflow.name} status={workflow.status} />
        </div>
      </div>

      {workflow.status === "paused" && (
        <p className="rounded-lg border border-warning/40 bg-warning-soft px-4 py-3 text-sm text-warning">
          This workflow is paused. Its trigger is ignored until you resume it.
        </p>
      )}

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Fact label="Trigger">
          <span className="flex items-center gap-1.5">
            <TriggerIcon type={workflow.trigger.type} />
            <span className="truncate">{workflow.trigger.detail}</span>
          </span>
        </Fact>
        <Fact label="Owner">{workflow.owner}</Fact>
        <Fact label="Success rate">
          <span className="font-mono tabular-nums">
            {rate === null ? "—" : `${rate}%`}
            {workflow.runs.length > 0 && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                last {workflow.runs.length} runs
              </span>
            )}
          </span>
        </Fact>
        <Fact label="Last run">
          {lastRun ? (
            <span className="font-mono">
              {timeAgo(lastRun.startedAt)}
              {avgDuration !== null && (
                <span className="ml-1.5 text-xs text-muted-foreground">
                  avg {formatDuration(Math.round(avgDuration))}
                </span>
              )}
            </span>
          ) : (
            <span className="text-muted-foreground">Never</span>
          )}
        </Fact>
      </dl>

      <section aria-labelledby="steps-heading" className="space-y-3">
        <h2 id="steps-heading" className="text-sm font-semibold">
          Steps
        </h2>
        <ol className="flex flex-col gap-2 md:flex-row md:items-stretch">
          {workflow.steps.map((step, index) => (
            <li key={index} className="flex flex-col gap-2 md:flex-1 md:flex-row md:items-center">
              <div className="flex-1 rounded-lg border border-border bg-card p-3">
                <p className="font-mono text-xs text-muted-foreground">
                  {index + 1}. {STEP_LABELS[step.kind]}
                </p>
                <p className="mt-1 text-sm">{step.label}</p>
              </div>
              {index < workflow.steps.length - 1 && (
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0 self-center rotate-90 text-muted-foreground md:rotate-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="runs-heading" className="space-y-3">
        <h2 id="runs-heading" className="text-sm font-semibold">
          Recent runs
        </h2>
        {workflow.runs.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No runs yet. This workflow has never been triggered.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/60 text-xs text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">Started</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-medium">Duration</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {workflow.runs.map((run) => (
                  <tr key={run.id}>
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs">
                      <time dateTime={run.startedAt}>{formatDateTime(run.startedAt)}</time>
                    </td>
                    <td className="px-4 py-2.5">
                      <RunStatusBadge status={run.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right font-mono text-xs tabular-nums">
                      {formatDuration(run.durationMs)}
                    </td>
                    <td className={`min-w-56 px-4 py-2.5 ${run.status === "failed" ? "text-danger" : "text-muted-foreground"}`}>
                      {run.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-card p-4">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{children}</dd>
    </div>
  );
}
