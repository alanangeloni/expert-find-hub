import { Link } from "react-router-dom";
import { Seo } from "@/components/seo/Seo";

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const BENEFITS = [
  {
    tone: "green" as const,
    title: "Same anti-lead-mill model.",
    body: "Flat listing, not pay-per-click. No pay-to-play rankings.",
  },
  {
    tone: "blue" as const,
    title: "Sit next to fiduciary advisors.",
    body: "Cleaner handoffs for households that need both.",
  },
  {
    tone: "orange" as const,
    title: "Transparent services.",
    body: "Tax prep vs planning, business, specialty work. Only what's real.",
  },
  {
    tone: "green" as const,
    title: "Browse + match paths for accountant intent as those flows go live.",
    body: "",
  },
];

const STEPS = [
  { num: "01", title: "Create accountant profile", color: "green" as const },
  { num: "02", title: "Complete verification", color: "blue" as const },
  { num: "03", title: "Appear in accountant browse and relevant match flows", color: "orange" as const },
];

const ForAccountants = () => {
  return (
    <div className="for-pro page-enter">
      <Seo
        title="For Accountants | Financial Professional"
        description="List your CPA or tax practice on Financial Professional. Same marketplace as fiduciary advisors, clear specialties, and no pay-to-play rankings."
        canonicalUrl="https://financialprofessional.com/for-accountants"
      />

      <section className="for-pro__hero">
        <div className="for-pro__hero-bg" aria-hidden="true">
          <div className="for-pro__hero-orb for-pro__hero-orb--1" />
          <div className="for-pro__hero-orb for-pro__hero-orb--2" />
          <div className="for-pro__hero-grid" />
        </div>
        <div className="dcontainer for-pro__hero-content">
          <div className="for-pro__eyebrow-pill">
            <span className="for-pro__eyebrow-dot" />
            For accountants
          </div>
          <h1>
            Get found when households need a
            <br />
            <em>CPA</em>, not just an advisor
          </h1>
          <p className="for-pro__hero-sub">
            Taxes aren't an April-only problem. Financial Professional lists accountants alongside
            fiduciary advisors so people can find the right professional for the job, and so you're
            discoverable next to the planners your clients already use.
          </p>
          <div className="for-pro__hero-actions">
            <Link to="/accountant-registration" className="btn btn--primary btn--lg">
              Create your accountant profile
            </Link>
            <p className="for-pro__micro">
              Same marketplace. Clear specialties. No pay-to-play rankings.
            </p>
          </div>
        </div>
      </section>

      <section className="for-pro__trust" aria-label="Marketplace highlights">
        <div className="dcontainer for-pro__trust-inner">
          <div className="for-pro__trust-item">
            <strong>Same marketplace</strong>
          </div>
          <div className="for-pro__trust-divider" aria-hidden="true" />
          <div className="for-pro__trust-item">
            <strong>Clear specialties</strong>
          </div>
          <div className="for-pro__trust-divider" aria-hidden="true" />
          <div className="for-pro__trust-item">
            <strong>No pay-to-play rankings</strong>
          </div>
        </div>
      </section>

      <section className="for-pro__band for-pro__band--white">
        <div className="dcontainer">
          <div className="for-pro__section-header">
            <span className="keyline" />
            <p className="for-pro__section-eyebrow">Who it's for</p>
            <h2>
              Built for CPAs and
              <br />
              <em>tax professionals</em>
            </h2>
          </div>
          <div className="for-pro__who-card">
            <p>
              CPAs and tax professionals who want consumer (and advisor-adjacent) discovery without
              buying click leads.
            </p>
          </div>
        </div>
      </section>

      <section className="for-pro__band for-pro__band--cream">
        <div className="dcontainer">
          <div className="for-pro__section-header">
            <span className="keyline" />
            <p className="for-pro__section-eyebrow">Why list here</p>
            <h2>
              Discovery without
              <br />
              <em>buying click leads</em>
            </h2>
          </div>
          <div className="for-pro__benefit-grid">
            {BENEFITS.map((item) => (
              <article key={item.title} className={`for-pro__benefit for-pro__benefit--${item.tone}`}>
                <span className="for-pro__benefit-icon">
                  <CheckIcon />
                </span>
                <h3>{item.title}</h3>
                {item.body ? <p>{item.body}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="for-pro__band for-pro__band--white">
        <div className="dcontainer">
          <div className="for-pro__section-header">
            <span className="keyline" />
            <p className="for-pro__section-eyebrow">Audience</p>
            <h2>
              Consumer channels that
              <br />
              <em>point people to you</em>
            </h2>
          </div>
          <div className="for-pro__audience">
            <div className="for-pro__audience-stat">
              <strong>over 675,000</strong>
              <span>Instagram followers</span>
            </div>
            <div className="for-pro__audience-copy">
              <p>
                Financial Professional&apos;s consumer channels (including Instagram at over 675,000
                followers) exist to send people toward real professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="for-pro__band for-pro__band--cream">
        <div className="dcontainer">
          <div className="for-pro__section-header">
            <span className="keyline keyline-blue" />
            <p className="for-pro__section-eyebrow">Your listing</p>
            <h2>
              What your profile
              <br />
              <em>should show</em>
            </h2>
          </div>
          <div className="for-pro__info-grid">
            <article className="for-pro__info-card">
              <span className="keyline" />
              <h3>What your profile should show</h3>
              <p>
                Credentials, services you actually offer, who you serve (individuals, business
                owners, both), and a clear next step.
              </p>
            </article>
            <article className="for-pro__info-card">
              <span className="keyline keyline-blue" />
              <h3>Reviews policy</h3>
              <p>
                We are not selling a review/testimonial platform today. Your listing stands on clear
                fees, credentials, and verification. If we add compliant reviews later, we'll say so.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="for-pro__band for-pro__band--white">
        <div className="dcontainer">
          <div className="for-pro__section-header">
            <span className="keyline" />
            <p className="for-pro__section-eyebrow">How it works</p>
            <h2>
              Three steps to
              <br />
              <em>get listed</em>
            </h2>
          </div>
          <div className="for-pro__steps">
            {STEPS.map((step) => (
              <div key={step.num} className={`for-pro__step for-pro__step--${step.color}`}>
                <span className="for-pro__step-num">{step.num}</span>
                <h3>{step.title}</h3>
              </div>
            ))}
          </div>
          <div className="for-pro__steps-cta">
            <Link to="/accountant-registration" className="btn btn--primary btn--lg">
              Create your accountant profile
            </Link>
          </div>
        </div>
      </section>

      <section className="for-pro__cta">
        <div className="dcontainer for-pro__cta-inner">
          <div className="for-pro__cta-text">
            <h2>List your accounting practice</h2>
            <p>Same marketplace. Clear specialties. No pay-to-play rankings.</p>
          </div>
          <div className="for-pro__cta-actions">
            <Link to="/accountant-registration" className="btn btn--green btn--lg">
              Create your accountant profile
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForAccountants;
