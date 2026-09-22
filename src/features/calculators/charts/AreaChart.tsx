
import React, { useMemo } from 'react';
import { useMeasure } from '../useMeasure';

export type AreaSeries = {
  label: string;
  color: string;
  values: number[];
  fill?: boolean;
  dashed?: boolean;
};

type Props = {
  labels: number[];
  series: AreaSeries[];
  height?: number;
  formatX?: (value: number) => string;
  formatY?: (value: number) => string;
  reference?: { value: number; label?: string; color?: string };
  ariaLabel?: string;
  legend?: boolean;
};


export default function AreaChart({
  labels,
  series,
  height = 240,
  formatX = (value) => String(Math.round(value)),
  formatY = (value) => String(Math.round(value)),
  reference,
  ariaLabel = 'Chart',
  legend = true,
}: Props) {
  const [ref, width] = useMeasure<HTMLDivElement>();
  const uid = useMemo(() => Math.random().toString(36).slice(2, 8), []);

  const w = Math.max(width, 280);
  const pad = { l: 62, r: 16, t: 18, b: 30 };
  const innerW = Math.max(10, w - pad.l - pad.r);
  const innerH = Math.max(10, height - pad.t - pad.b);
  const points = series[0]?.values.length ?? 0;

  const bounds = useMemo(() => {
    const values = series.flatMap((entry) => entry.values);
    if (reference) values.push(reference.value);
    if (!values.length) return { min: 0, max: 1 };
    let max = Math.max(...values, 0);
    const min = Math.min(...values, 0);
    if (max === min) max = min + 1;
    const span = max - min;
    return { min: min - span * 0.06, max: max + span * 0.08 };
  }, [series, reference]);

  const xOf = (index: number) =>
    pad.l + (points <= 1 ? innerW / 2 : (index / (points - 1)) * innerW);
  const yOf = (value: number) =>
    pad.t + innerH - ((value - bounds.min) / (bounds.max - bounds.min)) * innerH;

  const gridValues = useMemo(() => {
    const steps = 4;
    return Array.from({ length: steps + 1 }, (_, index) =>
      bounds.min + ((bounds.max - bounds.min) * index) / steps
    );
  }, [bounds]);

  const tickIndexes = useMemo(() => {
    if (points <= 1) return [0];
    const target = Math.min(5, points);
    const step = (points - 1) / (target - 1 || 1);
    const out: number[] = [];
    for (let i = 0; i < target; i += 1) out.push(Math.round(i * step));
    return Array.from(new Set(out));
  }, [points]);

  const baseline = Math.max(bounds.min, Math.min(bounds.max, 0));

  return (
    <div className="chart" ref={ref}>
      {width > 0 && points > 0 ? (
        <svg
          className="chart__svg"
          width={w}
          height={height}
          viewBox={`0 0 ${w} ${height}`}
          role="img"
          aria-label={ariaLabel}
        >
          <defs>
            {series.map((entry, index) => (
              <linearGradient key={entry.label} id={`ac-${uid}-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={entry.color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={entry.color} stopOpacity="0.01" />
              </linearGradient>
            ))}
          </defs>

          {gridValues.map((value, index) => (
            <g key={index}>
              <line
                className="chart__grid"
                x1={pad.l}
                x2={pad.l + innerW}
                y1={yOf(value)}
                y2={yOf(value)}
              />
              <text className="chart__label chart__label--y" x={pad.l - 10} y={yOf(value) + 4} textAnchor="end">
                {formatY(value)}
              </text>
            </g>
          ))}

          {tickIndexes.map((index) => (
            <text
              key={index}
              className="chart__label"
              x={xOf(index)}
              y={height - 9}
              textAnchor={index === 0 ? 'start' : index === points - 1 ? 'end' : 'middle'}
            >
              {formatX(labels[index] ?? index)}
            </text>
          ))}

          {reference ? (
            <g>
              <line
                className="chart__reference"
                x1={pad.l}
                x2={pad.l + innerW}
                y1={yOf(reference.value)}
                y2={yOf(reference.value)}
                stroke={reference.color ?? '#d98324'}
              />
              {reference.label ? (
                <text
                  className="chart__reference-label"
                  x={pad.l + innerW}
                  y={yOf(reference.value) - 7}
                  textAnchor="end"
                >
                  {reference.label}
                </text>
              ) : null}
            </g>
          ) : null}

          {series.map((entry, index) => {
            const line = entry.values
              .map((value, i) => `${i === 0 ? 'M' : 'L'}${xOf(i).toFixed(2)},${yOf(value).toFixed(2)}`)
              .join(' ');
            const area = `${line} L${xOf(entry.values.length - 1).toFixed(2)},${yOf(
              baseline
            ).toFixed(2)} L${xOf(0).toFixed(2)},${yOf(baseline).toFixed(2)} Z`;

            return (
              <g key={entry.label}>
                {entry.fill !== false ? (
                  <path d={area} fill={`url(#ac-${uid}-${index})`} />
                ) : null}
                <path
                  d={line}
                  fill="none"
                  stroke={entry.color}
                  strokeWidth={entry.dashed ? 1.6 : 2.2}
                  strokeDasharray={entry.dashed ? '5 5' : undefined}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}
        </svg>
      ) : (
        <div className="chart__empty" style={{ height }}>
          Not enough data to plot yet.
        </div>
      )}

      {legend && series.length > 0 ? (
        <ul className="chart__legend">
          {series.map((entry) => (
            <li key={entry.label} className="chart__legend-item">
              <span className="chart__dot" style={{ background: entry.color }} />
              {entry.label}
            </li>
          ))}
          {reference ? (
            <li className="chart__legend-item">
              <span
                className="chart__dot chart__dot--line"
                style={{ borderColor: reference.color ?? '#d98324' }}
              />
              {reference.label ?? 'Target'}
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
