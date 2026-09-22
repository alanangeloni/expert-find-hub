
import React, { useMemo } from 'react';
import PanelShell from './PanelShell';
import { useReportSummary } from '../summary';
import NumberField from '../NumberField';
import RangeField from '../RangeField';
import Stat from '../Stat';
import AreaChart from '../charts/AreaChart';
import { sampleSeries } from '../charts/sampleSeries';
import { usePersistentState } from '../usePersistentState';
import { calcKey } from '../storage';
import { monthsToGoal, requiredMonthly, futureValueSeries } from '../finance';
import {
  currency,
  compactCurrency,
  percent,
  durationFromMonths,
  addMonths,
  formatDate,
} from '../format';

type Inputs = {
  current: number;
  monthly: number;
  rate: number;
  target: number;
};

const DEFAULTS: Inputs = { current: 12000, monthly: 600, rate: 4.2, target: 50000 };

export default function SavingsPanel() {
  const [v, setV] = usePersistentState<Inputs>(calcKey('savings'), DEFAULTS);
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const model = useMemo(() => {
    const goal = monthsToGoal({
      current: v.current,
      monthly: v.monthly,
      annualRatePct: v.rate,
      target: v.target,
    });
    const faster = requiredMonthly({
      initial: v.current,
      annualRatePct: v.rate,
      years: 3,
      target: v.target,
    });
    const projection = futureValueSeries({
      initial: v.current,
      monthly: v.monthly,
      annualRatePct: v.rate,
      years: Math.min(30, Math.max(1, Math.ceil(goal.months / 12) + 2)),
    });
    const valueAtGoal = goal.reached ? v.current + v.monthly * goal.months : 0;

    return {
      ...goal,
      faster,
      projection,
      valueAtGoal,
      contributions: v.monthly * goal.months,
      interest: valueAtGoal - v.current - v.monthly * goal.months,
      eta: addMonths(new Date(), goal.months),
    };
  }, [v]);

  const series = [
    {
      label: 'Projected balance',
      color: '#d98324',
      values: model.projection.series.map((point) => point.value),
    },
    {
      label: 'Target',
      color: '#17b26a',
      fill: false,
      dashed: true,
      values: model.projection.series.map(() => v.target),
    },
  ];

  useReportSummary(model.reached ? `Goal in ${durationFromMonths(model.months)}` : "Goal is beyond 100 years");

  return (
    <PanelShell
      inputs={
        <>
          <NumberField
            label="Current savings"
            value={v.current}
            prefix="$"
            min={0}
            step={500}
            onChange={(current) => set('current', current)}
          />
          <NumberField
            label="Monthly contribution"
            value={v.monthly}
            prefix="$"
            suffix="/mo"
            min={0}
            step={50}
            onChange={(monthly) => set('monthly', monthly)}
          />
          <NumberField
            label="Savings target"
            value={v.target}
            prefix="$"
            min={0}
            step={1000}
            onChange={(target) => set('target', target)}
          />
          <RangeField
            label="Annual return"
            value={v.rate}
            min={0}
            max={12}
            step={0.1}
            display={percent(v.rate, 1)}
            minLabel="0%"
            maxLabel="12%"
            onChange={(rate) => set('rate', rate)}
          />
        </>
      }
      results={
        <>
          <div className="stat-grid">
            <Stat
              label="Time to goal"
              value={model.reached ? durationFromMonths(model.months) : '100+ yrs'}
              sub={model.reached ? `Around ${formatDate(model.eta)}` : 'Increase the monthly amount'}
              tone={model.reached ? 'accent' : 'bad'}
              emphasis
              icon="target"
            />
            <Stat
              label="Still needed"
              value={currency(Math.max(0, v.target - v.current))}
              sub={`${percent(
                v.target > 0 ? Math.min(100, (v.current / v.target) * 100) : 0,
                0
              )} of the way there`}
            />
            <Stat
              label="Your contributions"
              value={currency(Math.max(0, model.contributions))}
              tone="sky"
              sub={`${currency(Math.max(0, model.interest))} from growth`}
            />
            <Stat
              label="To finish in 3 years"
              value={`${currency(model.faster)}/mo`}
              tone="warn"
              sub={
                model.faster <= v.monthly
                  ? 'You are already ahead of that pace'
                  : `${currency(model.faster - v.monthly)} more per month`
              }
            />
          </div>

          <div className="sp__meter meter">
            <div className="meter__head">
              <span>Progress toward {currency(v.target)}</span>
              <strong>
                {percent(v.target > 0 ? Math.min(100, (v.current / v.target) * 100) : 0, 1)}
              </strong>
            </div>
            <div className="meter__track">
              <div
                className="meter__fill"
                style={{
                  width: `${Math.min(100, v.target > 0 ? (v.current / v.target) * 100 : 0)}%`,
                  background: 'linear-gradient(90deg, #4ad79b, #17b26a)',
                }}
              />
            </div>
          </div>
        </>
      }
      chart={
        <AreaChart
          ariaLabel="Savings balance against your target"
          labels={sampleSeries(model.projection.series.map((point) => point.year))}
          series={series.map((entry) => ({ ...entry, values: sampleSeries(entry.values) }))}
          height={220}
          formatX={(value) => `${value.toFixed(0)}y`}
          formatY={(value) => compactCurrency(value)}
        />
      }
      footnote="Returns compound monthly and are illustrative — markets do not deliver a steady rate. High-yield savings accounts currently sit well below long-run equity averages."
    />
  );
}
