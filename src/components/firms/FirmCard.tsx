import React from "react";
import { useNavigate } from "react-router-dom";
import type { InvestmentFirm } from "@/services/investmentFirmsService";

interface FirmCardProps {
  firm: InvestmentFirm;
}

const formatAUM = (aum?: string) => (aum ? (aum.startsWith("$") ? aum : `$${aum}`) : "—");

const formatMinimum = (min?: number | null) => {
  if (min === null || min === undefined) return "No minimum";
  if (min === 0) return "No minimum";
  return `$${min.toLocaleString()} min`;
};

const accentFor = (name: string) => {
  const tones = ["green", "blue", "orange"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
  return tones[h % tones.length];
};

export const FirmCard = ({ firm }: FirmCardProps) => {
  const navigate = useNavigate();
  const to = `/firms/${firm.slug}`;
  const assetClasses = firm.asset_classes || firm.asset_class || [];

  return (
    <article
      className={`firm-card firm-card--${accentFor(firm.name)}`}
      role="link"
      tabIndex={0}
      onClick={() => navigate(to)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(to);
        }
      }}
    >
      <div className="firm-card__accent" aria-hidden="true" />

      <div className="firm-card__header">
        {firm.logo_url ? (
          <img src={firm.logo_url} alt={firm.name} className="firm-card__icon object-contain bg-white" />
        ) : (
          <div className="firm-card__icon" aria-hidden="true">
            {firm.name.charAt(0)}
          </div>
        )}
        <div className="firm-card__heading">
          <h3>{firm.name}</h3>
          {firm.headquarters && <p className="firm-card__tagline">{firm.headquarters}</p>}
        </div>
      </div>

      {firm.description && <p className="firm-card__desc">{firm.description}</p>}

      <div className="firm-card__stats">
        <div className="firm-card__stat">
          <span className="firm-card__stat-value">{formatAUM(firm.aum)}</span>
          <span className="firm-card__stat-label">AUM</span>
        </div>
        <div className="firm-card__stat">
          <span className="firm-card__stat-value">{formatMinimum(firm.minimum_investment)}</span>
          <span className="firm-card__stat-label">Minimum</span>
        </div>
        <div className="firm-card__stat">
          <span className="firm-card__stat-value">
            {firm.established ? new Date(firm.established).getFullYear() : "—"}
          </span>
          <span className="firm-card__stat-label">Founded</span>
        </div>
      </div>

      <div className="firm-card__tags">
        {firm.verified && <span className="badge badge--green">Verified</span>}
        {assetClasses.slice(0, 3).map((s) => (
          <span key={s} className="badge badge--neutral">
            {s}
          </span>
        ))}
      </div>

      <div className="firm-card__footer">
        <span className="firm-card__cta">
          View firm
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </article>
  );
};

export default FirmCard;
