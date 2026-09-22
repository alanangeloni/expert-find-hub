
import React, { useMemo } from 'react';
import PanelShell from './PanelShell';
import { useReportSummary } from '../summary';
import NumberField from '../NumberField';
import RangeField from '../RangeField';
import Stat from '../Stat';
import Icon from '../Icon';
import AreaChart from '../charts/AreaChart';
import { sampleSeries } from '../charts/sampleSeries';
import { usePersistentState } from '../usePersistentState';
import { calcKey } from '../storage';
import { futureValueSeries } from '../finance';
import { currency, compactCurrency, percent } from '../format';

type Inputs = {
  initial: number;
  monthly: number;
  rate: number;
  years: number;
  increase: number;
};

const DEFAULTS: Inputs = { initial: 25000, monthly: 900, rate: 7, years: 25, increase: 0 };

export default function InvestPanel() {
  const [v, setV] = usePersistentState<Inputs>(calcKey('invest'), DEFAULTS);
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const model = useMemo(() => {
    void futureValueSeries;

    // Annual contribution escalator applied year over year.
    let balance = v.initial;
    let contributed = v.initial;
    const escalated: number[] = [balance];
    const escalatedContributed: number[] = [contributed];
    const monthlyRate = v.rate / 100 / 12;

    for (let year = 1; year <= Math.round(v.years); year += 1) {
      const contribution = v.monthly * Math.pow(1 + v.increase / 100, year - 1);
      for (let month = 0; month < 12; month += 1) {
        balance = balance * (1 + monthlyRate) + contribution;
        contributed += contribution;
      }
      escalated.push(balance);
      escalatedContributed.push(contributed);
    }

    const finalValue = escalated[escalated.length - 1];
    const finalContributed = escalatedContributed[escalatedContributed.length - 1];
    const realValue = finalValue / Math.pow(1.025, v.years);
    const plainContributions = v.initial + v.monthly * 12 * v.years;

    return {
      escalated,
      escalatedContributed,
      realValue,
      contributed: finalContributed,
      growth: finalValue - finalContributed,
      multiple: plainContributions > 0 ? finalValue / plainContributions : 0,
      finalValue,
    };
  }, [v]);

  const series = [
    { label: 'Portfolio value', color: '#17b26a', values: sampleSeries(model.escalated) },
    {
      label: 'Money you put in',
      color: '#2f6fed',
      values: sampleSeries(model.escalatedContributed),
    },
  ];

  useReportSummary(`${currency(model.finalValue)} projected`);

  return (
    <PanelShell
      inputs={
        <>
          <NumberField
            label="Starting balance"
            value={v.initial}
            prefix="$"
            min={0}
            step={1000}
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
          <RangeField
            label="Expected annual return"
            value={v.rate}
            min={0}
            max={12}
            step={0.1}
            display={percent(v.rate, 1)}
            minLabel="0%"
            maxLabel="12%"
            onChange={(rate) => set('rate', rate)}
          />
          <RangeField
            label="Years invested"
            value={v.years}
            min={1}
            max={50}
            step={1}
            display={`${v.years} years`}
            minLabel="1 yr"
            maxLabel="50 yrs"
            onChange={(years) => set('years', years)}
          />
          <NumberField
            label="Annual raise to contributions"
            value={v.increase}
            suffix="%/yr"
            min={0}
            max={15}
            onChange={(increase) => set('increase', increase)}
            hint="Increases your monthly amount each year"
          />
        </>
      }
      results={
        <>
          <div className="stat-grid">
            <Stat
              label={`Value in ${v.years} years`}
              value={currency(model.finalValue)}
              sub={`${currency(model.realValue)} in today’s money`}
              tone="accent"
              emphasis
              icon="trending"
            />
            <Stat
              label="Total contributed"
              value={currency(model.contributed)}
              sub={`${currency(v.initial)} initial + contributions`}
              tone="sky"
            />
            <Stat
              label="Growth earned"
              value={currency(model.growth)}
              sub={`${percent(
                model.contributed > 0 ? (model.growth / model.contributed) * 100 : 0,
                0
              )} on top of what you paid in`}
              tone="warn"
            />
            <Stat
              label="Money multiple"
              value={`${model.multiple.toFixed(2)}×`}
              sub="Every dollar contributed becomes this much"
            />
          </div>

          <div className="ip__callout">
            <Icon name="sparkle" size={16} />
            <p>
              Starting {Math.max(0, v.years - 10)} years earlier, or adding{' '}
              <strong>{currency(250)}</strong> a month, would meaningfully change this number — time in
              the market typically does more than timing it.
            </p>
          </div>
        </>
      }
      chart={
        <AreaChart
          ariaLabel="Portfolio value versus contributions"
          labels={Array.from({ length: model.escalated.length }, (_, index) => index)}
          series={series}
          height={228}
          formatX={(value) => `${Math.round(value)}y`}
          formatY={(value) => compactCurrency(value)}
        />
      }
      footnote="Returns are assumed to compound monthly at a constant rate. Real portfolios fluctuate; sequence of returns matters most in the final decade before you draw on the money."
    />
  );
}
