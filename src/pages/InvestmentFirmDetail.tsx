import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getInvestmentFirmBySlug, getSimilarFirms } from "@/services/investmentFirmsService";
import { Seo } from "@/components/seo/Seo";
import { hueFor } from "@/utils/advisorDisplay";

const Chevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const InvestmentFirmDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: firm, isLoading, error } = useQuery<any>({
    queryKey: ["investmentFirm", slug],
    queryFn: () => getInvestmentFirmBySlug(slug || ""),
    enabled: !!slug,
  });

  const { data: similarFirms = [] } = useQuery({
    queryKey: ["similarFirms", firm?.id],
    queryFn: () => getSimilarFirms(firm?.id || ""),
    enabled: !!firm?.id,
  });

  if (isLoading) {
    return (
      <div className="firm-detail">
        <div className="dcontainer" style={{ paddingTop: 64 }}>
          <div className="card-skeleton" style={{ height: 220 }} />
        </div>
      </div>
    );
  }

  if (error || !firm) {
    return (
      <div className="firm-detail firm-detail--missing">
        <div className="dcontainer">
          <h1>Investment firm not found</h1>
          <p>The firm you're looking for doesn't exist or has been removed.</p>
          <Link to="/firms" className="btn btn--green btn--md">
            Browse all firms
          </Link>
        </div>
      </div>
    );
  }

  const tone = (["green", "blue", "orange"] as const)[hueFor(firm.name) % 3];
  const features: any[] = firm.investment_firm_features?.map((f: any) => f.feature).filter(Boolean) || [];
  const leadership: any[] = firm.investment_firm_leadership?.filter(Boolean) || [];
  const registrations: any[] =
    firm.investment_firm_regulatory_info?.map((r: any) => r.registration).filter(Boolean) || [];
  const clientTypes: any[] = firm.investment_firm_clients?.map((c: any) => c.client_type).filter(Boolean) || [];
  const moneyMakingMethods: any[] = firm.money_making_methods || [];
  const assetClasses: string[] = firm.asset_classes || [];

  const pageTitle = `${firm.name} Review`.slice(0, 60);
  const pageDescription = `${firm.description || `${firm.name} investment firm review.`} Minimum investment: ${
    firm.minimum_investment || "not specified"
  }.`.slice(0, 155);

  const money = (v: any) => {
    if (v === null || v === undefined || String(v).trim() === "") return "—";
    const raw = String(v).trim();
    if (/^[0-9,.]+$/.test(raw)) {
      const n = Number(raw.replace(/,/g, ""));
      if (!Number.isNaN(n)) return `$${n.toLocaleString("en-US")}`;
    }
    return raw;
  };

  const stats = [
    { label: "Min. investment", value: money(firm.minimum_investment) },
    { label: "Target return", value: firm.target_return || "—" },
    { label: "AUM", value: firm.aum || "—" },
    {
      label: "Founded",
      value: firm.established ? new Date(firm.established).getFullYear().toString() : "—",
    },
  ];

  const keyInfo = [
    ["Headquarters", firm.headquarters],
    ["Employees", firm.employees_count],
    ["Payout frequency", firm.payout],
    ["Management fees", firm.fees],
    ["Min. investment", money(firm.minimum_investment)],
    ["Asset classes", assetClasses.join(", ")],
  ].filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "");

  return (
    <div className="firm-detail page-enter">
      <Seo
        title={pageTitle}
        description={pageDescription}
        canonicalUrl={`https://financial-professional.lovable.app/firms/${slug}`}
        ogImage={firm.logo_url || undefined}
      />

      <div className="dcontainer">
        <nav className="firm-detail__breadcrumb" aria-label="Breadcrumb">
          <button type="button" onClick={() => navigate("/")}>
            Home
          </button>
          <Chevron />
          <button type="button" onClick={() => navigate("/firms")}>
            Investment firms
          </button>
          <Chevron />
          <span>{firm.name}</span>
        </nav>

        <div className="firm-detail__layout">
          <div className="firm-detail__main">
            <div className="firm-detail__card" style={{ padding: 0, overflow: "hidden" }}>
              <div className={`firm-detail__banner firm-detail__banner--${tone}`} />
              <header className="firm-detail__header">
                {firm.logo_url ? (
                  <img src={firm.logo_url} alt={firm.name} className={`firm-detail__icon firm-detail__icon--${tone}`} style={{ objectFit: "contain", padding: 12 }} />
                ) : (
                  <div className={`firm-detail__icon firm-detail__icon--${tone}`} aria-hidden="true">
                    {firm.name.charAt(0)}
                  </div>
                )}
                <div className="firm-detail__intro">
                  <div className="firm-detail__badges">
                    {firm.verified && <span className="badge badge--blue">Verified</span>}
                    {assetClasses.slice(0, 3).map((a) => (
                      <span key={a} className="badge badge--neutral">
                        {a}
                      </span>
                    ))}
                  </div>
                  <h1>{firm.name}</h1>
                  {firm.description && <p className="firm-detail__tagline">{firm.description}</p>}
                  <div className="firm-detail__meta-row">
                    {firm.headquarters && <span className="firm-detail__loc">{firm.headquarters}</span>}
                    {firm.aum && <span>{firm.aum} AUM</span>}
                  </div>
                </div>
              </header>
              <div className="firm-detail__stats">
                {stats.map((s) => (
                  <div key={s.label} className="firm-detail__stat">
                    <span className="firm-detail__stat-value">{s.value}</span>
                    <span className="firm-detail__stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {(firm.long_description || firm.about) && (
              <section className="firm-detail__section">
                <h2>About {firm.name}</h2>
                <p className="firm-detail__bio" style={{ whiteSpace: "pre-line" }}>
                  {firm.long_description || firm.about}
                </p>
              </section>
            )}

            {features.length > 0 && (
              <section className="firm-detail__section">
                <h2>Investment approach</h2>
                <ul className="firm-detail__values">
                  {features.map((f, i) => (
                    <li key={i}>
                      <span className={`firm-detail__value-dot firm-detail__value-dot--${["green", "blue", "orange"][i % 3]}`} />
                      <div>
                        <strong>{f.title}</strong>
                        {f.description && <p>{f.description}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(moneyMakingMethods.length > 0 || firm.how_company_makes_money || firm.how_you_make_money) && (
              <section className="firm-detail__section">
                <h2>How the money works</h2>
                {firm.how_you_make_money && (
                  <p className="firm-detail__bio" style={{ marginBottom: 16 }}>{firm.how_you_make_money}</p>
                )}
                {moneyMakingMethods.map((m, i) => (
                  <div key={m.id || i} style={{ marginBottom: 12 }}>
                    <strong>{m.title}</strong>
                    <p className="firm-detail__bio">{m.description}</p>
                  </div>
                ))}
                {firm.how_company_makes_money && <p className="firm-detail__bio">{firm.how_company_makes_money}</p>}
              </section>
            )}

            {firm.investment_risks && (
              <section className="firm-detail__section">
                <h2>Investment risks</h2>
                <p className="firm-detail__bio" style={{ whiteSpace: "pre-line" }}>
                  {firm.investment_risks}
                </p>
              </section>
            )}

            {clientTypes.length > 0 && (
              <section className="firm-detail__section">
                <h2>Who they serve</h2>
                <div className="firm-detail__specialty-grid">
                  {clientTypes.map((c, i) => (
                    <span key={i} className="firm-detail__specialty">
                      {c.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {registrations.length > 0 && (
              <section className="firm-detail__section">
                <h2>Regulatory information</h2>
                <div className="firm-detail__specialty-grid">
                  {registrations.map((r, i) => (
                    <span key={i} className="firm-detail__specialty">
                      {r.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {leadership.length > 0 && (
              <section className="firm-detail__section firm-detail__section--roster">
                <div className="firm-detail__roster-header">
                  <h2>Leadership team</h2>
                </div>
                <div className="firm-detail__roster">
                  {leadership.map((p, i) => (
                    <div key={i} className="firm-detail__card" style={{ display: "flex", gap: 14, alignItems: "center" }}>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="avatar avatar--md object-cover" />
                      ) : (
                        <div className="avatar avatar--md" style={{ background: `hsl(${hueFor(p.name || "")} 42% 42%)` }}>
                          <span>{(p.name || "-").charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <strong>{p.name}</strong>
                        <p className="firm-detail__bio" style={{ fontSize: "0.875rem" }}>{p.title}</p>
                        {p.linkedin_url && (
                          <a href={p.linkedin_url} target="_blank" rel="noopener noreferrer">
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="firm-detail__sidebar">
            <div className="firm-detail__card">
              <h3>Key information</h3>
              <dl className="firm-detail__dl">
                {keyInfo.map(([label, value]) => (
                  <div key={String(label)}>
                    <dt>{label}</dt>
                    <dd>{String(value)}</dd>
                  </div>
                ))}
              </dl>
              <div className="firm-detail__actions">
                {firm.firm_link && (
                  <a href={firm.firm_link} target="_blank" rel="noopener noreferrer" className="btn btn--green btn--lg btn--full">
                    Open an account
                  </a>
                )}
                {firm.website_url && (
                  <a href={firm.website_url} target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--md btn--full">
                    Visit website
                  </a>
                )}
              </div>
              <p className="firm-detail__contact-note" style={{ margin: "16px 0 0" }}>
                Investing involves risk, including possible loss of principal.
              </p>
            </div>

            {similarFirms.length > 0 && (
              <div className="firm-detail__card firm-detail__card--muted">
                <h3>Similar firms</h3>
                <ul className="firm-detail__offices">
                  {similarFirms.slice(0, 3).map((f: any) => (
                    <li key={f.id}>
                      <Link to={`/firms/${f.slug}`} style={{ display: "block" }}>
                        <strong style={{ display: "block" }}>{f.name}</strong>
                        <span style={{ display: "block" }}>
                          Min: {money(f.minimum_investment)} · Return: {f.target_return || "—"}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default InvestmentFirmDetailPage;
