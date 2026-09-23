import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { CalculatorGuide as Guide } from './guides';

type Props = {
  name: string;
  guide: Guide;
};

export default function CalculatorGuide({ name, guide }: Props) {
  return (
    <article className="calc-guide">
      <section>
        <p className="firm-search__eyebrow">How to use it</p>
        <h2>How to use the {name.toLowerCase()} calculator</h2>
        <ol className="calc-guide__steps">
          {guide.howTo.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section>
        <p className="firm-search__eyebrow">The result</p>
        <h2>What the number means</h2>
        <p>{guide.result}</p>
      </section>

      <section>
        <p className="firm-search__eyebrow">The math</p>
        <h2>How this calculator works</h2>
        <div className="calc-guide__blocks">
          {guide.howItWorks.map((section) => (
            <div key={section.heading}>
              <h3>{section.heading}</h3>
              <p>{section.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="calc-guide__example">
        <p className="firm-search__eyebrow">Worked example</p>
        <h2>{guide.example.title}</h2>
        <p>{guide.example.setup}</p>
        <p>{guide.example.result}</p>
      </section>

      <section>
        <p className="firm-search__eyebrow">Key terms</p>
        <h2>Words this calculator uses</h2>
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
        <p className="firm-search__eyebrow">In practice</p>
        <h2>How to use the result</h2>
        <ul className="calc-guide__tips">
          {guide.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      <section>
        <p className="firm-search__eyebrow">Questions</p>
        <h2>People also ask</h2>
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
        <p className="firm-search__eyebrow">Assumptions</p>
        <h2>What this estimate leaves out</h2>
        <ul className="calc-guide__tips">
          {guide.assumptions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="calc-guide__disclaimer">
          These figures are estimates to help you understand the tradeoff. They are not tax, legal, insurance, or
          investment advice. A fiduciary can look at the same numbers in the context of the rest of your plan.
        </p>
      </section>
    </article>
  );
}
