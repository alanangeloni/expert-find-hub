import { Link, useParams } from "react-router-dom";
import { Seo } from "@/components/seo/Seo";
import { CATALOG, calculatorBySlug } from "@/features/calculators/catalog";
import CalculatorTool from "@/features/calculators/CalculatorTool";
import CalculatorGuide from "@/features/calculators/CalculatorGuide";
import { guideFor } from "@/features/calculators/guides";

const CalculatorPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const meta = calculatorBySlug(slug);

  if (!meta) {
    return (
      <div className="firm-search page-enter">
        <div className="firm-search__hero">
          <div className="dcontainer firm-search__hero-copy">
            <span className="keyline" />
            <p className="firm-search__eyebrow">Calculators</p>
            <h1>Calculator not found</h1>
            <p className="firm-search__sub">That tool is not in the directory.</p>
            <Link to="/calculators" className="btn btn--primary btn--md">
              All calculators
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const others = [
    ...CATALOG.filter((item) => item.id !== meta.id && item.category === meta.category),
    ...CATALOG.filter((item) => item.id !== meta.id && item.category !== meta.category),
  ].slice(0, 4);
  const guide = guideFor(meta.id);

  return (
    <div className="firm-search page-enter">
      <Seo
        title={`${meta.name} Calculator | Financial Professional`}
        description={meta.blurb}
        canonicalUrl={`https://financialprofessional.com/calculators/${meta.slug}`}
        structuredData={{
          "@type": "FAQPage",
          mainEntity: guide.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }}
      />

      <div className="firm-search__hero">
        <div className="dcontainer firm-search__hero-row">
          <div className="firm-search__hero-copy">
            <span className="keyline" />
            <p className="firm-search__eyebrow">
              <Link to="/calculators">Calculators</Link>
              {" · "}
              {meta.category}
            </p>
            <h1>
              {meta.name}
              <br />
              <em>calculator</em>
            </h1>
            <p className="firm-search__sub">
              {meta.blurb} When the number looks right, send it to the matching quiz and we will preselect{" "}
              {meta.goal.toLowerCase()}.
            </p>
          </div>
          <div className="firm-search__hero-cta">
            <Link to="/calculators" className="btn btn--outline btn--lg">
              All calculators
            </Link>
            <Link to="/#match" className="btn btn--primary btn--lg">
              Take the matching quiz
            </Link>
          </div>
        </div>
      </div>

      <div className="dcontainer firm-search__body">
        <CalculatorTool id={meta.id} showHeader={false} />
        <CalculatorGuide name={meta.name} guide={guide} />
        <section>
          <p className="firm-search__eyebrow">More calculators</p>
          <div className="firm-search__grid">
            {others.map((item) => (
              <Link key={item.id} to={`/calculators/${item.slug}`} className="firm-card firm-card--green">
                <div className="firm-card__accent" aria-hidden="true" />
                <div className="firm-card__heading">
                  <h3>{item.name}</h3>
                  <p className="firm-card__tagline">{item.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CalculatorPage;
