
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
import { futureValueSeries, requiredMonthly } from '../finance';
import { currency, compactCurrency, percent } from '../format';

type Inputs = {
  age: number;
  retireAge: number;
  current: number;
  monthly: number;
  rate: number;
  target: number;
  desiredIncome: number;
};

const DEFAULTS: Inputs = {
  age: 34,
  retireAge: 65,
  current: 88000,
  monthly: 1200,
  rate: 6.5,
  target: 1500000,
  desiredIncome: 70000,
};

export default function RetirementPanel() {
  const [v, setV] = usePersistentState<Inputs>(calcKey('retirement'), DEFAULTS);
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const model = useMemo(() => {
    const years = Math.max(1, Math.round(v.retireAge - v.age));
    const projection = futureValueSeries({
      initial: v.current,
      monthly: v.monthly,
      annualRatePct: v.rate,
      years,
    });
    const needed = requiredMonthly({
      initial: v.current,
      annualRatePct: v.rate,
      years,
      target: v.target,
    });
    const projected = projection.series[projection.series.length - 1].value;
    const gap = v.target - projected;
    const coverage = v.desiredIncome > 0 ? v.target / v.desiredIncome : 0;

    return {
      years,
      projection,
      needed,
      projected,
      gap,
      coverage,
      monthlyShortfall: Math.max(0, needed - v.monthly),
      onTrack: projected >= v.target,
      safeWithdrawal: (projected * 0.04) / 12,
    };
  }, [v]);

  const series = [
    {
      label: 'Projected nest egg',
      color: '#0f9b8e',
      values: sampleSeries(model.projection.series.map((point) => point.value)),
    },
    {
      label: 'Target',
      color: '#d98324',
      fill: false,
      dashed: true,
      values: model.projection.series.map(() => v.target),
    },
  ];

  useReportSummary(`${currency(model.projected)} at retirement`);

  return (
    <PanelShell
      inputs={
        <>
          <div className="field-row">
            <NumberField
              label="Current age"
              value={v.age}
              min={16}
              max={80}
              suffix="yrs"
              onChange={(age) => set('age', age)}
            />
            <NumberField
              label="Retire at"
              value={v.retireAge}
              min={v.age + 1}
              max={90}
              suffix="yrs"
              onChange={(retireAge) => set('retireAge', retireAge)}
            />
          </div>
          <NumberField
            label="Current retirement savings"
            value={v.current}
            prefix="$"
            min={0}
            step={5000}
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
            hint={`${currency(v.monthly * 12)} per year`}
          />
          <RangeField
            label="Expected annual return"
            value={v.rate}
            min={1}
            max={11}
            step={0.1}
            display={percent(v.rate, 1)}
            minLabel="1%"
            maxLabel="11%"
            onChange={(rate) => set('rate', rate)}
          />
          <NumberField
            label="Target nest egg"
            value={v.target}
            prefix="$"
            min={0}
            step={25000}
            onChange={(target) => set('target', target)}
            hint={`Roughly 25× a ${currency(v.desiredIncome)} annual income`}
          />
          <NumberField
            label="Desired retirement income"
            value={v.desiredIncome}
            prefix="$"
            suffix="/yr"
            min={0}
            step={5000}
            onChange={(desiredIncome) => set('desiredIncome', desiredIncome)}
          />
        </>
      }
      results={
        <>
          <div className="stat-grid">
            <Stat
              label={`Projected at ${v.retireAge}`}
              value={currency(model.projected)}
              sub={`${model.years} years of compounding`}
              tone={model.onTrack ? 'accent' : 'bad'}
              emphasis
              icon="clock"
            />
            <Stat
              label={model.onTrack ? 'Surplus vs target' : 'Shortfall vs target'}
              value={currency(Math.abs(model.gap))}
              sub={model.onTrack ? 'You are ahead of plan' : 'Increase contributions or push the date'}
              tone={model.onTrack ? 'accent' : 'warn'}
            />
            <Stat
              label="Needed monthly"
              value={currency(model.needed)}
              sub={
                model.monthlyShortfall > 0
                  ? `Add ${currency(model.monthlyShortfall)}/mo to hit target`
                  : 'You are already contributing enough'
              }
              tone={model.monthlyShortfall > 0 ? 'warn' : 'sky'}
            />
            <Stat
              label="Years of income covered"
              value={`${model.coverage.toFixed(1)}×`}
              sub={`4% rule gives ${currency(model.safeWithdrawal)}/mo`}
              tone="sky"
            />
          </div>

          <div className="rp__note">
            <strong>{currency(model.safeWithdrawal)}</strong>
            <span>
              is what a {currency(model.projected)} portfolio could safely pay you each month under the
              4% rule — {model.safeWithdrawal >= v.desiredIncome / 12 ? 'above' : 'below'} your{' '}
              {currency(v.desiredIncome / 12)} target.
            </span>
          </div>
        </>
      }
      chart={
        <AreaChart
          ariaLabel="Retirement nest egg projection against target"
          labels={sampleSeries(model.projection.series.map((point) => point.year))}
          series={series}
          height={228}
          formatX={(value) => `${Math.round(value)}y`}
          formatY={(value) => compactCurrency(value)}
        />
      }
      footnote="This ignores Social Security, pensions and taxes on withdrawals. Treat it as the gap your own savings has to close."
    />
  );
}
