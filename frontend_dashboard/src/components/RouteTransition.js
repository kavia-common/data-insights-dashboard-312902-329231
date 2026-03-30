import React, { useEffect, useMemo, useState } from "react";

/**
 * RouteTransition
 * Lightweight, dependency-free page transitions driven by CSS classes.
 * We avoid additional animation libraries and rely on prefers-reduced-motion in CSS.
 */

// PUBLIC_INTERFACE
export function RouteTransition({ routeKey, children }) {
  /** Wraps route content with a simple enter animation keyed by routeKey. */
  const [phase, setPhase] = useState("enter");
  const key = useMemo(() => routeKey ?? "route", [routeKey]);

  useEffect(() => {
    setPhase("enter");
    const t = window.setTimeout(() => setPhase("enter-active"), 10);
    return () => window.clearTimeout(t);
  }, [key]);

  return (
    <div className={`rt rt--${phase}`} key={key}>
      {children}
    </div>
  );
}
