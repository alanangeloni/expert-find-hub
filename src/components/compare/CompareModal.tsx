import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAdvisorsByIds } from "@/services/advisorsService";
import { useCompareAdvisors, MAX_COMPARE } from "@/contexts/CompareContext";
import { getInitials, hueFor, extractAcronym, formatMinAssets, advisorLocation } from "@/utils/advisorDisplay";

export const CompareModal = () => {
  const { compareIds, open, setOpen, removeCompare, clearCompare } = useCompareAdvisors();

  const { data: advisors = [] } = useQuery({
    queryKey: ["compare-advisors", compareIds],
    queryFn: () => getAdvisorsByIds(compareIds),
    enabled: compareIds.length > 0,
  });

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  if (!open || advisors.length === 0) return null;

  const close = () => setOpen(false);

  const rows: { label: string; render: (a: (typeof advisors)[number]) => React.ReactNode }[] = [
    {
      label: "Fee structure",
      render: (a) =>
        (a.compensation || []).length ? (
          <div className="compare-modal__pill-row">
            {(a.compensation || []).map((c) => (
              <span key={c} className="compare-modal__pill">
                {c}
              </span>
            ))}
          </div>
        ) : (
          <span className="compare-modal__blurb">Not listed</span>
        ),
    },
    { label: "Minimum assets", render: (a) => formatMinAssets(a.minimum) },
    {
      label: "Certifications",
      render: (a) => (
        <div className="compare-modal__pill-row">
          {(a.professional_designations || []).map((d) => (
            <span key={d} className="compare-modal__pill">
              {extractAcronym(d)}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: "Experience",
      render: (a) => (a.years_of_experience ? `${a.years_of_experience} years` : "—"),
    },
    { label: "Location", render: (a) => advisorLocation(a.city, a.state_hq) || "—" },
    {
      label: "Specialties",
      render: (a) => (
        <div className="compare-modal__pill-row">
          {(a.advisor_services || []).map((s) => (
            <span key={s} className="compare-modal__pill compare-modal__pill--soft">
              {s}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: "Standard",
      render: (a) =>
        a.fiduciary ? <span className="badge badge--green badge--md">Fiduciary</span> : <span className="badge badge--neutral badge--md">Not listed</span>,
    },
    {
      label: "Clients served",
      render: (a) => (
        <div className="compare-modal__pill-row">
          {(a.client_type || []).map((c) => (
            <span key={c} className="compare-modal__pill compare-modal__pill--soft">
              {c}
            </span>
          ))}
        </div>
      ),
    },
    { label: "Education", render: (a) => a.primary_education || "—" },
    {
      label: "States registered",
      render: (a) => (a.states_registered_in || []).join(", ") || "—",
    },
  ];

  return (
    <div className="compare-modal" role="dialog" aria-modal="true" aria-labelledby="compare-modal-title">
      <button type="button" className="compare-modal__backdrop" aria-label="Close comparison" onClick={close} />

      <div className="compare-modal__panel">
        <header className="compare-modal__header">
          <div className="compare-modal__title-row">
            <span className="compare-modal__icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 20V10M12 20V4M6 20v-6" />
              </svg>
            </span>
            <h2 id="compare-modal-title">
              Side-by-Side Advisor Comparison
              <span className="compare-modal__count">
                ({advisors.length}/{MAX_COMPARE})
              </span>
            </h2>
          </div>
          <div className="compare-modal__header-actions">
            <button type="button" className="compare-modal__text-btn" onClick={clearCompare}>
              Clear All
            </button>
            <button type="button" className="compare-modal__close" aria-label="Close" onClick={close}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>

        <div className="compare-modal__body">
          <div className="compare-modal__grid" style={{ "--compare-cols": advisors.length } as React.CSSProperties}>
            <div className="compare-modal__row compare-modal__row--profile">
              <div className="compare-modal__label-cell">Advisor profile</div>
              {advisors.map((a) => (
                <div key={a.id} className="compare-modal__cell compare-modal__profile">
                  <button
                    type="button"
                    className="compare-modal__remove-card"
                    aria-label={`Remove ${a.name}`}
                    onClick={() => removeCompare(a.id)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="compare-modal__avatar-wrap">
                    {a.headshot_url ? (
                      <img src={a.headshot_url} alt={a.name} className="avatar avatar--lg object-cover" />
                    ) : (
                      <div className="avatar avatar--lg" style={{ background: `hsl(${hueFor(a.name)} 42% 42%)` }} aria-hidden="true">
                        <span>{getInitials(a.name)}</span>
                      </div>
                    )}
                  </div>
                  <h3>{a.name}</h3>
                  <p className="compare-modal__certs-inline">
                    {(a.professional_designations || []).slice(0, 3).map(extractAcronym).join(" · ")}
                  </p>
                  {a.firm_name && <p className="compare-modal__firm">{a.firm_name}</p>}
                  <div className="compare-modal__profile-actions">
                    <Link to={`/advisors/${a.slug}`} className="btn btn--outline btn--sm btn--full" onClick={close}>
                      View full profile
                    </Link>
                    <Link to={`/advisors/${a.slug}#contact`} className="btn btn--green btn--sm btn--full" onClick={close}>
                      Request intro
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {rows.map((row, idx) => (
              <div
                key={row.label}
                className={`compare-modal__row ${idx === rows.length - 1 ? "compare-modal__row--last" : ""}`}
              >
                <div className="compare-modal__label-cell">{row.label}</div>
                {advisors.map((a) => (
                  <div key={a.id} className="compare-modal__cell">
                    {row.render(a)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
