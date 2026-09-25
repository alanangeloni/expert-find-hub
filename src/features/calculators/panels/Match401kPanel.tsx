import React, { useMemo } from 'react';
import PanelShell from './PanelShell';
import { useReportSummary } from '../summary';
import NumberField from '../NumberField';
import Stat from '../Stat';
import AreaChart from '../charts/AreaChart';
import { sampleSeries } from '../charts/sampleSeries';
import { usePersistentState } from '../usePersistentState';
import { calcKey } from '../storage';
import { EMPLOYEE_DEFERRAL_LIMIT, match401k } from '../finance';
import { currency, compactCurrency, percent } from '../format';

type Inputs = {
  salary: number;
  contribPct: number;
  matchRatePct: number;
  matchUpToPct: number;
  balance: number;
  returnPct: number;
  years: number;
  salaryGrowth: number;
};

const DEFAULTS: Inputs = {
  salary: 95000,
  contribPct: 6,
  matchRatePct: 50,
  matchUpToPct: 6,
  balance: 42000,
  returnPct: 7,
  years: 25,
  salaryGrowth: 3,
};

export default function Match401kPanel() {
  const [v, setV] = usePersistentState<Inputs>(calcKey('match401k'), DEFAULTS);
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const model = useMemo(() => match401k(v), [v]);

  useReportSummary(
    model.leftOnTable > 1
      ? `${currency(model.leftOnTable)} of match left on the table`
      : `${currency(model.balance)} projected with the full match`
  );

  return (
    <PanelShell
      inputs={
        <>
          <NumberField
            label="Annual salary"
            value={v.salary}
            prefix="$"
            min={0}
            step={1000}
            onChange={(salary) => set('salary', salary)}
          />
          <NumberField
            label="You contribute"
            value={v.contribPct}
            suffix="% of pay"
            min={0}
            max={50}
            step={0.5}
            onChange={(contribPct) => set('contribPct', contribPct)}
            hint={`Employee contributions are capped at ${currency(EMPLOYEE_DEFERRAL_LIMIT)} for 2024.`}
          />
          <div className="field-row">
            <NumberField
              label="Employer matches"
              value={v.matchRatePct}
              suffix="%"
              min={0}
              max={100}
              onChange={(matchRatePct) => set('matchRatePct', matchRatePct)}
              hint="Percent of what you put in"
            />
            <NumberField
              label="Up to"
              value={v.matchUpToPct}
              suffix="% of pay"
              min={0}
              max={20}
              step={0.5}
              onChange={(matchUpToPct) => set('matchUpToPct', matchUpToPct)}
            />
          </div>
          <NumberField
            label="Current 401(k) balance"
            value={v.balance}
            prefix="$"
            min={0}
            step={1000}
            onChange={(balance) => set('balance', balance)}
          />
          <div className="field-row">
            <NumberField
              label="Annual return"
              value={v.returnPct}
              suffix="%"
              min={0}
              max={12}
              step={0.1}
              onChange={(returnPct) => set('returnPct', returnPct)}
            />
            <NumberField
              label="Years"
              value={v.years}
              min={1}
              max={50}
              onChange={(years) => set('years', years)}
            />
          </div>
          <NumberField
            label="Salary growth"
            value={v.salaryGrowth}
            suffix="% /yr"
            min={0}
            max={10}
            step={0.1}
            onChange={(salaryGrowth) => set('salaryGrowth', salaryGrowth)}
          />
        </>
      }
      results={
        <div className="stat-grid">
          <Stat
            label="Projected balance"
            value={compactCurrency(model.balance)}
            sub={`${currency(model.employee)} from you, ${currency(model.employer)} from your employer`}
            tone="accent"
            emphasis
            icon="trending"
          />
          <Stat
            label="Employer adds this year"
            value={currency(model.thisYearEmployer)}
            sub={`On your ${currency(model.thisYearEmployee)} contribution`}
            tone="sky"
          />
          <Stat
            label="Match left on the table"
            value={currency(model.leftOnTable)}
            tone={model.leftOnTable > 1 ? 'warn' : 'accent'}
            sub={
              model.leftOnTable > 1
                ? `Contribute ${percent(v.matchUpToPct, 1)} of pay to collect it`
                : 'You are collecting the full match'
            }
          />
          <Stat
            label="Your contribution rate"
            value={percent(v.contribPct, 1)}
            sub={model.capped ? 'Hit the annual employee cap' : 'Under the annual employee cap'}
          />
        </div>
      }
      chart={
        <AreaChart
          ariaLabel="401(k) balance versus money contributed"
          labels={sampleSeries(model.series.map((point) => point.year))}
          series={[
            {
              label: 'Balance',
              color: '#17b26a',
              values: sampleSeries(model.series.map((point) => point.value)),
            },
            {
              label: 'Contributions',
              color: '#2f6fed',
              fill: false,
              values: sampleSeries(model.series.map((point) => point.contributed)),
            },
          ]}
          height={220}
          formatX={(value) => `${value.toFixed(0)}y`}
          formatY={(value) => compactCurrency(value)}
        />
      }
      footnote="A 50% match up to 6% of pay means the employer adds 50 cents per dollar on the first 6% of salary. The 2024 employee deferral limit is $23,000. Catch-up contributions for age 50 and older are not included."
    />
  );
}
