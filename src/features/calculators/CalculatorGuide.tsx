import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { CalculatorGuide as Guide } from './guides';
import type { CalculatorArticle } from './articles';

type Props = {
  name: string;
  guide: Guide;
  article: CalculatorArticle;
};

const wordsIn = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

const anchorId = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function readMinutes(guide: Guide, article: CalculatorArticle): number {
  const chunks = [
    article.lede,
    ...article.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
    guide.result,
    ...guide.howItWorks.flatMap((section) => [section.heading, section.body]),
    guide.example.setup,
    guide.example.result,
    ...guide.faqs.flatMap((faq) => [faq.q, faq.a]),
  ];
  return Math.max(4, Math.round(chunks.reduce((sum, text) => sum + wordsIn(text), 0) / 220));
}

export default function CalculatorGuide({ name, guide, article }: Props) {
  const minutes = readMinutes(guide, article);
  const contents = [
    ...article.sections.map((section) => ({ id: anchorId(section.heading), label: section.heading })),
    { id: 'how-to-use', label: 'How to use the calculator' },
    { id: 'worked-example', label: 'A worked example' },
    { id: 'questions', label: 'Questions people ask' },
  ];

  return (
    <div className="blog-post__layout calc-article">
      <article className="blog-post__article">
        <div className="blog-post__keyline" />
        <p className="blog-post__dek">{article.lede}</p>
        <p className="calc-article__byline">Financial Professional · {minutes} min read</p>

        <div className="blog-post__content">
          {article.sections.map((section) => (
            <section key={section.heading} id={anchorId(section.heading)}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}

          <section id="how-to-use">
            <h2>How to use the {name.toLowerCase()} calculator</h2>
            <p>{guide.result}</p>
            <ol className="calc-guide__steps">
              {guide.howTo.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section>
            <h2>How the math works</h2>
            {guide.howItWorks.map((section) => (
              <div key={section.heading}>
                <h3>{section.heading}</h3>
                <p>{section.body}</p>
              </div>
            ))}
          </section>

          <section id="worked-example" className="calc-guide__example">
            <h2>{guide.example.title}</h2>
            <p>{guide.example.setup}</p>
            <p>{guide.example.result}</p>
          </section>

          <section>
            <h2>Terms worth knowing</h2>
            <dl className="calc-guide__terms">
              {guide.terms.map((term) => (
                <div key={term.term}>
                  <dt>{term.term}</dt>
                  <dd>{term.definition}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2>What to do with the number</h2>
            {guide.tips.map((tip) => (
              <p key={tip}>{tip}</p>
            ))}
          </section>

          <section id="questions">
            <h2>Questions people ask</h2>
            <Accordion type="single" collapsible className="calc-guide__faq">
              {guide.faqs.map((faq, index) => (
                <AccordionItem key={faq.q} value={`faq-${index}`} className="service-page__faq-item">
                  <AccordionTrigger className="service-page__faq-q">{faq.q}</AccordionTrigger>
                  <AccordionContent className="service-page__faq-a">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section>
            <h2>What this leaves out</h2>
            {guide.assumptions.map((item) => (
              <p key={item}>{item}</p>
            ))}
            <p className="calc-guide__disclaimer">
              These figures are estimates to help you understand the tradeoff. They are not tax, legal, insurance, or
              investment advice. A fiduciary can look at the same numbers in the context of the rest of your plan.
            </p>
          </section>
        </div>
      </article>

      <aside className="blog-post__sidebar">
        <div className="blog-post__side-card">
          <h3>In this guide</h3>
          <div className="blog-post__side-cats">
            {contents.map((item) => (
              <a key={item.id} className="blog-post__side-cat" href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div className="blog-post__side-card blog-post__side-card--accent">
          <span className="blog-post__side-eyebrow">Next step</span>
          <h3>Use the number with an advisor</h3>
          <p>Send this result into the matching quiz when you want a fiduciary to look at the same figures.</p>
          <Link to="/#match" className="btn btn--primary btn--sm">
            Take the matching quiz
          </Link>
        </div>
      </aside>
    </div>
  );
}
