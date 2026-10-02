import { Link } from "react-router-dom";
import { TOTAL_STEPS } from "../types";

interface ProgressBarProps {
  step: number;
}

export function QuizProgressBar({ step }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (step / TOTAL_STEPS) * 100));
  return (
    <div className="quiz__progress" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={TOTAL_STEPS} aria-label={`Step ${step} of ${TOTAL_STEPS}`}>
      <div className="quiz__progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function QuizShell({
  step,
  children,
  showProgress = true,
}: {
  step: number;
  children: React.ReactNode;
  showProgress?: boolean;
}) {
  return (
    <div className="quiz">
      <div className="quiz__shell">
        {showProgress && <QuizProgressBar step={step} />}
        <div className="dcontainer quiz__layout">
          <aside className="quiz__rail">
            <Link to="/" className="quiz__back-home">
              ← Back to home
            </Link>
            <p className="quiz__rail-eyebrow">Get matched</p>
            <h2>
              Find your
              <br />
              <em>financial pro</em>
            </h2>
            <ol className="quiz__steps" aria-label="Quiz steps">
              {[
                "Your priority",
                "What you need",
                "Your situation",
                "Financials",
                "Timing & location",
                "Your details",
              ].map((label, i) => {
                const n = i + 1;
                const cls =
                  n === step ? "is-current" : n < step ? "is-done" : "";
                return (
                  <li key={label} className={cls}>
                    <span className="quiz__step-num">{n < step ? "✓" : n}</span>
                    <span className="quiz__step-label">{label}</span>
                  </li>
                );
              })}
            </ol>
            <p className="quiz__rail-note">
              About 2 minutes. Free, no obligation — and we never sell your details.
            </p>
          </aside>
          <div className="quiz__main">{children}</div>
        </div>
      </div>
    </div>
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
      className={`quiz__option ${selected ? "is-on" : ""}`}
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
      className={`quiz__chip ${selected ? "is-on" : ""}`}
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
    <button type="button" className="btn btn--primary btn--lg quiz__continue" disabled={disabled} onClick={onClick}>
      {label}
      <span aria-hidden="true">→</span>
    </button>
  );
}

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="quiz__back" onClick={onClick}>
      ← Back
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
    <div className="quiz__card">
      <header className="quiz__card-header">
        {eyebrow ? <span className="quiz__step-indicator">{eyebrow}</span> : null}
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>
      <div className="quiz__card-body">{children}</div>
      {footer ? <footer className="quiz__card-footer">{footer}</footer> : null}
    </div>
  );
}
