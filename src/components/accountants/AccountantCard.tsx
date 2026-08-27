import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Accountant } from "@/services/accountantsService";
import { getInitials, hueFor, advisorLocation } from "@/utils/advisorDisplay";

interface AccountantCardProps {
  accountant: Accountant;
}

export const AccountantCard = ({ accountant }: AccountantCardProps) => {
  const navigate = useNavigate();
  const to = `/accountants/${accountant.slug}`;
  const location = advisorLocation(accountant.city, accountant.state_hq);
  const credentials = (accountant.credentials || []).slice(0, 3);
  const specialties = (accountant.client_specialties || []).slice(0, 3);
  const extraSpecialties = (accountant.client_specialties || []).length - specialties.length;

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
        {accountant.headshot_url ? (
          <img src={accountant.headshot_url} alt={accountant.name} className="avatar avatar--lg object-cover" />
        ) : (
          <div className="avatar avatar--lg" style={{ background: `hsl(${hueFor(accountant.name)} 42% 42%)` }} aria-hidden="true">
            <span>{getInitials(accountant.name)}</span>
          </div>
        )}
        <div className="advisor-card__identity">
          <div className="advisor-card__name-row">
            <h3>{accountant.name}</h3>
          </div>
          {accountant.position && <p className="advisor-card__title">{accountant.position}</p>}
          {accountant.firm_name && <span className="advisor-card__firm">{accountant.firm_name}</span>}
        </div>
      </div>

      {accountant.bio && <p className="advisor-card__bio">{accountant.bio}</p>}

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
        {accountant.verified && <span className="badge badge--green badge--sm">Verified</span>}
        {credentials.map((c) => (
          <span key={c} className="badge badge--blue badge--sm">
            {c}
          </span>
        ))}
        {accountant.minimum_fee && <span className="badge badge--neutral badge--sm">{accountant.minimum_fee}</span>}
      </div>

      {specialties.length > 0 && (
        <div className="advisor-card__specialties">
          {specialties.map((s) => (
            <span key={s} className="advisor-card__specialty">
              {s}
            </span>
          ))}
          {extraSpecialties > 0 && <span className="advisor-card__specialty advisor-card__specialty--more">+{extraSpecialties}</span>}
        </div>
      )}

      <div className="advisor-card__footer">
        <span className="advisor-card__exp">
          {accountant.years_of_experience ? `${accountant.years_of_experience} years experience` : "Experienced accountant"}
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

export default AccountantCard;
