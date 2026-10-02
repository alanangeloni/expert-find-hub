import { useEffect, useMemo, useState } from "react";
import {
  AGE_RANGE_OPTIONS,
  AGE_RANGE_QUESTION,
  AGE_RANGE_SUBTEXT,
  ACCOUNTANT_REVENUE_QUESTION,
  CROSS_SELL_BY_PATH,
  CROSS_SELL_QUESTION,
  CROSS_SELL_SUBTEXT,
  formatCurrency,
  INDUSTRIES,
  INDUSTRY_QUESTION,
  INDUSTRY_SUBTEXT,
  INTENT_EXCLUSIVE,
  INTENT_OPTIONS,
  INTENT_QUESTION,
  INTENT_SUBTEXT,
  LOGISTICS_QUESTION,
  LOGISTICS_SUBTEXT,
  PERSONA_NONE,
  PERSONA_QUESTION,
  PERSONA_SUBTEXT,
  PERSONAS_BY_PATH,
  PRIMARY_OPTIONS,
  PRIMARY_QUESTION,
  PRIMARY_SUBTEXT,
  SERVICES_BY_PATH,
  SERVICES_QUESTION,
  SERVICES_SUBTEXT,
  SLIDER_DEFAULT_INDEX,
  SLIDER_VALUES,
  STATE_LABEL,
  TAX_FORK_OPTIONS,
  TAX_FORK_QUESTION,
  TAX_FORK_SUBTEXT,
  TIMING_LABEL,
  TIMING_OPTIONS,
  US_STATES,
  WEALTH_ASSETS_QUESTION,
  WEALTH_INCOME_QUESTION,
} from "../content";
import type { QuizAnswers, QuizPath } from "../types";
import {
  BackButton,
  ChipOption,
  ContinueButton,
  OptionCard,
  StepCard,
} from "./QuizChrome";

function sortAlpha(items: string[]) {
  return [...items].sort((a, b) => a.localeCompare(b));
}

function toggleExclusive(
  selected: string[],
  value: string,
  exclusive: string
): string[] {
  if (value === exclusive) {
    return selected.includes(exclusive) ? [] : [exclusive];
  }
  const without = selected.filter((s) => s !== exclusive);
  return without.includes(value)
    ? without.filter((s) => s !== value)
    : [...without, value];
}

function toggleNone(
  selected: string[],
  value: string,
  noneValue: string
): string[] {
  if (value === noneValue) {
    return selected.includes(noneValue) ? [] : [noneValue];
  }
  const without = selected.filter((s) => s !== noneValue);
  return without.includes(value)
    ? without.filter((s) => s !== value)
    : [...without, value];
}

export function PrimaryStep({
  selected,
  onSelect,
}: {
  selected: QuizPath | null;
  onSelect: (path: QuizPath) => void;
}) {
  const options = [...PRIMARY_OPTIONS].sort((a, b) =>
    a.title.localeCompare(b.title)
  );
  return (
    <StepCard title={PRIMARY_QUESTION} subtitle={PRIMARY_SUBTEXT}>
      <div className="quiz__option-grid">
        {options.map((o) => (
          <OptionCard
            key={o.path}
            title={o.title}
            description={o.subtitle}
            selected={selected === o.path}
            onClick={() => onSelect(o.path)}
          />
        ))}
      </div>
    </StepCard>
  );
}

export function ServicesStep({
  path,
  selected,
  onChange,
  onContinue,
  onBack,
}: {
  path: QuizPath;
  selected: string[];
  onChange: (v: string[]) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const options = sortAlpha(SERVICES_BY_PATH[path]);
  const toggle = (v: string) =>
    onChange(selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v]);
  return (
    <StepCard
      title={SERVICES_QUESTION}
      subtitle={SERVICES_SUBTEXT}
      footer={
        <>
          <BackButton onClick={onBack} />
          <ContinueButton onClick={onContinue} disabled={selected.length === 0} />
        </>
      }
    >
      <div className={`quiz__option-grid ${options.length <= 4 ? "quiz__option-grid--single" : ""}`}>
        {options.map((o) => (
          <OptionCard key={o} title={o} selected={selected.includes(o)} onClick={() => toggle(o)} />
        ))}
      </div>
    </StepCard>
  );
}

