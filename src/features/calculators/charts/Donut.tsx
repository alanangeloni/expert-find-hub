
import React from 'react';

export type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
  formatValue?: (value: number) => string;
  legend?: boolean;
};

export default function Donut({
  segments,
  size = 176,
  thickness = 16,
  centerLabel,
  centerValue,
  formatValue = (value) => String(Math.round(value)),
  legend = true,
}: Props) {
  const active = segments.filter((segment) => segment.value > 0);
  const total = active.reduce((sum, segment) => sum + segment.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="donut">
      <div className="donut__graphic" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(16, 16, 16, 0.08)"
              strokeWidth={thickness}
            />
            {active.map((segment) => {
              const fraction = total > 0 ? segment.value / total : 0;
              const dash = fraction * circumference;
              const element = (
                <circle
                  key={segment.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={thickness}
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                />
              );
              offset += dash;
              return element;
            })}
          </g>
        </svg>
        <div className="donut__center">
          {centerLabel ? <span className="donut__center-label">{centerLabel}</span> : null}
          {centerValue ? <strong className="donut__center-value">{centerValue}</strong> : null}
        </div>
      </div>

      {legend ? (
        <ul className="donut__legend">
          {segments.map((segment) => (
            <li key={segment.label} className="donut__legend-item">
              <span className="donut__swatch" style={{ background: segment.color }} />
              <span className="donut__legend-label">{segment.label}</span>
              <span className="donut__legend-value">
                {formatValue(segment.value)}
                <em>{total > 0 ? ` · ${Math.round((segment.value / total) * 100)}%` : ''}</em>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
