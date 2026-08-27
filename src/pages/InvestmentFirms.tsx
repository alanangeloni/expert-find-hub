import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getInvestmentFirms } from "@/services/investmentFirmsService";
import { FirmCard } from "@/components/firms/FirmCard";
import { SearchFilters, type FirmFilters } from "@/components/search/SearchFilters";
import { NewsletterSignup } from "@/components/common/NewsletterSignup";
import { Seo } from "@/components/seo/Seo";

const EMPTY: FirmFilters = { query: "", assetClass: "", minimum: "", sort: "name" };

const parseAum = (aum?: string) => {
  if (!aum) return 0;
  const raw = aum.replace(/[$,\s]/g, "").toUpperCase();
  const num = parseFloat(raw);
  if (Number.isNaN(num)) return 0;
  if (raw.includes("T")) return num * 1e12;
  if (raw.includes("B")) return num * 1e9;
  if (raw.includes("M")) return num * 1e6;
  if (raw.includes("K")) return num * 1e3;
  return num;
};

const InvestmentFirms = () => {
  const [filters, setFilters] = useState<FirmFilters>(EMPTY);
  const [visible, setVisible] = useState(18);

  const { data, isLoading } = useQuery({
    queryKey: ["all-firms"],
    queryFn: () => getInvestmentFirms({ page: 1, pageSize: 1000 }),
  });

  const firms = data?.data || [];

  const assetClasses = useMemo(() => {
    const set = new Set<string>();
    firms.forEach((f) => (f.asset_classes || f.asset_class || []).forEach((a) => set.add(a)));
    return Array.from(set).sort();
  }, [firms]);

  const results = useMemo(() => {
    let list = [...firms];
    const q = filters.query.trim().toLowerCase();

    if (q) {
      list = list.filter((f) =>
        [f.name, f.description, f.headquarters, f.address].filter(Boolean).join(" ").toLowerCase().includes(q)
      );
    }
    if (filters.assetClass) {
      list = list.filter((f) => (f.asset_classes || f.asset_class || []).includes(filters.assetClass));
    }
    if (filters.minimum) {
      const min = Number(filters.minimum);
      list = list.filter((f) => {
        const v = f.minimum_investment ?? 0;
        if (min === 0) return v === 0;
        if (min === 1000001) return v > 1000000;
        return v <= min;
      });
    }

    list.sort((a, b) => {
      if (filters.sort === "aum") return parseAum(b.aum) - parseAum(a.aum);
      if (filters.sort === "rating") return (b.rating || 0) - (a.rating || 0);
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [firms, filters]);

  return (
    <div className="firm-search page-enter">
      <Seo
        title="Investment Firms Directory | Financial Professional"
        description="Browse independent investment firms by asset class, minimum investment, and assets under management."
        canonicalUrl="https://financialprofessional.com/firms"
      />

      <div className="firm-search__hero">
        <div className="dcontainer firm-search__hero-row">
          <div className="firm-search__hero-copy">
            <span className="keyline" />
            <p className="firm-search__eyebrow">Firm directory</p>
            <h1>
              Browse independent
              <br />
              <em>investment firms</em>
            </h1>
            <p className="firm-search__sub">
              Discover investment firms by location, asset class, scale, and minimum investment.
            </p>
          </div>
          <div className="firm-search__hero-cta">
            <Link to="/advisors" className="btn btn--primary btn--lg">
              Browse advisors
            </Link>
            <Link to="/#match" className="btn btn--outline btn--lg">
              Take the matching quiz
            </Link>
          </div>
        </div>
      </div>


      <div className="dcontainer firm-search__body">
        <SearchFilters
          type="firms"
          filters={filters}
          onChange={setFilters}
          resultCount={results.length}
          assetClasses={assetClasses}
        />

        {isLoading ? (
          <div className="firm-search__grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-skeleton" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="firm-search__empty">
            <div className="firm-search__empty-icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <h3>No firms match those filters</h3>
            <p>Try broadening your search or clearing a few filters.</p>
            <button className="firm-search__empty-btn" onClick={() => setFilters(EMPTY)}>
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <div className="firm-search__grid">
              {results.slice(0, visible).map((f) => (
                <FirmCard key={f.id} firm={f} />
              ))}
            </div>
            {visible < results.length && (
              <div className="flex justify-center mt-10">
                <button className="btn btn--outline btn--lg" onClick={() => setVisible((v) => v + 18)}>
                  Load more firms
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

export default InvestmentFirms;
