import React, { useMemo } from 'react';
import PanelShell from './PanelShell';
import { useReportSummary } from '../summary';
import NumberField from '../NumberField';
import Stat from '../Stat';
import AreaChart from '../charts/AreaChart';
import { usePersistentState } from '../usePersistentState';
import { calcKey } from '../storage';
import { collegeCosts, futureValueSeries, requiredMonthly } from '../finance';
import { currency, compactCurrency } from '../format';

type Inputs = {
  annualCost: number;
  current: number;
  monthly: number;
  yearsUntil: number;
  yearsInSchool: number;
  inflation: number;
  returnPct: number;
};

const DEFAULTS: Inputs = {
  annualCost: 28000,
  current: 15000,
  monthly: 400,
  yearsUntil: 12,
  yearsInSchool: 4,
  inflation: 4,
  returnPct: 6,
};

export default function CollegePanel() {
  const [v, setV] = usePersistentState<Inputs>(calcKey('college'), DEFAULTS);
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const model = useMemo(() => {
    const costs = collegeCosts({
      annualCost: v.annualCost,
      yearsUntil: v.yearsUntil,
      yearsInSchool: v.yearsInSchool,
      inflation: v.inflation,
    });
    const needed = requiredMonthly({
      initial: v.current,
      annualRatePct: v.returnPct,
      years: v.yearsUntil,
      target: costs.total,
    });
    const projection = futureValueSeries({
      initial: v.current,
      monthly: v.monthly,
      annualRatePct: v.returnPct,
      years: Math.max(1, v.yearsUntil),
    });
    return { ...costs, needed, projection, gap: costs.total - projection.value };
  }, [v]);

  useReportSummary(
    model.gap <= 0
      ? 'On pace for the inflated college cost'
      : `${currency(model.needed)} per month to cover college`
  );

  return (
    <PanelShell
      inputs={
        <>
          <NumberField
            label="Annual cost today"
            value={v.annualCost}
            prefix="$"
            min={0}
            step={1000}
            onChange={(annualCost) => set('annualCost', annualCost)}
            hint="Tuition, housing, and fees in today's dollars."
          />
          <div className="field-row">
            <NumberField
              label="Saved so far"
              value={v.current}
              prefix="$"
              min={0}
              step={500}
              onChange={(current) => set('current', current)}
            />
            <NumberField
              label="Monthly savings"
              value={v.monthly}
              prefix="$"
              min={0}
              step={25}
              onChange={(monthly) => set('monthly', monthly)}
            />
          </div>
          <div className="field-row">
            <NumberField
              label="Years until college"
              value={v.yearsUntil}
              min={0}
              max={25}
              onChange={(yearsUntil) => set('yearsUntil', yearsUntil)}
            />
            <NumberField
              label="Years in school"
              value={v.yearsInSchool}
              min={1}
              max={8}
              onChange={(yearsInSchool) => set('yearsInSchool', yearsInSchool)}
            />
          </div>
          <div className="field-row">
            <NumberField
              label="College inflation"
              value={v.inflation}
              suffix="%"
              min={0}
              max={10}
              step={0.1}
              onChange={(inflation) => set('inflation', inflation)}
            />
            <NumberField
              label="Savings return"
              value={v.returnPct}
              suffix="%"
              min={0}
              max={12}
              step={0.1}
              onChange={(returnPct) => set('returnPct', returnPct)}
            />
          </div>
        </>
      }
      results={
        <div className="stat-grid">
          <Stat
            label="Monthly amount that covers it"
            value={`${currency(model.needed)}/mo`}
            sub={
              model.needed <= v.monthly
                ? 'Your current savings rate covers the goal'
                : `${currency(Math.max(0, model.needed - v.monthly))} more than you save now`
            }
            tone={model.gap <= 0 ? 'accent' : 'warn'}
            emphasis
            icon="target"
          />
          <Stat
            label="Total future cost"
            value={compactCurrency(model.total)}
            sub={`First year about ${currency(model.firstYear)}`}
          />
          <Stat
            label="Projected savings"
            value={compactCurrency(model.projection.value)}
            tone="sky"
            sub={model.gap > 0 ? `${currency(model.gap)} short` : 'Covers the inflated bill'}
          />
          <Stat
            label="Today's sticker, inflated"
            value={`${v.yearsInSchool} years`}
            sub={`Costs rise ${v.inflation}% a year until and during school`}
          />
        </div>
      }
      chart={
        <AreaChart
          ariaLabel="College savings against the future cost"
          labels={model.projection.series.map((point) => point.year)}
          series={[
            {
              label: 'Savings',
              color: '#7c5cf0',
              values: model.projection.series.map((point) => point.value),
            },
            {
              label: 'Future cost',
              color: '#d98324',
              fill: false,
              dashed: true,
              values: model.projection.series.map(() => model.total),
            },
          ]}
          height={220}
          formatX={(value) => `${value.toFixed(0)}y`}
          formatY={(value) => compactCurrency(value)}
        />
      }
      footnote="The target is the sum of each school year, inflated from today's cost. Savings compound monthly until the first year. The balance is assumed to be available at the start of school, so it does not keep earning while tuition is paid."
    />
  );
}
