import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { readHandoff, type CalculatorHandoff } from "@/features/calculators/handoff";

type AssetBracket = "under-100k" | "100k-500k" | "500k-2m" | "over-2m" | "prefer-not";

const QUIZ_GOALS = [
  { value: "Retirement Planning", label: "Retirement planning" },
  { value: "Wealth Management", label: "Grow my wealth" },
  { value: "Tax Planning", label: "Tax optimization" },
  { value: "Estate/Trust Planning", label: "Estate & legacy" },
  { value: "Socially Responsible Investing", label: "Sustainable investing" },
  { value: "Small Business Planning", label: "Business owner" },
  { value: "Early Career Planning", label: "Early career" },
  { value: "High Net Worth", label: "Private wealth" },
  { value: "Insurance Planning", label: "Insurance & protection" },
  { value: "Education Planning", label: "Education funding" },
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","PR","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

const QUIZ_FEES = [
  { value: "Assets Under Management", label: "Percentage of assets", hint: "Typically 0.5–1% of assets managed" },
  { value: "Flat Fee", label: "Flat fee", hint: "Predictable fixed pricing" },
  { value: "Hourly", label: "Hourly", hint: "Pay only for time used" },
  { value: "Fee-Only", label: "Fee-only", hint: "No commissions, ever" },
];

const QUIZ_ASSETS: { value: AssetBracket; label: string; hint: string }[] = [
  { value: "under-100k", label: "Under $100K", hint: "Building the foundation" },
  { value: "100k-500k", label: "$100K – $500K", hint: "Growing steadily" },
  { value: "500k-2m", label: "$500K – $2M", hint: "Significant assets" },
  { value: "over-2m", label: "Over $2M", hint: "Substantial wealth" },
  { value: "prefer-not", label: "Prefer not to say", hint: "We'll keep options open" },
];

const EXPERIENCE_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "5plus", label: "5+ years" },
  { value: "10plus", label: "10+ years" },
  { value: "15plus", label: "15+ years" },
];

const QUIZ_STEPS = [
  { id: "goals", title: "What matters most?", subtitle: "Pick up to 4 goals or specialties." },
  { id: "location", title: "Where are you based?", subtitle: "Optional. Leave blank for nationwide." },
  { id: "fees", title: "Preferred fee style", subtitle: "How would you like to pay for advice?" },
  { id: "assets", title: "Investable assets", subtitle: "Helps us respect advisor minimums." },
  { id: "preferences", title: "Fine-tune the match", subtitle: "A few final preferences." },
] as const;

const MatchQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState<string[]>([]);
  const [state, setState] = useState("");
  const [fees, setFees] = useState<string[]>([]);
  const [assets, setAssets] = useState<AssetBracket | null>(null);
  const [fiduciaryOnly, setFiduciaryOnly] = useState(true);
  const [experience, setExperience] = useState("any");
  const [note, setNote] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [handoff, setHandoff] = useState<CalculatorHandoff | null>(null);

  useEffect(() => {
    const saved = readHandoff();
    if (!saved) return;
    setHandoff(saved);
    setGoals((prev) => (prev.includes(saved.goal) ? prev : [saved.goal, ...prev].slice(0, 4)));
  }, [location.search, location.hash]);

  useEffect(() => {
    if (location.hash !== "#match") return;
    document.getElementById("match")?.scrollIntoView({ behavior: "smooth" });
  }, [location.hash, location.pathname]);

  const current = QUIZ_STEPS[step];
  const canAdvance = current.id === "goals" ? goals.length > 0 : true;

  const toggleGoal = (value: string) => {
    setGoals((prev) => {
      if (prev.includes(value)) return prev.filter((g) => g !== value);
      if (prev.length >= 4) {
        setNote("You can select up to 4 goals");
        setTimeout(() => setNote(null), 2200);
        return prev;
      }
      return [...prev, value];
    });
  };

  const toggleFee = (value: string) =>
    setFees((prev) => (prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]));

  const handleNext = () => {
    if (step < QUIZ_STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    setDone(true);
    const params = new URLSearchParams();
    if (goals[0]) params.set("specialties", goals[0]);
    if (state) params.set("state", state);
    if (fees[0]) params.set("feeStructure", fees[0]);
    if (assets && assets !== "prefer-not") params.set("minimumAssets", assets);
    if (fiduciaryOnly) params.set("fiduciary", "1");
    if (experience !== "any") params.set("experience", experience);
    setTimeout(() => navigate(`/advisors?${params.toString()}`), 900);
  };

  return (
    <section className="home-quiz" id="match">
      <div className="dcontainer">
        <div className="home-section-header">
          <span className="keyline" />
          <p className="home-section-eyebrow">Find your match</p>
          <h2>
            A few questions.
            <br />
            <em>The right shortlist.</em>
          </h2>
          <p className="home-section-desc">
            Answer below and we'll narrow the directory to the advisors most aligned with your situation.
          </p>
        </div>

        <div className="home-quiz__card">
          {!done ? (
            <>
              {handoff && (
                <p className="home-quiz__handoff">
                  From your {handoff.name} calculator: <strong>{handoff.summary}</strong>
                </p>
              )}

              <ol className="home-quiz__steps" aria-label="Progress">
                {QUIZ_STEPS.map((item, index) => (
                  <li
                    key={item.id}
                    className={`home-quiz__step-pill ${
                      index === step ? "is-current" : index < step ? "is-done" : ""
                    }`}
                  >
                    <span>{index < step ? "✓" : index + 1}</span>
                    {item.title}
                  </li>
                ))}
              </ol>

              <h3 className="home-quiz__title">{current.title}</h3>
              <p className="home-quiz__subtitle">{current.subtitle}</p>

              {current.id === "goals" && (
                <div className="home-quiz__chips">
                  {QUIZ_GOALS.map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      aria-pressed={goals.includes(g.value)}
                      className={`home-quiz__chip ${goals.includes(g.value) ? "is-active" : ""}`}
                      onClick={() => toggleGoal(g.value)}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              )}

              {current.id === "location" && (
                <div className="home-quiz__chips">
                  {US_STATES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={state === s}
                      className={`home-quiz__chip home-quiz__chip--sm ${state === s ? "is-active" : ""}`}
                      onClick={() => setState(state === s ? "" : s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {current.id === "fees" && (
                <div className="home-quiz__options">
                  {QUIZ_FEES.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      className={`home-quiz__option ${fees.includes(f.value) ? "is-active" : ""}`}
                      onClick={() => toggleFee(f.value)}
                    >
                      <strong>{f.label}</strong>
                      <span>{f.hint}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`home-quiz__option ${fees.length === 0 ? "is-active" : ""}`}
                    onClick={() => setFees([])}
                  >
                    <strong>No preference</strong>
                    <span>Keep all fee models open</span>
                  </button>
                </div>
              )}

              {current.id === "assets" && (
                <div className="home-quiz__options">
                  {QUIZ_ASSETS.map((a) => (
                    <button
                      key={a.value}
                      type="button"
                      className={`home-quiz__option ${assets === a.value ? "is-active" : ""}`}
                      onClick={() => setAssets(a.value)}
                    >
                      <strong>{a.label}</strong>
                      <span>{a.hint}</span>
                    </button>
                  ))}
                </div>
              )}

              {current.id === "preferences" && (
                <div className="home-quiz__prefs">
                  <button
                    type="button"
                    className={`home-quiz__option ${fiduciaryOnly ? "is-active" : ""}`}
                    onClick={() => setFiduciaryOnly(!fiduciaryOnly)}
                    aria-pressed={fiduciaryOnly}
                  >
                    <strong>Fiduciary only</strong>
                    <span>Legally obligated to put you first</span>
                  </button>

                  <div className="home-quiz__field">
                    <h4>Minimum experience</h4>
                    <div className="home-quiz__chips">
                      {EXPERIENCE_OPTIONS.map((e) => (
                        <button
                          key={e.value}
                          type="button"
                          className={`home-quiz__chip home-quiz__chip--sm ${experience === e.value ? "is-active" : ""}`}
                          onClick={() => setExperience(e.value)}
                        >
                          {e.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {note && <p className="home-quiz__note">{note}</p>}

              <div className="home-quiz__actions">
                {step > 0 ? (
                  <button type="button" className="btn btn--outline btn--md" onClick={() => setStep(step - 1)}>
                    Back
                  </button>
                ) : (
                  <span />
                )}
                <button type="button" className="btn btn--green btn--md" disabled={!canAdvance} onClick={handleNext}>
                  {step === QUIZ_STEPS.length - 1 ? "See my matches" : "Continue"}
                </button>
              </div>
            </>
          ) : (
            <div className="home-quiz__done">
              <h3>Matching you now…</h3>
              <p>Pulling advisors that fit your goals, location, fees, and preferences.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};


export default MatchQuiz;
