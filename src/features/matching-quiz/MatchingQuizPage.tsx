import { useCallback, useEffect, useRef, useState } from "react";
import { Seo } from "@/components/seo/Seo";
import { quizAnalytics } from "./analytics";
import {
  Confirmation,
  ContactGate,
  ResultsReveal,
  validateContact,
} from "./components/ContactAndResults";
import { QuizShell } from "./components/QuizChrome";
import {
  CrossSellStep,
  FinancialStep,
  IndustryStep,
  IntentStep,
  LogisticsStep,
  PersonaStep,
  PrimaryStep,
  ServicesStep,
  TaxForkStep,
} from "./components/QuizSteps";
import { nextPhase, prevPhase } from "./routing";
import {
  buildLeadPayload,
  ensureSliderDefaults,
  fetchDirectoryMatches,
  saveQuizLead,
} from "./quizService";
import {
  clearQuizState,
  getOrCreateSessionId,
  loadQuizState,
  rotateSessionId,
  saveQuizState,
} from "./storage";
import {
  INITIAL_ANSWERS,
  PHASE_STEP,
  type QuizAnswers,
  type QuizMatchCard,
  type QuizPath,
  type QuizPhase,
} from "./types";

const MatchingQuizPage = () => {
  const [answers, setAnswers] = useState<QuizAnswers>(INITIAL_ANSWERS);
  const [phase, setPhase] = useState<QuizPhase>("primary");
  const [sessionId, setSessionId] = useState(() => getOrCreateSessionId());
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [matches, setMatches] = useState<QuizMatchCard[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const saved = loadQuizState();
    if (saved && saved.phase !== "confirmation") {
      setAnswers(ensureSliderDefaults(saved.answers));
      setPhase(saved.phase === "results" ? "contact" : saved.phase);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || startedRef.current) return;
    startedRef.current = true;
    quizAnalytics.started(sessionId);
  }, [hydrated, sessionId]);

  useEffect(() => {
    if (!hydrated) return;
    if (phase === "confirmation") return;
    saveQuizState(answers, phase);
  }, [answers, phase, hydrated]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase]);

  const patch = useCallback((partial: Partial<QuizAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...partial }));
  }, []);

  const go = useCallback(
    (next: QuizPhase, snapshot?: QuizAnswers) => {
      const current = snapshot || answers;
      quizAnalytics.stepCompleted(sessionId, phase, PHASE_STEP[phase]);
      if (next === "financial") {
        setAnswers(ensureSliderDefaults(current));
      }
      setPhase(next);
      void saveQuizLead(
        buildLeadPayload(
          next === "financial" ? ensureSliderDefaults(current) : current,
          sessionId,
          next,
          "in_progress"
        )
      );
    },
    [answers, phase, sessionId]
  );

  const handleBack = () => {
    const back = prevPhase(phase, answers);
    if (back) setPhase(back);
  };

  const handleContinue = () => {
    const next = nextPhase(phase, answers);
    if (next) go(next);
  };

  const handleBranch = (path: QuizPath) => {
    const nextAnswers = ensureSliderDefaults({
      ...answers,
      path,
      services: [],
      additionalNeeds: [],
      taxFilingType: "",
      industry: "",
      industryOther: "",
      personaTags: [],
      intentReason: "",
      financialSize: "",
      investableAssets: "",
      annualIncome: "",
      ageRange: "",
    });
    setAnswers(nextAnswers);
    quizAnalytics.branchSelected(sessionId, path);
    setTimeout(() => go("services", nextAnswers), 280);
  };

  const handleTaxFork = (taxFilingType: string) => {
    const nextAnswers = { ...answers, taxFilingType };
    setAnswers(nextAnswers);
    setTimeout(() => {
      const next = nextPhase("taxFork", nextAnswers);
      if (next) go(next, nextAnswers);
    }, 280);
  };

  const handleIntent = (intentReason: string) => {
    const nextAnswers = { ...answers, intentReason };
    setAnswers(nextAnswers);
    setTimeout(() => go("financial", nextAnswers), 280);
  };

  const handleSubmit = async () => {
    const errors = validateContact(answers);
    if (Object.keys(errors).length) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = buildLeadPayload(answers, sessionId, "results", "completed");
      const { error } = await saveQuizLead(payload);
      if (error) {
        // Still reveal matches — lead storage failure shouldn't block UX
        setSubmitError("We saved a local copy; server sync had an issue.");
      }
      const revealed = await fetchDirectoryMatches(answers.path, answers.state || undefined);
      setMatches(revealed);
      quizAnalytics.completed(sessionId, answers.path);
      clearQuizState();
      setSessionId(rotateSessionId());
      setPhase("results");
    } catch (err) {
      console.error(err);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated) return null;

  const step = PHASE_STEP[phase];
  const showShell = phase !== "results" && phase !== "confirmation";

  const body = (() => {
    switch (phase) {
      case "primary":
        return <PrimaryStep selected={answers.path} onSelect={handleBranch} />;
      case "services":
        return answers.path ? (
          <ServicesStep
            path={answers.path}
            selected={answers.services}
            onChange={(services) => patch({ services })}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        ) : null;
      case "crossSell":
        return answers.path ? (
          <CrossSellStep
            path={answers.path}
            selected={answers.additionalNeeds}
            onChange={(additionalNeeds) => patch({ additionalNeeds })}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        ) : null;
      case "taxFork":
        return (
          <TaxForkStep
            selected={answers.taxFilingType}
            onSelect={handleTaxFork}
            onBack={handleBack}
          />
        );
      case "industry":
        return (
          <IndustryStep
            industry={answers.industry}
            industryOther={answers.industryOther}
            onChange={(industry, industryOther) => patch({ industry, industryOther })}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        );
      case "persona":
        return answers.path ? (
          <PersonaStep
            path={answers.path}
            selected={answers.personaTags}
            onChange={(personaTags) => patch({ personaTags })}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        ) : null;
      case "intent":
        return (
          <IntentStep
            selected={answers.intentReason}
            onSelect={handleIntent}
            onBack={handleBack}
          />
        );
      case "financial":
        return (
          <FinancialStep
            answers={answers}
            onChange={patch}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        );
      case "logistics":
        return (
          <LogisticsStep
            answers={answers}
            onChange={patch}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        );
      case "contact":
        return (
          <>
            <ContactGate
              answers={answers}
              onChange={patch}
              onBack={handleBack}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
            {submitError ? <p className="quiz__error">{submitError}</p> : null}
          </>
        );
      case "results":
        return (
          <ResultsReveal
            matches={matches}
            path={answers.path}
            onContinue={() => setPhase("confirmation")}
          />
        );
      case "confirmation":
        return <Confirmation matches={matches} path={answers.path} />;
      default:
        return null;
    }
  })();

  return (
    <>
      <Seo
        title="Find a Financial Professional | Matching Quiz"
        description="Take our 2-minute quiz to get matched with vetted accountants and fiduciary financial advisors. Free, private, and no obligation."
        canonicalUrl="https://financialprofessional.com/find-a-financial-professional"
      />
      {showShell ? (
        <QuizShell step={step}>{body}</QuizShell>
      ) : (
        <div className="quiz quiz--results">{body}</div>
      )}
    </>
  );
};

export default MatchingQuizPage;
