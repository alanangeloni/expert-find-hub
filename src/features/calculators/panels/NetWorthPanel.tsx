
import React, { useMemo } from 'react';
import PanelShell from './PanelShell';
import { useReportSummary } from '../summary';
import NumberField from '../NumberField';
import Stat from '../Stat';
import Donut from '../charts/Donut';
import { usePersistentState } from '../usePersistentState';
import { calcKey } from '../storage';
import { currency, percent } from '../format';

type Inputs = {
  cash: number;
  investments: number;
  retirement: number;
  property: number;
  other: number;
  mortgage: number;
  loans: number;
  cards: number;
  student: number;
};

const DEFAULTS: Inputs = {
  cash: 18000,
  investments: 96000,
  retirement: 74000,
  property: 420000,
  other: 9000,
  mortgage: 312000,
  loans: 22000,
  cards: 6400,
  student: 0,
};

const ASSET_FIELDS: { key: keyof Inputs; label: string; color: string }[] = [
  { key: 'cash', label: 'Cash & savings', color: '#34d399' },
  { key: 'investments', label: 'Investments', color: '#38bdf8' },
  { key: 'retirement', label: 'Retirement accounts', color: '#a78bfa' },
  { key: 'property', label: 'Property & vehicles', color: '#f4b942' },
  { key: 'other', label: 'Other assets', color: '#7b8aa5' },
];

const DEBT_FIELDS: { key: keyof Inputs; label: string; color: string }[] = [
  { key: 'mortgage', label: 'Mortgage', color: '#fb7185' },
  { key: 'loans', label: 'Loans', color: '#fda4af' },
  { key: 'cards', label: 'Credit cards', color: '#f97316' },
  { key: 'student', label: 'Student loans', color: '#e879f9' },
];

function tier(netWorth: number): { label: string; blurb: string } {
  if (netWorth < 0) return { label: 'Rebuilding', blurb: 'Liabilities exceed assets — focus on the highest-rate debt first.' };
  if (netWorth < 50000) return { label: 'Starting out', blurb: 'The first $50K is the hardest. Automate a monthly transfer and let it run.' };
  if (netWorth < 250000) return { label: 'Building', blurb: 'You have real momentum. Watch that consumer debt does not outrun your savings.' };
  if (netWorth < 750000) return { label: 'Solid', blurb: 'A meaningful buffer. Consider diversifying away from property concentration.' };
  return { label: 'Established', blurb: 'Strong balance sheet. Estate and tax structuring usually matter more than returns now.' };
}

export default function NetWorthPanel() {
  const [v, setV] = usePersistentState<Inputs>(calcKey('networth'), DEFAULTS);
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const model = useMemo(() => {
    const assets = ASSET_FIELDS.reduce((sum, field) => sum + (v[field.key] as number), 0);
    const debts = DEBT_FIELDS.reduce((sum, field) => sum + (v[field.key] as number), 0);
    const net = assets - debts;
    const liquidity = v.cash + v.investments;
    const badDebt = v.cards + v.student;
    return {
      assets,
      debts,
      net,
      liquidity,
      badDebt,
      debtRatio: assets > 0 ? (debts / assets) * 100 : 0,
      tier: tier(net),
      monthsOfBuffer: v.cash > 0 && debts > 0 ? v.cash / Math.max(1, debts / 12) : 0,
    };
  }, [v]);

  useReportSummary(`Net worth ${currency(model.net)}`);

  return (
    <PanelShell
      inputsTitle="What you own and owe"
      inputs={
        <>
          <span className="nw__group">Assets</span>
          {ASSET_FIELDS.map((field) => (
            <NumberField
              key={field.key}
              label={field.label}
              value={v[field.key] as number}
              prefix="$"
              min={0}
              step={1000}
              onChange={(value) => set(field.key, value)}
            />
          ))}
          <span className="nw__group nw__group--debt">Liabilities</span>
          {DEBT_FIELDS.map((field) => (
            <NumberField
              key={field.key}
              label={field.label}
              value={v[field.key] as number}
              prefix="$"
              min={0}
              step={1000}
              onChange={(value) => set(field.key, value)}
            />
          ))}
        </>
      }
      results={
        <>
          <div className="stat-grid">
            <Stat
              label="Net worth"
              value={currency(model.net)}
              sub={model.tier.label}
              tone={model.net >= 0 ? 'accent' : 'bad'}
              emphasis
              icon="shield"
            />
            <Stat label="Total assets" value={currency(model.assets)} tone="sky" />
            <Stat
              label="Total liabilities"
              value={currency(model.debts)}
              tone="bad"
              sub={`${percent(model.debtRatio, 0)} of assets`}
            />
            <Stat
              label="Liquid reserves"
              value={currency(model.liquidity)}
              sub={`${currency(model.badDebt)} in high-interest debt`}
              tone={model.badDebt > model.liquidity * 0.2 ? 'warn' : 'default'}
            />
          </div>

          <div className="nw__verdict">
            <strong>{model.tier.label}</strong>
            <p>{model.tier.blurb}</p>
          </div>
        </>
      }
      chart={
        <Donut
          centerLabel="Net worth"
          centerValue={currency(model.net)}
          formatValue={(value) => currency(value)}
          segments={[
            ...ASSET_FIELDS.filter((field) => (v[field.key] as number) > 0).map((field) => ({
              label: field.label,
              value: v[field.key] as number,
              color: field.color,
            })),
            ...DEBT_FIELDS.filter((field) => (v[field.key] as number) > 0).map((field) => ({
              label: `${field.label} (owed)`,
              value: -(v[field.key] as number),
              color: field.color,
            })),
          ]}
        />
      }
      footnote="Net worth is a snapshot, not a score. Track the direction quarter over quarter — a rising number with a healthy cash buffer matters more than the absolute figure."
    />
  );
}
