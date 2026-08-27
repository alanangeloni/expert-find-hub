import React, { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { getAllAccountants } from "@/services/accountantsService";
import { AccountantCard } from "@/components/accountants/AccountantCard";
import { Seo } from "@/components/seo/Seo";
import { US_STATES } from "@/constants/states";
import { ACCOUNTANT_SERVICES, ACCOUNTANT_SPECIALTIES, ACCOUNTANT_CREDENTIALS } from "@/constants/accountants";
import { advisorLocation } from "@/utils/advisorDisplay";

interface AccountantFilters {
  query: string;
  specialty: string;
  service: string;
  state: string;
  credential: string;
  verifiedOnly: boolean;
  sort: "experience" | "name" | "firm";
}

const EMPTY: AccountantFilters = {
  query: "",
  specialty: "",
  service: "",
  state: "",
  credential: "",
  verifiedOnly: false,
  sort: "experience",
};

const Accountants = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<AccountantFilters>(EMPTY);
  const [visible, setVisible] = useState(18);

  useEffect(() => {
    const specialty = searchParams.get("specialty") || "";
    const state = searchParams.get("state") || "";
    const query = searchParams.get("q") || "";
    setFilters((prev) => ({
      ...prev,
      specialty: specialty || prev.specialty,
      state: state || prev.state,
      query: query || prev.query,
    }));
  }, [searchParams]);

  const { data: accountants = [], isLoading } = useQuery({
    queryKey: ["all-accountants"],
    queryFn: getAllAccountants,
  });

  const results = useMemo(() => {
    let list = [...accountants];
    const q = filters.query.trim().toLowerCase();

    if (q) {
      list = list.filter((a) =>
        [
          a.name,
          a.firm_name,
          a.position,
          a.bio,
          advisorLocation(a.city, a.state_hq),
          ...(a.services || []),
          ...(a.client_specialties || []),
          ...(a.credentials || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    if (filters.specialty) {
      list = list.filter((a) => (a.client_specialties || []).includes(filters.specialty));
    }
    if (filters.service) {
      list = list.filter((a) => (a.services || []).includes(filters.service));
    }
    if (filters.state) list = list.filter((a) => a.state_hq === filters.state);
    if (filters.credential) {
      list = list.filter((a) => (a.credentials || []).includes(filters.credential));
    }
    if (filters.verifiedOnly) list = list.filter((a) => a.verified);

    list.sort((a, b) => {
      if (filters.sort === "name") return a.name.localeCompare(b.name);
      if (filters.sort === "firm") return (a.firm_name || "").localeCompare(b.firm_name || "");
      return (b.years_of_experience || 0) - (a.years_of_experience || 0);
    });

    return list;
  }, [accountants, filters]);

  useEffect(() => setVisible(18), [filters]);

  const update = (patch: Partial<AccountantFilters>) => setFilters((f) => ({ ...f, ...patch }));

  return (
    <div className="advisor-search page-enter">
      <Seo
        title="Find an Accountant | Financial Professional"
        description="Search vetted accountants and CPAs by specialty, service, location, and credentials."
        canonicalUrl="https://financialprofessional.com/accountants"
      />

      <div className="advisor-search__hero">
        <div className="dcontainer advisor-search__hero-row">
          <div className="advisor-search__hero-copy">
            <span className="keyline" />
            <p className="advisor-search__eyebrow">Accountant directory</p>
            <h1>
              Find your
              <br />
              <em>Accountant</em>
            </h1>
            <p className="advisor-search__sub">
              Search vetted accountants and CPAs by specialty, service, location, and credentials.
            </p>
          </div>
          <div className="advisor-search__hero-cta">
            <Link to="/accountants" className="btn btn--outline btn--lg">
              Browse specialties
            </Link>
          </div>
        </div>
      </div>

      <div className="dcontainer advisor-search__body">
        <div className="accountant-filters">
          <input
            type="search"
            className="accountant-filters__search"
            placeholder="Search by name, firm, or keyword"
            value={filters.query}
            onChange={(e) => update({ query: e.target.value })}
            aria-label="Search accountants"
          />
          <select
            className="accountant-filters__select"
            value={filters.specialty}
            onChange={(e) => update({ specialty: e.target.value })}
            aria-label="Filter by specialty"
          >
            <option value="">All specialties</option>
            {ACCOUNTANT_SPECIALTIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            className="accountant-filters__select"
            value={filters.service}
            onChange={(e) => update({ service: e.target.value })}
            aria-label="Filter by service"
          >
            <option value="">All services</option>
            {ACCOUNTANT_SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            className="accountant-filters__select"
            value={filters.state}
            onChange={(e) => update({ state: e.target.value })}
            aria-label="Filter by state"
          >
            <option value="">All states</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            className="accountant-filters__select"
            value={filters.credential}
            onChange={(e) => update({ credential: e.target.value })}
            aria-label="Filter by credential"
          >
            <option value="">All credentials</option>
            {ACCOUNTANT_CREDENTIALS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="accountant-filters__select"
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value as AccountantFilters["sort"] })}
            aria-label="Sort results"
          >
            <option value="experience">Most experienced</option>
            <option value="name">Name A-Z</option>
            <option value="firm">Firm A-Z</option>
          </select>
          <label className="accountant-filters__check">
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={(e) => update({ verifiedOnly: e.target.checked })}
            />
            Verified only
          </label>
          <span className="accountant-filters__count">{results.length} accountants</span>
        </div>

        {isLoading ? (
          <div className="advisor-search__grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-skeleton" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="advisor-search__empty">
            <div className="advisor-search__empty-icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <h3>No accountants match those filters</h3>
            <p>Try broadening your search or clearing a few filters.</p>
            <button className="advisor-search__empty-btn" onClick={() => setFilters(EMPTY)}>
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <div className="advisor-search__grid">
              {results.slice(0, visible).map((a) => (
                <AccountantCard key={a.id} accountant={a} />
              ))}
            </div>
            {visible < results.length && (
              <div className="flex justify-center mt-10">
                <button className="btn btn--outline btn--lg" onClick={() => setVisible((v) => v + 18)}>
                  Load more accountants
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Accountants;
