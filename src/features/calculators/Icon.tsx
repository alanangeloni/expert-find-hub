
import React from 'react';

export type IconName =
  | 'calculator'
  | 'home'
  | 'car'
  | 'trending'
  | 'target'
  | 'bank'
  | 'card'
  | 'pie'
  | 'receipt'
  | 'wallet'
  | 'clock'
  | 'search'
  | 'star'
  | 'check'
  | 'arrow-right'
  | 'users'
  | 'shield'
  | 'briefcase'
  | 'map-pin'
  | 'mail'
  | 'calendar'
  | 'x'
  | 'plus'
  | 'minus'
  | 'bookmark'
  | 'filter'
  | 'percent'
  | 'globe'
  | 'sparkle';

const GLYPHS: Record<IconName, React.ReactNode> = {
  calculator: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="3" />
      <line x1="8" y1="7.5" x2="16" y2="7.5" />
      <circle cx="8.6" cy="12.2" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12.2" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.4" cy="12.2" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="8.6" cy="16.4" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="16.4" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.4" cy="16.4" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  home: (
    <>
      <path d="M3.8 10.6 12 4l8.2 6.6" />
      <path d="M6 9.6V20h12V9.6" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  car: (
    <>
      <path d="M4 16.2v-2.8l1.8-4.6A2 2 0 0 1 7.7 7.5h8.6a2 2 0 0 1 1.9 1.3L20 13.4v2.8" />
      <line x1="4" y1="13.2" x2="20" y2="13.2" />
      <circle cx="7.5" cy="16.6" r="1.7" />
      <circle cx="16.5" cy="16.6" r="1.7" />
    </>
  ),
  trending: (
    <>
      <polyline points="3 17.5 9 11.5 13 15.5 21 7" />
      <polyline points="15 7 21 7 21 13" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  bank: (
    <>
      <path d="M3.5 9.8 12 4.2l8.5 5.6" />
      <line x1="4.6" y1="9.8" x2="19.4" y2="9.8" />
      <line x1="6.8" y1="12" x2="6.8" y2="17.4" />
      <line x1="12" y1="12" x2="12" y2="17.4" />
      <line x1="17.2" y1="12" x2="17.2" y2="17.4" />
      <line x1="4" y1="20" x2="20" y2="20" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="6.6" y1="15" x2="11" y2="15" />
    </>
  ),
  pie: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 3.6V12l7.3 4.2" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3.2h12v17.6l-3-1.9-3 1.9-3-1.9-3 1.9V3.2z" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="3" />
      <path d="M3 10.2h18" />
      <circle cx="17" cy="14.6" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <polyline points="12 7.6 12 12 15.4 14" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.4" />
      <line x1="15.8" y1="15.8" x2="20.4" y2="20.4" />
    </>
  ),
  star: <path d="M12 4l2.5 5.2 5.5.8-4 3.9.9 5.6-4.9-2.6-4.9 2.6.9-5.6-4-3.9 5.5-.8L12 4z" />,
  check: <polyline points="5 12.6 10 17.6 19 7" />,
  'arrow-right': (
    <>
      <line x1="4" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </>
  ),
  users: (
    <>
      <circle cx="9.2" cy="9" r="3.4" />
      <path d="M3.6 19.6c0-3.1 2.5-5.2 5.6-5.2s5.6 2.1 5.6 5.2" />
      <path d="M16.2 6.4a3.4 3.4 0 0 1 0 6.6" />
      <path d="M17.6 14.8c1.9.7 3.1 2.3 3.1 4.8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.4l7 2.6v5.4c0 4.4-2.9 7.7-7 9.2-4.1-1.5-7-4.8-7-9.2V6l7-2.6z" />
      <polyline points="9 12.2 11.3 14.5 15.3 10" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7.4" width="18" height="12.2" rx="2.6" />
      <path d="M9 7.4V5.9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" />
      <line x1="3" y1="12.6" x2="21" y2="12.6" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M12 20.8s6.4-5.6 6.4-10.1A6.4 6.4 0 0 0 5.6 10.7C5.6 15.2 12 20.8 12 20.8z" />
      <circle cx="12" cy="10.4" r="2.3" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.4" width="18" height="13.2" rx="3" />
      <polyline points="4.2 8 12 13.4 19.8 8" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.6" y="5" width="16.8" height="15" rx="3" />
      <line x1="3.6" y1="9.6" x2="20.4" y2="9.6" />
      <line x1="8.2" y1="3.2" x2="8.2" y2="6.6" />
      <line x1="15.8" y1="3.2" x2="15.8" y2="6.6" />
    </>
  ),
  x: (
    <>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  minus: <line x1="5" y1="12" x2="19" y2="12" />,
  bookmark: <path d="M6.4 3.6h11.2a1 1 0 0 1 1 1v16.1l-6.6-4.1-6.6 4.1V4.6a1 1 0 0 1 1-1z" />,
  filter: (
    <>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="10" y1="17" x2="14" y2="17" />
    </>
  ),
  percent: (
    <>
      <line x1="6.4" y1="17.6" x2="17.6" y2="6.4" />
      <circle cx="7.6" cy="7.6" r="2.5" />
      <circle cx="16.4" cy="16.4" r="2.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <line x1="3.6" y1="12" x2="20.4" y2="12" />
      <path d="M12 3.6c2.4 2.4 3.6 5.4 3.6 8.4s-1.2 6-3.6 8.4c-2.4-2.4-3.6-5.4-3.6-8.4S9.6 6 12 3.6z" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3.6l1.7 5 5 1.7-5 1.7-1.7 5-1.7-5-5-1.7 5-1.7 1.7-5z" />
      <path d="M18.6 15.4l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z" />
    </>
  ),
};

type Props = {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
};

export default function Icon({ name, size = 20, className, strokeWidth = 1.6 }: Props) {
  return (
    <svg
      className={className ? `icon ${className}` : 'icon'}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {GLYPHS[name]}
    </svg>
  );
}
