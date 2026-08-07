import React, { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { getAllAdvisors } from "@/services/advisorsService";
import { AdvisorCard } from "@/components/advisors/AdvisorCard";
import { SearchFilters, type AdvisorFilters } from "@/components/search/SearchFilters";
import { valuesForSpecialty, SPECIALTY_GROUPS } from "@/constants/specialties";
import { NewsletterSignup } from "@/components/common/NewsletterSignup";
import { Seo } from "@/components/seo/Seo";
import { advisorLocation, formatMinAssets } from "@/utils/advisorDisplay";

const EMPTY: AdvisorFilters = {
  query: "",
  specialty: "",
  state: "",
  feeStructure: "",
  fiduciaryOnly: false,
  verifiedOnly: false,
  noMinimum: false,
  sort: "experience",
};

const labelForRawService = (raw: string) => {
  const group = SPECIALTY_GROUPS.find((g) => g.values.includes(raw));
  return group ? group.label : raw;
};

const AdvisorSearch = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<AdvisorFilters>(EMPTY);
  const [visible, setVisible] = useState(18);

  useEffect(() => {
    const specialty = searchParams.get("specialty") || searchParams.get("specialties") || "";
    const state = searchParams.get("state") || "";
    const query = searchParams.get("q") || "";
    setFilters((prev) => ({
      ...prev,
      specialty: specialty ? labelForRawService(specialty) : prev.specialty,
      state: state || prev.state,
      query: query || prev.query,
    }));
  }, [searchParams]);

  const { data: advisors = [], isLoading } = useQuery({
    queryKey: ["all-advisors"],
    queryFn: getAllAdvisors,
  });

  const states = useMemo(
    () => Array.from(new Set(advisors.map((a) => a.state_hq).filter(Boolean))).sort() as string[],
    [advisors]
  );

  const results = useMemo(() => {
    let list = [...advisors];
    const q = filters.query.trim().toLowerCase();

    if (q) {
      list = list.filter((a) =>
        [
          a.name,
          a.firm_name,
          a.position,
          a.personal_bio,
          advisorLocation(a.city, a.state_hq),
          ...(a.advisor_services || []),
          ...(a.professional_designations || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    if (filters.specialty) {
      const values = valuesForSpecialty(filters.specialty);
      list = list.filter((a) => (a.advisor_services || []).some((s) => values.includes(s)));
    }
    if (filters.state) list = list.filter((a) => a.state_hq === filters.state);
    if (filters.feeStructure) list = list.filter((a) => (a.compensation || []).includes(filters.feeStructure));
    if (filters.fiduciaryOnly) list = list.filter((a) => a.fiduciary);
    if (filters.verifiedOnly) list = list.filter((a) => a.verified);
    if (filters.noMinimum) list = list.filter((a) => formatMinAssets(a.minimum) === "No minimum");

    list.sort((a, b) => {
      if (filters.sort === "name") return a.name.localeCompare(b.name);
      if (filters.sort === "firm") return (a.firm_name || "").localeCompare(b.firm_name || "");
      return (b.years_of_experience || 0) - (a.years_of_experience || 0);
    });

    return list;
  }, [advisors, filters]);

  useEffect(() => setVisible(18), [filters]);

  return (
    <div className="advisor-search page-enter">
      <Seo
        title="Find a Financial Advisor | Financial Professional"
        description="Search vetted fiduciary financial advisors by specialty, location, and fees. Compare up to 3 advisors side by side — free."
        canonicalUrl="https://financial-professional.lovable.app/advisors"
      />

      <div className="advisor-search__hero">
        <div className="dcontainer advisor-search__hero-row">
          <div>
            <p className="advisor-search__eyebrow">Advisor directory</p>
            <h1>Find your financial advisor</h1>
            <p className="advisor-search__sub">
              Search vetted fiduciaries by specialty, location, fees, and more. Compare up to 3 side by side.
            </p>
          </div>
          <Link to="/#match" className="btn btn--green btn--md">
            Take matching quiz
          </Link>
        </div>
      </div>

      <div className="dcontainer advisor-search__body">
        <SearchFilters
          type="advisors"
          filters={filters}
          onChange={setFilters}
          resultCount={results.length}
          states={states}
        />

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
            <h3>No advisors match those filters</h3>
            <p>Try broadening your search or clearing a few filters.</p>
            <button className="advisor-search__empty-btn" onClick={() => setFilters(EMPTY)}>
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <div className="advisor-search__grid">
              {results.slice(0, visible).map((a) => (
                <AdvisorCard key={a.id} advisor={a} />
              ))}
            </div>
            {visible < results.length && (
              <div className="flex justify-center mt-10">
                <button className="btn btn--outline btn--lg" onClick={() => setVisible((v) => v + 18)}>
                  Load more advisors
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <NewsletterSignup />
    </div>
  );
};

export default AdvisorSearch;
