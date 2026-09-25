import React, { useMemo } from 'react';
import PanelShell from './PanelShell';
import { useReportSummary } from '../summary';
import NumberField from '../NumberField';
import Stat from '../Stat';
import { usePersistentState } from '../usePersistentState';
import { calcKey } from '../storage';
import { refinanceComparison } from '../finance';
import { currency, percent, durationFromMonths } from '../format';

type Inputs = {
  balance: number;
  currentRate: number;
  yearsLeft: number;
  newRate: number;
  newYears: number;
  closingCosts: number;
};

const DEFAULTS: Inputs = {
  balance: 340000,
  currentRate: 7.1,
  yearsLeft: 27,
  newRate: 6.1,
  newYears: 30,
  closingCosts: 6500,
};

export default function RefinancePanel() {
  const [v, setV] = usePersistentState<Inputs>(calcKey('refinance'), DEFAULTS);
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const model = useMemo(() => refinanceComparison(v), [v]);
  const saves = model.monthlySavings > 1;

  useReportSummary(
    saves && model.breakEvenMonths
      ? `Break-even in ${durationFromMonths(model.breakEvenMonths)}`
      : 'New loan does not lower the payment'
  );

  return (
    <PanelShell
      inputs={
        <>
          <NumberField
            label="Remaining balance"
            value={v.balance}
            prefix="$"
            min={0}
            step={5000}
            onChange={(balance) => set('balance', balance)}
          />
          <div className="field-row">
            <NumberField
              label="Current rate"
              value={v.currentRate}
              suffix="%"
              min={0}
              max={15}
              step={0.05}
              onChange={(currentRate) => set('currentRate', currentRate)}
            />
            <NumberField
              label="Years left"
              value={v.yearsLeft}
              suffix="yr"
              min={1}
              max={40}
              onChange={(yearsLeft) => set('yearsLeft', yearsLeft)}
            />
          </div>
          <div className="field-row">
            <NumberField
              label="New rate"
              value={v.newRate}
              suffix="%"
              min={0}
              max={15}
              step={0.05}
              onChange={(newRate) => set('newRate', newRate)}
            />
            <NumberField
              label="New term"
              value={v.newYears}
              suffix="yr"
              min={1}
              max={40}
              onChange={(newYears) => set('newYears', newYears)}
            />
          </div>
          <NumberField
            label="Closing costs"
            value={v.closingCosts}
            prefix="$"
            min={0}
            step={250}
            onChange={(closingCosts) => set('closingCosts', closingCosts)}
            hint="Paid up front. They are not added to the new loan balance."
          />
        </>
      }
      results={
        <div className="stat-grid">
          <Stat
            label="Break-even"
            value={saves && model.breakEvenMonths ? durationFromMonths(model.breakEvenMonths) : 'No savings'}
            sub={
              saves
                ? `${currency(model.monthlySavings)} less per month`
                : 'The new payment is not lower'
            }
            tone={saves ? 'accent' : 'bad'}
            emphasis
            icon="home"
          />
          <Stat
            label="New payment"
            value={currency(model.newPayment)}
            sub={`Current payment ${currency(model.currentPayment)}`}
          />
          <Stat
            label="Interest saved"
            value={currency(model.interestSaved)}
            tone={model.interestSaved >= 0 ? 'sky' : 'warn'}
            sub="Over the full remaining life of each loan"
          />
          <Stat
            label="After closing costs"
            value={currency(model.netOfClosing)}
            tone={model.netOfClosing >= 0 ? 'accent' : 'warn'}
            sub={model.netOfClosing >= 0 ? 'Interest savings beat the fees' : 'Fees outweigh the interest savings'}
          />
        </div>
      }
      footnote={`Principal and interest only. A longer new term can cut the payment and still raise total interest. Current loan runs ${model.currentMonths} months; the new loan runs ${model.newMonths}. Rates shown as ${percent(v.currentRate, 2)} and ${percent(v.newRate, 2)}.`}
    />
  );
}
