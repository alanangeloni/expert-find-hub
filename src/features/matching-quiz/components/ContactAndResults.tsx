import { Link } from "react-router-dom";
import {
  CONTACT_EYEBROW,
  CONTACT_HEADING_WITH_PREVIEW,
  CONTACT_SUB,
  CONTACT_SUB_WITH_PREVIEW,
  MATCHES_FOUND_LABEL,
  MATCHES_UNLOCK_HINT,
  PRIVACY_COPY,
} from "../content";
import type { QuizAnswers, QuizMatchCard } from "../types";
import { BackButton, ContinueButton, StepCard } from "./QuizChrome";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9\s\-()+]*$/;

export function validateContact(answers: QuizAnswers): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!answers.firstName.trim()) errors.firstName = "First name is required";
  if (!answers.lastName.trim()) errors.lastName = "Last name is required";
  if (!answers.email.trim()) errors.email = "Email is required";
  else if (!EMAIL_RE.test(answers.email.trim())) errors.email = "Please enter a valid email";
  if (answers.phone && !PHONE_RE.test(answers.phone)) {
    errors.phone = "Only digits, spaces, dashes, parentheses, and + are allowed";
  }
  return errors;
}

const BLUR_COLORS = ["#1A3C28", "#2d6b50", "#8B6F2A", "#5C3A21", "#3F5B7C"];

