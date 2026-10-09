import type { Run, Workflow, WorkflowStatus } from "./types";

// Run timestamps are relative to server start so the demo never looks stale.
function makeRuns(
  workflowId: string,
  everyMinutes: number,
  durationMs: number,
  outcomes: string, // newest first; "." = success, "x" = failure
  successMessage: string,
  failureMessage: string,
  startMinutesAgo = 0,
): Run[] {
  const now = Date.now();
  return [...outcomes].map((outcome, i) => {
    const failed = outcome === "x";
    return {
      id: `${workflowId}-run-${outcomes.length - i}`,
      startedAt: new Date(
        now - (startMinutesAgo + everyMinutes * i + 3) * 60_000,
      ).toISOString(),
      // Vary durations a little so the table doesn't look copy-pasted.
      durationMs: Math.round(durationMs * (0.8 + ((i * 37) % 40) / 100)),
      status: failed ? "failed" : "success",
      message: failed ? failureMessage : successMessage,
    };
  });
}

function seed(): Workflow[] {
  return [
    {
      id: "shopify-netsuite-orders",
      name: "Sync Shopify orders to NetSuite",
      description:
        "Pulls new Shopify orders, maps SKUs and tax lines, and creates sales orders in NetSuite.",
      owner: "Finance Ops",
      status: "active",
      trigger: { type: "schedule", detail: "Every 15 minutes" },
      steps: [
        { kind: "trigger", label: "Every 15 minutes" },
        { kind: "transform", label: "Fetch orders created since last run" },
        { kind: "transform", label: "Map SKUs and tax codes" },
        { kind: "action", label: "Create NetSuite sales orders" },
      ],
      runs: makeRuns(
        "shopify-netsuite-orders",
        15,
        8_400,
        "....x.....",
        "Synced orders to NetSuite",
        "NetSuite API 429: rate limited, will retry next run",
      ),
    },
    {
      id: "nightly-invoice-export",
      name: "Nightly invoice PDF export",
      description:
        "Renders the day's invoices to PDF and uploads them to the shared accounting drive.",
      owner: "Accounting",
      status: "active",
      trigger: { type: "schedule", detail: "Every day at 02:00" },
      steps: [
        { kind: "trigger", label: "Every day at 02:00" },
        { kind: "transform", label: "Query invoices issued yesterday" },
        { kind: "transform", label: "Render each invoice to PDF" },
        { kind: "action", label: "Upload to Google Drive /Invoices" },
      ],
      runs: makeRuns(
        "nightly-invoice-export",
        24 * 60,
        94_000,
        ".......",
        "Exported invoices to Drive",
        "Drive upload timed out",
        9 * 60,
      ),
    },
    {
      id: "failed-payment-alert",
      name: "Slack alert on failed payment",
      description:
        "Posts to #billing when Stripe reports a failed charge, with a link to the customer.",
      owner: "Billing",
      status: "active",
      trigger: { type: "webhook", detail: "POST /hooks/stripe" },
      steps: [
        { kind: "trigger", label: "Stripe webhook: charge.failed" },
        { kind: "transform", label: "Look up customer in CRM" },
        { kind: "action", label: "Post message to #billing" },
      ],
      runs: makeRuns(
        "failed-payment-alert",
        190,
        620,
        "........",
        "Posted alert to #billing",
        "Slack returned channel_not_found",
        42,
      ),
    },
    {
      id: "new-hire-onboarding",
      name: "New hire account setup",
      description:
        "Creates Google Workspace, Slack and GitHub accounts when HR marks a hire as confirmed.",
      owner: "IT",
      status: "active",
      trigger: { type: "webhook", detail: "POST /hooks/bamboohr" },
      steps: [
        { kind: "trigger", label: "BambooHR: hire confirmed" },
        { kind: "action", label: "Create Google Workspace user" },
        { kind: "action", label: "Invite to Slack" },
        { kind: "action", label: "Add to GitHub org" },
      ],
      runs: makeRuns(
        "new-hire-onboarding",
        3 * 24 * 60,
        12_300,
        ".x..",
        "Provisioned accounts",
        "GitHub invite failed: seat limit reached",
        26 * 60,
      ),
    },
    {
      id: "hubspot-lead-enrichment",
      name: "Enrich new HubSpot leads",
      description:
        "Adds company size and industry to new leads, then routes them to the right sales rep.",
      owner: "Revenue Ops",
      status: "paused",
      trigger: { type: "webhook", detail: "POST /hooks/hubspot" },
      steps: [
        { kind: "trigger", label: "HubSpot: contact created" },
        { kind: "transform", label: "Enrich from Clearbit" },
        { kind: "transform", label: "Score and pick owner" },
        { kind: "action", label: "Update HubSpot contact" },
      ],
      runs: makeRuns(
        "hubspot-lead-enrichment",
        55,
        2_100,
        "xxx..x..",
        "Enriched and routed lead",
        "Clearbit API key expired",
        2 * 24 * 60,
      ),
    },
    {
      id: "weekly-kpi-email",
      name: "Weekly KPI email",
      description:
        "Builds a summary of revenue, churn and support volume and emails it to leadership.",
      owner: "Operations",
      status: "active",
      trigger: { type: "schedule", detail: "Mondays at 08:00" },
      steps: [
        { kind: "trigger", label: "Mondays at 08:00" },
        { kind: "transform", label: "Query warehouse for weekly metrics" },
        { kind: "transform", label: "Render HTML summary" },
        { kind: "action", label: "Send email to leadership@" },
      ],
      runs: makeRuns(
        "weekly-kpi-email",
        7 * 24 * 60,
        31_000,
        "....",
        "Sent KPI email",
        "Warehouse query exceeded timeout",
        4 * 24 * 60,
      ),
    },
    {
      id: "inventory-reorder",
      name: "Low inventory reorder request",
      description:
        "Opens a purchase request when a SKU falls below its reorder point.",
      owner: "Supply Chain",
      status: "paused",
      trigger: { type: "manual", detail: "Run on demand" },
      steps: [
        { kind: "trigger", label: "Run on demand" },
        { kind: "transform", label: "Find SKUs below reorder point" },
        { kind: "action", label: "Create purchase request" },
      ],
      runs: [],
    },
  ];
}

// Keep the store on globalThis so it survives dev hot reloads and is shared
// by every route and server action running in this Node process.
const globalForStore = globalThis as unknown as { flowboardWorkflows?: Workflow[] };
const workflows = (globalForStore.flowboardWorkflows ??= seed());

export function getWorkflows(): Workflow[] {
  return workflows;
}

export function getWorkflow(id: string): Workflow | undefined {
  return workflows.find((workflow) => workflow.id === id);
}

export function setWorkflowStatus(id: string, status: WorkflowStatus): Workflow | undefined {
  const workflow = getWorkflow(id);
  if (workflow) workflow.status = status;
  return workflow;
}
