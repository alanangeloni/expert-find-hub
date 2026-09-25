import React, { useMemo } from 'react';
import PanelShell from './PanelShell';
import { useReportSummary } from '../summary';
import NumberField from '../NumberField';
import Stat from '../Stat';
import Segmented from '../Segmented';
import AreaChart from '../charts/AreaChart';
import { usePersistentState } from '../usePersistentState';
import { calcKey } from '../storage';
import { inflate } from '../finance';
import { currency, compactCurrency, percent } from '../format';

type Inputs = {
  amount: number;
  rate: number;
  years: number;
  mode: 'cost' | 'power';
};

const DEFAULTS: Inputs = { amount: 100000, rate: 3, years: 20, mode: 'cost' };

export default function InflationPanel() {
  const [v, setV] = usePersistentState<Inputs>(calcKey('inflation'), DEFAULTS);
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const model = useMemo(() => {
    const end = inflate(v.amount, v.rate, v.years);
    const series = Array.from({ length: Math.max(1, Math.round(v.years)) + 1 }, (_, year) =>
      inflate(v.amount, v.rate, year)
    );
    return { ...end, series };
  }, [v]);

  const future = v.mode === 'cost';

  useReportSummary(
    future
      ? `${currency(v.amount)} costs ${currency(model.futureCost)} in ${v.years} years`
      : `${currency(v.amount)} buys ${currency(model.purchasingPower)} of today's goods later`
  );

  return (
    <PanelShell
      inputs={
        <>
          <Segmented
            label="Question"
            value={v.mode}
            onChange={(mode) => set('mode', mode)}
            options={[
              { value: 'cost', label: 'Future cost' },
              { value: 'power', label: 'Buying power' },
            ]}
          />
          <NumberField
            label={future ? "Cost in today's dollars" : 'Amount you hold today'}
            value={v.amount}
            prefix="$"
            min={0}
            step={1000}
            onChange={(amount) => set('amount', amount)}
          />
          <NumberField
            label="Inflation rate"
            value={v.rate}
            suffix="%"
            min={0}
            max={12}
            step={0.1}
            onChange={(rate) => set('rate', rate)}
          />
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
            label={future ? 'Future cost' : 'Buying power later'}
            value={currency(future ? model.futureCost : model.purchasingPower)}
            sub={
              future
                ? `${currency(v.amount)} in today's dollars`
                : `What ${currency(v.amount)} will purchase`
            }
            tone="accent"
            emphasis
            icon="percent"
          />
          <Stat
            label="Price level"
            value={`${model.factor.toFixed(2)}x`}
            sub={`At ${percent(v.rate, 1)} for ${v.years} years`}
          />
          <Stat
            label={future ? 'Extra dollars needed' : 'Purchasing power lost'}
            value={currency(future ? model.futureCost - v.amount : v.amount - model.purchasingPower)}
            tone="warn"
          />
          <Stat
            label="Rule of thumb"
            value={v.rate > 0 ? `${Math.round(72 / v.rate)} years` : 'Flat'}
            sub="Approximate years for prices to double"
          />
        </div>
      }
      chart={
        <AreaChart
          ariaLabel={future ? 'Rising future cost' : 'Falling buying power'}
          labels={model.series.map((_, year) => year)}
          series={[
            {
              label: future ? 'Future cost' : 'Buying power',
              color: future ? '#d98324' : '#2f6fed',
              values: model.series.map((point) => (future ? point.futureCost : point.purchasingPower)),
            },
          ]}
          height={220}
          formatX={(value) => `${value.toFixed(0)}y`}
          formatY={(value) => compactCurrency(value)}
        />
      }
      footnote="Inflation compounds once a year. The rule of 72 is a shortcut, not the figure the chart uses. A long-run average near 3% is a planning assumption, not a forecast."
    />
  );
}
