import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getAllAccountants } from "@/services/accountantsService";
import { AccountantCard } from "@/components/accountants/AccountantCard";
import { Seo } from "@/components/seo/Seo";
import { Spinner } from "@/components/ui/spinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ACCOUNTANT_SPECIALTIES,
  accountantSpecialtySlug,
  accountantSpecialtyFromSlug,
  accountantSpecialtyDefinition,
} from "@/constants/accountants";

const AccountantSpecialty = () => {
  const { slug } = useParams<{ slug: string }>();
  const specialty = slug ? accountantSpecialtyFromSlug(slug) : undefined;

  const { data: accountants = [], isLoading } = useQuery({
    queryKey: ["all-accountants"],
    queryFn: getAllAccountants,
    enabled: !!specialty,
  });

  const results = useMemo(
    () => accountants.filter((a) => (a.client_specialties || []).includes(specialty || "")),
    [accountants, specialty]
  );

  const related = useMemo(
    () => ACCOUNTANT_SPECIALTIES.filter((s) => s !== specialty).slice(0, 8),
    [specialty]
  );

  if (!specialty) {
    return (
      <div className="dcontainer accountant-detail__missing">
        <h1>Specialty not found</h1>
        <p>That specialty page doesn't exist.</p>
        <Link to="/accountants" className="btn btn--primary btn--lg">
          Browse accountants
        </Link>
      </div>
    );
  }

  const canonical = `https://financialprofessional.com/accountants/specialty/${accountantSpecialtySlug(specialty)}`;
  const faqs = [
    {
      q: `Which accountants work with ${specialty.toLowerCase()}?`,
      a: `Financial Professional lists verified accountants who specialize in ${specialty.toLowerCase()}. Browse profiles and compare experience, services, and credentials.`,
    },
    {
      q: `What should I look for in an accountant for ${specialty.toLowerCase()}?`,
      a: `Look for relevant credentials (CPA, EA), direct experience with ${specialty.toLowerCase()}, transparent pricing, and familiarity with your state's tax rules.`,
    },
    {
      q: "How much do accountants charge?",
      a: "Fees vary by service and complexity. Many list a minimum fee or package pricing on their profile. Always confirm pricing before engaging.",
    },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `Accountants for ${specialty}`,
      url: canonical,
      description: accountantSpecialtyDefinition(specialty),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="advisor-search page-enter">
      <Seo
        title={`Accountants for ${specialty} | Financial Professional`}
        description={`Find vetted accountants who specialize in ${specialty.toLowerCase()}. Compare credentials, services, and pricing.`}
        canonicalUrl={canonical}
        structuredData={structuredData}
      />

      <div className="advisor-search__hero">
        <div className="dcontainer">
          <nav className="accountant-detail__crumbs" aria-label="Breadcrumb">
            <Link to="/accountants">Accountants</Link>
            <span aria-hidden="true">/</span>
            <span>{specialty}</span>
          </nav>
          <span className="keyline" />
          <h1>
            Accountants for <em>{specialty}</em>
          </h1>
          <p className="advisor-search__sub">{accountantSpecialtyDefinition(specialty)}</p>
        </div>
      </div>

      <div className="dcontainer advisor-search__body">
        {isLoading ? (
          <div className="advisor-search__grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card-skeleton" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="advisor-search__empty">
            <h3>No accountants listed for this specialty yet</h3>
            <p>We're adding new professionals regularly. Check back soon or browse all accountants.</p>
            <Link to="/accountants" className="advisor-search__empty-btn">
              Browse all accountants
            </Link>
          </div>
        ) : (
          <div className="advisor-search__grid">
            {results.map((a) => (
              <AccountantCard key={a.id} accountant={a} />
            ))}
          </div>
        )}

        <section className="accountant-specialty__faq">
          <h2>Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="accountant-specialty__related">
          <h2>Explore more specialties</h2>
          <div className="advisor-card__specialties">
            {related.map((s) => (
              <Link key={s} to={`/accountants/specialty/${accountantSpecialtySlug(s)}`} className="advisor-card__specialty">
                {s}
              </Link>
            ))}
            <Link to="/accountants" className="advisor-card__specialty advisor-card__specialty--more">
              All accountants
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AccountantSpecialty;
