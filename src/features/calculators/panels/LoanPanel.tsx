
import React, { useMemo } from 'react';
import PanelShell from './PanelShell';
import { useReportSummary } from '../summary';
import NumberField from '../NumberField';
import Segmented from '../Segmented';
import Stat from '../Stat';
import Icon from '../Icon';
import AreaChart from '../charts/AreaChart';
import { sampleSeries } from '../charts/sampleSeries';
import { usePersistentState } from '../usePersistentState';
import { calcKey } from '../storage';
import { Debt, simulatePayoff, monthlyPayment } from '../finance';
import { currency, percent } from '../format';

type Inputs = {
  debts: Debt[];
  extra: number;
  strategy: 'avalanche' | 'snowball';
};

const DEFAULTS: Inputs = {
  extra: 250,
  strategy: 'avalanche',
  debts: [
    { id: 'd1', name: 'Visa Signature', balance: 8400, apr: 23.9, min: 210 },
    { id: 'd2', name: 'Chase Freedom', balance: 3200, apr: 19.2, min: 90 },
    { id: 'd3', name: 'Auto loan', balance: 14200, apr: 6.4, min: 320 },
    { id: 'd4', name: 'Student loan', balance: 19600, apr: 5.1, min: 230 },
  ],
};

export default function LoanPanel() {
  const [v, setV] = usePersistentState<Inputs>(calcKey('loan'), DEFAULTS);

  const patchDebt = (id: string, values: Partial<Debt>) =>
    setV((prev) => ({
      ...prev,
      debts: prev.debts.map((debt) => (debt.id === id ? { ...debt, ...values } : debt)),
    }));

  const addDebt = () =>
    setV((prev) => ({
      ...prev,
      debts: [
        ...prev.debts,
        { id: `d${Date.now()}`, name: 'New debt', balance: 1500, apr: 18, min: 50 },
      ],
    }));

  const removeDebt = (id: string) =>
    setV((prev) => ({ ...prev, debts: prev.debts.filter((debt) => debt.id !== id) }));

  const model = useMemo(() => {
    const active = v.debts.filter((debt) => debt.balance > 0);
    const result = simulatePayoff(active, v.extra, v.strategy);
    const minimumOnly = simulatePayoff(active, 0, v.strategy);
    const totalBalance = active.reduce((sum, debt) => sum + debt.balance, 0);
    const minimumTotal = active.reduce((sum, debt) => sum + debt.min, 0);

    return {
      ...result,
      minimumOnly,
      totalBalance,
      minimumTotal,
      monthsSaved: Math.max(0, minimumOnly.months - result.months),
      interestSaved: Math.max(0, minimumOnly.totalInterest - result.totalInterest),
    };
  }, [v]);

  const series = useMemo(
    () => [
      {
        label: 'Balance remaining',
        color: '#fb7185',
        values: sampleSeries([model.totalBalance, ...model.balanceSeries]),
      },
    ],
    [model]
  );

  useReportSummary(`Debt-free in ${model.months} months`);

  return (
    <PanelShell
      inputsTitle="Your debts"
      inputs={
        <>
          <ul className="lp__debts">
            {v.debts.map((debt) => (
              <li key={debt.id} className="lp__debt">
                <div className="lp__debt-head">
                  <input
                    className="lp__debt-name"
                    value={debt.name}
                    aria-label="Debt name"
                    onChange={(event) => patchDebt(debt.id, { name: event.target.value })}
                  />
                  <button
                    type="button"
                    aria-label={`Remove ${debt.name}`}
                    onClick={() => removeDebt(debt.id)}
                  >
                    <Icon name="x" size={15} />
                  </button>
                </div>
                <div className="lp__debt-fields">
                  <label>
                    <span>Balance</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={debt.balance}
                      aria-label={`${debt.name} balance`}
                      onChange={(event) =>
                        patchDebt(debt.id, { balance: Number(event.target.value.replace(/[^0-9.]/g, '')) || 0 })
                      }
                    />
                  </label>
                  <label>
                    <span>APR %</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={debt.apr}
                      aria-label={`${debt.name} APR`}
                      onChange={(event) =>
                        patchDebt(debt.id, { apr: Number(event.target.value.replace(/[^0-9.]/g, '')) || 0 })
                      }
                    />
                  </label>
                  <label>
                    <span>Min $</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={debt.min}
                      aria-label={`${debt.name} minimum payment`}
                      onChange={(event) =>
                        patchDebt(debt.id, { min: Number(event.target.value.replace(/[^0-9.]/g, '')) || 0 })
                      }
                    />
                  </label>
                </div>
              </li>
            ))}
          </ul>

          <button type="button" className="lp__add" onClick={addDebt}>
            <Icon name="plus" size={15} />
            Add another debt
          </button>

          <NumberField
            label="Extra payment each month"
            value={v.extra}
            prefix="$"
            suffix="/mo"
            min={0}
            step={25}
            onChange={(extra) => setV((prev) => ({ ...prev, extra }))}
            hint={`Minimums: ${currency(model.minimumTotal)} · total paid: ${currency(model.minimumTotal + v.extra)}`}
          />

          <Segmented
            label="Payoff strategy"
            value={v.strategy}
            onChange={(strategy) => setV((prev) => ({ ...prev, strategy }))}
            options={[
              { value: 'avalanche', label: 'Avalanche' },
              { value: 'snowball', label: 'Snowball' },
            ]}
          />
          <p className="lp__strategy-note">
            {v.strategy === 'avalanche'
              ? 'Highest-rate debt first — mathematically cheapest.'
              : 'Smallest balance first — quickest wins for momentum.'}
          </p>
        </>
      }
      results={
        <>
          <div className="stat-grid">
            <Stat
              label="Debt-free in"
              value={`${model.months} mo`}
              sub={`${(model.months / 12).toFixed(1)} years`}
              tone="accent"
              emphasis
              icon="card"
            />
            <Stat
              label="Total interest"
              value={currency(model.totalInterest)}
              tone="warn"
              sub={`${percent(
                model.totalBalance > 0 ? (model.totalInterest / model.totalBalance) * 100 : 0
              )} of balance`}
            />
            <Stat
              label="Interest saved"
              value={currency(model.interestSaved)}
              sub={`Versus minimum payments only`}
              tone="sky"
            />
            <Stat
              label="Months saved"
              value={`${model.monthsSaved}`}
              sub={`Minimum-only would take ${model.minimumOnly.months} mo`}
              tone={model.monthsSaved > 0 ? 'accent' : 'default'}
            />
          </div>

          <div className="lp__order">
            <h4>Payoff order</h4>
            <ol>
              {model.order.length ? (
                model.order.map((entry) => (
                  <li key={entry.id}>
                    <span className="lp__order-month">Month {entry.month}</span>
                    <strong>{entry.name}</strong>
                  </li>
                ))
              ) : (
                <li className="lp__order-done">Everything is already paid off.</li>
              )}
            </ol>
          </div>
        </>
      }
      chart={
        <AreaChart
          ariaLabel="Total debt balance falling to zero"
          labels={sampleSeries(
            Array.from({ length: model.balanceSeries.length + 1 }, (_, index) => index)
          )}
          series={series}
          height={220}
          formatX={(value) => `${Math.round(value)}m`}
          formatY={(value) => (value >= 1000 ? `$${Math.round(value / 1000)}K` : `$${Math.round(value)}`)}
          legend={false}
        />
      }
      footnote="Avalanche saves the most interest. Snowball clears accounts sooner, which many people find easier to stick with — the difference here is shown above."
    />
  );
}
