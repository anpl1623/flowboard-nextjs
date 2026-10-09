import type { CSSProperties } from "react";

// Sets the --i custom property that the motion-* utilities in globals.css turn into a stagger delay.
export function stagger(index: number): CSSProperties {
  return { "--i": index } as CSSProperties;
}
