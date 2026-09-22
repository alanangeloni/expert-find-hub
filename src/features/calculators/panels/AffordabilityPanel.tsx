
import React, { useMemo } from 'react';
import PanelShell from './PanelShell';
import { useReportSummary } from '../summary';
import NumberField from '../NumberField';
import RangeField from '../RangeField';
import Stat from '../Stat';
import BarChart from '../charts/BarChart';
import { usePersistentState } from '../usePersistentState';
import { calcKey } from '../storage';
import { monthlyPayment } from '../finance';
import { currency, percent } from '../format';

type Inputs = {
  income: number;
  debts: number;
  down: number;
  rate: number;
  years: number;
  front: number;
  back: number;
};

const DEFAULTS: Inputs = {
  income: 132000,
  debts: 650,
  down: 60000,
  rate: 6.35,
  years: 30,
  front: 28,
  back: 36,
};

const OVERHEAD = 0.0145; // taxes + insurance as a share of price, per year

export default function AffordabilityPanel() {
  const [v, setV] = usePersistentState<Inputs>(calcKey('affordability'), DEFAULTS);
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const model = useMemo(() => {
    const monthlyIncome = v.income / 12;
    const frontBudget = (monthlyIncome * v.front) / 100;
    const backBudget = (monthlyIncome * v.back) / 100 - v.debts;
    const budget = Math.max(0, Math.min(frontBudget, backBudget));

    const monthlyRate = v.rate / 100 / 12;
    const periods = Math.round(v.years * 12);
    const factor =
      monthlyRate === 0 ? periods : (1 - Math.pow(1 + monthlyRate, -periods)) / monthlyRate;

    const k = OVERHEAD / 12;
    const pi = (budget - v.down * k) / (1 + factor * k);
    const price = Math.max(0, v.down + Math.max(0, pi) * factor);
    const loan = Math.max(0, price - v.down);
    const payment = monthlyPayment(loan, v.rate, v.years) + price * k;

    return {
      budget,
      frontBudget,
      backBudget,
      pi: Math.max(0, pi),
      price,
      loan,
      payment,
      dti: monthlyIncome > 0 ? (payment + v.debts) / monthlyIncome * 100 : 0,
      constrainedByFront: frontBudget <= backBudget,
    };
  }, [v]);

  const scenarios = useMemo(
    () =>
      [v.rate - 1, v.rate, v.rate + 1.25].map((rate) => {
        const monthlyRate = rate / 100 / 12;
        const periods = Math.round(v.years * 12);
        const factor =
          monthlyRate === 0 ? periods : (1 - Math.pow(1 + monthlyRate, -periods)) / monthlyRate;
        const k = OVERHEAD / 12;
        const pi = (model.budget - v.down * k) / (1 + factor * k);
        return { rate: Math.max(0.5, rate), price: Math.max(0, v.down + Math.max(0, pi) * factor) };
      }),
    [v, model.budget]
  );

  useReportSummary(`Max home price ${currency(model.price)}`);

  return (
    <PanelShell
      inputs={
        <>
          <NumberField
            label="Annual income (gross)"
            value={v.income}
            prefix="$"
            min={0}
            step={1000}
            onChange={(income) => set('income', income)}
          />
          <NumberField
            label="Monthly debt payments"
            value={v.debts}
            prefix="$"
            suffix="/mo"
            min={0}
            onChange={(debts) => set('debts', debts)}
            hint="Car loans, student loans, minimum card payments"
          />
          <NumberField
            label="Cash for down payment"
            value={v.down}
            prefix="$"
            min={0}
            step={5000}
            onChange={(down) => set('down', down)}
          />
          <RangeField
            label="Interest rate"
            value={v.rate}
            min={2}
            max={11}
            step={0.05}
            display={percent(v.rate, 2)}
            minLabel="2%"
            maxLabel="11%"
            onChange={(rate) => set('rate', rate)}
          />
          <div className="field-row">
            <NumberField
              label="Front-end DTI"
              value={v.front}
              suffix="%"
              min={10}
              max={45}
              onChange={(front) => set('front', front)}
            />
            <NumberField
              label="Back-end DTI"
              value={v.back}
              suffix="%"
              min={20}
              max={55}
              onChange={(back) => set('back', back)}
            />
          </div>
        </>
      }
      results={
        <>
          <div className="stat-grid">
            <Stat
              label="Max home price"
              value={currency(model.price)}
              sub={`${currency(model.loan)} mortgage after down payment`}
              tone="accent"
              emphasis
              icon="bank"
            />
            <Stat
              label="Housing budget"
              value={`${currency(model.budget)}/mo`}
              sub={`${percent(v.front, 0)} front-end limit`}
            />
            <Stat
              label="Resulting DTI"
              value={percent(model.dti, 0)}
              sub={`${percent(v.back, 0)} back-end limit`}
              tone={model.dti > v.back ? 'bad' : 'sky'}
            />
            <Stat
              label="Binding constraint"
              value={model.constrainedByFront ? 'Housing ratio' : 'Total debt'}
              sub={
                model.constrainedByFront
                  ? 'Your income limits the payment'
                  : 'Existing debts are the bottleneck'
              }
              tone={model.constrainedByFront ? 'default' : 'warn'}
            />
          </div>

          <div className="af__note">
            <strong>{currency(model.pi)}/mo</strong>
            <span>
              goes to principal &amp; interest, leaving roughly{' '}
              {currency((model.price * OVERHEAD) / 12)} per month for taxes and insurance at{' '}
              {percent(OVERHEAD * 100, 2)} of home value.
            </span>
          </div>
        </>
      }
      chart={
        <BarChart
          ariaLabel="Affordable home price at different mortgage rates"
          bars={scenarios.map((scenario, index) => ({
            label: `${percent(scenario.rate, 2)}`,
            value: scenario.price,
            caption: currency(scenario.price),
            emphasis: index === 1,
            color: index === 1 ? '#17b26a' : '#2f6fed',
          }))}
          formatValue={(value) => currency(value)}
        />
      }
      footnote="Lenders typically cap total debt at 36–43% of gross income. Taxes, insurance and HOA are modelled at 1.45% of home value per year — your county rate may differ."
    />
  );
}
