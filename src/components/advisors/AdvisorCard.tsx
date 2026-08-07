import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Advisor } from "@/services/advisorsService";

interface AdvisorCardProps {
  advisor: Advisor;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const hueFor = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
};

const extractAcronym = (designation: string) => {
  const match = designation.match(/\(([^)]+)\)/);
  if (match) return match[1];
  const words = designation.trim().split(/\s+/);
  if (words.length === 1) return designation;
  return words.map((w) => w[0]).join("").toUpperCase();
};

const formatMin = (min?: string) => {
  if (!min) return "No minimum";
  const raw = min.trim();
  const numeric = Number(raw.replace(/[$,]/g, ""));
  if (!Number.isNaN(numeric) && numeric > 0 && numeric < 1000) return `$${numeric.toLocaleString()} min`;
  return raw.startsWith("$") ? `${raw} min` : `$${raw} min`;
};


export const AdvisorCard = ({ advisor }: AdvisorCardProps) => {
  const navigate = useNavigate();
  const to = `/advisors/${advisor.slug}`;
  const location = [advisor.city, advisor.state_hq].filter(Boolean).join(", ");
  const designations = (advisor.professional_designations || []).slice(0, 3);
  const services = (advisor.advisor_services || []).slice(0, 3);
  const extraServices = (advisor.advisor_services || []).length - services.length;
  const feeStructure = (advisor.compensation || [])[0];

  return (
    <article
      className="advisor-card"
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
      <div className="advisor-card__top">
        {advisor.headshot_url ? (
          <img
            src={advisor.headshot_url}
            alt={advisor.name}
            className="avatar avatar--lg object-cover"
          />
        ) : (
          <div
            className="avatar avatar--lg"
            style={{ background: `hsl(${hueFor(advisor.name)} 42% 42%)` }}
            aria-hidden="true"
          >
            <span>{getInitials(advisor.name)}</span>
          </div>
        )}
        <div className="advisor-card__identity">
          <div className="advisor-card__name-row">
            <h3>{advisor.name}</h3>
          </div>
          {advisor.position && <p className="advisor-card__title">{advisor.position}</p>}
          {advisor.firm_name && <span className="advisor-card__firm">{advisor.firm_name}</span>}
        </div>
      </div>

      {advisor.personal_bio && <p className="advisor-card__bio">{advisor.personal_bio}</p>}

      <div className="advisor-card__meta">
        {location && (
          <span className="advisor-card__location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {location}
          </span>
        )}
      </div>

      <div className="advisor-card__tags">
        {advisor.fiduciary && <span className="badge badge--green badge--sm">Fiduciary</span>}
        {designations.map((d) => (
          <span key={d} className="badge badge--blue badge--sm">
            {d}
          </span>
        ))}
        {feeStructure && <span className="badge badge--neutral badge--sm">{feeStructure}</span>}
        <span className="badge badge--neutral badge--sm">{formatMin(advisor.minimum)}</span>
      </div>

      {services.length > 0 && (
        <div className="advisor-card__specialties">
          {services.map((s) => (
            <span key={s} className="advisor-card__specialty">
              {s}
            </span>
          ))}
          {extraServices > 0 && (
            <span className="advisor-card__specialty advisor-card__specialty--more">
              +{extraServices}
            </span>
          )}
        </div>
      )}

      <div className="advisor-card__footer">
        <span className="advisor-card__exp">
          {advisor.years_of_experience ? `${advisor.years_of_experience} years experience` : "Experienced advisor"}
        </span>
        <div className="advisor-card__footer-right">
          <Link to={to} className="advisor-card__cta" onClick={(e) => e.stopPropagation()}>
            View profile
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default AdvisorCard;
