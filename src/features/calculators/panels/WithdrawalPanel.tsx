
import React, { useMemo } from 'react';
import PanelShell from './PanelShell';
import { useReportSummary } from '../summary';
import NumberField from '../NumberField';
import RangeField from '../RangeField';
import Stat from '../Stat';
import AreaChart from '../charts/AreaChart';
import { usePersistentState } from '../usePersistentState';
import { calcKey } from '../storage';
import { currency, compactCurrency, percent } from '../format';

type Inputs = {
  portfolio: number;
  rate: number;
  inflation: number;
  years: number;
  spend: number;
};

const DEFAULTS: Inputs = {
  portfolio: 1200000,
  rate: 6,
  inflation: 2.5,
  years: 30,
  spend: 48000,
};

export default function WithdrawalPanel() {
  const [v, setV] = usePersistentState<Inputs>(calcKey('withdrawal'), DEFAULTS);
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const model = useMemo(() => {
    let balance = v.portfolio;
    let spend = v.spend;
    let depletedYear: number | null = null;
    const balances: number[] = [balance];
    const realBalances: number[] = [balance];
    const withdrawals: number[] = [spend];

    for (let year = 1; year <= v.years; year += 1) {
      const growth = balance * (v.rate / 100);
      balance = balance + growth - spend;
      if (balance <= 0) {
        balance = 0;
        if (depletedYear === null) depletedYear = year;
      }
      spend = spend * (1 + v.inflation / 100);
      balances.push(balance);
      withdrawals.push(spend);
      realBalances.push(balance / Math.pow(1 + v.inflation / 100, year));
    }

    const totalWithdrawn = withdrawals.slice(0, -1).reduce((sum, value) => sum + value, 0);
    const endReal = realBalances[realBalances.length - 1];
    const rate = v.portfolio > 0 ? (v.spend / v.portfolio) * 100 : 0;

    return {
      balances,
      realBalances,
      withdrawals,
      depletedYear,
      totalWithdrawn,
      endReal,
      rate,
      lasts: depletedYear === null,
    };
  }, [v]);

  useReportSummary(model.lasts ? `Portfolio lasts ${v.years}+ years` : `Portfolio runs out in ${model.depletedYear} years`);

  return (
    <PanelShell
      inputs={
        <>
          <NumberField
            label="Portfolio at retirement"
            value={v.portfolio}
            prefix="$"
            min={0}
            step={25000}
            onChange={(portfolio) => set('portfolio', portfolio)}
          />
          <NumberField
            label="First-year withdrawal"
            value={v.spend}
            prefix="$"
            suffix="/yr"
            min={0}
            step={1000}
            onChange={(spend) => set('spend', spend)}
            hint={`${percent(model.rate, 1)} of the portfolio`}
          />
          <div className="field-row">
            <NumberField
              label="Annual return"
              value={v.rate}
              suffix="%"
              min={0}
              max={12}
              onChange={(rate) => set('rate', rate)}
            />
            <NumberField
              label="Inflation"
              value={v.inflation}
              suffix="%"
              min={0}
              max={8}
              onChange={(inflation) => set('inflation', inflation)}
            />
          </div>
          <RangeField
            label="Years in retirement"
            value={v.years}
            min={5}
            max={45}
            step={1}
            display={`${v.years} years`}
            minLabel="5"
            maxLabel="45"
            onChange={(years) => set('years', years)}
          />
        </>
      }
      results={
        <>
          <div className="stat-grid">
            <Stat
              label={model.lasts ? 'Portfolio lasts' : 'Runs out in'}
              value={model.lasts ? `${v.years}+ yrs` : `${model.depletedYear} yrs`}
              sub={
                model.lasts
                  ? `${currency(model.endReal)} left in today’s money`
                  : 'Reduce spending or add guaranteed income'
              }
              tone={model.lasts ? 'accent' : 'bad'}
              emphasis
              icon="wallet"
            />
            <Stat
              label="Withdrawal rate"
              value={percent(model.rate, 1)}
              sub={model.rate <= 4 ? 'At or below the 4% rule' : 'Above the classic 4% rule'}
              tone={model.rate <= 4 ? 'accent' : 'warn'}
            />
            <Stat
              label="Total withdrawn"
              value={currency(model.totalWithdrawn)}
              sub="Over the full horizon, inflation-adjusted"
              tone="sky"
            />
            <Stat
              label="Ending balance"
              value={currency(model.balances[model.balances.length - 1])}
              sub={`${currency(model.endReal)} in today’s dollars`}
            />
          </div>

          <div className="wp__chart-legend">
            {[
              ['#2f6fed', 'Nominal balance'],
              ['#7c5cf0', 'Inflation-adjusted balance'],
            ].map(([color, label]) => (
              <span key={label}>
                <i style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </>
      }
      chart={
        <AreaChart
          ariaLabel="Portfolio balance through retirement"
          labels={Array.from({ length: model.balances.length }, (_, index) => index)}
          series={[
            { label: 'Nominal balance', color: '#2f6fed', values: model.balances },
            { label: 'Real (today’s $)', color: '#7c5cf0', fill: false, values: model.realBalances },
          ]}
          height={228}
          formatX={(value) => `yr ${Math.round(value)}`}
          formatY={(value) => compactCurrency(value)}
          legend={false}
        />
      }
      footnote="This is a deterministic model — real markets deliver returns in a random order, which is why a bad first decade is far more dangerous than a bad later one."
    />
  );
}
