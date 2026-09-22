
import React from 'react';
import Icon, { IconName } from './Icon';

type Props = {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tone?: 'default' | 'accent' | 'warn' | 'bad' | 'sky';
  icon?: IconName;
  emphasis?: boolean;
};

export default function Stat({ label, value, sub, tone = 'default', icon, emphasis }: Props) {
  return (
    <div className={`stat stat--${tone} ${emphasis ? 'stat--emphasis' : ''}`}>
      <span className="stat__label">
        {icon ? <Icon name={icon} size={14} /> : null}
        {label}
      </span>
      <strong className="stat__value">{value}</strong>
      {sub ? <span className="stat__sub">{sub}</span> : null}
    </div>
  );
}
