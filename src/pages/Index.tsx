import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AdvisorCard } from "@/components/advisors/AdvisorCard";
import { getAdvisors, getAllAdvisors } from "@/services/advisorsService";
import { SPECIALTY_GROUPS } from "@/constants/specialties";
import { Seo } from "@/components/seo/Seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MatchQuiz from "@/components/home/MatchQuiz";

/* --------------------------- Featured advisors --------------------------- */
const FeaturedAdvisors = () => {
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getAdvisors({ page: 1, pageSize: 12 });
        const shuffled = [...(data || [])].sort(() => 0.5 - Math.random());
        setAdvisors(shuffled.slice(0, 3));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="home-featured__grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="home-featured__skeleton" />
        ))}
      </div>
    );
  }

  if (!advisors.length) return null;

  return (
    <div className="home-featured__grid">
      {advisors.map((a) => (
        <AdvisorCard key={a.id} advisor={a} />
      ))}
    </div>
  );
};

const SpecialtyGrid = () => {
  const { data: advisors = [] } = useQuery({ queryKey: ["all-advisors"], queryFn: getAllAdvisors });

  return (
    <div className="home-specialties__grid">
      {SPECIALTY_GROUPS.map((group, i) => {
        const tones = ["green", "blue", "orange"] as const;
        const tone = tones[i % 3];
        const count = advisors.filter((a) =>
          (a.advisor_services || []).some((s) => group.values.includes(s))
        ).length;
        return (
          <Link
            key={group.label}
            className={`home-specialty home-specialty--${tone}`}
            to={`/advisors?specialty=${encodeURIComponent(group.label)}`}
          >
            <span className="home-specialty__name">{group.label}</span>
            <span className="home-specialty__count">
              {count} advisor{count !== 1 ? "s" : ""}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        );
      })}
    </div>
  );
};

const FAQS = [
  {
    q: "How much does it cost to get matched?",
    a: "Nothing. Searching the directory and getting matched with advisors is completely free for you. Advisors pay to be listed, and that never affects how we rank or display them.",
  },
  {
    q: "What does fiduciary actually mean?",
    a: "A fiduciary is legally required to put your interests ahead of their own. That means no product commissions steering the advice you receive.",
  },
  {
    q: "How are advisors vetted?",
    a: "We verify credentials, registrations, and disclosures. You should always confirm details on the SEC's Investment Adviser Public Disclosure database before engaging anyone.",
  },
  {
    q: "Do I need a minimum amount of money?",
    a: "No. Many advisors in the directory work with clients who are just getting started, and you can filter by minimum asset requirement.",
  },
  {
    q: "What happens after I reach out?",
    a: "You'll schedule a free intro call. There is no obligation. Talk to as many advisors as you like before deciding.",
  },
];

