import React from "react";
import { LandingPage } from "./LandingPage";

// PUBLIC_INTERFACE
export function LoginPage() {
  /** Compatibility route: keep /login but render the redesigned landing auth panel in login mode. */
  return <LandingPage initialAuthMode="login" autoScrollToAuth />;
}
