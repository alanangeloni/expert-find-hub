
import React, { useMemo } from 'react';
import PanelShell from './PanelShell';
import { useReportSummary } from '../summary';
import NumberField from '../NumberField';
import Stat from '../Stat';
import Donut from '../charts/Donut';
import { usePersistentState } from '../usePersistentState';
import { calcKey } from '../storage';
import { monthlyPayment } from '../finance';
import { currency, percent } from '../format';

type Inputs = {
  price: number;
  down: number;
  trade: number;
  taxPct: number;
  apr: number;
  months: number;
  fees: number;
};

const DEFAULTS: Inputs = {
  price: 42000,
  down: 4000,
  trade: 6500,
  taxPct: 6.5,
  apr: 7.2,
  months: 60,
  fees: 650,
};

export default function AutoPanel() {
  const [v, setV] = usePersistentState<Inputs>(calcKey('auto'), DEFAULTS);
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const model = useMemo(() => {
    const taxable = Math.max(0, v.price - v.trade);
    const salesTax = (taxable * v.taxPct) / 100;
    const financed = Math.max(0, v.price + salesTax + v.fees - v.down - v.trade);
    const monthly = (financed * (v.apr / 100 / 12)) / (1 - Math.pow(1 + v.apr / 100 / 12, -v.months));
    const payment = Number.isFinite(monthly) ? monthly : financed / Math.max(1, v.months);
    const totalInterest = payment * v.months - financed;
    const driveOff = v.down;

    return {
      salesTax,
      financed,
      payment,
      totalInterest,
      totalCost: payment * v.months + driveOff + v.trade * 0,
      driveOff,
      apr: v.apr,
      loanToValue: v.price + salesTax + v.fees > 0
        ? (financed / (v.price + salesTax + v.fees)) * 100
        : 0,
    };
  }, [v]);

  useReportSummary(`${currency(model.payment)} per month`);

  return (
    <PanelShell
      inputs={
        <>
          <NumberField
            label="Vehicle price"
            value={v.price}
            prefix="$"
            min={0}
            step={500}
            onChange={(price) => set('price', price)}
          />
          <div className="field-row">
            <NumberField
              label="Down payment"
              value={v.down}
              prefix="$"
              min={0}
              step={250}
              onChange={(down) => set('down', down)}
            />
            <NumberField
              label="Trade-in value"
              value={v.trade}
              prefix="$"
              min={0}
              step={250}
              onChange={(trade) => set('trade', trade)}
            />
          </div>
          <div className="field-row">
            <NumberField
              label="Sales tax"
              value={v.taxPct}
              suffix="%"
              min={0}
              max={12}
              onChange={(taxPct) => set('taxPct', taxPct)}
            />
            <NumberField
              label="Term"
              value={v.months}
              suffix="mo"
              min={12}
              max={96}
              onChange={(months) => set('months', months)}
            />
          </div>
          <NumberField
            label="APR"
            value={v.apr}
            suffix="%"
            min={0}
            max={30}
            onChange={(apr) => set('apr', apr)}
          />
          <NumberField
            label="Title, registration & fees"
            value={v.fees}
            prefix="$"
            min={0}
            onChange={(fees) => set('fees', fees)}
          />
        </>
      }
      results={
        <>
          <div className="stat-grid">
            <Stat
              label="Monthly payment"
              value={currency(model.payment)}
              sub={`${v.months} months at ${percent(v.apr, 2)}`}
              tone="accent"
              emphasis
              icon="car"
            />
            <Stat label="Amount financed" value={currency(model.financed)} sub={`${percent(model.loanToValue, 0)} of price + tax & fees`} />
            <Stat
              label="Total interest"
              value={currency(Math.max(0, model.totalInterest))}
              tone="warn"
              sub={`${percent(
                model.financed > 0 ? (model.totalInterest / model.financed) * 100 : 0
              )} of the loan`}
            />
            <Stat label="Total out the door" value={currency(model.totalCost)} tone="sky" sub="Includes your cash down" />
          </div>

          <div className="ap__flow">
            {[
              { label: 'Vehicle price', value: v.price },
              { label: 'Sales tax', value: model.salesTax },
              { label: 'Fees', value: v.fees },
              { label: 'Less down payment', value: -v.down },
              { label: 'Less trade-in', value: -v.trade },
            ].map((row) => (
              <div key={row.label} className="ap__flow-row">
                <span>{row.label}</span>
                <strong className={row.value < 0 ? 'tone-good' : ''}>
                  {row.value < 0 ? `−${currency(Math.abs(row.value))}` : currency(row.value)}
                </strong>
              </div>
            ))}
            <div className="ap__flow-row ap__flow-row--total">
              <span>Amount financed</span>
              <strong>{currency(model.financed)}</strong>
            </div>
          </div>
        </>
      }
      chart={
        <Donut
          centerLabel="Out the door"
          centerValue={currency(model.totalCost)}
          formatValue={(value) => currency(value)}
          segments={[
            { label: 'Payments over term', value: model.payment * v.months, color: '#38bdf8' },
            { label: 'Interest', value: Math.max(0, model.totalInterest), color: '#fb7185' },
            { label: 'Sales tax & fees', value: model.salesTax + v.fees, color: '#f4b942' },
            { label: 'Cash down', value: v.down, color: '#34d399' },
          ]}
        />
      }
      footnote="Dealer financing often beats credit-union rates only when a manufacturer incentive is applied. Compare the APR against a pre-approved loan before signing."
    />
  );
}
