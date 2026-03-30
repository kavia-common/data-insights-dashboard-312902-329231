import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/feature-card.css";

// PUBLIC_INTERFACE
export function FeatureCard({ icon, title, description }) {
  /** Simple feature card used by the landing page. */
  return (
    <article className="featureCard">
      <div className="featureCard__icon" aria-hidden="true">
        <FontAwesomeIcon icon={icon} />
      </div>
      <h3 className="featureCard__title">{title}</h3>
      <p className="featureCard__desc">{description}</p>
    </article>
  );
}
