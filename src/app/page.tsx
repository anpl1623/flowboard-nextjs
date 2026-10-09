import Link from "next/link";
import { RunStatusBadge } from "@/components/RunStatusBadge";
import { StatusToggle } from "@/components/StatusToggle";
import { TriggerIcon } from "@/components/TriggerIcon";
import { getWorkflows } from "@/lib/data";
import { successRate, timeAgo } from "@/lib/format";

// Data lives in a mutable in-memory store, so render per request instead of at build time.
export const dynamic = "force-dynamic";

const DAY_MS = 24 * 60 * 60 * 1000;

export default function HomePage() {
  const workflows = getWorkflows();
  const active = workflows.filter((workflow) => workflow.status === "active").length;
  const since = Date.now() - DAY_MS;
  const recentRuns = workflows.flatMap((workflow) =>
    workflow.runs.filter((run) => new Date(run.startedAt).getTime() >= since),
  );
  const failedRecent = recentRuns.filter((run) => run.status === "failed").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Workflows</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Automations running across your business systems. Pause one to stop it from triggering.
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Workflows" value={workflows.length} />
        <Stat label="Active" value={active} />
        <Stat label="Paused" value={workflows.length - active} />
        <Stat
          label="Failed runs (24h)"
          value={failedRecent}
          tone={failedRecent > 0 ? "danger" : undefined}
          hint={`of ${recentRuns.length}`}
        />
      </dl>

      <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
        {workflows.map((workflow) => {
          const lastRun = workflow.runs[0];
          const rate = successRate(workflow.runs);
          return (
            <li
              key={workflow.id}
              className="relative flex flex-col gap-3 p-4 transition-colors hover:bg-muted/60 sm:flex-row sm:items-center sm:gap-6"
            >
              <div className="min-w-0 flex-1">
                {/* The ::after overlay makes the whole row clickable; the toggle sits above it. */}
                <Link
                  href={`/workflows/${workflow.id}`}
                  className="font-medium after:absolute after:inset-0 hover:underline focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-ring"
                >
                  {workflow.name}
                </Link>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">{workflow.description}</p>
                <p className="mt-1.5 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <TriggerIcon type={workflow.trigger.type} className="size-3.5" />
                  {workflow.trigger.detail}
                  <span aria-hidden="true">·</span>
                  {workflow.owner}
                </p>
              </div>

              <dl className="flex gap-6 text-sm sm:w-72 sm:shrink-0">
                <div className="w-40">
                  <dt className="text-xs text-muted-foreground">Last run</dt>
                  <dd className="mt-1 flex items-center gap-2">
                    {lastRun ? (
                      <>
                        <RunStatusBadge status={lastRun.status} />
                        <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                          {timeAgo(lastRun.startedAt)}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Never</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Success</dt>
                  <dd className="mt-1 font-mono tabular-nums">{rate === null ? "—" : `${rate}%`}</dd>
                </div>
              </dl>

              <div className="shrink-0">
                <StatusToggle id={workflow.id} name={workflow.name} status={workflow.status} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: number;
  hint?: string;
  tone?: "danger";
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 flex items-baseline gap-1.5">
        <span className={`font-mono text-2xl font-semibold tabular-nums ${tone === "danger" ? "text-danger" : ""}`}>
          {value}
        </span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </dd>
    </div>
  );
}
