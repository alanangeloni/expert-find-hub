import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllAdvisors } from "@/services/advisorsService";
import { US_STATES, stateSlug } from "@/constants/states";
import { NewsletterSignup } from "@/components/common/NewsletterSignup";
import { Seo } from "@/components/seo/Seo";

const BASE = "https://financialprofessional.com";

const StatesIndex = () => {
  const { data: advisors = [] } = useQuery({
    queryKey: ["all-advisors"],
    queryFn: getAllAdvisors,
  });

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    advisors.forEach((a) => {
      if (a.state_hq) map[a.state_hq] = (map[a.state_hq] || 0) + 1;
    });
    return map;
  }, [advisors]);

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
        ],
      },
      {
        "@type": "ItemList",
        name: "Financial professionals by state",
        itemListElement: US_STATES.map((state, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `Financial Professionals in ${state}`,
          url: `${BASE}/financial-professionals/${stateSlug(state)}`,
        })),
      },
    ],
  };

  return (
    <div className="states-page page-enter">
      <Seo
        title="Browse Financial Professionals by State | Financial Professional"
        description="Find a financial professional in your state. Browse vetted fiduciary financial professionals, advisors, and firms across all 50 states and Washington, D.C."
        canonicalUrl={`${BASE}/financial-professionals`}
        structuredData={structuredData}
      />

      <div className="states-page__hero">
        <div className="dcontainer">
          <span className="keyline" />
          <p className="states-page__eyebrow">Browse by location</p>
          <h1>
            Browse Financial Professionals <em>by State</em>
          </h1>
          <p className="states-page__sub">
            Find vetted financial professionals, fiduciary advisors, and wealth management firms in your state. Every
            profile is reviewed before it appears in the directory.
          </p>
        </div>
      </div>


      <div className="dcontainer states-page__body">
        <div className="states-grid">
          {US_STATES.map((state) => {
            const count = counts[state] || 0;
            return (
              <Link
                key={state}
                to={`/financial-professionals/${stateSlug(state)}`}
                className={`state-tile${count === 0 ? " state-tile--empty" : ""}`}
              >
                <span>{state}</span>
                {count > 0 && <span className="state-tile__count">{count}</span>}
              </Link>
            );
          })}
        </div>

        <p className="states-page__note">
          Looking for something more specific? Search every financial professional by specialty, fees, and minimums on
          the <Link to="/advisors">full directory</Link>.
        </p>

        <NewsletterSignup />
      </div>
    </div>
  );
};

export default StatesIndex;
