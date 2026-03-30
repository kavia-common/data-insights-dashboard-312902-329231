import React, { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faAt,
  faCircleNotch,
  faKey,
  faLock,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import "../styles/auth-panel.css";

function pickRedirectTarget(location) {
  const from = location?.state?.from;
  if (typeof from === "string" && from.startsWith("/app")) return from;
  return "/app";
}

// PUBLIC_INTERFACE
export function AuthPanel({ initialMode = "login" }) {
  /**
   * Combined login/signup UX.
   *
   * Contract:
   * - initialMode: "login" | "signup"
   * - Uses AuthContext.login/register
   * - Redirects to /app on success (or to location.state.from if set)
   */
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const scrollRef = useRef(null);
  const [mode, setMode] = useState(initialMode); // "login" | "signup"

  // Inputs
  const [identifier, setIdentifier] = useState(""); // username/email
  const [password, setPassword] = useState("");

  // Signup-only inputs
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [status, setStatus] = useState({ type: "idle", message: "" }); // idle|loading|error|success
  const [busy, setBusy] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const modeMeta = useMemo(() => {
    if (mode === "signup") {
      return {
        title: "Create your account",
        subtitle: "Join quickly—then continue to the workflow dashboard.",
        actionLabel: "Create account",
        actionIcon: faUserPlus
      };
    }
    return {
      title: "Welcome back",
      subtitle: "Sign in to continue to your workspace.",
      actionLabel: "Sign in",
      actionIcon: faArrowRight
    };
  }, [mode]);

  const validate = () => {
    const errors = {};
    const idTrimmed = identifier.trim();

    if (!idTrimmed) errors.identifier = "Email or username is required.";
    if (!password) errors.password = "Password is required.";
    if (password && password.length < 8) errors.password = "Use at least 8 characters.";

    if (mode === "signup") {
      if (!confirmPassword) errors.confirmPassword = "Confirm your password.";
      if (password && confirmPassword && password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
      }
    }

    return errors;
  };

  const setModeAndScroll = (nextMode) => {
    setMode(nextMode);
    window.setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 0);
    setStatus({ type: "idle", message: "" });
    setFieldErrors({});
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStatus({ type: "error", message: "Please fix the highlighted fields." });
      return;
    }

    setBusy(true);
    setStatus({ type: "loading", message: "Working…" });

    try {
      const username = identifier.trim();

      if (mode === "login") {
        await login({ username, password });
      } else {
        // Keep roles defaulted to publisher for a streamlined UX.
        // Server-side authorization/SoD still applies.
        await register({ username, password, roles: ["publisher"] });
        // After register, sign the user in for the “single-flow” experience.
        await login({ username, password });
      }

      setStatus({ type: "success", message: "Success. Redirecting to dashboard…" });
      const to = pickRedirectTarget(location);
      window.setTimeout(() => navigate(to, { replace: true }), 450);
    } catch (err) {
      setStatus({
        type: "error",
        message: err?.message ? String(err.message) : "Unable to authenticate. Please try again."
      });
    } finally {
      setBusy(false);
    }
  };

  const StatusBanner = () => {
    if (status.type === "idle") return null;
    const isError = status.type === "error";
    const isSuccess = status.type === "success";

    return (
      <div
        className={`statusBanner ${isError ? "statusBanner--error" : ""} ${
          isSuccess ? "statusBanner--success" : ""
        }`}
        role={isError ? "alert" : "status"}
      >
        {status.type === "loading" && (
          <span className="spin" aria-hidden="true">
            <FontAwesomeIcon icon={faCircleNotch} />
          </span>
        )}
        <span>{status.message}</span>
      </div>
    );
  };

  return (
    <div className="authPanel" aria-label="Login and signup">
      <div className="authPanel__top">
        <div className="segmented" role="tablist" aria-label="Auth mode">
          <button
            type="button"
            className={`segmented__btn ${mode === "login" ? "isActive" : ""}`}
            onClick={() => setModeAndScroll("login")}
            role="tab"
            aria-selected={mode === "login"}
          >
            Login
          </button>
          <button
            type="button"
            className={`segmented__btn ${mode === "signup" ? "isActive" : ""}`}
            onClick={() => setModeAndScroll("signup")}
            role="tab"
            aria-selected={mode === "signup"}
          >
            Sign up
          </button>
        </div>

        <div className="authPanel__titles">
          <h3 className="authPanel__title">{modeMeta.title}</h3>
          <p className="authPanel__subtitle">{modeMeta.subtitle}</p>
        </div>
      </div>

      {/* Scrollable form area (required by request) */}
      <div className="authPanel__scroll" ref={scrollRef}>
        <form className="authForm" onSubmit={onSubmit} aria-label={mode === "login" ? "Login form" : "Signup form"}>
          <StatusBanner />

          <div className="field">
            <label htmlFor="identifier">Email or username</label>
            <div className={`inputWrap ${fieldErrors.identifier ? "inputWrap--error" : ""}`}>
              <span className="inputIcon" aria-hidden="true">
                <FontAwesomeIcon icon={faAt} />
              </span>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@company.com"
              />
            </div>
            {fieldErrors.identifier && (
              <div className="fieldError" role="alert">
                {fieldErrors.identifier}
              </div>
            )}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className={`inputWrap ${fieldErrors.password ? "inputWrap--error" : ""}`}>
              <span className="inputIcon" aria-hidden="true">
                <FontAwesomeIcon icon={mode === "login" ? faKey : faLock} />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {fieldErrors.password && (
              <div className="fieldError" role="alert">
                {fieldErrors.password}
              </div>
            )}
          </div>

          {mode === "signup" && (
            <div className="field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className={`inputWrap ${fieldErrors.confirmPassword ? "inputWrap--error" : ""}`}>
                <span className="inputIcon" aria-hidden="true">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              {fieldErrors.confirmPassword && (
                <div className="fieldError" role="alert">
                  {fieldErrors.confirmPassword}
                </div>
              )}
            </div>
          )}

          <div className="authActions">
            <button className="btn btn--primary btn--block" type="submit" disabled={busy}>
              {busy ? (
                <>
                  <span className="spin" aria-hidden="true">
                    <FontAwesomeIcon icon={faCircleNotch} />
                  </span>
                  Please wait
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={modeMeta.actionIcon} className="btnIcon" />
                  {modeMeta.actionLabel}
                </>
              )}
            </button>

            <button
              type="button"
              className="btn btn--ghost btn--block"
              onClick={() => navigate("/app")}
              disabled={busy}
            >
              Continue as demo user
            </button>
          </div>

          <div className="authFinePrint">By continuing, you agree to your organization’s policies. (UI placeholder)</div>
        </form>
      </div>
    </div>
  );
}