/* --------------------------------- Page --------------------------------- */
const HomePage = () => {
  const navigate = useNavigate();
  const [heroQuery, setHeroQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = heroQuery.trim();
    navigate(q ? `/advisors?search=${encodeURIComponent(q)}` : "/advisors");
  };

  return (
    <div className="home page-enter">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero__bg" aria-hidden="true">
          <div className="home-hero__orb home-hero__orb--1" />
          <div className="home-hero__orb home-hero__orb--2" />
          <div className="home-hero__grid" />
        </div>
        <div className="dcontainer home-hero__content">
          <div className="home-hero__eyebrow">
            <span className="home-hero__eyebrow-dot" />
            Zero commissions. Real matches.
          </div>
          <h1 className="home-hero__title">
            Achieve your Financial Goals
            <br />
            <span className="home-hero__title-serif">with a Financial Professional</span>
          </h1>
          <p className="home-hero__subtitle">
            We match you with vetted fiduciary financial advisors, based on your goals, values, and
            the way you actually want to work together.
          </p>

          <form className="home-hero__search" onSubmit={handleSearch}>
            <div className="home-hero__search-field">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="search"
                placeholder="Try “retirement,” “tax planning,” or a name…"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                aria-label="Search advisors"
              />
            </div>
            <button type="submit" className="btn btn--primary btn--lg">
              Search advisors
            </button>
          </form>

          <div className="home-hero__chips">
            <span className="home-hero__chips-label">Popular:</span>
            <div className="home-hero__chips-row">
              {["Retirement Planning", "Tax Planning", "Estate/Trust Planning", "Small Business Planning"].map((s) => (
                <Link key={s} className="home-hero__chip" to={`/advisors?specialties=${encodeURIComponent(s)}`}>
                  {s}
                </Link>
              ))}
            </div>
          </div>

          <div className="home-hero__quiz-cta">
            <p>Not sure where to start?</p>
            <a className="btn btn--green btn--lg" href="#match">
              Take the 2-min matching quiz
            </a>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="home-trust">
        <div className="dcontainer home-trust__inner">
          <div className="home-trust__item">
            <strong>Vetted</strong>
            <span>Independent advisors</span>
          </div>
          <div className="home-trust__divider" />
          <div className="home-trust__item">
            <strong>100%</strong>
            <span>Fiduciary standard</span>
          </div>
          <div className="home-trust__divider" />
          <div className="home-trust__item">
            <strong>$0</strong>
            <span>Cost to get matched</span>
          </div>
          <div className="home-trust__divider" />
          <div className="home-trust__item">
            <strong>Nationwide</strong>
            <span>Advisors in every state</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="home-how" id="how-it-works">
        <div className="dcontainer">
          <div className="home-section-header">
            <span className="keyline" />
            <p className="home-section-eyebrow">How it works</p>
            <h2>
              From first search to
              <br />
              <em>the right relationship</em>
            </h2>
            <p className="home-section-desc">
              We cut through the noise so you can focus on what matters: finding someone you trust
              with your financial future.
            </p>
          </div>

          <div className="home-how__steps">
            {[
              {
                num: "01",
                title: "Tell us what matters",
                body: "Take our quick matching quiz: goals, location, fee style, and values. Takes under two minutes.",
                color: "green" as const,
              },
              {
                num: "02",
                title: "Explore & compare",
                body: "Browse transparent profiles and compare advisors: fees, minimums, credentials, and fit.",
                color: "blue" as const,
              },
              {
                num: "03",
                title: "Connect with confidence",
                body: "Reach out directly to advisors who are accepting clients. Every match is a fiduciary.",
                color: "orange" as const,
              },
            ].map((step) => (
              <div key={step.num} className={`home-how__step home-how__step--${step.color}`}>
                <span className="home-how__num">{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>

          <div className="home-how__cta">
            <a className="btn btn--primary btn--lg" href="#match">
              Start the matching quiz
            </a>
          </div>
        </div>
      </section>

      {/* Featured advisors */}
      <section className="home-featured">
        <div className="dcontainer">
          <div className="home-section-header home-section-header--row">
            <div>
              <span className="keyline" />
              <p className="home-section-eyebrow">Featured advisors</p>
              <h2>
                Top-rated professionals
                <br />
                <em>ready to help</em>
              </h2>
            </div>
            <Link className="btn btn--outline btn--md" to="/advisors">
              View all advisors
            </Link>
          </div>

          <FeaturedAdvisors />
        </div>
      </section>

      {/* Specialties */}
      <section className="home-specialties">
        <div className="dcontainer">
          <div className="home-section-header">
            <span className="keyline keyline-blue" />
            <p className="home-section-eyebrow">Browse by focus</p>
            <h2>
              Expertise for every
              <br />
              <em>chapter of wealth</em>
            </h2>
          </div>

          <SpecialtyGrid />

        </div>
      </section>

      {/* Match quiz */}
      <MatchQuiz />

      {/* Why */}
      <section className="home-why">
        <div className="dcontainer home-why__inner">
          <div className="home-why__copy">
            <span className="keyline" />
            <p className="home-section-eyebrow">Why Financial Professional</p>
            <h2>
              Advice relationships
              <br />
              <em>worth building</em>
            </h2>
            <p className="home-section-desc">
              The right advisor can change the trajectory of your financial life. We built this
              directory to make that match feel intentional, not like another lead-gen form.
            </p>
            <ul className="home-why__list">
              {[
                "Every advisor commits to a fiduciary standard",
                "Transparent fees, minimums, and specialties upfront",
                "No pay-to-play rankings, ever",
                "Compare advisors before you commit",
              ].map((item) => (
                <li key={item}>
                  <span className="home-why__check" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <a className="btn btn--green btn--lg" href="#match">
              Start matching
            </a>
          </div>

          <div className="home-why__cards">
            <div className="home-why__card home-why__card--1">
              <span className="badge badge--green badge--sm">Fiduciary</span>
              <h3>Your interests, legally first</h3>
              <p>
                Every professional listed is held to a fiduciary standard. They must put your
                interests ahead of their own.
              </p>
            </div>
            <div className="home-why__card home-why__card--2">
              <span className="badge badge--blue badge--sm">Transparent</span>
              <h3>No hidden agendas</h3>
              <p>
                See fee structures, asset minimums, and credentials before you ever schedule a call.
                Clarity from the first click.
              </p>
            </div>
            <div className="home-why__card home-why__card--3">
              <span className="badge badge--orange badge--sm">Human</span>
              <h3>Match on more than AUM</h3>
              <p>
                Filter by specialty, values, and life stage, because fit is about more than
                portfolio size.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="home-faq">
        <div className="dcontainer">
          <div className="home-section-header">
            <span className="keyline keyline-orange" />
            <p className="home-section-eyebrow">Questions</p>
            <h2>
              Everything you might
              <br />
              <em>be wondering</em>
            </h2>
          </div>

          <Accordion type="single" collapsible className="home-faq__list">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="home-faq__item">
                <AccordionTrigger className="home-faq__q">{f.q}</AccordionTrigger>
                <AccordionContent className="home-faq__a">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA band */}
      <section className="home-cta">
        <div className="dcontainer home-cta__inner">
          <div className="home-cta__text">
            <h2>Ready to find your advisor?</h2>
            <p>Take the quiz or browse the directory. Either way, matching is free.</p>
          </div>
          <div className="home-cta__actions">
            <a className="btn btn--green btn--lg" href="#match">
              Take the quiz
            </a>
            <Link className="btn btn--outline btn--lg home-cta__secondary" to="/advisors">
              Search advisors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Financial Professional",
    url: "https://financialprofessional.com/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://financialprofessional.com/advisors?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Seo
        title="Find a Financial Professional | Fiduciary Advisors"
        description="Match with vetted, fee-only fiduciary financial advisors based on your goals, assets, and stage of life. Free to search, free to get matched."
        structuredData={structuredData}
        canonicalUrl="https://financialprofessional.com/"
      />
      <HomePage />
    </>
  );
};

export default Index;
