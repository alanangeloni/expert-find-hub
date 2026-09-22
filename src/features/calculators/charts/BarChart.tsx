
import React from 'react';

export type Bar = {
  label: string;
  value: number;
  color?: string;
  caption?: string;
  emphasis?: boolean;
};

type Props = {
  bars: Bar[];
  height?: number;
  formatValue?: (value: number) => string;
  ariaLabel?: string;
};

export default function BarChart({
  bars,
  height = 220,
  formatValue = (value) => String(Math.round(value)),
  ariaLabel = 'Bar chart',
}: Props) {
  const max = Math.max(...bars.map((bar) => Math.max(0, bar.value)), 1);

  return (
    <div className="bars" style={{ minHeight: height }} role="img" aria-label={ariaLabel}>
      {bars.map((bar) => {
        const pct = Math.max(3, (Math.max(0, bar.value) / max) * 100);
        return (
          <div key={bar.label} className="bars__item">
            <span className="bars__value">{formatValue(bar.value)}</span>
            <div className="bars__track">
              <div
                className={`bars__fill ${bar.emphasis ? 'bars__fill--emphasis' : ''}`}
                style={{
                  height: `${pct}%`,
                  background: bar.color
                    ? `linear-gradient(180deg, ${bar.color}, ${bar.color}55)`
                    : undefined,
                }}
              />
            </div>
            <span className="bars__label">{bar.label}</span>
            {bar.caption ? <span className="bars__caption">{bar.caption}</span> : null}
          </div>
        );
      })}
    </div>
  );
}
