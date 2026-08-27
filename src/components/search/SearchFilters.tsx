import React from "react";
import { ALL_SPECIALTY_OPTIONS, FEE_STRUCTURE_OPTIONS } from "@/constants/specialties";

export interface AdvisorFilters {
  query: string;
  specialty: string;
  state: string;
  feeStructure: string;
  fiduciaryOnly: boolean;
  verifiedOnly: boolean;
  noMinimum: boolean;
  sort: "experience" | "name" | "firm";
}

export interface FirmFilters {
  query: string;
  assetClass: string;
  minimum: string;
  sort: "name" | "aum" | "rating";
}

interface AdvisorProps {
  type: "advisors";
  filters: AdvisorFilters;
  onChange: (next: AdvisorFilters) => void;
  resultCount: number;
  states: string[];
}

interface FirmProps {
  type: "firms";
  filters: FirmFilters;
  onChange: (next: FirmFilters) => void;
  resultCount: number;
  assetClasses: string[];
}

type Props = AdvisorProps | FirmProps;

const SearchIcon = () => (
  <svg className="filters__search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export function SearchFilters(props: Props) {
  if (props.type === "advisors") {
    const { filters, onChange, resultCount, states } = props;
    const set = <K extends keyof AdvisorFilters>(key: K, value: AdvisorFilters[K]) =>
      onChange({ ...filters, [key]: value });

    const activeChips: { key: string; label: string; clear: () => void }[] = [];
    if (filters.specialty) activeChips.push({ key: "specialty", label: filters.specialty, clear: () => set("specialty", "") });
    if (filters.state) activeChips.push({ key: "state", label: filters.state, clear: () => set("state", "") });
    if (filters.feeStructure) activeChips.push({ key: "fee", label: filters.feeStructure, clear: () => set("feeStructure", "") });
    if (filters.fiduciaryOnly) activeChips.push({ key: "fid", label: "Fiduciary only", clear: () => set("fiduciaryOnly", false) });
    if (filters.verifiedOnly) activeChips.push({ key: "ver", label: "Verified", clear: () => set("verifiedOnly", false) });
    if (filters.noMinimum) activeChips.push({ key: "min", label: "No minimum", clear: () => set("noMinimum", false) });

    return (
      <div className="filters">
        <div className="filters__search">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search by name, firm, specialty, or city…"
            value={filters.query}
            onChange={(e) => set("query", e.target.value)}
            aria-label="Search advisors"
          />
        </div>

        <div className="filters__row">
          <select value={filters.specialty} onChange={(e) => set("specialty", e.target.value)} aria-label="Specialty">
            <option value="">All specialties</option>
            {ALL_SPECIALTY_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select value={filters.state} onChange={(e) => set("state", e.target.value)} aria-label="State">
            <option value="">All locations</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select value={filters.feeStructure} onChange={(e) => set("feeStructure", e.target.value)} aria-label="Fee structure">
            <option value="">All fee types</option>
            {FEE_STRUCTURE_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <select value={filters.sort} onChange={(e) => set("sort", e.target.value as AdvisorFilters["sort"])} aria-label="Sort by">
            <option value="experience">Most experienced</option>
            <option value="name">Name A–Z</option>
            <option value="firm">Firm A–Z</option>
          </select>
        </div>

        <div className="filters__toggles">
          <label className={`filters__toggle ${filters.fiduciaryOnly ? "is-on" : ""}`}>
            <input type="checkbox" checked={filters.fiduciaryOnly} onChange={(e) => set("fiduciaryOnly", e.target.checked)} />
            <span>Fiduciary only</span>
          </label>
          <label className={`filters__toggle ${filters.verifiedOnly ? "is-on" : ""}`}>
            <input type="checkbox" checked={filters.verifiedOnly} onChange={(e) => set("verifiedOnly", e.target.checked)} />
            <span>Verified</span>
          </label>
          <label className={`filters__toggle ${filters.noMinimum ? "is-on" : ""}`}>
            <input type="checkbox" checked={filters.noMinimum} onChange={(e) => set("noMinimum", e.target.checked)} />
            <span>No asset minimum</span>
          </label>
        </div>

        <div className="filters__footer">
          <p className="filters__count">
            <strong>{resultCount}</strong> advisor{resultCount !== 1 ? "s" : ""} found
          </p>
          {activeChips.length > 0 && (
            <div className="filters__chips">
              {activeChips.map((c) => (
                <button key={c.key} className="filters__chip" onClick={c.clear}>
                  {c.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              ))}
              <button
                className="filters__clear"
                onClick={() =>
                  onChange({
                    ...filters,
                    specialty: "",
                    state: "",
                    feeStructure: "",
                    fiduciaryOnly: false,
                    verifiedOnly: false,
                    noMinimum: false,
                  })
                }
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const { filters, onChange, resultCount, assetClasses } = props;
  const set = <K extends keyof FirmFilters>(key: K, value: FirmFilters[K]) => onChange({ ...filters, [key]: value });

  return (
    <div className="filters">
      <div className="filters__search">
        <SearchIcon />
        <input
          type="search"
          placeholder="Search firms by name or city…"
          value={filters.query}
          onChange={(e) => set("query", e.target.value)}
          aria-label="Search firms"
        />
      </div>

      <div className="filters__row">
        <select value={filters.assetClass} onChange={(e) => set("assetClass", e.target.value)} aria-label="Asset class">
          <option value="">All asset classes</option>
          {assetClasses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select value={filters.minimum} onChange={(e) => set("minimum", e.target.value)} aria-label="Minimum investment">
          <option value="">All minimums</option>
          <option value="0">No minimum</option>
          <option value="250000">Under $250k</option>
          <option value="1000000">Under $1M</option>
          <option value="1000001">$1M+</option>
        </select>

        <select value={filters.sort} onChange={(e) => set("sort", e.target.value as FirmFilters["sort"])} aria-label="Sort by">
          <option value="name">Name A–Z</option>
          <option value="aum">Largest AUM</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      <div className="filters__footer">
        <p className="filters__count">
          <strong>{resultCount}</strong> firm{resultCount !== 1 ? "s" : ""} found
        </p>
      </div>
    </div>
  );
}

export default SearchFilters;
