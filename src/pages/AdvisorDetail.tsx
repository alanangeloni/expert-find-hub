import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { getAdvisorBySlug } from "@/services/advisorsService";
import { MeetingRequestForm } from "@/components/advisors/MeetingRequestForm";
import { CompareToggle } from "@/components/compare/CompareToggle";
import { useCompareAdvisors } from "@/contexts/CompareContext";
import { getInitials, hueFor, extractAcronym, formatMinAssets, advisorLocation } from "@/utils/advisorDisplay";
import { Seo } from "@/components/seo/Seo";

const Chevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const AdvisorDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [meetingOpen, setMeetingOpen] = useState(false);
  const { isComparing, toggleCompare, compareIds, max } = useCompareAdvisors();

  const { data: advisor, isLoading } = useQuery({
    queryKey: ["advisor", slug],
    queryFn: () => getAdvisorBySlug(slug || ""),
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

  if (!advisor) {
    return (
      <div className="advisor-detail advisor-detail--missing">
        <div className="dcontainer">
          <h1>Advisor not found</h1>
          <p>The advisor you're looking for doesn't exist or has been removed.</p>
          <Link to="/advisors" className="btn btn--green">
            Browse all advisors
          </Link>
        </div>
      </div>
    );
  }

  const location = advisorLocation(advisor.city, advisor.state_hq);
  const designations = advisor.professional_designations || [];
  const services = advisor.advisor_services || [];
  const licenses = advisor.licenses || [];
  const clients = advisor.client_type || [];
  const states = advisor.states_registered_in || [];
  const comparing = isComparing(advisor.id);
  const firmTone = ["green", "blue", "orange"][hueFor(advisor.firm_name || advisor.name) % 3];

  const pageTitle = `${advisor.name} — ${advisor.position || "Financial Advisor"}${
    advisor.firm_name ? ` at ${advisor.firm_name}` : ""
  }`.slice(0, 60);
  const pageDescription = (
    advisor.personal_bio ||
    `${advisor.position || "Financial advisor"}${advisor.firm_name ? ` at ${advisor.firm_name}` : ""}${
      location ? ` in ${location}` : ""
    }. Request an introduction today.`
  ).slice(0, 155);

  const requestBtn = (
    <button type="button" className="btn btn--green btn--lg btn--full" onClick={() => setMeetingOpen(true)}>
      Request an introduction
    </button>
  );

  return (
    <div className="advisor-detail page-enter">
      <Seo
        title={pageTitle}
        description={pageDescription}
        canonicalUrl={`https://financial-professional.lovable.app/advisors/${slug}`}
        ogImage={advisor.headshot_url || undefined}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FinancialService",
          name: advisor.name,
          jobTitle: advisor.position || "Financial Advisor",
          description: pageDescription,
          image: advisor.headshot_url || undefined,
          url: `https://financial-professional.lovable.app/advisors/${slug}`,
          areaServed: location || undefined,
        }}
      />

      <div className="dcontainer">
        <nav className="advisor-detail__breadcrumb" aria-label="Breadcrumb">
          <button type="button" onClick={() => navigate("/")}>
            Home
          </button>
          <Chevron />
          <button type="button" onClick={() => navigate("/advisors")}>
            Advisors
          </button>
          <Chevron />
          <span>{advisor.name}</span>
        </nav>

        <div className="advisor-detail__layout">
          {/* ---------------- Main ---------------- */}
          <div className="advisor-detail__main">
            <header className="advisor-detail__header">
              {advisor.headshot_url ? (
                <img src={advisor.headshot_url} alt={advisor.name} className="avatar avatar--xl object-cover" />
              ) : (
                <div
                  className="avatar avatar--xl"
                  style={{ background: `hsl(${hueFor(advisor.name)} 42% 42%)` }}
                  aria-hidden="true"
                >
                  <span>{getInitials(advisor.name)}</span>
                </div>
              )}

              <div className="advisor-detail__intro">
                <div className="advisor-detail__badges">
                  {advisor.fiduciary && <span className="badge badge--green">Fiduciary</span>}
                  {advisor.verified && <span className="badge badge--blue">Verified</span>}
                  {designations.slice(0, 4).map((d) => (
                    <span key={d} className="badge badge--neutral">
                      {extractAcronym(d)}
                    </span>
                  ))}
                </div>

                <h1>{advisor.name}</h1>
                <p className="advisor-detail__title">{advisor.position || "Financial Advisor"}</p>
                {advisor.firm_name &&
                  (advisor.website_url ? (
                    <a
                      className="advisor-detail__firm-link"
                      href={advisor.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {advisor.firm_name}
                    </a>
                  ) : (
                    <span className="advisor-detail__firm-link">{advisor.firm_name}</span>
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
                  {!!advisor.years_of_experience && <span>{advisor.years_of_experience} years experience</span>}
                  <span>{formatMinAssets(advisor.minimum)} minimum</span>
                </div>

                <div className="advisor-detail__mobile-actions">
                  {requestBtn}
                  <div className="advisor-detail__mobile-actions-row">
                    <CompareToggle
                      active={comparing}
                      disabled={compareIds.length >= max && !comparing}
                      size="md"
                      onClick={() => toggleCompare(advisor.id)}
                    />
                  </div>
                </div>
              </div>
            </header>

            {advisor.personal_bio && (
              <section className="advisor-detail__section">
                <h2>About {advisor.name.split(" ")[0]}</h2>
                <p className="advisor-detail__bio" style={{ whiteSpace: "pre-line" }}>
                  {advisor.personal_bio}
                </p>
              </section>
            )}

            {services.length > 0 && (
              <section className="advisor-detail__section">
                <h2>Areas of focus</h2>
                <div className="advisor-detail__specialty-grid">
                  {services.map((s) => (
                    <Link key={s} to={`/advisors?specialty=${encodeURIComponent(s)}`} className="advisor-detail__specialty">
                      {s}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {(designations.length > 0 || licenses.length > 0 || advisor.primary_education || clients.length > 0) && (
              <section className="advisor-detail__section">
                <h2>Credentials &amp; background</h2>
                <div className="advisor-detail__creds">
                  {designations.length > 0 && (
                    <div>
                      <h3>Designations</h3>
                      <div className="advisor-detail__cert-list">
                        {designations.map((d) => (
                          <span key={d} className="badge badge--blue badge--sm" title={d}>
                            {extractAcronym(d)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {licenses.length > 0 && (
                    <div>
                      <h3>Licenses</h3>
                      <div className="advisor-detail__cert-list">
                        {licenses.map((l) => (
                          <span key={l} className="badge badge--neutral badge--sm">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {advisor.primary_education && (
                    <div>
                      <h3>Education</h3>
                      <p>{advisor.primary_education}</p>
                    </div>
                  )}
                  {clients.length > 0 && (
                    <div>
                      <h3>Clients served</h3>
                      <div className="advisor-detail__cert-list">
                        {clients.map((c) => (
                          <span key={c} className="badge badge--neutral badge--sm">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {states.length > 0 && (
                    <div>
                      <h3>Registered in</h3>
                      <p>{states.join(", ")}</p>
                    </div>
                  )}
                  {(advisor.advisor_sec_crd || advisor.firm_sec_crd) && (
                    <div>
                      <h3>Regulatory</h3>
                      <ul className="advisor-detail__edu">
                        {advisor.advisor_sec_crd && (
                          <li>
                            {advisor.link_to_advisor_sec ? (
                              <a href={advisor.link_to_advisor_sec} target="_blank" rel="noopener noreferrer">
                                Advisor CRD #{advisor.advisor_sec_crd}
                              </a>
                            ) : (
                              <>Advisor CRD #{advisor.advisor_sec_crd}</>
                            )}
                          </li>
                        )}
                        {advisor.firm_sec_crd && (
                          <li>
                            {advisor.link_to_firm_sec ? (
                              <a href={advisor.link_to_firm_sec} target="_blank" rel="noopener noreferrer">
                                Firm CRD #{advisor.firm_sec_crd}
                              </a>
                            ) : (
                              <>Firm CRD #{advisor.firm_sec_crd}</>
                            )}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {(advisor.firm_bio || advisor.firm_name) && (
              <section className="advisor-detail__section">
                <h2>The firm</h2>
                <div className="advisor-detail__firm-card">
                  {advisor.firm_logo_url ? (
                    <img
                      src={advisor.firm_logo_url}
                      alt={advisor.firm_name || "Firm logo"}
                      className="advisor-detail__firm-icon object-contain bg-white"
                    />
                  ) : (
                    <div className={`advisor-detail__firm-icon advisor-detail__firm-icon--${firmTone}`} aria-hidden="true">
                      {(advisor.firm_name || "F").charAt(0)}
                    </div>
                  )}
                  <div>
                    <strong>{advisor.firm_name || "Independent practice"}</strong>
                    {advisor.firm_bio && <p style={{ whiteSpace: "pre-line" }}>{advisor.firm_bio}</p>}
                    {advisor.firm_address && <span style={{ display: "block" }}>{advisor.firm_address}</span>}
                    {advisor.firm_aum && <span style={{ display: "block" }}>{advisor.firm_aum} assets under management</span>}
                  </div>
                </div>
              </section>
            )}

            {advisor.youtube_video_id && (
              <section className="advisor-detail__section">
                <h2>Meet {advisor.name.split(" ")[0]}</h2>
                <div className="aspect-video w-full overflow-hidden rounded-xl">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${advisor.youtube_video_id}`}
                    title={`Video introduction from ${advisor.name}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </section>
            )}

            {advisor.disclaimer && (
              <section className="advisor-detail__section">
                <h2>Disclosures</h2>
                <p className="advisor-detail__bio" style={{ whiteSpace: "pre-line", fontSize: "0.875rem" }}>
                  {advisor.disclaimer}
                </p>
              </section>
            )}
          </div>

          {/* ---------------- Sidebar ---------------- */}
          <aside className="advisor-detail__sidebar">
            <div className="advisor-detail__card">
              <h3>Work with {advisor.name.split(" ")[0]}</h3>
              <dl className="advisor-detail__dl">
                <div>
                  <dt>Minimum assets</dt>
                  <dd>{formatMinAssets(advisor.minimum)}</dd>
                </div>
                <div>
                  <dt>Fee structure</dt>
                  <dd>{(advisor.compensation || []).join(", ") || "Not listed"}</dd>
                </div>
                <div>
                  <dt>Experience</dt>
                  <dd>{advisor.years_of_experience ? `${advisor.years_of_experience} years` : "—"}</dd>
                </div>
                <div>
                  <dt>Standard</dt>
                  <dd>{advisor.fiduciary ? "Fiduciary" : "Not listed"}</dd>
                </div>
              </dl>
              <div className="advisor-detail__actions">
                {requestBtn}
                <CompareToggle
                  active={comparing}
                  disabled={compareIds.length >= max && !comparing}
                  size="md"
                  onClick={() => toggleCompare(advisor.id)}
                />
                {advisor.website_url && (
                  <a
                    href={advisor.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--outline btn--full"
                  >
                    Visit website
                  </a>
                )}
              </div>
            </div>

            <div className="advisor-detail__card advisor-detail__card--muted">
              <h3>Why people trust this directory</h3>
              <ul className="advisor-detail__trust">
                <li>Every advisor is independently reviewed before listing.</li>
                <li>No cost, no obligation to connect with an advisor.</li>
                <li>Compare fees, minimums, and credentials transparently.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <Dialog open={meetingOpen} onOpenChange={setMeetingOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <VisuallyHidden>
            <DialogTitle>Request a meeting with {advisor.name}</DialogTitle>
          </VisuallyHidden>
          <MeetingRequestForm
            advisorId={advisor.id}
            advisorName={advisor.name}
            onSuccess={() => setMeetingOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvisorDetailPage;