export function BlurredMatchPreview({ count = 5 }: { count?: number }) {
  const placeholders = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="quiz-preview">
      <div className="quiz-preview__head">
        <span className="quiz-preview__count">{MATCHES_FOUND_LABEL}</span>
        <span className="quiz-preview__hint">{MATCHES_UNLOCK_HINT}</span>
      </div>
      <ul className="quiz-preview__list">
        {placeholders.map((i) => {
          const opacity = i >= 4 ? 0.35 : i === 3 ? 0.5 : 1;
          return (
            <li key={i} className="quiz-preview__card" style={{ opacity }}>
              <div className="quiz-preview__blur" aria-hidden="true">
                <div
                  className="quiz-preview__avatar"
                  style={{ background: BLUR_COLORS[i % BLUR_COLORS.length] }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
                <div className="quiz-preview__meta">
                  <span className="quiz-preview__name">Professional Name</span>
                  <span className="quiz-preview__firm">Firm · City, ST</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ContactGate({
  answers,
  onChange,
  onBack,
  onSubmit,
  submitting,
}: {
  answers: QuizAnswers;
  onChange: (patch: Partial<QuizAnswers>) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const errors = validateContact(answers);
  const hasErrors =
    !answers.firstName.trim() ||
    !answers.lastName.trim() ||
    !answers.email.trim() ||
    !EMAIL_RE.test(answers.email.trim()) ||
    (!!answers.phone && !PHONE_RE.test(answers.phone));

  return (
    <div className="quiz__contact-layout">
      <StepCard
        eyebrow={CONTACT_EYEBROW}
        title={CONTACT_HEADING_WITH_PREVIEW}
        subtitle={CONTACT_SUB_WITH_PREVIEW}
        footer={
          <>
            <BackButton onClick={onBack} />
            <ContinueButton
              onClick={onSubmit}
              disabled={hasErrors || submitting}
              label={submitting ? "Finding your matches..." : "See my matches →"}
            />
          </>
        }
      >
        <div className="quiz__contact-grid">
          <label className="quiz__field-label">
            First name
            <input
              className="quiz__text-input"
              value={answers.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              autoComplete="given-name"
            />
            {errors.firstName && answers.firstName === "" ? null : null}
          </label>
          <label className="quiz__field-label">
            Last name
            <input
              className="quiz__text-input"
              value={answers.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              autoComplete="family-name"
            />
          </label>
        </div>
        <label className="quiz__field-label">
          Email
          <input
            type="email"
            className="quiz__text-input"
            value={answers.email}
            onChange={(e) => onChange({ email: e.target.value })}
            autoComplete="email"
          />
        </label>
        <label className="quiz__field-label">
          Phone <span className="quiz__optional">(optional)</span>
          <input
            type="tel"
            className="quiz__text-input"
            value={answers.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            autoComplete="tel"
          />
        </label>

        <div className="quiz__privacy" role="note">
          <span className="quiz__privacy-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <span>{PRIVACY_COPY}</span>
        </div>
        <p className="quiz__contact-fallback-note">{CONTACT_SUB}</p>
      </StepCard>

      <BlurredMatchPreview />
    </div>
  );
}

export function ResultsReveal({
  matches,
  path,
  onContinue,
}: {
  matches: QuizMatchCard[];
  path: string | null;
  onContinue: () => void;
}) {
  const directoryHref = path === "tax" ? "/accountants" : "/advisors";
  const label = path === "tax" ? "accountants" : "advisors";

  return (
    <div className="quiz-results">
      <div className="quiz-results__hero">
        <div className="quiz-results__hero-inner">
          <span className="keyline" />
          <p className="quiz-results__eyebrow">Your matches</p>
          <h1>
            {matches.length} {label}{" "}
            <em>ready to meet you</em>
          </h1>
          <p className="quiz-results__sub">
            These professionals are from our directory. Browse their profiles, then continue for
            simple next steps.
          </p>
          <div className="quiz-results__actions">
            <button type="button" className="btn btn--primary btn--lg" onClick={onContinue}>
              Continue
            </button>
            <Link className="btn btn--outline btn--lg" to={directoryHref}>
              Browse full directory
            </Link>
          </div>
        </div>
      </div>

      <div className="dcontainer quiz-results__body">
        {matches.length === 0 ? (
          <div className="quiz-results__empty">
            <h3>We&apos;re still building matches in your area</h3>
            <p>Browse the full directory while we expand coverage.</p>
            <Link className="btn btn--primary btn--md" to={directoryHref}>
              Browse {label}
            </Link>
          </div>
        ) : (
          <ul className="quiz-results__grid">
            {matches.map((m, i) => (
              <li key={m.id} className="quiz-results__card-wrap">
                <div className="quiz-results__score-bar">
                  <span className="quiz-results__rank">{i + 1}</span>
                  <div className="quiz-results__score">
                    <span className="quiz-results__score-value">Match</span>
                    <span className="quiz-results__score-label">Directory pick</span>
                  </div>
                </div>
                <Link to={m.href} className="quiz-match-card">
                  {m.headshotUrl ? (
                    <img src={m.headshotUrl} alt="" className="quiz-match-card__img" />
                  ) : (
                    <div className="quiz-match-card__img quiz-match-card__img--placeholder">
                      {m.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <strong>{m.name}</strong>
                    {m.subtitle ? <p>{m.subtitle}</p> : null}
                    {(m.city || m.state) && (
                      <p className="quiz-match-card__loc">
                        {[m.city, m.state].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function Confirmation({
  matches,
  path,
}: {
  matches: QuizMatchCard[];
  path: string | null;
}) {
  const directoryHref = path === "tax" ? "/accountants" : "/advisors";

  return (
    <div className="quiz-confirm dcontainer">
      <span className="keyline" />
      <p className="quiz-results__eyebrow">You&apos;re all set</p>
      <h1>
        Next steps <em>from here</em>
      </h1>
      <p className="quiz-results__sub">
        Your answers are saved. Review your matches below, open a few profiles, and reach out when
        you&apos;re ready — no obligation.
      </p>

      <ol className="quiz-confirm__steps">
        <li>
          <strong>Review profiles</strong>
          <span>Compare specialties, fees, and experience.</span>
        </li>
        <li>
          <strong>Shortlist 2–3</strong>
          <span>Pick the professionals who feel like the best fit.</span>
        </li>
        <li>
          <strong>Request an intro</strong>
          <span>Use the contact options on each profile when you&apos;re ready.</span>
        </li>
      </ol>

      <ul className="quiz-confirm__matches">
        {matches.map((m) => (
          <li key={m.id}>
            <Link to={m.href}>{m.name}</Link>
            {m.firmName ? <span> · {m.firmName}</span> : null}
          </li>
        ))}
      </ul>

      <div className="quiz-results__actions">
        <Link className="btn btn--primary btn--lg" to={directoryHref}>
          Browse more professionals
        </Link>
        <Link className="btn btn--outline btn--lg" to="/">
          Back to home
        </Link>
      </div>
    </div>
  );
}
