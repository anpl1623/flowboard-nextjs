import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PausedBanner } from "@/components/PausedBanner";
import { RunStatusBadge } from "@/components/RunStatusBadge";
import { StatusToggle } from "@/components/StatusToggle";
import { TriggerIcon } from "@/components/TriggerIcon";
import { getWorkflow } from "@/lib/data";
import { formatDateTime, formatDuration, successRate, timeAgo } from "@/lib/format";
import { stagger } from "@/lib/motion";
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
        style={stagger(0)}
        className="motion-rise group inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors duration-(--dur-fast) hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 transition-transform duration-(--dur-base) ease-(--ease-out) group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        All workflows
      </Link>

      <div
        style={stagger(1)}
        className="motion-rise flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight">{workflow.name}</h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">{workflow.description}</p>
        </div>
        <div className="shrink-0 self-start rounded-xl border border-border bg-card px-1 shadow-card">
          <StatusToggle id={workflow.id} name={workflow.name} status={workflow.status} />
        </div>
      </div>

      <PausedBanner paused={workflow.status === "paused"} />

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Fact index={2} label="Trigger">
          <span className="flex items-center gap-1.5">
            <TriggerIcon type={workflow.trigger.type} />
            <span className="truncate">{workflow.trigger.detail}</span>
          </span>
        </Fact>
        <Fact index={3} label="Owner">{workflow.owner}</Fact>
        <Fact index={4} label="Success rate">
          <span className="font-mono tabular-nums">
            {rate === null ? "—" : `${rate}%`}
            {workflow.runs.length > 0 && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                last {workflow.runs.length} runs
              </span>
            )}
          </span>
        </Fact>
        <Fact index={5} label="Last run">
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
        <h2
          id="steps-heading"
          style={stagger(6)}
          className="motion-rise text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          Steps
        </h2>
        <ol className="flex flex-col md:flex-row md:items-stretch">
          {workflow.steps.map((step, index) => (
            <li key={index} className="flex flex-col items-stretch md:flex-1 md:flex-row md:items-center">
              {/* Card, then connector: each connector draws after the card before it has appeared. */}
              <div
                style={stagger(7 + index * 2)}
                className="motion-rise flex-1 self-stretch rounded-xl border border-border bg-card p-3.5 shadow-card"
              >
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex size-5 items-center justify-center rounded-full bg-muted font-mono text-[11px] font-medium text-foreground">
                    {index + 1}
                  </span>
                  <span className="font-medium uppercase tracking-wider">{STEP_LABELS[step.kind]}</span>
                </p>
                <p className="mt-2 text-sm leading-snug">{step.label}</p>
              </div>
              {index < workflow.steps.length - 1 && (
                <div aria-hidden="true" className="flex h-7 flex-col items-center md:h-auto md:w-9 md:flex-row">
                  <span
                    style={stagger(8 + index * 2)}
                    className="motion-draw w-px flex-1 bg-muted-foreground/50 md:h-px md:w-auto"
                  />
                  <svg
                    style={stagger(9 + index * 2)}
                    viewBox="0 0 24 24"
                    className="motion-rise -mt-1 size-3.5 shrink-0 rotate-90 text-muted-foreground md:mt-0 md:-ml-1 md:rotate-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="runs-heading" className="space-y-3">
        <h2
          id="runs-heading"
          style={stagger(8)}
          className="motion-rise text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          Recent runs
        </h2>
        {workflow.runs.length === 0 ? (
          <div
            style={stagger(9)}
            className="motion-rise flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-card/50 p-8 text-center"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <p className="text-sm text-muted-foreground">No runs yet. This workflow has never been triggered.</p>
          </div>
        ) : (
          <div style={stagger(9)} className="motion-rise overflow-x-auto rounded-xl border border-border bg-card shadow-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Started</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Duration</th>
                  <th scope="col" className="px-4 py-3 font-medium">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {workflow.runs.map((run, index) => (
                  <tr
                    key={run.id}
                    style={stagger(10 + index)}
                    className="motion-fade transition-colors duration-(--dur-fast) hover:bg-muted/50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">
                      <time dateTime={run.startedAt}>{formatDateTime(run.startedAt)}</time>
                    </td>
                    <td className="px-4 py-3">
                      <RunStatusBadge status={run.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-xs tabular-nums">
                      {formatDuration(run.durationMs)}
                    </td>
                    <td className={`min-w-56 px-4 py-3 leading-relaxed ${run.status === "failed" ? "text-danger" : "text-muted-foreground"}`}>
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

function Fact({ index, label, children }: { index: number; label: string; children: React.ReactNode }) {
  return (
    <div style={stagger(index)} className="motion-rise min-w-0 rounded-xl border border-border bg-card p-4 shadow-card">
      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-2 text-sm font-medium">{children}</dd>
    </div>
  );
}
