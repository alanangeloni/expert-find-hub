import { Link } from "react-router-dom";
import { Seo } from "@/components/seo/Seo";

const WHY_LIST = [
  "Same anti-lead-mill model. Flat listing, not pay-per-click.",
  "Sit next to fiduciary advisors. Cleaner handoffs for households that need both.",
  "Transparent services. Tax prep vs planning, business, specialty work. Only what's real.",
  "No pay-to-play rankings.",
  "Browse + match paths for accountant intent as those flows go live.",
];

const STEPS = [
  "Create accountant profile",
  "Complete verification",
  "Appear in accountant browse and relevant match flows",
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
        <div className="dcontainer for-pro__hero-row">
          <div className="for-pro__hero-copy">
            <span className="keyline" />
            <p className="for-pro__eyebrow">For accountants</p>
            <h1>
              Get found when households need a
              <br />
              <em>CPA</em>, not just an advisor
            </h1>
            <p className="for-pro__sub">
              Taxes aren't an April-only problem. Financial Professional lists accountants alongside
              fiduciary advisors so people can find the right professional for the job, and so you're
              discoverable next to the planners your clients already use.
            </p>
          </div>
          <div className="for-pro__hero-cta">
            <Link to="/accountant-registration" className="btn btn--primary btn--lg">
              Create your accountant profile
            </Link>
            <p className="for-pro__micro">
              Same marketplace. Clear specialties. No pay-to-play rankings.
            </p>
          </div>
        </div>
      </section>

      <div className="dcontainer for-pro__body">
        <section className="for-pro__section">
          <h2>Who it's for</h2>
          <p>
            CPAs and tax professionals who want consumer (and advisor-adjacent) discovery without
            buying click leads.
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
          <h2>Audience</h2>
          <p>
            Financial Professional&apos;s consumer channels (including Instagram at over 675,000
            followers) exist to send people toward real professionals.
          </p>
        </section>

        <section className="for-pro__section">
          <h2>What your profile should show</h2>
          <p>
            Credentials, services you actually offer, who you serve (individuals, business owners,
            both), and a clear next step.
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
          <Link to="/accountant-registration" className="btn btn--primary btn--lg">
            List your accounting practice
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ForAccountants;
