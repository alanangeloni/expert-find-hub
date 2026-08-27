import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllAdvisors } from "@/services/advisorsService";
import { ALL_SERVICES, serviceSlug, serviceDefinition } from "@/constants/serviceContent";
import { NewsletterSignup } from "@/components/common/NewsletterSignup";
import { Seo } from "@/components/seo/Seo";

const BASE = "https://financialprofessional.com";

const ServicesIndex = () => {
  const { data: advisors = [] } = useQuery({
    queryKey: ["all-advisors"],
    queryFn: getAllAdvisors,
  });

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    advisors.forEach((a) => {
      (a.advisor_services || []).forEach((s) => {
        map[s] = (map[s] || 0) + 1;
      });
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
          { "@type": "ListItem", position: 2, name: "Services", item: `${BASE}/services` },
        ],
      },
      {
        "@type": "ItemList",
        name: "Financial professional services",
        itemListElement: ALL_SERVICES.map((service, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: service,
          url: `${BASE}/services/${serviceSlug(service)}`,
        })),
      },
    ],
  };

  return (
    <div className="services-page page-enter">
      <Seo
        title="Financial Advisor Services by Specialty | Financial Professional"
        description="Browse financial professionals by specialty, from retirement and tax planning to estate, business, and investment management. Compare vetted fiduciaries free."
        canonicalUrl={`${BASE}/services`}
        structuredData={structuredData}
      />

      <div className="services-page__hero">
        <div className="dcontainer services-page__hero-row">
          <div className="services-page__hero-copy">
            <span className="keyline" />
            <p className="services-page__eyebrow">Advisor services</p>
            <h1>
              Browse Financial Professionals
              <br />
              <em>by Specialty</em>
            </h1>
            <p className="services-page__sub">
              Every financial situation is different. Start with the specialty you need, then compare vetted fiduciary
              professionals on credentials, fees, and minimums.
            </p>
          </div>
          <div className="services-page__hero-cta">
            <Link to="/#match" className="btn btn--primary btn--lg">
              Take the matching quiz
            </Link>
            <Link to="/advisors" className="btn btn--outline btn--lg">
              Browse all advisors
            </Link>
          </div>
        </div>
      </div>

      <div className="dcontainer services-page__body">
        <div className="services-grid">
          {ALL_SERVICES.map((service) => {
            const count = counts[service] || 0;
            return (
              <Link key={service} to={`/services/${serviceSlug(service)}`} className="service-tile">
                <div className="service-tile__head">
                  <h2>{service}</h2>
                  {count > 0 && <span className="service-tile__count">{count}</span>}
                </div>
                <p>{serviceDefinition(service)}</p>
                <span className="service-tile__cta">
                  View professionals
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>

        <p className="services-page__note">
          Prefer to search by location? Browse <Link to="/financial-professionals">financial professionals by state</Link>.
        </p>

        <NewsletterSignup />
      </div>
    </div>
  );
};

export default ServicesIndex;
