"use client";

import { useEffect } from "react";

// Override at MODULE SCOPE — runs before first render, before the warning fires
if (typeof window !== "undefined") {
  const _origError = console.error.bind(console);
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return;
    }
    _origError(...args);
  };
}

/**
 * Rendered inside AppProviders to permanently suppress the next-themes
 * "script tag" React 19 dev warning (known incompatibility: next-themes@0.4.x + React 19).
 */
export function SuppressNextThemesWarning() {
  // No-op — real suppression happens at module scope above
  return null;
}
