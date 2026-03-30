import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export function RequireAuth({ children }) {
  /** Redirects to /login if user is not authenticated. */
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to the public landing page; auth UI is integrated into the landing flow.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
