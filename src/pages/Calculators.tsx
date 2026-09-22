import { Link } from "react-router-dom";
import { Seo } from "@/components/seo/Seo";
import { CATALOG, CATEGORIES } from "@/features/calculators/catalog";
import Icon from "@/features/calculators/Icon";
import "@/features/calculators/calculators.css";

const Calculators = () => {
  const groups = CATEGORIES.filter((category) => category !== "All").map((category) => ({
    category,
    items: CATALOG.filter((item) => item.category === category),
  }));

  return (
    <div className="page-enter">
      <Seo
        title="Financial Calculators | Financial Professional"
        description="Run mortgage, debt, savings, retirement, and tax calculators in your browser, then match with a fiduciary advisor using the same numbers."
        canonicalUrl="https://financialprofessional.com/calculators"
      />
      <section className="home-quiz" style={{ borderBottom: "1px solid var(--gray-200)" }}>
        <div className="dcontainer">
          <div className="home-section-header">
            <span className="keyline" />
            <p className="home-section-eyebrow">Free tools</p>
            <h1>
              Financial calculators
              <br />
              <em>for real decisions.</em>
            </h1>
            <p className="home-section-desc">
              Twelve calculators for home, debt, saving, investing, and taxes. Your inputs stay in this browser.
              When you are ready, send the result into the matching quiz.
            </p>
          </div>
          <div className="fp-calc" style={{ marginTop: 48 }}>
            {groups.map((group) => (
              <div key={group.category} style={{ marginBottom: 36 }}>
                <h2 className="fp-tool__cat" style={{ marginBottom: 14 }}>
                  {group.category}
                </h2>
                <div className="calcs__grid">
                  {group.items.map((item) => (
                    <Link
                      key={item.id}
                      to={`/calculators/${item.slug}`}
                      className="ccard"
                      style={{ ["--card-accent" as string]: item.accent }}
                    >
                      <span className="ccard__main">
                        <span className="ccard__icon">
                          <Icon name={item.icon} size={20} />
                        </span>
                        <span className="ccard__cat">{item.category}</span>
                        <strong className="ccard__name">{item.name}</strong>
                        <span className="ccard__tagline">{item.tagline}</span>
                        <span className="ccard__blurb">{item.blurb}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Calculators;
