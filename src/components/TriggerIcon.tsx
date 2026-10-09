import type { TriggerType } from "@/lib/types";

const PATHS: Record<TriggerType, React.ReactNode> = {
  schedule: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  webhook: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  manual: <path d="M8 5v14l11-7L8 5Z" />,
};

export function TriggerIcon({ type, className = "size-4" }: { type: TriggerType; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {PATHS[type]}
    </svg>
  );
}
