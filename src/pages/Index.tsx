import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, CalendarCheck, Clock, CreditCard, Check, ChevronLeft } from "lucide-react";
import { AdvisorCard } from "@/components/advisors/AdvisorCard";
import { getAdvisors } from "@/services/advisorsService";
import { Seo } from "@/components/seo/Seo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/* ------------------------- Match Quiz ------------------------- */
type AssetBracket = "under-100k" | "100k-500k" | "500k-2m" | "over-2m";

const QUIZ_GOALS = [
  { value: "Retirement Planning", label: "Retirement planning", desc: "Build a durable income plan for life after work", icon: "🌅" },
  { value: "Wealth Management", label: "Grow my wealth", desc: "Long-term investing across multiple accounts", icon: "📈" },
  { value: "Tax Planning", label: "Tax optimization", desc: "Equity comp, business income, advanced planning", icon: "📊" },
  { value: "Estate Planning", label: "Estate & legacy", desc: "Trusts, gifting, generational wealth transfer", icon: "🏛️" },
  { value: "Sustainable Investing", label: "Sustainable investing", desc: "ESG-aligned, climate-conscious portfolios", icon: "🌿" },
  { value: "Business Owners", label: "I own a business", desc: "Owner comp, entity structuring, exit planning", icon: "🏢" },
  { value: "Young Professionals", label: "Early career", desc: "Student debt, first home, starting to invest", icon: "🚀" },
  { value: "High Net Worth", label: "Private wealth", desc: "Concentrated positions, alternatives, family office", icon: "💎" },
];

const QUIZ_ASSETS: { value: AssetBracket; label: string; hint: string }[] = [
  { value: "under-100k", label: "Under $100K", hint: "Just getting started" },
  { value: "100k-500k", label: "$100K – $500K", hint: "Building momentum" },
  { value: "500k-2m", label: "$500K – $2M", hint: "Significant assets" },
  { value: "over-2m", label: "Over $2M", hint: "Private wealth range" },
];

const QUIZ_FEES = [
  { value: "Fee-Only", label: "Fee-only", hint: "Transparent annual or project fee" },
  { value: "Assets Under Management", label: "Percentage of assets", hint: "Typically 0.5–1% AUM" },
  { value: "Flat Fee", label: "Flat subscription", hint: "Predictable monthly or annual" },
  { value: "Hourly", label: "Hourly / as-needed", hint: "Pay only when you engage" },
];

const MatchQuiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<string | null>(null);
  const [assets, setAssets] = useState<AssetBracket | null>(null);
  const [feePref, setFeePref] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const canAdvance =
    (step === 0 && !!goal) || (step === 1 && !!assets) || (step === 2 && !!feePref);
  const progress = ((step + 1) / 3) * 100;

  const handleNext = () => {
    if (step === 2 && goal && assets && feePref) {
      setDone(true);
      const params = new URLSearchParams();
      if (goal) params.set("specialty", goal);
      if (assets) params.set("minimum", assets);
      if (feePref) params.set("compensation", feePref);
      setTimeout(() => navigate(`/advisors?${params.toString()}`), 900);
    } else {
      setStep(step + 1);
    }
  };

  const reset = () => {
    setStep(0);
    setGoal(null);
    setAssets(null);
    setFeePref(null);
    setDone(false);
  };

  return (
    <section id="match" className="py-20 md:py-24 bg-white border-y border-line">
      <div className="container mx-auto px-5 md:px-6">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <span className="eyebrow">Find your match</span>
          <h2 className="font-display text-[clamp(28px,3.5vw,44px)] font-medium text-blue leading-tight mt-4 mb-4">
            Three questions. Three advisors.
          </h2>
          <p className="text-ink-3 text-[17px] leading-relaxed">
            Answer below and we'll narrow our directory to the advisors most aligned with your situation.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-sand border border-line rounded-[24px] p-6 md:p-10 shadow-[var(--shadow-md)]">
          {!done ? (
            <>
              <div className="mb-7">
                <div className="h-1.5 bg-sand-2 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      background: "linear-gradient(90deg, hsl(var(--blue)) 0%, hsl(var(--aqua)) 55%, hsl(var(--mint)) 100%)",
                    }}
                  />
                </div>
                <span className="text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Step {step + 1} of 3
                </span>
              </div>

              {step === 0 && (
                <div>
                  <h3 className="font-display text-[22px] md:text-[26px] text-blue mb-2">
                    What's most on your mind right now?
                  </h3>
                  <p className="text-ink-3 mb-6 text-[15px]">
                    Choose the goal that feels closest. You can talk about anything with your advisor.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {QUIZ_GOALS.map((g) => (
                      <button
                        key={g.value}
                        onClick={() => setGoal(g.value)}
                        className={`text-left p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                          goal === g.value
                            ? "border-mint bg-mint-soft shadow-[0_0_0_1px_hsl(var(--mint))]"
                            : "border-line bg-card hover:border-aqua hover:-translate-y-0.5"
                        }`}
                      >
                        <span className="text-2xl flex-shrink-0">{g.icon}</span>
                        <span className="flex flex-col min-w-0">
                          <strong className="text-blue font-semibold text-[15px] leading-tight mb-0.5">{g.label}</strong>
                          <span className="text-[13px] text-ink-3 leading-snug">{g.desc}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h3 className="font-display text-[22px] md:text-[26px] text-blue mb-2">
                    Roughly how much do you have invested today?
                  </h3>
                  <p className="text-ink-3 mb-6 text-[15px]">
                    This includes retirement accounts, brokerage, and cash savings. We don't share with anyone.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {QUIZ_ASSETS.map((a) => (
                      <button
                        key={a.value}
                        onClick={() => setAssets(a.value)}
                        className={`text-left p-5 rounded-2xl border transition-all flex flex-col gap-1 ${
                          assets === a.value
                            ? "border-mint bg-mint-soft shadow-[0_0_0_1px_hsl(var(--mint))]"
                            : "border-line bg-card hover:border-aqua hover:-translate-y-0.5"
                        }`}
                      >
                        <strong className="text-blue font-semibold text-[16px]">{a.label}</strong>
                        <span className="text-[13px] text-ink-3">{a.hint}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="font-display text-[22px] md:text-[26px] text-blue mb-2">
                    How do you prefer to pay for advice?
                  </h3>
                  <p className="text-ink-3 mb-6 text-[15px]">
                    Every advisor in our directory charges transparently. Pick what feels right — you can change later.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {QUIZ_FEES.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => setFeePref(f.value)}
                        className={`text-left p-5 rounded-2xl border transition-all flex flex-col gap-1 ${
                          feePref === f.value
                            ? "border-mint bg-mint-soft shadow-[0_0_0_1px_hsl(var(--mint))]"
                            : "border-line bg-card hover:border-aqua hover:-translate-y-0.5"
                        }`}
                      >
                        <strong className="text-blue font-semibold text-[16px]">{f.label}</strong>
                        <span className="text-[13px] text-ink-3">{f.hint}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-line">
                <button
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-1.5 text-ink-3 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:text-blue transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!canAdvance}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue text-white rounded-full font-medium text-[14.5px] transition-all hover:bg-blue-light hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 shadow-[0_4px_14px_hsl(var(--blue)/0.22)]"
                >
                  {step === 2 ? "See my matches" : "Continue"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div
                className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center text-white"
                style={{ background: "linear-gradient(135deg, hsl(var(--mint)), hsl(var(--aqua)))" }}
              >
                <Check className="w-8 h-8" strokeWidth={3} />
              </div>
              <h3 className="font-display text-2xl text-blue mb-2">Your matches are ready.</h3>
              <p className="text-ink-3 mb-6 max-w-md mx-auto">
                We've narrowed the directory based on what you shared. Taking you there now…
              </p>
              <button
                onClick={reset}
                className="text-blue font-medium underline-offset-4 hover:underline text-sm"
              >
                Start over
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

/* ------------------------- FAQ ------------------------- */
const FAQ_ITEMS = [
  {
    q: "How much does Financial Professional cost?",
    a: "It's free for you. We're supported by a flat membership paid by advisors to be listed in our directory — but advisors do not pay per match, per click, or per conversion. That removes the incentive to send you to whoever pays most.",
  },
  {
    q: 'What does "fiduciary" actually mean?',
    a: 'A fiduciary is legally required to put your interests ahead of their own. Most "advisors" at big banks and brokerages are held to a lower "suitability" standard. Every fiduciary professional in our directory is verified through SEC Form ADV filings and annual re-checks.',
  },
  {
    q: "How do you vet advisors?",
    a: "Credentials check (CFP®, CFA, CPA, etc.), ADV review for any disclosures, minimum years of independent practice, and a structured interview with our team. We decline the majority of advisors who apply.",
  },
  {
    q: "Can I work with an advisor virtually?",
    a: "Yes — the vast majority of our advisors work with clients nationwide over video. You can filter by location if you prefer someone local, but you are not limited by geography.",
  },
  {
    q: "What if I don't click with my match?",
    a: "Every intro call is free and no-obligation. You can browse and reach out to as many advisors as you like — there's no penalty. The goal is that you find the right advisor, not that you pick the first one.",
  },
  {
    q: "Do you share my information?",
    a: "Only with the specific advisors you ask to meet with, and only the information required to prepare for your intro call. We never sell your data and never hand it to third parties.",
  },
];

const FAQ = () => (
  <section id="faq" className="py-20 md:py-24 bg-sand">
    <div className="container mx-auto px-5 md:px-6 grid md:grid-cols-[1fr_1.4fr] gap-12 md:gap-16">
      <div>
        <span className="eyebrow">FAQ</span>
        <h2 className="font-display text-[clamp(28px,3.5vw,44px)] font-medium text-blue leading-tight mt-4 mb-4">
          Questions, answered
          <br />
          before you ask.
        </h2>
        <p className="text-ink-3 leading-relaxed">
          Still curious?{" "}
          <Link to="/advisors" className="text-aqua underline-offset-4 hover:underline">
            Browse the directory
          </Link>{" "}
          or reach out — a real person will reply within a business day.
        </p>
      </div>

      <Accordion type="single" collapsible defaultValue="item-0" className="space-y-3">
        {FAQ_ITEMS.map((f, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="bg-card border border-line rounded-2xl px-5 md:px-6"
          >
            <AccordionTrigger className="text-left font-display text-[17px] md:text-[18px] text-blue hover:no-underline py-5">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-ink-3 text-[15px] leading-relaxed pb-5">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

/* ------------------------- Hero ------------------------- */
const Hero = () => (
  <section className="relative overflow-hidden pt-12 bg-sand">
    {/* background glows */}
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(900px 600px at 90% -10%, hsl(var(--mint) / 0.14), transparent 60%), radial-gradient(700px 500px at -5% 10%, hsl(var(--aqua) / 0.10), transparent 60%)",
      }}
    />
    {/* grid grain */}
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(hsl(var(--ink) / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--ink) / 0.05) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black, transparent 70%)",
        maskImage: "radial-gradient(ellipse at 50% 40%, black, transparent 70%)",
      }}
    />

    <div className="container mx-auto px-5 md:px-6 relative grid md:grid-cols-[1.1fr_1fr] gap-12 md:gap-16 items-center pt-8 md:pt-14 pb-12 md:pb-20">
      {/* Left content */}
      <div className="relative z-10 text-left">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-2 bg-white/85 border border-line rounded-full text-[12.5px] font-medium text-ink-2 backdrop-blur-md mb-6">
          <span
            className="w-[7px] h-[7px] rounded-full bg-mint"
            style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
          />
          Fiduciary-only · SEC-verified · No kickbacks
        </div>

        <h1 className="font-display font-medium text-[clamp(36px,5.5vw,68px)] leading-[1.02] text-blue mb-6">
          The advisor you deserve,
          <br />
          <span
            className="italic"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--aqua)) 0%, hsl(var(--blue)) 60%, hsl(var(--mint)) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            matched in 3 minutes.
          </span>
        </h1>

        <p className="text-[17px] md:text-[18px] leading-relaxed text-ink-3 max-w-[540px] mb-9">
          Financial Professional connects you with a vetted, fee-only financial advisor — chosen for your goals,
          your assets, and the life you're building. No sales pitches. No commissions. Just aligned advice.
        </p>

        <div className="flex gap-3 flex-wrap mb-10">
          <a
            href="#match"
            className="inline-flex items-center gap-2 px-6 py-4 bg-blue text-white rounded-full font-medium text-[15px] transition-all shadow-[0_6px_20px_hsl(var(--blue)/0.28)] hover:bg-blue-light hover:-translate-y-0.5 hover:shadow-[0_10px_28px_hsl(var(--blue)/0.35)]"
          >
            Find my advisor
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            to="/advisors"
            className="inline-flex items-center px-6 py-4 bg-transparent text-blue border border-blue rounded-full font-medium text-[15px] transition-all hover:bg-blue hover:text-white"
          >
            Browse the directory
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex">
            {["hsl(var(--mint))", "hsl(var(--aqua))", "hsl(var(--blue))", "hsl(var(--blue-3))"].map((c, i) => (
              <span
                key={i}
                className="w-9 h-9 rounded-full border-2 border-sand -ml-2.5 first:ml-0"
                style={{ background: c, zIndex: 4 - i }}
              />
            ))}
          </div>
          <div className="text-[13px] text-ink-3">
            <div className="flex gap-2 items-center">
              <span className="text-mint-2 tracking-widest">★★★★★</span>
              <strong className="text-ink font-semibold">4.9</strong>
            </div>
            <span>from 12,400+ matched clients</span>
          </div>
        </div>
      </div>

      {/* Right visual */}
      <div className="relative h-[460px] md:h-[520px] max-w-[480px] md:max-w-none mx-auto md:mx-0 w-full" aria-hidden>
        {/* Main card */}
        <div
          className="absolute top-1/2 left-1/2 w-[min(400px,100%)] p-7 z-20 bg-card border border-line rounded-[22px] shadow-[var(--shadow-md)]"
          style={{ transform: "translate(-50%,-50%)", animation: "card-float 7s ease-in-out infinite" }}
        >
          <div className="flex gap-3.5 items-center mb-6">
            <div
              className="w-[54px] h-[54px] rounded-full flex items-center justify-center text-white font-semibold text-lg"
              style={{ background: "linear-gradient(135deg, hsl(var(--aqua)), hsl(var(--blue)))" }}
            >
              EM
            </div>
            <div>
              <div className="font-semibold text-base text-ink flex items-center gap-1.5">
                Evelyn Marsh
                <span className="inline-flex items-center justify-center w-4 h-4 bg-mint text-blue rounded-full text-[10px] font-extrabold">
                  ✓
                </span>
              </div>
              <div className="text-[13px] text-ink-3 mt-0.5">CFP® · Retirement Strategist</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 p-4 bg-sand-2 rounded-xl mb-5">
            {[
              ["Fee model", "Fee-only"],
              ["Minimum", "$500K"],
              ["Rating", "4.9 ★"],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</span>
                <strong className="text-[13.5px] text-ink font-semibold">{v}</strong>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-sand-2 rounded-full overflow-hidden mb-2.5">
            <div
              className="h-full rounded-full"
              style={{
                width: "96%",
                background: "linear-gradient(90deg, hsl(var(--blue)) 0%, hsl(var(--aqua)) 55%, hsl(var(--mint)) 100%)",
                animation: "match-fill 2s ease-out",
              }}
            />
          </div>
          <span className="text-[13px] text-ink font-semibold">96% match to your goals</span>
        </div>

        {/* Floating chip 1 */}
        <div
          className="absolute top-[14%] -left-[5%] sm:left-[2%] z-30 bg-card border border-line rounded-[22px] shadow-[var(--shadow-md)] py-3.5 px-4 flex items-center gap-3"
          style={{ animation: "float-a 6s ease-in-out infinite" }}
        >
          <div className="bg-mint-soft text-blue px-2.5 py-1 rounded-full text-[11px] font-semibold">Retirement</div>
          <div className="flex flex-col">
            <strong className="text-[15px] text-ink font-semibold">18 yrs</strong>
            <span className="text-[11.5px] text-muted-foreground">in practice</span>
          </div>
        </div>

        {/* Floating chip 2 */}
        <div
          className="absolute bottom-[14%] right-[4%] z-30 bg-card border border-line rounded-[22px] shadow-[var(--shadow-md)] py-3.5 px-4 flex items-center gap-3"
          style={{ animation: "float-b 7s ease-in-out infinite" }}
        >
          <div className="w-[38px] h-[38px] bg-mint-soft rounded-[10px] flex items-center justify-center">
            <ShieldCheck className="w-[18px] h-[18px] text-blue" />
          </div>
          <div className="flex flex-col">
            <strong className="text-[15px] text-ink font-semibold">Verified</strong>
            <span className="text-[11.5px] text-muted-foreground">Fiduciary</span>
          </div>
        </div>
      </div>
    </div>

    {/* Logos strip */}
    <div className="border-t border-line py-8 bg-white/50 relative">
      <div className="container mx-auto px-5 md:px-6 flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-10">
        <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold whitespace-nowrap">
          As seen in
        </span>
        <div className="flex gap-7 md:gap-10 flex-wrap items-center flex-1">
          {["The Wall Street Journal", "Forbes", "Bloomberg", "Barron's", "Kiplinger", "Morningstar"].map((l) => (
            <span key={l} className="font-display italic text-[17px] font-medium text-ink-3 opacity-70">
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------- Stats ------------------------- */
const Stats = () => {
  const stats = [
    { value: "1,200+", label: "Vetted fiduciary advisors" },
    { value: "$48B", label: "Client assets under advice" },
    { value: "12,400", label: "Successful matches" },
    { value: "4.9 / 5", label: "Average client rating" },
  ];
  return (
    <section className="py-16 md:py-24 bg-sand">
      <div className="container mx-auto px-5 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <div className="font-display text-[clamp(32px,4vw,52px)] font-medium text-blue leading-none mb-2">
                {s.value}
              </div>
              <div className="text-sm text-ink-3">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ----------------------- How it works ----------------------- */
const HowItWorks = () => {
  const steps = [
    {
      n: "01",
      title: "Tell us about you",
      body: "Share your goals, your assets, and the kind of relationship you want with an advisor. Takes about three minutes.",
    },
    {
      n: "02",
      title: "Meet your top matches",
      body: "We surface advisors from our network who fit your profile — each a fiduciary, each independently verified, each with transparent pricing.",
    },
    {
      n: "03",
      title: "Book a free intro call",
      body: "Chat with one, two, or all three. No pressure, no obligation. Choose who feels right — we're here when you need us.",
    },
  ];

  return (
    <section className="py-20 md:py-24 bg-white border-y border-line">
      <div className="container mx-auto px-5 md:px-6">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow mb-4">How it works</span>
          <h2 className="font-display text-[clamp(28px,3.5vw,44px)] font-medium text-blue leading-tight mt-4 mb-4">
            Three steps to aligned advice.
          </h2>
          <p className="text-ink-3 text-[17px] leading-relaxed">
            Finding the right advisor shouldn't feel like dating, cold-calling, or a sales funnel.
            We've rebuilt the process to feel like what it should be: thoughtful, transparent, and in your corner.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.n}
              className="p-7 bg-sand rounded-[22px] border border-line transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-md)] hover:border-aqua/40"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-mint-soft text-blue flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="font-display text-2xl text-aqua/70">{s.n}</span>
              </div>
              <h3 className="font-display text-xl text-blue mb-2">{s.title}</h3>
              <p className="text-ink-3 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* --------------------- Advisor directory teaser --------------------- */
const AdvisorGrid = () => {
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { count } = await getAdvisors({ page: 1, pageSize: 1 });
        if (count > 0) {
          const { data } = await getAdvisors({ page: 1, pageSize: count });
          if (data?.length) {
            const shuffled = [...data].sort(() => 0.5 - Math.random());
            setAdvisors(shuffled.slice(0, 6));
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[340px] bg-sand-2 rounded-[22px] animate-pulse" />
        ))}
      </div>
    );
  }
  if (!advisors.length) {
    return <div className="text-center text-ink-3 py-8">No advisors found</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {advisors.map((a) => (
        <AdvisorCard key={a.id} advisor={a} />
      ))}
    </div>
  );
};

const Directory = () => (
  <section id="advisors" className="py-20 md:py-24 bg-sand">
    <div className="container mx-auto px-5 md:px-6">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div className="max-w-xl">
          <span className="eyebrow mb-4">The directory</span>
          <h2 className="font-display text-[clamp(28px,3.5vw,44px)] font-medium text-blue leading-tight mt-4">
            Featured fiduciary advisors.
          </h2>
        </div>
        <Link to="/advisors" className="inline-flex items-center gap-2 text-blue font-medium hover:gap-3 transition-all">
          View all advisors <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <AdvisorGrid />
    </div>
  </section>
);

/* ----------------------- Specialties ----------------------- */
const Specialties = () => {
  const items = [
    { label: "Retirement", desc: "SECURE Act, Roth conversions, income planning" },
    { label: "Tax Strategy", desc: "RSUs, ISOs, QSBS, Roth ladders, backdoor" },
    { label: "Estate & Trust", desc: "Revocable, irrevocable, gifting, beneficiaries" },
    { label: "Sustainable", desc: "ESG, climate-aligned, impact portfolios" },
    { label: "Small Business", desc: "Solo 401k, defined benefit, exit planning" },
    { label: "Early Career", desc: "Debt, first home, starting to invest" },
    { label: "Divorce Finance", desc: "CDFA®, asset division, post-divorce" },
    { label: "Special Needs", desc: "ABLE accounts, SNTs, government benefits" },
    { label: "Expat & Cross-Border", desc: "US/UK/EU, dual citizenship, FATCA" },
  ];
  return (
    <section className="py-20 md:py-24 bg-white border-y border-line">
      <div className="container mx-auto px-5 md:px-6">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow mb-4">Specialties</span>
          <h2 className="font-display text-[clamp(28px,3.5vw,44px)] font-medium text-blue leading-tight mt-4 mb-4">
            Whatever makes your situation
            <br />
            unusual, we've matched for it.
          </h2>
          <p className="text-ink-3 text-[17px] leading-relaxed">
            We're not a list of generalists. Every advisor carries a deep specialty — because the best advice is specific advice.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <Link
              to="/advisors"
              key={it.label}
              className="group p-6 rounded-[18px] border border-line bg-sand hover:bg-mint-soft hover:border-mint transition-all flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-blue">{it.label}</h3>
                <ArrowRight className="w-4 h-4 text-ink-3 group-hover:text-blue group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-sm text-ink-3 leading-relaxed">{it.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ----------------------- CTA section ----------------------- */
const CTASection = () => (
  <section className="py-20 md:py-28 bg-sand">
    <div className="container mx-auto px-5 md:px-6">
      <div
        className="relative overflow-hidden rounded-[28px] p-10 md:p-16 text-center"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--blue)) 0%, hsl(var(--blue-2)) 60%, hsl(var(--aqua-2)) 100%)",
        }}
      >
        <div
          aria-hidden
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(var(--mint)) 0%, transparent 70%)" }}
        />
        <div className="relative">
          <span className="inline-block text-mint uppercase tracking-[0.18em] text-xs font-semibold mb-4">
            Start your match
          </span>
          <h2 className="font-display text-[clamp(30px,4vw,52px)] font-medium text-white leading-tight mb-5">
            The right advisor is
            <br />
            <span className="italic text-mint">closer than you think.</span>
          </h2>
          <p className="text-white/80 text-[17px] max-w-xl mx-auto mb-8 leading-relaxed">
            Browse vetted advisors. Compare specialties. Book a free intro call. No fees, no obligations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <a
              href="#match"
              className="inline-flex items-center gap-2 px-7 py-4 bg-mint text-blue rounded-full font-semibold text-[15px] hover:bg-white transition-all shadow-[0_8px_24px_hsl(var(--mint)/0.4)]"
            >
              Get matched now
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link to="/auth/SignUp" className="text-white/90 underline-offset-4 hover:underline text-sm">
              or join as a financial professional
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-mint" /> Fiduciary verified
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-mint" /> No payment required
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-mint" /> 3-minute match
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ----------------------- Page ----------------------- */
const Index = () => {
  const pageTitle = "Financial Professional | Find a Fiduciary Financial Advisor";
  const pageDescription =
    "Get matched with a vetted, fee-only fiduciary financial advisor in minutes. Compare specialties, fees, and experience — then book a free intro call.";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Financial Professional",
    description: pageDescription,
    url: "https://financial-professional.lovable.app",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://financial-professional.lovable.app/advisors?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Seo
        title={pageTitle}
        description={pageDescription}
        structuredData={structuredData}
        canonicalUrl="https://financial-professional.lovable.app/"
      />
      <div className="flex flex-col bg-sand">
        <Hero />
        <Stats />
        <HowItWorks />
        <MatchQuiz />
        <Directory />
        <Specialties />
        <FAQ />
        <CTASection />
      </div>
    </>
  );
};

export default Index;
