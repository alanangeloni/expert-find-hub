import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAccountantBySlug } from "@/services/accountantsService";
import { Seo } from "@/components/seo/Seo";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { accountantSpecialtySlug, accountantSpecialtyDefinition } from "@/constants/accountants";
import { CERTIFICATION_DEFINITIONS } from "@/constants/definitions";
import { getInitials, hueFor, advisorLocation } from "@/utils/advisorDisplay";

const Chevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const AccountantDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: accountant, isLoading } = useQuery({
    queryKey: ["accountant", slug],
    queryFn: () => getAccountantBySlug(slug || ""),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="advisor-detail">
        <div className="dcontainer" style={{ paddingTop: 64 }}>
          <div className="card-skeleton" style={{ height: 220 }} />
        </div>
      </div>
    );
  }

  if (!accountant) {
    return (
      <div className="advisor-detail advisor-detail--missing">
        <div className="dcontainer">
          <h1>Accountant not found</h1>
          <p>The profile you're looking for doesn't exist or isn't public yet.</p>
          <Link to="/accountants" className="btn btn--green btn--md">
            Browse accountants
          </Link>
        </div>
      </div>
    );
  }

  const location = advisorLocation(accountant.city, accountant.state_hq);
  const credentials = accountant.credentials || [];
  const services = accountant.services || [];
  const clientSpecialties = accountant.client_specialties || [];
  const states = accountant.states_served || [];
  const firmTone = ["green", "blue", "orange"][hueFor(accountant.firm_name || accountant.name) % 3];

  const pageDescription = (
    accountant.bio ||
    `${accountant.position || "Accountant"}${accountant.firm_name ? ` at ${accountant.firm_name}` : ""}${
      location ? ` in ${location}` : ""
    }.`
  ).slice(0, 155);

  return (
    <div className="advisor-detail page-enter">
      <Seo
        title={`${accountant.name}${credentials.length ? `, ${credentials[0]}` : ""} | Financial Professional`}
        description={pageDescription}
        canonicalUrl={`https://financialprofessional.com/accountants/${accountant.slug}`}
        ogImage={accountant.headshot_url || undefined}
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              name: accountant.name,
              jobTitle: accountant.position || "Accountant",
              worksFor: accountant.firm_name ? { "@type": "Organization", name: accountant.firm_name } : undefined,
              address: location || undefined,
              url: `https://financialprofessional.com/accountants/${accountant.slug}`,
              image: accountant.headshot_url || undefined,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://financialprofessional.com/" },
                { "@type": "ListItem", position: 2, name: "Accountants", item: "https://financialprofessional.com/accountants" },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: accountant.name,
                  item: `https://financialprofessional.com/accountants/${accountant.slug}`,
                },
              ],
            },
          ],
        }}
      />

      <div className="dcontainer">
        <nav className="advisor-detail__breadcrumb" aria-label="Breadcrumb">
          <button type="button" onClick={() => navigate("/")}>
            Home
          </button>
          <Chevron />
          <button type="button" onClick={() => navigate("/accountants")}>
            Accountants
          </button>
          <Chevron />
          <span>{accountant.name}</span>
        </nav>

        <div className="advisor-detail__layout">
          {/* ---------------- Main ---------------- */}
          <div className="advisor-detail__main">
            <header className="advisor-detail__header">
              {accountant.headshot_url ? (
                <img src={accountant.headshot_url} alt={accountant.name} className="avatar avatar--xl object-cover" />
              ) : (
                <div
                  className="avatar avatar--xl"
                  style={{ background: `hsl(${hueFor(accountant.name)} 42% 42%)` }}
                  aria-hidden="true"
                >
                  <span>{getInitials(accountant.name)}</span>
                </div>
              )}

              <div className="advisor-detail__intro">
                <div className="advisor-detail__badges">
                  {accountant.verified && <span className="badge badge--green">Verified</span>}
                  {credentials.slice(0, 4).map((c) => (
                    <span key={c} className="badge badge--neutral">
                      {c}
                    </span>
                  ))}
                </div>

                <h1>{accountant.name}</h1>
                <p className="advisor-detail__title">{accountant.position || "Accountant"}</p>
                {accountant.firm_name &&
                  (accountant.website_url ? (
                    <a
                      className="advisor-detail__firm-link"
                      href={accountant.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {accountant.firm_name}
                    </a>
                  ) : (
                    <span className="advisor-detail__firm-link">{accountant.firm_name}</span>
                  ))}

                <div className="advisor-detail__meta-row">
                  {location && (
                    <span className="advisor-detail__loc">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {location}
                    </span>
                  )}
                  {!!accountant.years_of_experience && <span>{accountant.years_of_experience} years experience</span>}
                  {accountant.minimum_fee && <span>{accountant.minimum_fee} minimum</span>}
                </div>
              </div>
            </header>

            {accountant.bio && (
              <section className="advisor-detail__section">
                <h2>About {accountant.name.split(" ")[0]}</h2>
                <p className="advisor-detail__bio" style={{ whiteSpace: "pre-line" }}>
                  {accountant.bio}
                </p>
              </section>
            )}

            {services.length > 0 && (
              <section className="advisor-detail__section">
                <h2>Services offered</h2>
                <div className="advisor-detail__specialty-grid">
                  {services.map((s) => (
                    <span key={s} className="advisor-detail__specialty">
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {clientSpecialties.length > 0 && (
              <section className="advisor-detail__section">
                <h2>Client specialties</h2>
                <div className="advisor-detail__specialty-grid">
                  {clientSpecialties.map((s) => (
                    <InfoTooltip key={s} content={accountantSpecialtyDefinition(s)}>
                      <Link to={`/accountants/specialty/${accountantSpecialtySlug(s)}`} className="advisor-detail__specialty">
                        {s}
                      </Link>
                    </InfoTooltip>
                  ))}
                </div>
              </section>
            )}

            {(credentials.length > 0 || states.length > 0) && (
              <section className="advisor-detail__section">
                <h2>Credentials &amp; background</h2>
                <div className="advisor-detail__creds">
                  {credentials.length > 0 && (
                    <div>
                      <h3>Designations</h3>
                      <div className="advisor-detail__cert-list">
                        {credentials.map((c) => (
                          <InfoTooltip key={c} content={CERTIFICATION_DEFINITIONS[c]}>
                            <span className="badge badge--blue badge--sm">{c}</span>
                          </InfoTooltip>
                        ))}
                      </div>
                    </div>
                  )}
                  {states.length > 0 && (
                    <div>
                      <h3>States served</h3>
                      <p>{states.join(", ")}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {accountant.firm_name && (
              <section className="advisor-detail__section">
                <h2>The firm</h2>
                <div className="advisor-detail__firm-card">
                  <div className={`advisor-detail__firm-icon advisor-detail__firm-icon--${firmTone}`} aria-hidden="true">
                    {accountant.firm_name.charAt(0)}
                  </div>
                  <div>
                    <strong>{accountant.firm_name}</strong>
                    {accountant.pricing_note && <p>{accountant.pricing_note}</p>}
                  </div>
                </div>
              </section>
            )}

            {accountant.disclaimer && (
              <section className="advisor-detail__section">
                <h2>Disclosures</h2>
                <p className="advisor-detail__bio" style={{ whiteSpace: "pre-line", fontSize: "0.875rem" }}>
                  {accountant.disclaimer}
                </p>
              </section>
            )}
          </div>

          {/* ---------------- Sidebar ---------------- */}
          <aside className="advisor-detail__sidebar">
            <div className="advisor-detail__card">
              <h3>Work with {accountant.name.split(" ")[0]}</h3>
              <dl className="advisor-detail__dl">
                <div>
                  <dt>Minimum fee</dt>
                  <dd>{accountant.minimum_fee || "Not listed"}</dd>
                </div>
                <div>
                  <dt>Experience</dt>
                  <dd>{accountant.years_of_experience ? `${accountant.years_of_experience} years` : "Not listed"}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{location || "Not listed"}</dd>
                </div>
                <div>
                  <dt>Credentials</dt>
                  <dd>{credentials.join(", ") || "Not listed"}</dd>
                </div>
              </dl>
              <div className="advisor-detail__actions">
                {accountant.website_url && (
                  <a
                    href={accountant.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--green btn--lg btn--full"
                  >
                    Visit website
                  </a>
                )}
                {accountant.email && (
                  <a href={`mailto:${accountant.email}`} className="btn btn--outline btn--md btn--full">
                    Contact {accountant.name.split(" ")[0]}
                  </a>
                )}
              </div>
            </div>

            <div className="advisor-detail__card advisor-detail__card--muted">
              <h3>Why people trust this directory</h3>
              <ul className="advisor-detail__trust">
                <li>Every professional is independently reviewed before listing.</li>
                <li>No cost, no obligation to connect.</li>
                <li>Compare credentials and specialties transparently.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AccountantDetail;
