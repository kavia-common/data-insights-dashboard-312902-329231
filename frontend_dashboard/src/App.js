import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { RequireAuth } from "./components/RequireAuth";
import { Layout } from "./components/Layout";
import { RouteTransition } from "./components/RouteTransition";

import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { SubmissionsPage } from "./pages/SubmissionsPage";
import { ValidationPage } from "./pages/ValidationPage";
import { ApprovalsPage } from "./pages/ApprovalsPage";
import { PublishPage } from "./pages/PublishPage";
import { AuditPage } from "./pages/AuditPage";
import { EvidencePage } from "./pages/EvidencePage";
import { SettingsPage } from "./pages/SettingsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function AppRoutes() {
  const location = useLocation();

  return (
    <RouteTransition routeKey={location.pathname}>
      <Routes location={location}>
        {/* Public landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Compatibility routes: keep these paths but show the same landing+auth UX */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated portal (existing pages kept) */}
        <Route
          path="/app"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="submissions" element={<SubmissionsPage />} />
          <Route path="validation" element={<ValidationPage />} />
          <Route path="approvals" element={<ApprovalsPage />} />
          <Route path="publish" element={<PublishPage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="evidence" element={<EvidencePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </RouteTransition>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** App entry: routing + auth provider + landing + portal routes. */
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
