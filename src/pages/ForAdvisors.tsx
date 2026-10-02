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
    title: "Not a lead mill.",
    body: "Consumers match free. You aren't buying a name every time someone clicks.",
  },
  {
    tone: "blue" as const,
    title: "Flat membership to be listed.",
    body: "No pay-per-lead. No revenue share on AUM.",
  },
  {
    tone: "orange" as const,
    title: "No pay-to-play rankings.",
    body: "Visibility isn't auctioned to the highest bidder.",
  },
  {
    tone: "green" as const,
    title: "Fiduciary-first matching.",
    body: "Shoppers come in looking for that standard.",
  },
  {
    tone: "blue" as const,
    title: "Transparent profile.",
    body: "Fees, minimums, specialties, credentials. Built for comparison, not brochure fluff.",
  },
  {
    tone: "orange" as const,
    title: "Match + browse.",
    body: "Quiz and directory so households can find you either way.",
  },
  {
    tone: "green" as const,
    title: "Advisors and accountants together.",
    body: "Households don't experience wealth and tax as separate vendors.",
  },
];

const STEPS = [
  { num: "01", title: "Create profile", color: "green" as const },
  { num: "02", title: "Complete verification", color: "blue" as const },
  { num: "03", title: "Appear in match and browse when you're a fit", color: "orange" as const },
];

const ForAdvisors = () => {
  return (
    <div className="for-pro page-enter">
      <Seo
        title="For Advisors | Financial Professional"
        description="List your fiduciary advisory practice on Financial Professional. Flat membership to be listed, no pay-per-click, and rankings that aren't for sale."
        canonicalUrl="https://financialprofessional.com/for-advisors"
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
            For advisors
          </div>
          <h1>
            Get found by people already looking
            <br />
            for a <em>fiduciary</em>
          </h1>
          <p className="for-pro__hero-sub">
            Financial Professional is a consumer marketplace that matches households with vetted
            financial professionals. Create a profile, show fees and specialties clearly, and show
            up when someone is ready to talk. Not when a lead vendor is ready to bill you.
          </p>
          <div className="for-pro__hero-actions">
            <Link to="/advisor-registration" className="btn btn--primary btn--lg">
              Create your advisor profile
            </Link>
            <p className="for-pro__micro">
              Flat membership to be listed. No pay-per-click. Rankings aren't for sale.
            </p>
          </div>
        </div>
      </section>

      <section className="for-pro__trust" aria-label="Membership highlights">
        <div className="dcontainer for-pro__trust-inner">
          <div className="for-pro__trust-item">
            <strong>Flat membership to be listed</strong>
          </div>
          <div className="for-pro__trust-divider" aria-hidden="true" />
          <div className="for-pro__trust-item">
            <strong>No pay-per-click</strong>
          </div>
          <div className="for-pro__trust-divider" aria-hidden="true" />
          <div className="for-pro__trust-item">
            <strong>Rankings aren't for sale</strong>
          </div>
        </div>
      </section>

      <section className="for-pro__band for-pro__band--white">
        <div className="dcontainer">
          <div className="for-pro__section-header">
            <span className="keyline" />
            <p className="for-pro__section-eyebrow">Who it's for</p>
            <h2>
              Built for RIAs and
              <br />
              <em>fiduciary advisors</em>
            </h2>
          </div>
          <div className="for-pro__who-card">
            <p>
              RIAs and fiduciary advisors who want inbound from people comparing professionals, not
              shared dialer leads.
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
              A marketplace built for
              <br />
              <em>real professionals</em>
            </h2>
          </div>
          <div className="for-pro__benefit-grid">
            {BENEFITS.map((item) => (
              <article key={item.title} className={`for-pro__benefit for-pro__benefit--${item.tone}`}>
                <span className="for-pro__benefit-icon">
                  <CheckIcon />
                </span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
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
            <p className="for-pro__section-eyebrow">Listing standards</p>
            <h2>
              Clear profiles.
              <br />
              <em>Honest expectations.</em>
            </h2>
          </div>
          <div className="for-pro__info-grid">
            <article className="for-pro__info-card for-pro__info-card--wide">
              <span className="keyline" />
              <h3>How you get found</h3>
              <p>
                Profile in the marketplace, specialty and location paths, and consumer match flow. Do
                not claim ChatGPT/Google ranking we haven't earned. Build pages and profiles that can
                actually be indexed.
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
            <article className="for-pro__info-card">
              <span className="keyline keyline-orange" />
              <h3>What we expect</h3>
              <p>
                Accurate registration details, honest fees and minimums, specialties you actually
                serve, and verification so "listed" means something.
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
            <Link to="/advisor-registration" className="btn btn--primary btn--lg">
              Create your advisor profile
            </Link>
          </div>
        </div>
      </section>

      <section className="for-pro__cta">
        <div className="dcontainer for-pro__cta-inner">
          <div className="for-pro__cta-text">
            <h2>List your practice on Financial Professional</h2>
            <p>Flat membership to be listed. No pay-per-click. Rankings aren't for sale.</p>
          </div>
          <div className="for-pro__cta-actions">
            <Link to="/advisor-registration" className="btn btn--green btn--lg">
              Create your advisor profile
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForAdvisors;
