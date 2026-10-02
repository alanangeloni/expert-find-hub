import { Link } from "react-router-dom";
import { TOTAL_STEPS } from "../types";

const STEP_LABELS = [
  "Your priority",
  "What you need",
  "Your situation",
  "Financials",
  "Timing & location",
  "Your details",
];

export function QuizShell({
  step,
  children,
}: {
  step: number;
  children: React.ReactNode;
  showProgress?: boolean;
}) {
  return (
    <section className="home-quiz quiz-page">
      <div className="dcontainer">
        <div className="home-quiz__card quiz-page__card">
          <header className="home-quiz__head">
            <div>
              <span className="home-quiz__rule" aria-hidden="true" />
              <p className="home-quiz__eyebrow">Find your match</p>
              <h1 className="home-quiz__headline">
                A few questions. <em>The right shortlist.</em>
              </h1>
              <p className="home-quiz__lead">
                Tell us whether you need an accountant or a financial advisor. We&apos;ll walk you
                through six quick steps — free, private, and no obligation.
              </p>
            </div>
            <span className="home-quiz__count">
              Step {step} of {TOTAL_STEPS}
            </span>
          </header>

          <ol className="home-quiz__steps" aria-label="Progress">
            {STEP_LABELS.map((label, index) => {
              const n = index + 1;
              const cls =
                n === step ? "is-current" : n < step ? "is-done" : "";
              return (
                <li key={label} className={`home-quiz__step-pill ${cls}`}>
                  <span>{n < step ? "✓" : n}</span>
                  {label}
                </li>
              );
            })}
          </ol>

          {children}

          <p className="home-quiz__promise quiz-page__privacy-foot">
            <span aria-hidden="true">✓</span>
            Free, no obligation — and we never sell your details.
          </p>
          <p className="quiz-page__home-link">
            <Link to="/">← Back to home</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export function OptionCard({
  title,
  description,
  selected,
  onClick,
}: {
  title: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`home-quiz__option ${selected ? "is-active" : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      <strong>{title}</strong>
      {description ? <span>{description}</span> : null}
    </button>
  );
}

export function ChipOption({
  title,
  selected,
  onClick,
}: {
  title: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`home-quiz__chip ${selected ? "is-active" : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {title}
    </button>
  );
}

export function ContinueButton({
  onClick,
  disabled,
  label = "Continue",
}: {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      className="home-quiz__next"
      disabled={disabled}
      onClick={onClick}
    >
      {label}
      <span aria-hidden="true">→</span>
    </button>
  );
}

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="home-quiz__back" onClick={onClick}>
      Back
    </button>
  );
}

export function StepCard({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="quiz-page__step">
      {eyebrow ? <p className="quiz-page__phase-eyebrow">{eyebrow}</p> : null}
      <div className="home-quiz__panel">
        <p className="home-quiz__ask">{title}</p>
        {subtitle ? <p className="home-quiz__hint">{subtitle}</p> : null}
        {children}
      </div>
      {footer ? <footer className="home-quiz__foot">{footer}</footer> : null}
    </div>
  );
}
