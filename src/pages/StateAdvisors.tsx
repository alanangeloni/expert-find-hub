import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllAdvisors } from "@/services/advisorsService";
import { AdvisorCard } from "@/components/advisors/AdvisorCard";
import { SearchFilters, type AdvisorFilters } from "@/components/search/SearchFilters";
import { valuesForSpecialty, SPECIALTY_GROUPS } from "@/constants/specialties";
import { NewsletterSignup } from "@/components/common/NewsletterSignup";
import { Seo } from "@/components/seo/Seo";
import { US_STATES, stateFromSlug, stateSlug } from "@/constants/states";
import { advisorLocation, formatMinAssets } from "@/utils/advisorDisplay";
import NotFound from "./NotFound";

const BASE = "https://financialprofessional.com";

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

const listToSentence = (items: string[]) => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
};

const StateAdvisors = () => {
  const { state: slug = "" } = useParams();
  const state = stateFromSlug(slug);
  const [filters, setFilters] = useState<AdvisorFilters>(EMPTY);
  const [visible, setVisible] = useState(18);

  const { data: advisors = [], isLoading } = useQuery({
    queryKey: ["all-advisors"],
    queryFn: getAllAdvisors,
  });

  const inState = useMemo(
    () => advisors.filter((a) => a.state_hq === state),
    [advisors, state]
  );

  const topSpecialties = useMemo(() => {
    const counts: Record<string, number> = {};
    inState.forEach((a) => (a.advisor_services || []).forEach((s) => (counts[s] = (counts[s] || 0) + 1)));
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([s]) => s);
  }, [inState]);

  const nearbyStates = useMemo(() => {
    if (!state) return [];
    const idx = US_STATES.indexOf(state);
    return [...US_STATES.slice(idx + 1), ...US_STATES.slice(0, idx)]
      .filter((s) => advisors.some((a) => a.state_hq === s))
      .slice(0, 8);
  }, [advisors, state]);

  const results = useMemo(() => {
    let list = [...inState];
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
  }, [inState, filters]);

  useEffect(() => setVisible(18), [filters, slug]);

  if (!state) return <NotFound />;

  const canonical = `${BASE}/financial-professionals/${stateSlug(state)}`;
  const count = inState.length;
  const cities = Array.from(new Set(inState.map((a) => a.city).filter(Boolean))).slice(0, 4) as string[];

  const description =
    count > 0
      ? `Compare ${count} vetted financial professionals in ${state}. See specialties, fees, minimums, and credentials, then request a meeting free.`
      : `Find a financial professional serving ${state}. Browse vetted fiduciary advisors and request a meeting free.`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: "Financial Professionals by State",
            item: `${BASE}/financial-professionals`,
          },
          { "@type": "ListItem", position: 3, name: `Financial Professionals in ${state}`, item: canonical },
        ],
      },
      {
        "@type": "ItemList",
        name: `Financial professionals in ${state}`,
        numberOfItems: count,
        itemListElement: inState.slice(0, 50).map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: a.name,
          url: `${BASE}/advisors/${a.slug}`,
        })),
      },
    ],
  };

  return (
    <div className="states-page page-enter">
      <Seo
        title={`Financial Professionals in ${state} | Find a Financial Professional`}
        description={description}
        canonicalUrl={canonical}
        structuredData={structuredData}
        noIndex={count === 0}
      />

      <div className="states-page__hero">
        <div className="dcontainer">
          <nav className="state-page__breadcrumb" aria-label="Breadcrumb">
            <Link to="/financial-professionals">Financial professionals by state</Link>
            <span aria-hidden="true">/</span>
            <span>{state}</span>
          </nav>
          <h1>
            Find a Financial Professional in <em>{state}</em>
          </h1>
          <p className="state-page__intro">
            {count > 0 ? (
              <>
                {count} vetted financial {count === 1 ? "professional is" : "professionals are"} listed in {state}
                {cities.length > 0 ? `, including practices in ${listToSentence(cities)}` : ""}.
                {topSpecialties.length > 0
                  ? ` They specialize in areas such as ${listToSentence(topSpecialties.slice(0, 3))}.`
                  : ""}{" "}
                Compare credentials, fees, and minimums, then request an introduction free.
              </>
            ) : (
              <>
                We have not listed a financial professional headquartered in {state} yet. Browse the full directory to
                find a fiduciary who works with clients remotely across the country.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="dcontainer states-page__body">
        {count > 0 && (
          <SearchFilters
            type="advisors"
            filters={filters}
            onChange={setFilters}
            resultCount={results.length}
            states={[state]}
          />
        )}

        {isLoading ? (
          <div className="state-page__grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-skeleton" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="state-page__empty">
            <h3>No financial professionals to show{count > 0 ? " for those filters" : ` in ${state} yet`}</h3>
            <p>
              {count > 0
                ? "Try broadening your search or clearing a few filters."
                : "The full directory covers every state, and many professionals work with clients nationwide."}
            </p>
            {count > 0 ? (
              <button className="btn btn--green btn--md" onClick={() => setFilters(EMPTY)}>
                Reset filters
              </button>
            ) : (
              <Link to="/advisors" className="btn btn--green btn--md">
                Browse all financial professionals
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="state-page__grid">
              {results.slice(0, visible).map((a) => (
                <AdvisorCard key={a.id} advisor={a} />
              ))}
            </div>
            {visible < results.length && (
              <div className="flex justify-center mt-10">
                <button className="btn btn--outline btn--lg" onClick={() => setVisible((v) => v + 18)}>
                  Load more financial professionals
                </button>
              </div>
            )}
          </>
        )}

        {topSpecialties.length > 0 && (
          <section className="state-page__section">
            <h2>Browse by specialty in {state}</h2>
            <div className="state-page__links">
              {topSpecialties.map((s) => (
                <Link
                  key={s}
                  to={`/advisors?state=${encodeURIComponent(state)}&specialty=${encodeURIComponent(s)}`}
                  className="state-page__link"
                >
                  {labelForRawService(s)}
                </Link>
              ))}
            </div>
          </section>
        )}

        {nearbyStates.length > 0 && (
          <section className="state-page__section">
            <h2>Financial professionals in other states</h2>
            <div className="state-page__links">
              {nearbyStates.map((s) => (
                <Link key={s} to={`/financial-professionals/${stateSlug(s)}`} className="state-page__link">
                  {s}
                </Link>
              ))}
              <Link to="/financial-professionals" className="state-page__link">
                All states
              </Link>
            </div>
          </section>
        )}

        <NewsletterSignup />
      </div>
    </div>
  );
};

export default StateAdvisors;