export function CrossSellStep({
  path,
  selected,
  onChange,
  onContinue,
  onBack,
}: {
  path: QuizPath;
  selected: string[];
  onChange: (v: string[]) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const { options, exclusive } = CROSS_SELL_BY_PATH[path];
  const sorted = sortAlpha(options.filter((o) => o !== exclusive));
  return (
    <StepCard
      title={CROSS_SELL_QUESTION}
      subtitle={CROSS_SELL_SUBTEXT}
      footer={
        <>
          <BackButton onClick={onBack} />
          <ContinueButton onClick={onContinue} disabled={selected.length === 0} />
        </>
      }
    >
      <div className="quiz__option-grid">
        {sorted.map((o) => (
          <OptionCard
            key={o}
            title={o}
            selected={selected.includes(o)}
            onClick={() => onChange(toggleExclusive(selected, o, exclusive))}
          />
        ))}
        <OptionCard
          title={exclusive}
          selected={selected.includes(exclusive)}
          onClick={() => onChange(toggleExclusive(selected, exclusive, exclusive))}
        />
      </div>
    </StepCard>
  );
}

export function TaxForkStep({
  selected,
  onSelect,
  onBack,
}: {
  selected: string;
  onSelect: (v: string) => void;
  onBack: () => void;
}) {
  return (
    <StepCard
      title={TAX_FORK_QUESTION}
      subtitle={TAX_FORK_SUBTEXT}
      footer={<BackButton onClick={onBack} />}
    >
      <div className="quiz__option-grid quiz__option-grid--single">
        {TAX_FORK_OPTIONS.map((o) => (
          <OptionCard
            key={o}
            title={o}
            selected={selected === o}
            onClick={() => onSelect(o)}
          />
        ))}
      </div>
    </StepCard>
  );
}

export function IndustryStep({
  industry,
  industryOther,
  onChange,
  onContinue,
  onBack,
}: {
  industry: string;
  industryOther: string;
  onChange: (industry: string, industryOther: string) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? INDUSTRIES.filter((i) => i.toLowerCase().includes(q)) : INDUSTRIES;
  }, [query]);
  const canContinue = industry !== "" && (industry !== "Other" || true);

  return (
    <StepCard
      title={INDUSTRY_QUESTION}
      subtitle={INDUSTRY_SUBTEXT}
      footer={
        <>
          <BackButton onClick={onBack} />
          <ContinueButton onClick={onContinue} disabled={!canContinue} />
        </>
      }
    >
      <div className="quiz__search-list">
        <input
          type="search"
          className="quiz__search-input"
          placeholder="Search industries…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search industries"
        />
        <div className="quiz__search-results" role="listbox">
          {filtered.length === 0 ? (
            <p className="quiz__empty">No matches.</p>
          ) : (
            filtered.map((item) => (
              <button
                key={item}
                type="button"
                role="option"
                aria-selected={industry === item}
                className={`quiz__search-item ${industry === item ? "is-on" : ""}`}
                onClick={() => onChange(item, item === "Other" ? industryOther : "")}
              >
                {item}
              </button>
            ))
          )}
        </div>
      </div>
      {industry === "Other" && (
        <input
          className="quiz__text-input mt-4"
          placeholder="Tell us your industry"
          value={industryOther}
          onChange={(e) => onChange("Other", e.target.value)}
        />
      )}
    </StepCard>
  );
}

