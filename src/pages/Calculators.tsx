import { Link } from "react-router-dom";
import { Seo } from "@/components/seo/Seo";
import { CATALOG, CATEGORIES } from "@/features/calculators/catalog";
import "@/features/calculators/calculators.css";

const TONES = ["green", "blue", "orange"] as const;

const Calculators = () => {
  const groups = CATEGORIES.filter((category) => category !== "All").map((category) => ({
    category,
    items: CATALOG.filter((item) => item.category === category),
  }));

  return (
    <div className="firm-search page-enter">
      <Seo
        title="Financial Calculators | Financial Professional"
        description="Run mortgage, debt, savings, retirement, and tax calculators in your browser, then match with a fiduciary advisor using the same numbers."
        canonicalUrl="https://financialprofessional.com/calculators"
      />

      <div className="firm-search__hero">
        <div className="dcontainer firm-search__hero-row">
          <div className="firm-search__hero-copy">
            <span className="keyline" />
            <p className="firm-search__eyebrow">Free tools</p>
            <h1>
              Financial
              <br />
              <em>calculators</em>
            </h1>
            <p className="firm-search__sub">
              {CATALOG.length} calculators for home, debt, saving, investing, taxes, and planning. Your inputs stay
              in this browser. When a result looks right, send it into the matching quiz.
            </p>
          </div>
          <div className="firm-search__hero-cta">
            <Link to="/#match" className="btn btn--primary btn--lg">
              Take the matching quiz
            </Link>
            <Link to="/advisors" className="btn btn--outline btn--lg">
              Browse advisors
            </Link>
          </div>
        </div>
      </div>

      <div className="dcontainer firm-search__body">
        <section className="calc-index-intro">
          <p className="firm-search__eyebrow">How they work</p>
          <h2>A number, then the reason behind it</h2>
          <p>
            Each calculator keeps the tool at the top and an explanation underneath, so you can see how the math
            works, what the result is telling you, and which assumptions it leaves out.
          </p>
          <div className="calc-index-intro__grid">
            <div>
              <h3>It stays in this browser</h3>
              <p>What you type is saved on this device. It is not sent to an account, and you can reset it on the tool.</p>
            </div>
            <div>
              <h3>Read the result before you act on it</h3>
              <p>
                The guide under the tool uses the same default numbers as the calculator, then explains the formula
                in plain language.
              </p>
            </div>
            <div>
              <h3>Carry the number into a match</h3>
              <p>
                Use these numbers sends the result to the matching quiz and preselects a planning goal. The first
                conversation with an advisor is free.
              </p>
            </div>
          </div>
        </section>
        {groups.map((group) => (
          <section key={group.category}>
            <p className="firm-search__eyebrow">{group.category}</p>
            <div className="firm-search__grid">
              {group.items.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/calculators/${item.slug}`}
                  className={`firm-card firm-card--${TONES[index % TONES.length]}`}
                >
                  <div className="firm-card__accent" aria-hidden="true" />
                  <div className="firm-card__header">
                    <div className="firm-card__icon" aria-hidden="true">
                      {item.name.charAt(0)}
                    </div>
                    <div className="firm-card__heading">
                      <h3>{item.name}</h3>
                      <p className="firm-card__tagline">{item.tagline}</p>
                    </div>
                  </div>
                  <p className="firm-card__desc">{item.blurb}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Calculators;
