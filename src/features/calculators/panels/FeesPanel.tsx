import React, { useMemo } from 'react';
import PanelShell from './PanelShell';
import { useReportSummary } from '../summary';
import NumberField from '../NumberField';
import Stat from '../Stat';
import AreaChart from '../charts/AreaChart';
import { sampleSeries } from '../charts/sampleSeries';
import { usePersistentState } from '../usePersistentState';
import { calcKey } from '../storage';
import { feeDrag } from '../finance';
import { currency, compactCurrency, percent } from '../format';

type Inputs = {
  initial: number;
  monthly: number;
  grossReturn: number;
  lowFee: number;
  highFee: number;
  years: number;
};

const DEFAULTS: Inputs = {
  initial: 100000,
  monthly: 500,
  grossReturn: 7,
  lowFee: 0.08,
  highFee: 1,
  years: 30,
};

export default function FeesPanel() {
  const [v, setV] = usePersistentState<Inputs>(calcKey('fees'), DEFAULTS);
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const model = useMemo(() => feeDrag(v), [v]);
  const share = model.low.value > 0 ? (model.gap / model.low.value) * 100 : 0;

  useReportSummary(`${currency(model.gap)} more at the lower fee`);

  return (
    <PanelShell
      inputs={
        <>
          <NumberField
            label="Starting balance"
            value={v.initial}
            prefix="$"
            min={0}
            step={5000}
            onChange={(initial) => set('initial', initial)}
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
            label="Return before fees"
            value={v.grossReturn}
            suffix="%"
            min={0}
            max={12}
            step={0.1}
            onChange={(grossReturn) => set('grossReturn', grossReturn)}
          />
          <div className="field-row">
            <NumberField
              label="Lower annual fee"
              value={v.lowFee}
              suffix="%"
              min={0}
              max={3}
              step={0.01}
              onChange={(lowFee) => set('lowFee', lowFee)}
            />
            <NumberField
              label="Higher annual fee"
              value={v.highFee}
              suffix="%"
              min={0}
              max={3}
              step={0.05}
              onChange={(highFee) => set('highFee', highFee)}
            />
          </div>
          <NumberField
            label="Years"
            value={v.years}
            min={1}
            max={50}
            onChange={(years) => set('years', years)}
          />
        </>
      }
      results={
        <div className="stat-grid">
          <Stat
            label="Kept by the lower fee"
            value={compactCurrency(Math.max(0, model.gap))}
            sub={model.gap >= 0 ? `${percent(share, 1)} of the lower-fee balance` : 'The higher fee is lower than the first'}
            tone="accent"
            emphasis
            icon="percent"
          />
          <Stat
            label={`${percent(v.lowFee, 2)} fee`}
            value={compactCurrency(model.low.value)}
            tone="sky"
            sub={`Net return ${percent(v.grossReturn - v.lowFee, 2)}`}
          />
          <Stat
            label={`${percent(v.highFee, 2)} fee`}
            value={compactCurrency(model.high.value)}
            sub={`Net return ${percent(v.grossReturn - v.highFee, 2)}`}
          />
          <Stat
            label="Fee gap per year"
            value={percent(Math.abs(v.highFee - v.lowFee), 2)}
            tone="warn"
            sub="Small annual gaps compound for decades"
          />
        </div>
      }
      chart={
        <AreaChart
          ariaLabel="Balance at a lower fee versus a higher fee"
          labels={sampleSeries(model.low.series.map((point) => point.year))}
          series={[
            {
              label: `${percent(v.lowFee, 2)} fee`,
              color: '#17b26a',
              values: sampleSeries(model.low.series.map((point) => point.value)),
            },
            {
              label: `${percent(v.highFee, 2)} fee`,
              color: '#dc5468',
              values: sampleSeries(model.high.series.map((point) => point.value)),
            },
          ]}
          height={220}
          formatX={(value) => `${value.toFixed(0)}y`}
          formatY={(value) => compactCurrency(value)}
        />
      }
      footnote="Each fee is subtracted from the annual return, then the balance compounds monthly. A 1% advisory fee is not automatically a bad trade if the advice changes your savings rate, taxes, or behavior. Use the gap as a question to ask, not as a verdict."
    />
  );
}
