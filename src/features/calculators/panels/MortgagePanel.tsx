
import React, { useMemo } from 'react';
import PanelShell from './PanelShell';
import { useReportSummary } from '../summary';
import NumberField from '../NumberField';
import RangeField from '../RangeField';
import Stat from '../Stat';
import AreaChart from '../charts/AreaChart';
import { usePersistentState } from '../usePersistentState';
import { calcKey } from '../storage';
import { monthlyPayment, amortization } from '../finance';
import { currency, compactCurrency, formatDate, addMonths, percent } from '../format';

type Inputs = {
  price: number;
  downPct: number;
  rate: number;
  years: number;
  taxPct: number;
  insurance: number;
  hoa: number;
};

const DEFAULTS: Inputs = {
  price: 520000,
  downPct: 20,
  rate: 6.35,
  years: 30,
  taxPct: 1.15,
  insurance: 1900,
  hoa: 0,
};

export default function MortgagePanel() {
  const [v, setV] = usePersistentState<Inputs>(calcKey('mortgage'), DEFAULTS);
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const model = useMemo(() => {
    const down = v.price * (v.downPct / 100);
    const loan = Math.max(0, v.price - down);
    const pi = monthlyPayment(loan, v.rate, v.years);
    const tax = (v.price * v.taxPct) / 100 / 12;
    const insurance = v.insurance / 12;
    const total = pi + tax + insurance + v.hoa;
    const rows = amortization(loan, v.rate, v.years);

    const yearly: { year: number; balance: number; interest: number; principal: number }[] = [];
    rows.forEach((row, index) => {
      const yearIndex = Math.floor(index / 12);
      if (!yearly[yearIndex]) {
        yearly[yearIndex] = { year: yearIndex + 1, balance: row.balance, interest: 0, principal: 0 };
      }
      yearly[yearIndex].balance = row.balance;
      yearly[yearIndex].interest += row.interest;
      yearly[yearIndex].principal += row.principal;
    });

    const totalInterest = rows.reduce((sum, row) => sum + row.interest, 0);
    const payoff = addMonths(new Date(), Math.round(v.years * 12));

    return {
      down,
      loan,
      pi,
      tax,
      insurance,
      total,
      yearly,
      totalInterest,
      totalCost: total * v.years * 12,
      payoff,
      ltv: v.price > 0 ? (loan / v.price) * 100 : 0,
    };
  }, [v]);

  const balanceSeries = [
    { label: 'Balance', color: '#2f6fed', values: [model.loan, ...model.yearly.map((y) => y.balance)] },
    {
      label: 'Interest paid',
      color: '#d98324',
      fill: false,
      values: [
        0,
        ...model.yearly.map((_, index) =>
          model.yearly.slice(0, index + 1).reduce((sum, y) => sum + y.interest, 0)
        ),
      ],
    },
  ];

  useReportSummary(`${currency(model.total)} per month`);

  return (
    <PanelShell
      inputs={
        <>
          <NumberField
            label="Home price"
            value={v.price}
            prefix="$"
            min={0}
            step={5000}
            onChange={(price) => set('price', price)}
          />
          <div className="field-row">
            <NumberField
              label="Down payment"
              value={v.downPct}
              suffix="%"
              min={0}
              max={60}
              onChange={(downPct) => set('downPct', downPct)}
              hint={currency(model.down)}
            />
            <NumberField
              label="Term"
              value={v.years}
              suffix="yr"
              min={1}
              max={40}
              onChange={(years) => set('years', years)}
            />
          </div>
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
              label="Property tax"
              value={v.taxPct}
              suffix="%/yr"
              min={0}
              max={4}
              onChange={(taxPct) => set('taxPct', taxPct)}
            />
            <NumberField
              label="Insurance"
              value={v.insurance}
              prefix="$"
              suffix="/yr"
              min={0}
              onChange={(insurance) => set('insurance', insurance)}
            />
          </div>
          <NumberField
            label="HOA dues"
            value={v.hoa}
            prefix="$"
            suffix="/mo"
            min={0}
            onChange={(hoa) => set('hoa', hoa)}
          />
        </>
      }
      results={
        <>
          <div className="stat-grid">
            <Stat
              label="Monthly payment"
              value={currency(model.total)}
              sub={`${currency(model.pi)} principal & interest`}
              tone="accent"
              emphasis
              icon="home"
            />
            <Stat label="Loan amount" value={currency(model.loan)} sub={`${percent(model.ltv)} LTV`} />
            <Stat
              label="Total interest"
              value={currency(model.totalInterest)}
              sub={`${percent(
                model.loan > 0 ? (model.totalInterest / model.loan) * 100 : 0
              )} of principal`}
              tone="warn"
            />
            <Stat
              label="Paid off"
              value={formatDate(model.payoff)}
              sub={`${v.years} years from today`}
              tone="sky"
            />
          </div>

          <div className="mp__breakdown">
            {[
              { label: 'Principal & interest', value: model.pi, color: '#17b26a' },
              { label: 'Property tax', value: model.tax, color: '#2f6fed' },
              { label: 'Home insurance', value: model.insurance, color: '#7c5cf0' },
              { label: 'HOA dues', value: v.hoa, color: '#d98324' },
            ].map((row) => (
              <div key={row.label} className="mp__row">
                <span className="mp__dot" style={{ background: row.color }} />
                <span className="mp__row-label">{row.label}</span>
                <span className="mp__row-value">{currency(row.value)}</span>
                <span className="mp__row-pct">
                  {percent(model.total > 0 ? (row.value / model.total) * 100 : 0, 0)}
                </span>
              </div>
            ))}
          </div>
        </>
      }
      chart={
        <>
          <AreaChart
            ariaLabel="Mortgage balance and cumulative interest over time"
            labels={[0, ...model.yearly.map((y) => y.year)]}
            series={balanceSeries}
            height={230}
            formatX={(value) => `${Math.round(value)}y`}
            formatY={(value) => compactCurrency(value)}
          />
          <div className="dtable__wrap">
            <table className="dtable">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {model.yearly.slice(0, 30).map((year) => (
                  <tr key={year.year}>
                    <td>
                      <strong>Year {year.year}</strong>
                    </td>
                    <td>{currency(year.principal)}</td>
                    <td>{currency(year.interest)}</td>
                    <td>{currency(year.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      }
      footnote={`Total cost over the life of the loan including taxes, insurance and HOA: ${currency(
        model.totalCost
      )}.`}
    />
  );
}
