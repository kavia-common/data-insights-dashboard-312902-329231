import React, { useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChartLine,
  faCircleCheck,
  faShieldHalved,
  faWandMagicSparkles
} from "@fortawesome/free-solid-svg-icons";
import { AuthPanel } from "../components/AuthPanel";
import { FeatureCard } from "../components/FeatureCard";
import "../styles/landing.css";

// PUBLIC_INTERFACE
export function LandingPage({ initialAuthMode = "login", autoScrollToAuth = false }) {
  /**
   * Public landing page for the application.
   *
   * Contract:
   * - initialAuthMode: "login" | "signup" (defaults to login)
   * - autoScrollToAuth: if true, scrolls to the auth section on mount (best-effort)
   */
  const authScrollRef = useRef(null);
  const navigate = useNavigate();

  const features = useMemo(
    () => [
      {
        icon: faShieldHalved,
        title: "Validation-ready workflows",
        description: "A clean foundation for upload, validation runs, and approval tracking."
      },
      {
        icon: faChartLine,
        title: "Insightful dashboards",
        description: "Professional UI patterns for analytics, reports, and dataset status."
      },
      {
        icon: faCircleCheck,
        title: "Audit-friendly UX",
        description: "Designed for clarity: fewer surprises, clearer next steps, safer actions."
      }
    ],
    []
  );

  const scrollToAuth = () => {
    authScrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  React.useEffect(() => {
    if (!autoScrollToAuth) return;
    const t = window.setTimeout(() => scrollToAuth(), 80);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoScrollToAuth]);

  return (
    <div className="landing">
      <header className="landing__header">
        <Link className="landing__brand" to="/" aria-label="Data Insights Dashboard Home">
          <span className="brandMark" aria-hidden="true">
            <FontAwesomeIcon icon={faWandMagicSparkles} />
          </span>
          <span className="brandText">
            <strong>Data</strong> Insights
          </span>
        </Link>

        <nav className="landing__nav" aria-label="Primary">
          <a className="navLink" href="#features">
            Features
          </a>
          <a className="navLink" href="#auth">
            Login / Sign up
          </a>
          <button className="btn btn--primary btn--sm" onClick={scrollToAuth} type="button">
            Get started <FontAwesomeIcon icon={faArrowRight} className="btnIcon" />
          </button>
        </nav>
      </header>

      <main className="landing__main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__bg" aria-hidden="true">
            <div className="orb orb--a" />
            <div className="orb orb--b" />
            <div className="gridGlow" />
          </div>

          <div className="container hero__content">
            <div className="hero__copy">
              <p className="eyebrow">
                <FontAwesomeIcon icon={faShieldHalved} className="eyebrowIcon" />
                A professional UI for data products
              </p>
              <h1 id="hero-title" className="hero__title">
                Validate, approve, and explore datasets with a modern dashboard.
              </h1>
              <p className="hero__subtitle">
                A polished landing experience plus a clean workflow portal—built for clarity, speed, and trust.
              </p>

              <div className="hero__cta">
                <button className="btn btn--primary" onClick={scrollToAuth} type="button">
                  Open auth panel <FontAwesomeIcon icon={faArrowRight} className="btnIcon" />
                </button>
                <a className="btn btn--ghost" href="#features">
                  See features
                </a>
                <button className="btn btn--ghost" type="button" onClick={() => navigate("/app")}>
                  Go to dashboard
                </button>
              </div>

              <div className="hero__stats" aria-label="Highlights">
                <div className="statCard">
                  <div className="statTop">Fast start</div>
                  <div className="statValue">Landing + Auth</div>
                  <div className="statHint">Single page, scrollable</div>
                </div>
                <div className="statCard">
                  <div className="statTop">Clean motion</div>
                  <div className="statValue">Subtle transitions</div>
                  <div className="statHint">Reduced-motion friendly</div>
                </div>
              </div>
            </div>

            <div className="hero__panel" id="features">
              <h2 className="sectionTitle">Designed for real workflows</h2>
              <div className="featureGrid">
                {features.map((f) => (
                  <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description} />
                ))}
              </div>

              <div className="panelFoot">
                <a className="linkPill" href="#auth">
                  Jump to login / sign up
                  <span aria-hidden="true" className="linkPill__icon">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Scroll target */}
        <section className="authSection" id="auth" ref={authScrollRef} aria-label="Authentication">
          <div className="container authSection__inner">
            <div className="authSection__copy">
              <h2 className="authTitle">Continue to your dashboard</h2>
              <p className="authSubtitle">
                Login and sign up live in one scrollable panel so users can switch without leaving the page.
              </p>

              <div className="calloutCard">
                <div className="calloutIcon" aria-hidden="true">
                  <FontAwesomeIcon icon={faCircleCheck} />
                </div>
                <div>
                  <div className="calloutTitle">Pro tip</div>
                  <div className="calloutText">
                    After successful auth, you’ll be routed to the portal at <code>/app</code>.
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <Link className="btn btn--ghost" to="/app">
                  Continue without signing in
                </Link>
              </div>
            </div>

            <AuthPanel initialMode={initialAuthMode} />
          </div>
        </section>

        <footer className="landing__footer">
          <div className="container footerInner">
            <div className="footerBrand">
              <span className="brandMark brandMark--sm" aria-hidden="true">
                <FontAwesomeIcon icon={faWandMagicSparkles} />
              </span>
              <span className="footerText">Data Insights Dashboard</span>
            </div>
            <div className="footerMeta">Modern motion, Font Awesome icons, and a clean light theme.</div>
          </div>
        </footer>
      </main>
    </div>
  );
}
