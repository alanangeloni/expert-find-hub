
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
  income: number;
  needs: number;
  wants: number;
  savings: number;
};

const DEFAULTS: Inputs = { income: 6800, needs: 3200, wants: 1450, savings: 1200 };

type Bucket = {
  key: keyof Inputs;
  label: string;
  targetPct: number;
  color: string;
  hint: string;
};

const BUCKETS: Bucket[] = [
  {
    key: 'needs',
    label: 'Needs',
    targetPct: 50,
    color: '#38bdf8',
    hint: 'Rent, utilities, groceries, insurance, minimum debt payments',
  },
  {
    key: 'wants',
    label: 'Wants',
    targetPct: 30,
    color: '#a78bfa',
    hint: 'Dining, travel, subscriptions, hobbies',
  },
  {
    key: 'savings',
    label: 'Savings & debt paydown',
    targetPct: 20,
    color: '#34d399',
    hint: 'Emergency fund, investing, extra principal',
  },
];

export default function BudgetPanel() {
  const [v, setV] = usePersistentState<Inputs>(calcKey('budget'), DEFAULTS);
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const model = useMemo(() => {
    const allocated = v.needs + v.wants + v.savings;
    const leftover = v.income - allocated;
    const rows = BUCKETS.map((bucket) => {
      const amount = v[bucket.key] as number;
      const pct = v.income > 0 ? (amount / v.income) * 100 : 0;
      const target = (v.income * bucket.targetPct) / 100;
      return { ...bucket, amount, pct, target, delta: amount - target };
    });
    return {
      allocated,
      leftover,
      rows,
      savingsRate: v.income > 0 ? (v.savings / v.income) * 100 : 0,
      needsPct: v.income > 0 ? (v.needs / v.income) * 100 : 0,
      overspent: allocated > v.income,
    };
  }, [v]);

  const deficit = model.rows.filter((row) => row.delta < -1);
  const surplus = model.rows.filter((row) => row.delta > 1);

  useReportSummary(`${currency(model.leftover)} unallocated`);

  return (
    <PanelShell
      inputsTitle="Monthly take-home"
      inputs={
        <>
          <NumberField
            label="Monthly take-home pay"
            value={v.income}
            prefix="$"
            suffix="/mo"
            min={0}
            step={100}
            onChange={(income) => set('income', income)}
            hint="After tax and retirement contributions"
          />
          {BUCKETS.map((bucket) => (
            <NumberField
              key={bucket.key}
              label={bucket.label}
              value={v[bucket.key] as number}
              prefix="$"
              suffix="/mo"
              min={0}
              step={50}
              hint={bucket.hint}
              onChange={(value) => set(bucket.key, value)}
            />
          ))}
        </>
      }
      results={
        <>
          <div className="stat-grid">
            <Stat
              label="Unallocated"
              value={currency(model.leftover)}
              sub={
                model.leftover >= 0
                  ? 'Sitting outside your plan'
                  : 'You have overspent your income'
              }
              tone={model.leftover >= 0 ? 'accent' : 'bad'}
              emphasis
              icon="pie"
            />
            <Stat
              label="Savings rate"
              value={percent(model.savingsRate, 0)}
              sub={model.savingsRate >= 20 ? 'Above the 20% benchmark' : '20% is the classic target'}
              tone={model.savingsRate >= 20 ? 'accent' : 'warn'}
            />
            <Stat
              label="Needs share"
              value={percent(model.needsPct, 0)}
              sub={model.needsPct <= 50 ? 'Within the 50% guideline' : 'Above the 50% guideline'}
              tone={model.needsPct <= 50 ? 'sky' : 'warn'}
            />
            <Stat
              label="Allocated"
              value={currency(model.allocated)}
              sub={`of ${currency(v.income)} income`}
            />
          </div>

          <div className="bp__meters">
            {model.rows.map((row) => (
              <div key={row.key} className="meter">
                <div className="meter__head">
                  <span>
                    {row.label} · {currency(row.amount)}
                  </span>
                  <strong>
                    {percent(row.pct, 0)}
                    <em className={row.delta >= 0 ? 'tone-good' : 'tone-bad'}>
                      {row.delta >= 0 ? ' ▲' : ' ▼'} {currency(Math.abs(row.delta))}
                    </em>
                  </strong>
                </div>
                <div className="meter__track">
                  <div
                    className="meter__fill"
                    style={{
                      width: `${Math.min(100, row.pct)}%`,
                      background: `linear-gradient(90deg, ${row.color}, ${row.color}88)`,
                    }}
                  />
                  <span className="meter__target" style={{ left: `${row.targetPct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className={`bp__verdict ${model.overspent ? 'bp__verdict--bad' : ''}`}>
            {model.overspent ? (
              <p>
                You are spending <strong>{currency(Math.abs(model.leftover))}</strong> more than you
                earn each month. Start by trimming the largest “wants” line, then revisit the plan.
              </p>
            ) : deficit.length ? (
              <p>
                {deficit.map((row) => row.label).join(' and ')} {deficit.length > 1 ? 'are' : 'is'}{' '}
                below the 50/30/20 guideline by{' '}
                <strong>{currency(deficit.reduce((sum, row) => sum + Math.abs(row.delta), 0))}</strong>.
                Reallocating {currency(model.leftover)} of unallocated cash gets you close.
              </p>
            ) : (
              <p>
                Nicely balanced — every bucket sits at or above its 50/30/20 target. Consider pushing{' '}
                {currency(model.leftover)} of unallocated cash into savings or debt paydown.
              </p>
            )}
            {surplus.length && !model.overspent ? (
              <span className="bp__verdict-tag">
                {surplus.map((row) => row.label).join(' · ')} ahead of target
              </span>
            ) : null}
          </div>
        </>
      }
      chart={
        <Donut
          centerLabel="Allocated"
          centerValue={`${percent(v.income > 0 ? (model.allocated / v.income) * 100 : 0, 0)}`}
          formatValue={(value) => currency(value)}
          segments={[
            ...model.rows.map((row) => ({ label: row.label, value: row.amount, color: row.color })),
            {
              label: 'Unallocated',
              value: Math.max(0, model.leftover),
              color: '#7b8aa5',
            },
          ]}
        />
      }
      footnote="The 50/30/20 rule is a starting heuristic, not a law. In high-cost cities a 60/25/15 split is often more realistic — the meters show your gap to any target you choose."
    />
  );
}
