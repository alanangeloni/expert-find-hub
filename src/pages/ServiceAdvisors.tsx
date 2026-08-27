import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllAdvisors } from "@/services/advisorsService";
import { getBlogPosts } from "@/services/blogService";
import { AdvisorCard } from "@/components/advisors/AdvisorCard";
import { BlogCard } from "@/components/blog/BlogCard";
import { SearchFilters, type AdvisorFilters } from "@/components/search/SearchFilters";
import { NewsletterSignup } from "@/components/common/NewsletterSignup";
import { Seo } from "@/components/seo/Seo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { valuesForSpecialty } from "@/constants/specialties";
import {
  ALL_SERVICES,
  serviceSlug,
  serviceFromSlug,
  serviceDefinition,
  serviceChecklist,
  serviceFaqs,
} from "@/constants/serviceContent";
import { stateSlug } from "@/constants/states";
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

const listToSentence = (items: string[]) => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
};

const ServiceAdvisors = () => {
  const { slug = "" } = useParams();
  const service = serviceFromSlug(slug);
  const [filters, setFilters] = useState<AdvisorFilters>(EMPTY);
  const [visible, setVisible] = useState(18);

  const { data: advisors = [], isLoading } = useQuery({
    queryKey: ["all-advisors"],
    queryFn: getAllAdvisors,
  });

  const { data: posts = [] } = useQuery({
    queryKey: ["published-posts-services"],
    queryFn: () => getBlogPosts({ status: "published", limit: 50 }),
  });

  const serviceValues = useMemo(() => (service ? valuesForSpecialty(service) : []), [service]);

  const inService = useMemo(
    () => advisors.filter((a) => (a.advisor_services || []).some((s) => serviceValues.includes(s))),
    [advisors, serviceValues]
  );

  const states = useMemo(
    () => Array.from(new Set(inService.map((a) => a.state_hq).filter(Boolean))).sort() as string[],
    [inService]
  );

  const topStates = useMemo(() => {
    const counts: Record<string, number> = {};
    inService.forEach((a) => {
      if (a.state_hq) counts[a.state_hq] = (counts[a.state_hq] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([s]) => s);
  }, [inService]);

  const relatedServices = useMemo(() => {
    if (!service) return [];
    const idx = ALL_SERVICES.indexOf(service);
    return [...ALL_SERVICES.slice(idx + 1), ...ALL_SERVICES.slice(0, idx)].slice(0, 10);
  }, [service]);

  const relatedPosts = useMemo(() => {
    if (!service) return [];
    const words = service
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter((w) => w.length > 3);
    const scored = posts
      .map((p) => {
        const haystack = `${p.title} ${(p.categories || []).join(" ")} ${p.excerpt || ""}`.toLowerCase();
        const score = words.reduce((acc, w) => acc + (haystack.includes(w) ? 1 : 0), 0);
        return { p, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map((x) => x.p);
  }, [posts, service]);

  const results = useMemo(() => {
    let list = [...inService];
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
  }, [inService, filters]);

  useEffect(() => setVisible(18), [filters, slug]);

  if (!service) return <NotFound />;

  const count = inService.length;
  const canonical = `${BASE}/services/${serviceSlug(service)}`;
  const definition = serviceDefinition(service);
  const checklist = serviceChecklist(service);
  const faqs = serviceFaqs(service);
  const description = `Find a financial professional for ${service.toLowerCase()}. Compare ${
    count > 0 ? `${count} vetted` : "vetted"
  } fiduciary advisors on credentials, fees, and minimums, then request a free introduction.`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${BASE}/services` },
          { "@type": "ListItem", position: 3, name: service, item: canonical },
        ],
      },
      {
        "@type": "CollectionPage",
        name: `Financial professionals for ${service}`,
        description,
        url: canonical,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: inService.slice(0, 30).map((a, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: a.name,
            url: `${BASE}/advisors/${a.slug}`,
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="services-page page-enter">
      <Seo
        title={`${service} Financial Advisors | Financial Professional`}
        description={description}
        canonicalUrl={canonical}
        structuredData={structuredData}
        noIndex={count === 0}
      />

      <div className="services-page__hero">
        <div className="dcontainer">
          <nav className="service-page__breadcrumb" aria-label="Breadcrumb">
            <Link to="/services">Services</Link>
            <span aria-hidden="true">/</span>
            <span>{service}</span>
          </nav>
          <h1>
            Find a Financial Professional
            <br />
            <em>for {service}</em>
          </h1>
          <p className="service-page__intro">
            {definition}{" "}
            {count > 0 ? (
              <>
                {count} vetted {count === 1 ? "professional offers" : "professionals offer"} this service
                {topStates.length > 0 ? `, with practices in ${listToSentence(topStates.slice(0, 3))}` : ""}. Compare
                credentials, fees, and minimums, then request an introduction free.
              </>
            ) : (
              <>
                We have not listed a professional for this specialty yet. Browse the full directory to find a fiduciary
                who works with clients nationwide.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="dcontainer services-page__body">
        {count > 0 && (
          <SearchFilters
            type="advisors"
            filters={filters}
            onChange={setFilters}
            resultCount={results.length}
            states={states}
          />
        )}

        {isLoading ? (
          <div className="service-page__grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-skeleton" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="service-page__empty">
            <h3>No financial professionals to show{count > 0 ? " for those filters" : " for this specialty yet"}</h3>
            <p>
              {count > 0
                ? "Try broadening your search or clearing a few filters."
                : "The full directory covers every specialty, and many professionals work with clients nationwide."}
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
            <div className="service-page__grid">
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

        <section className="service-page__section">
          <h2>What to look for in a financial professional for {service.toLowerCase()}</h2>
          <ul className="service-page__checklist">
            {checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="service-page__section">
          <h2>Frequently asked questions</h2>
          <Accordion type="single" collapsible className="service-page__faq">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`} className="service-page__faq-item">
                <AccordionTrigger className="service-page__faq-q">{f.q}</AccordionTrigger>
                <AccordionContent className="service-page__faq-a">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {relatedPosts.length > 0 && (
          <section className="service-page__section">
            <h2>Related reading</h2>
            <div className="service-page__posts">
              {relatedPosts.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}

        {topStates.length > 0 && (
          <section className="service-page__section">
            <h2>{service} professionals by state</h2>
            <div className="service-page__links">
              {topStates.map((s) => (
                <Link key={s} to={`/financial-professionals/${stateSlug(s)}`} className="service-page__link">
                  {s}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="service-page__section">
          <h2>Explore more specialties</h2>
          <div className="service-page__links">
            {relatedServices.map((s) => (
              <Link key={s} to={`/services/${serviceSlug(s)}`} className="service-page__link">
                {s}
              </Link>
            ))}
          </div>
        </section>

        <NewsletterSignup />
      </div>
    </div>
  );
};

export default ServiceAdvisors;
