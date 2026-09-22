
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  id?: string;
};

function plain(value: number): string {
  if (!Number.isFinite(value)) return '0';
  return String(value);
}

export default function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  hint,
  min,
  max,
  step,
  id,
}: Props) {
  const [text, setText] = useState(() => plain(value));
  const focused = useRef(false);
  const reactId = React.useId();
  const inputId = id ?? `nf-${reactId}`;

  useEffect(() => {
    if (focused.current) return;
    setText(plain(value));
  }, [value]);

  const commit = (next: string) => {
    setText(next);
    const cleaned = next.replace(/[^0-9.-]/g, '');
    if (cleaned === '' || cleaned === '-' || cleaned === '.') return;
    const parsed = Number(cleaned);
    if (!Number.isFinite(parsed)) return;
    let result = parsed;
    if (typeof min === 'number' && result < min) result = min;
    if (typeof max === 'number' && result > max) result = max;
    onChange(result);
  };

  return (
    <label className="nfield" htmlFor={inputId}>
      <span className="nfield__label">{label}</span>
      <span className="nfield__control">
        {prefix ? <span className="nfield__affix">{prefix}</span> : null}
        <input
          id={inputId}
          className="nfield__input"
          type="text"
          inputMode="decimal"
          value={text}
          step={step}
          onFocus={() => {
            focused.current = true;
          }}
          onBlur={() => {
            focused.current = false;
            setText(plain(value));
          }}
          onChange={(event) => commit(event.target.value)}
        />
        {suffix ? <span className="nfield__affix nfield__affix--suffix">{suffix}</span> : null}
      </span>
      {hint ? <span className="nfield__hint">{hint}</span> : null}
    </label>
  );
}
