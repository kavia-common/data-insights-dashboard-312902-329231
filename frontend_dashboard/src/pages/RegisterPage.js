import React from "react";
import { LandingPage } from "./LandingPage";

// PUBLIC_INTERFACE
export function RegisterPage() {
  /** Compatibility route: keep /register but render the redesigned landing auth panel in signup mode. */
  return <LandingPage initialAuthMode="signup" autoScrollToAuth />;
}