export function PersonaStep({
  path,
  selected,
  onChange,
  onContinue,
  onBack,
}: {
  path: QuizPath;
  selected: string[];
  onChange: (v: string[]) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const options = sortAlpha(PERSONAS_BY_PATH[path].filter((p) => p !== PERSONA_NONE));
  return (
    <StepCard
      title={PERSONA_QUESTION}
      subtitle={PERSONA_SUBTEXT}
      footer={
        <>
          <BackButton onClick={onBack} />
          <ContinueButton onClick={onContinue} disabled={selected.length === 0} />
        </>
      }
    >
      <div className="quiz__option-grid">
        {options.map((o) => (
          <OptionCard
            key={o}
            title={o}
            selected={selected.includes(o)}
            onClick={() => onChange(toggleNone(selected, o, PERSONA_NONE))}
          />
        ))}
        <OptionCard
          title={PERSONA_NONE}
          selected={selected.includes(PERSONA_NONE)}
          onClick={() => onChange(toggleNone(selected, PERSONA_NONE, PERSONA_NONE))}
        />
      </div>
    </StepCard>
  );
}

export function IntentStep({
  selected,
  onSelect,
  onBack,
}: {
  selected: string;
  onSelect: (v: string) => void;
  onBack: () => void;
}) {
  const options = sortAlpha(INTENT_OPTIONS.filter((o) => o !== INTENT_EXCLUSIVE));
  return (
    <StepCard
      title={INTENT_QUESTION}
      subtitle={INTENT_SUBTEXT}
      footer={<BackButton onClick={onBack} />}
    >
      <div className="quiz__option-grid">
        {options.map((o) => (
          <OptionCard key={o} title={o} selected={selected === o} onClick={() => onSelect(o)} />
        ))}
        <OptionCard
          title={INTENT_EXCLUSIVE}
          selected={selected === INTENT_EXCLUSIVE}
          onClick={() => onSelect(INTENT_EXCLUSIVE)}
        />
      </div>
    </StepCard>
  );
}

function CurrencySlider({
  question,
  value,
  onChange,
  showQuestion = true,
}: {
  question: string;
  value: string;
  onChange: (v: string) => void;
  showQuestion?: boolean;
}) {
  const initial = useMemo(() => {
    const idx = SLIDER_VALUES.findIndex(
      (v, i) => formatCurrency(v, true, i === SLIDER_VALUES.length - 1) === value
    );
    return idx >= 0 ? idx : SLIDER_DEFAULT_INDEX;
  }, [value]);
  const [index, setIndex] = useState(initial);

  useEffect(() => {
    const label = formatCurrency(
      SLIDER_VALUES[index],
      true,
      index === SLIDER_VALUES.length - 1
    );
    onChange(label);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const label = formatCurrency(
    SLIDER_VALUES[index],
    true,
    index === SLIDER_VALUES.length - 1
  );

  return (
    <div className="quiz__slider">
      {showQuestion ? (
        <>
          <h3 className="quiz__slider-q">{question}</h3>
          <p className="quiz__slider-hint">Drag the slider to select.</p>
        </>
      ) : null}
      <p className="quiz__slider-value">{label}</p>
      <input
        type="range"
        min={0}
        max={SLIDER_VALUES.length - 1}
        value={index}
        onChange={(e) => setIndex(Number(e.target.value))}
        className="quiz__range"
        aria-label={question}
      />
      <div className="quiz__slider-ends">
        <span>{formatCurrency(SLIDER_VALUES[0])}</span>
        <span>
          {formatCurrency(SLIDER_VALUES[SLIDER_VALUES.length - 1], true, true)}
        </span>
      </div>
    </div>
  );
}

export function FinancialStep({
  answers,
  onChange,
  onContinue,
  onBack,
}: {
  answers: QuizAnswers;
  onChange: (patch: Partial<QuizAnswers>) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  if (answers.path === "wealth") {
    const canContinue = !!answers.ageRange;
    return (
      <StepCard
        title={WEALTH_ASSETS_QUESTION}
        subtitle="Drag the slider to select."
        footer={
          <>
            <BackButton onClick={onBack} />
            <ContinueButton onClick={onContinue} disabled={!canContinue} />
          </>
        }
      >
        <CurrencySlider
          question={WEALTH_ASSETS_QUESTION}
          value={answers.investableAssets}
          onChange={(v) => onChange({ investableAssets: v })}
          showQuestion={false}
        />
        <div className="quiz__slider-block">
          <CurrencySlider
            question={WEALTH_INCOME_QUESTION}
            value={answers.annualIncome}
            onChange={(v) => onChange({ annualIncome: v })}
          />
        </div>
        <div className="quiz__age">
          <h3>{AGE_RANGE_QUESTION}</h3>
          <p>{AGE_RANGE_SUBTEXT}</p>
          <div className="quiz__age-grid">
            {AGE_RANGE_OPTIONS.map((a) => (
              <button
                key={a}
                type="button"
                className={`quiz__age-btn ${answers.ageRange === a ? "is-on" : ""}`}
                onClick={() => onChange({ ageRange: a })}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </StepCard>
    );
  }

  return (
    <StepCard
      title={ACCOUNTANT_REVENUE_QUESTION}
      subtitle="Drag the slider to select."
      footer={
        <>
          <BackButton onClick={onBack} />
          <ContinueButton onClick={onContinue} />
        </>
      }
    >
      <CurrencySlider
        question={ACCOUNTANT_REVENUE_QUESTION}
        value={answers.financialSize}
        onChange={(v) => onChange({ financialSize: v })}
        showQuestion={false}
      />
    </StepCard>
  );
}

export function LogisticsStep({
  answers,
  onChange,
  onContinue,
  onBack,
}: {
  answers: QuizAnswers;
  onChange: (patch: Partial<QuizAnswers>) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const locationOk = answers.outsideUs || !!answers.state;
  const canContinue = !!answers.timing && locationOk;

  return (
    <StepCard
      title={LOGISTICS_QUESTION}
      subtitle={LOGISTICS_SUBTEXT}
      footer={
        <>
          <BackButton onClick={onBack} />
          <ContinueButton onClick={onContinue} disabled={!canContinue} />
        </>
      }
    >
      <div className="quiz__field">
        <h3>{TIMING_LABEL}</h3>
        <div className="quiz__option-grid quiz__option-grid--single">
          {TIMING_OPTIONS.map((t) => (
            <OptionCard
              key={t}
              title={t}
              selected={answers.timing === t}
              onClick={() => onChange({ timing: t })}
            />
          ))}
        </div>
      </div>

      <div className="quiz__field mt-8">
        <h3>{STATE_LABEL}</h3>
        {!answers.outsideUs && (
          <div className="quiz__chips quiz__chips--compact">
            {US_STATES.map((s) => (
              <ChipOption
                key={s}
                title={s}
                selected={answers.state === s}
                onClick={() => onChange({ state: s, outsideUs: false })}
              />
            ))}
          </div>
        )}
        <label className="quiz__toggle mt-4">
          <input
            type="checkbox"
            checked={answers.outsideUs}
            onChange={(e) =>
              onChange({
                outsideUs: e.target.checked,
                state: e.target.checked ? "" : answers.state,
              })
            }
          />
          <span className="quiz__toggle-ui" aria-hidden="true" />
          <span>
            <strong>I live outside the United States</strong>
          </span>
        </label>
      </div>
    </StepCard>
  );
}
