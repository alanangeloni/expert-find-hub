import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getAccountantBySlug } from "@/services/accountantsService";
import { Seo } from "@/components/seo/Seo";
import { Spinner } from "@/components/ui/spinner";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { accountantSpecialtySlug, accountantSpecialtyDefinition } from "@/constants/accountants";
import { CERTIFICATION_DEFINITIONS } from "@/constants/definitions";
import { getInitials, hueFor, advisorLocation } from "@/utils/advisorDisplay";

const AccountantDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: accountant, isLoading } = useQuery({
    queryKey: ["accountant", slug],
    queryFn: () => getAccountantBySlug(slug || ""),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!accountant) {
    return (
      <div className="dcontainer accountant-detail__missing">
        <h1>Accountant not found</h1>
        <p>The profile you're looking for doesn't exist or isn't public yet.</p>
        <Link to="/accountants" className="btn btn--primary btn--lg">
          Browse accountants
        </Link>
      </div>
    );
  }

  const location = advisorLocation(accountant.city, accountant.state_hq);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: accountant.name,
    jobTitle: accountant.position || "Accountant",
    worksFor: accountant.firm_name ? { "@type": "Organization", name: accountant.firm_name } : undefined,
    address: location,
    url: `https://financialprofessional.com/accountants/${accountant.slug}`,
    image: accountant.headshot_url,
  };

  return (
    <div className="accountant-detail page-enter">
      <Seo
        title={`${accountant.name}${accountant.credentials?.length ? `, ${accountant.credentials[0]}` : ""} | Financial Professional`}
        description={
          accountant.bio?.slice(0, 155) ||
          `${accountant.name} is an accountant${accountant.firm_name ? ` at ${accountant.firm_name}` : ""}${location ? ` in ${location}` : ""}.`
        }
        canonicalUrl={`https://financialprofessional.com/accountants/${accountant.slug}`}
        jsonLd={jsonLd}
      />

      <div className="advisor-search__hero">
        <div className="dcontainer">
          <nav className="accountant-detail__crumbs" aria-label="Breadcrumb">
            <Link to="/accountants">Accountants</Link>
            <span aria-hidden="true">/</span>
            <span>{accountant.name}</span>
          </nav>
          <div className="accountant-detail__hero">
            {accountant.headshot_url ? (
              <img src={accountant.headshot_url} alt={accountant.name} className="avatar avatar--xl object-cover" />
            ) : (
              <div className="avatar avatar--xl" style={{ background: `hsl(${hueFor(accountant.name)} 42% 42%)` }} aria-hidden="true">
                <span>{getInitials(accountant.name)}</span>
              </div>
            )}
            <div>
              <h1 className="accountant-detail__name">
                {accountant.name}
                {accountant.credentials?.length ? `, ${accountant.credentials.join(", ")}` : ""}
              </h1>
              {accountant.position && <p className="accountant-detail__position">{accountant.position}</p>}
              {accountant.firm_name && <p className="accountant-detail__firm">{accountant.firm_name}</p>}
              <div className="advisor-card__tags">
                {accountant.verified && <span className="badge badge--green badge--sm">Verified</span>}
                {location && <span className="badge badge--neutral badge--sm">{location}</span>}
                {accountant.years_of_experience ? (
                  <span className="badge badge--neutral badge--sm">{accountant.years_of_experience} years experience</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dcontainer accountant-detail__body">
        <div className="accountant-detail__main">
          {accountant.bio && (
            <section className="accountant-detail__section">
              <h2>About {accountant.name.split(" ")[0]}</h2>
              <p>{accountant.bio}</p>
            </section>
          )}

          {(accountant.services || []).length > 0 && (
            <section className="accountant-detail__section">
              <h2>Services offered</h2>
              <div className="advisor-card__specialties">
                {accountant.services!.map((s) => (
                  <span key={s} className="advisor-card__specialty">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {(accountant.client_specialties || []).length > 0 && (
            <section className="accountant-detail__section">
              <h2>Client specialties</h2>
              <div className="advisor-card__specialties">
                {accountant.client_specialties!.map((s) => (
                  <InfoTooltip key={s} content={accountantSpecialtyDefinition(s)}>
                    <Link to={`/accountants/specialty/${accountantSpecialtySlug(s)}`} className="advisor-card__specialty">
                      {s}
                    </Link>
                  </InfoTooltip>
                ))}
              </div>
            </section>
          )}

          {(accountant.credentials || []).length > 0 && (
            <section className="accountant-detail__section">
              <h2>Credentials &amp; licenses</h2>
              <div className="advisor-card__tags">
                {accountant.credentials!.map((c) => (
                  <InfoTooltip key={c} content={CERTIFICATION_DEFINITIONS[c]}>
                    <span className="badge badge--blue">{c}</span>
                  </InfoTooltip>
                ))}
              </div>
            </section>
          )}

          {(accountant.states_served || []).length > 0 && (
            <section className="accountant-detail__section">
              <h2>States served</h2>
              <div className="advisor-card__specialties">
                {accountant.states_served!.map((s) => (
                  <span key={s} className="advisor-card__specialty">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {accountant.disclaimer && (
            <p className="accountant-detail__disclaimer">{accountant.disclaimer}</p>
          )}
        </div>

        <aside className="accountant-detail__aside">
          <div className="accountant-detail__cta-card">
            <h3>Work with {accountant.name.split(" ")[0]}</h3>
            {accountant.minimum_fee && (
              <p className="accountant-detail__cta-row">
                <span>Minimum fee</span>
                <strong>{accountant.minimum_fee}</strong>
              </p>
            )}
            {accountant.pricing_note && <p className="accountant-detail__cta-note">{accountant.pricing_note}</p>}
            {accountant.website_url && (
              <a href={accountant.website_url} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--lg accountant-detail__cta-btn">
                Visit website
              </a>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AccountantDetail;
