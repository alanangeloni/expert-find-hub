
import React from 'react';

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  label?: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
};

export default function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  size = 'md',
}: Props<T>) {
  return (
    <div className={`seg seg--${size}`}>
      {label ? <span className="seg__label">{label}</span> : null}
      <div className="seg__group" role="group" aria-label={label ?? 'Options'}>
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              className={`seg__item ${active ? 'seg__item--active' : ''}`}
              aria-pressed={active}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
