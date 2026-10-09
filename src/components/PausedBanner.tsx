"use client";

import { useState } from "react";

// Stays mounted while the exit animation plays, then unmounts. Without this React would
// remove the banner instantly when the workflow is resumed.
export function PausedBanner({ paused }: { paused: boolean }) {
  const [mounted, setMounted] = useState(paused);
  if (paused && !mounted) setMounted(true);
  if (!mounted) return null;

  return (
    <p
      role="status"
      onAnimationEnd={() => {
        if (!paused) setMounted(false);
      }}
      className={`flex items-start gap-2.5 rounded-xl border border-warning/40 bg-warning-soft px-4 py-3 text-sm leading-relaxed text-warning ${
        paused ? "motion-banner-in" : "motion-banner-out"
      }`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 5v14M16 5v14" />
      </svg>
      This workflow is paused. Its trigger is ignored until you resume it.
    </p>
  );
}
