
import React from 'react';

type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  display: string;
  minLabel?: string;
  maxLabel?: string;
};

export default function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  display,
  minLabel,
  maxLabel,
}: Props) {
  const id = React.useId();
  const progress = ((value - min) / Math.max(1, max - min)) * 100;

  return (
    <div className="rfield">
      <div className="rfield__head">
        <label className="rfield__label" htmlFor={`rf-${id}`}>
          {label}
        </label>
        <strong className="rfield__value">{display}</strong>
      </div>
      <input
        id={`rf-${id}`}
        className="rfield__input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ ['--range-progress' as string]: `${progress}%` }}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {minLabel || maxLabel ? (
        <div className="rfield__scale">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
