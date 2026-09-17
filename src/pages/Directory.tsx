import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { getAllAdvisors } from "@/services/advisorsService";
import { getInvestmentFirms } from "@/services/investmentFirmsService";
import { getAllAccountants } from "@/services/accountantsService";
import { getBlogPosts } from "@/services/blogService";
import { ALL_SERVICES, serviceSlug } from "@/constants/serviceContent";
import { US_STATES, stateSlug } from "@/constants/states";
import { ACCOUNTANT_SPECIALTIES, accountantSpecialtySlug } from "@/constants/accountants";
import { Seo } from "@/components/seo/Seo";
import { NewsletterSignup } from "@/components/common/NewsletterSignup";

const BASE = "https://financialprofessional.com";

const HUBS = [
  { href: "/advisors", label: "Find a financial advisor" },
  { href: "/services", label: "Browse by specialty" },
  { href: "/financial-professionals", label: "Browse by state" },
  { href: "/firms", label: "Investment firms" },
  { href: "/accountants", label: "Accountants and CPAs" },
  { href: "/accounting-firms", label: "Accounting firms" },
  { href: "/blog", label: "The Journal" },
  { href: "/advisor-registration", label: "List your advisor profile" },
];

const DirectorySection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="directory-page__section">
    <h2>{title}</h2>
    <ul className="directory-page__list">{children}</ul>
  </section>
);

const Directory = () => {
  const { data: advisors = [] } = useQuery({ queryKey: ["all-advisors"], queryFn: getAllAdvisors });
  const { data: firmsData } = useQuery({
    queryKey: ["all-firms"],
    queryFn: () => getInvestmentFirms({ page: 1, pageSize: 1000 }),
  });
  const { data: accountants = [] } = useQuery({ queryKey: ["all-accountants"], queryFn: getAllAccountants });
  const { data: posts = [] } = useQuery({
    queryKey: ["blogPosts", "all"],
    queryFn: () => getBlogPosts({ status: "published", limit: 200 }),
  });

  const firms = firmsData?.data || [];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Site directory",
    url: `${BASE}/directory`,
    description:
      "Browse every financial professional directory page, including advisors, firms, accountants, specialties, states, and journal articles.",
  };

  return (
    <div className="directory-page page-enter">
      <Seo
        title="Site Directory | Financial Professional"
        description="Browse every financial professional directory page, including advisors, firms, accountants, specialties, states, and journal articles."
        canonicalUrl={`${BASE}/directory`}
        structuredData={structuredData}
      />

      <div className="directory-page__hero">
        <div className="dcontainer">
          <span className="keyline" />
          <p className="directory-page__eyebrow">Sitemap</p>
          <h1>
            Site <em>directory</em>
          </h1>
          <p className="directory-page__sub">
            Every public section of Financial Professional, in one place. Use this page to jump to an advisor, firm,
            specialty, state, or journal article.
          </p>
        </div>
      </div>

      <div className="dcontainer directory-page__body">
        <DirectorySection title="Main sections">
          {HUBS.map((item) => (
            <li key={item.href}>
              <Link to={item.href}>{item.label}</Link>
            </li>
          ))}
        </DirectorySection>

        <DirectorySection title="Advisor specialties">
          {ALL_SERVICES.map((service) => (
            <li key={service}>
              <Link to={`/services/${serviceSlug(service)}`}>{service}</Link>
            </li>
          ))}
        </DirectorySection>

        <DirectorySection title="Financial professionals by state">
          {US_STATES.map((state) => (
            <li key={state}>
              <Link to={`/financial-professionals/${stateSlug(state)}`}>{state}</Link>
            </li>
          ))}
        </DirectorySection>

        <DirectorySection title="Advisors">
          {advisors.map((a) => (
            <li key={a.id}>
              <Link to={`/advisors/${a.slug}`}>{a.name}</Link>
            </li>
          ))}
        </DirectorySection>

        <DirectorySection title="Investment firms">
          {firms.map((f) => (
            <li key={f.id}>
              <Link to={`/firms/${f.slug}`}>{f.name}</Link>
            </li>
          ))}
        </DirectorySection>

        <DirectorySection title="Accountant specialties">
          {ACCOUNTANT_SPECIALTIES.map((specialty) => (
            <li key={specialty}>
              <Link to={`/accountants/specialty/${accountantSpecialtySlug(specialty)}`}>{specialty}</Link>
            </li>
          ))}
        </DirectorySection>

        <DirectorySection title="Accountants">
          {accountants.map((a) => (
            <li key={a.id}>
              <Link to={`/accountants/${a.slug}`}>{a.name}</Link>
            </li>
          ))}
        </DirectorySection>

        <DirectorySection title="Journal">
          {posts.map((p) => (
            <li key={p.id}>
              <Link to={`/blog/${p.slug}`}>{p.title}</Link>
            </li>
          ))}
        </DirectorySection>

        <NewsletterSignup />
      </div>
    </div>
  );
};

export default Directory;
