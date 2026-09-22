import { Link, useParams } from "react-router-dom";
import { Seo } from "@/components/seo/Seo";
import { CATALOG, calculatorBySlug } from "@/features/calculators/catalog";
import CalculatorTool from "@/features/calculators/CalculatorTool";

const CalculatorPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const meta = calculatorBySlug(slug);

  if (!meta) {
    return (
      <div className="blog-post blog-post--missing page-enter">
        <div className="container">
          <h1>Calculator not found</h1>
          <p>That tool is not in the directory.</p>
          <Link to="/calculators" className="btn btn--primary btn--md">
            All calculators
          </Link>
        </div>
      </div>
    );
  }

  const others = CATALOG.filter((item) => item.id !== meta.id).slice(0, 4);

  return (
    <div className="page-enter">
      <Seo
        title={`${meta.name} Calculator | Financial Professional`}
        description={meta.blurb}
        canonicalUrl={`https://financialprofessional.com/calculators/${meta.slug}`}
      />
      <section className="home-quiz">
        <div className="dcontainer">
          <p className="home-section-eyebrow">
            <Link to="/calculators">Calculators</Link>
            {" / "}
            {meta.category}
          </p>
          <h1 style={{ marginTop: 12 }}>
            {meta.name}
            <br />
            <em>calculator</em>
          </h1>
          <p className="home-section-desc" style={{ marginTop: 12, maxWidth: 640 }}>
            {meta.blurb} When the number looks right, send it to the matching quiz and we will preselect{" "}
            {meta.goal.toLowerCase()}.
          </p>
          <div style={{ marginTop: 36 }}>
            <CalculatorTool id={meta.id} />
          </div>
          <div style={{ marginTop: 40 }}>
            <h2 className="home-section-eyebrow">More calculators</h2>
            <div className="home-quiz__chips" style={{ marginTop: 16 }}>
              {others.map((item) => (
                <Link key={item.id} to={`/calculators/${item.slug}`} className="home-quiz__chip">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CalculatorPage;
