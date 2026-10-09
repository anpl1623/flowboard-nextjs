"use client";

import { useState } from "react";

// Rolls from the old value to the new one when the prop changes. Uses transform and opacity only,
// and does nothing on first render so the page entrance is not doubled up.
export function AnimatedNumber({ value }: { value: number }) {
  const [state, setState] = useState<{ value: number; prev: number | null }>({ value, prev: null });
  // Adjusting state while rendering is React's documented way to react to a prop change.
  if (state.value !== value) {
    setState({ value, prev: state.value });
  }

  return (
    <span className="relative inline-block">
      {state.prev !== null && (
        <span
          key={`out-${state.prev}`}
          aria-hidden="true"
          onAnimationEnd={() => setState({ value: state.value, prev: null })}
          className="motion-roll-out absolute left-0 top-0"
        >
          {state.prev}
        </span>
      )}
      <span key={value} className={state.prev !== null ? "motion-roll-in inline-block" : "inline-block"}>
        {value}
      </span>
    </span>
  );
}
