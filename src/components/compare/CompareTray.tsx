import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdvisorsByIds } from "@/services/advisorsService";
import { useCompareAdvisors, MAX_COMPARE } from "@/contexts/CompareContext";
import { getInitials, hueFor } from "@/utils/advisorDisplay";

export const CompareTray = () => {
  const { compareIds, removeCompare, clearCompare, setOpen } = useCompareAdvisors();

  const { data: advisors = [] } = useQuery({
    queryKey: ["compare-advisors", compareIds],
    queryFn: () => getAdvisorsByIds(compareIds),
    enabled: compareIds.length > 0,
  });

  if (compareIds.length === 0) return null;

  return (
    <div className="compare-tray" role="region" aria-label="Advisor comparison tray">
      <div className="compare-tray__inner">
        <div className="compare-tray__label">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 20V10M12 20V4M6 20v-6" />
          </svg>
          <span>
            Compare <strong>{compareIds.length}</strong> of {MAX_COMPARE}
          </span>
        </div>

        <div className="compare-tray__slots">
          {Array.from({ length: MAX_COMPARE }).map((_, i) => {
            const id = compareIds[i];
            const advisor = advisors.find((a) => a.id === id);
            if (!id) {
              return (
                <div key={`empty-${i}`} className="compare-tray__slot compare-tray__slot--empty">
                  <span>{i + 1}</span>
                </div>
              );
            }
            const name = advisor?.name || "Advisor";
            return (
              <div key={id} className="compare-tray__slot">
                {advisor?.headshot_url ? (
                  <img src={advisor.headshot_url} alt={name} className="avatar avatar--sm object-cover" />
                ) : (
                  <div className="avatar avatar--sm" style={{ background: `hsl(${hueFor(name)} 42% 42%)` }} aria-hidden="true">
                    <span>{getInitials(name)}</span>
                  </div>
                )}
                <span className="compare-tray__name">{name}</span>
                <button
                  type="button"
                  className="compare-tray__remove"
                  aria-label={`Remove ${name}`}
                  onClick={() => removeCompare(id)}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        <div className="compare-tray__actions">
          <button type="button" className="compare-tray__clear" onClick={clearCompare}>
            Clear
          </button>
          <button
            type="button"
            className="btn btn--green btn--sm"
            onClick={() => setOpen(true)}
            disabled={compareIds.length < 2}
          >
            Compare {compareIds.length >= 2 ? `(${compareIds.length})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareTray;
