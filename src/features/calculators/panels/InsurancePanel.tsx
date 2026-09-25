import React, { useMemo } from 'react';
import PanelShell from './PanelShell';
import { useReportSummary } from '../summary';
import NumberField from '../NumberField';
import Stat from '../Stat';
import Donut from '../charts/Donut';
import { usePersistentState } from '../usePersistentState';
import { calcKey } from '../storage';
import { insuranceNeed } from '../finance';
import { currency, compactCurrency } from '../format';

type Inputs = {
  income: number;
  years: number;
  debts: number;
  goals: number;
  assets: number;
  existing: number;
};

const DEFAULTS: Inputs = {
  income: 90000,
  years: 15,
  debts: 280000,
  goals: 80000,
  assets: 120000,
  existing: 250000,
};

export default function InsurancePanel() {
  const [v, setV] = usePersistentState<Inputs>(calcKey('insurance'), DEFAULTS);
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const model = useMemo(() => insuranceNeed(v), [v]);

  useReportSummary(
    model.need > 0
      ? `${currency(model.need)} of additional coverage`
      : 'Existing resources cover this estimate'
  );

  return (
    <PanelShell
      inputs={
        <>
          <NumberField
            label="Annual income to replace"
            value={v.income}
            prefix="$"
            min={0}
            step={1000}
            onChange={(income) => set('income', income)}
          />
          <NumberField
            label="Years to replace it"
            value={v.years}
            min={0}
            max={40}
            onChange={(years) => set('years', years)}
            hint="Often until the youngest child is independent, or until retirement savings can take over."
          />
          <NumberField
            label="Debts to clear"
            value={v.debts}
            prefix="$"
            min={0}
            step={5000}
            onChange={(debts) => set('debts', debts)}
            hint="Mortgage, student loans, and other balances you would not leave behind."
          />
          <NumberField
            label="Extra goals"
            value={v.goals}
            prefix="$"
            min={0}
            step={5000}
            onChange={(goals) => set('goals', goals)}
            hint="College funding, final expenses, or a cash cushion."
          />
          <div className="field-row">
            <NumberField
              label="Savings and investments"
              value={v.assets}
              prefix="$"
              min={0}
              step={5000}
              onChange={(assets) => set('assets', assets)}
            />
            <NumberField
              label="Coverage you already have"
              value={v.existing}
              prefix="$"
              min={0}
              step={10000}
              onChange={(existing) => set('existing', existing)}
            />
          </div>
        </>
      }
      results={
        <div className="stat-grid">
          <Stat
            label="Additional coverage"
            value={compactCurrency(model.need)}
            sub={model.need > 0 ? 'After savings and current policies' : 'Current resources cover the goal'}
            tone={model.need > 0 ? 'accent' : 'sky'}
            emphasis
            icon="shield"
          />
          <Stat label="Income replacement" value={compactCurrency(model.incomeNeed)} sub={`${v.years} years of income`} />
          <Stat label="Debts and goals" value={currency(v.debts + v.goals)} />
          <Stat label="Already covered" value={currency(model.offsets)} tone="sky" sub="Savings plus existing insurance" />
        </div>
      }
      chart={
        <Donut
          centerLabel="Still needed"
          centerValue={compactCurrency(model.need)}
          segments={[
            { label: 'Income', value: model.incomeNeed, color: '#2f6fed' },
            { label: 'Debts', value: v.debts, color: '#dc5468' },
            { label: 'Goals', value: v.goals, color: '#d98324' },
          ]}
          formatValue={(value) => compactCurrency(value)}
        />
      }
      footnote="This is an income-replacement estimate, not a quote. It does not model Social Security survivor benefits, a stay-at-home spouse's unpaid work, or the cost of the policy itself."
    />
  );
}
