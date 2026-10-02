import { Link } from "react-router-dom";
import { Seo } from "@/components/seo/Seo";

const WHY_LIST = [
  "Not a lead mill. Consumers match free. You aren't buying a name every time someone clicks.",
  "Flat membership to be listed. No pay-per-lead. No revenue share on AUM.",
  "No pay-to-play rankings. Visibility isn't auctioned to the highest bidder.",
  "Fiduciary-first matching. Shoppers come in looking for that standard.",
  "Transparent profile. Fees, minimums, specialties, credentials. Built for comparison, not brochure fluff.",
  "Match + browse. Quiz and directory so households can find you either way.",
  "Advisors and accountants together. Households don't experience wealth and tax as separate vendors.",
];

const STEPS = [
  "Create profile",
  "Complete verification",
  "Appear in match and browse when you're a fit",
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
        <div className="dcontainer for-pro__hero-row">
          <div className="for-pro__hero-copy">
            <span className="keyline" />
            <p className="for-pro__eyebrow">For advisors</p>
            <h1>
              Get found by people already looking
              <br />
              for a <em>fiduciary</em>
            </h1>
            <p className="for-pro__sub">
              Financial Professional is a consumer marketplace that matches households with vetted
              financial professionals. Create a profile, show fees and specialties clearly, and show
              up when someone is ready to talk. Not when a lead vendor is ready to bill you.
            </p>
          </div>
          <div className="for-pro__hero-cta">
            <Link to="/advisor-registration" className="btn btn--primary btn--lg">
              Create your advisor profile
            </Link>
            <p className="for-pro__micro">
              Flat membership to be listed. No pay-per-click. Rankings aren't for sale.
            </p>
          </div>
        </div>
      </section>

      <div className="dcontainer for-pro__body">
        <section className="for-pro__section">
          <h2>Who it's for</h2>
          <p>
            RIAs and fiduciary advisors who want inbound from people comparing professionals, not
            shared dialer leads.
          </p>
        </section>

        <section className="for-pro__section">
          <h2>Why list here</h2>
          <ul className="for-pro__bullets">
            {WHY_LIST.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="for-pro__section">
          <h2>How you get found</h2>
          <p>
            Profile in the marketplace, specialty and location paths, and consumer match flow. Do
            not claim ChatGPT/Google ranking we haven't earned. Build pages and profiles that can
            actually be indexed.
          </p>
        </section>

        <section className="for-pro__section">
          <h2>Reviews policy</h2>
          <p>
            We are not selling a review/testimonial platform today. Your listing stands on clear
            fees, credentials, and verification. If we add compliant reviews later, we'll say so.
          </p>
        </section>

        <section className="for-pro__section">
          <h2>What we expect</h2>
          <p>
            Accurate registration details, honest fees and minimums, specialties you actually serve,
            and verification so "listed" means something.
          </p>
        </section>

        <section className="for-pro__section">
          <h2>How it works</h2>
          <ol className="for-pro__steps">
            {STEPS.map((step, i) => (
              <li key={step}>
                <span className="for-pro__step-num">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="for-pro__bottom">
        <div className="dcontainer for-pro__bottom-inner">
          <Link to="/advisor-registration" className="btn btn--primary btn--lg">
            List your practice on Financial Professional
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ForAdvisors;
