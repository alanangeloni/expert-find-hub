
import React, { useMemo } from 'react';
import PanelShell from './PanelShell';
import { useReportSummary } from '../summary';
import NumberField from '../NumberField';
import Segmented from '../Segmented';
import Stat from '../Stat';
import Donut from '../charts/Donut';
import { usePersistentState } from '../usePersistentState';
import { calcKey } from '../storage';
import {
  FilingStatus,
  STANDARD_DEDUCTION,
  ficaTax,
  federalTax,
} from '../finance';
import { currency, percent } from '../format';

type Inputs = {
  status: FilingStatus;
  wages: number;
  other: number;
  itemized: number;
  stateRate: number;
  retirement: number;
};

const DEFAULTS: Inputs = {
  status: 'single',
  wages: 95000,
  other: 4000,
  itemized: 0,
  stateRate: 5,
  retirement: 6000,
};

export default function TaxPanel() {
  const [v, setV] = usePersistentState<Inputs>(calcKey('tax'), DEFAULTS);
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const model = useMemo(() => {
    const gross = v.wages + v.other;
    const agi = Math.max(0, gross - v.retirement);
    const standard = STANDARD_DEDUCTION[v.status];
    const deduction = Math.max(standard, v.itemized);
    const taxable = Math.max(0, agi - deduction);
    const federal = federalTax(v.status, taxable);
    const fica = ficaTax(v.status, v.wages);
    const state = (taxable * v.stateRate) / 100;
    const total = federal.tax + fica + state;

    return {
      gross,
      agi,
      deduction,
      taxable,
      federal: federal.tax,
      marginal: federal.marginal,
      rows: federal.rows.filter((row) => row.amount > 0),
      fica,
      state,
      total,
      effective: gross > 0 ? (total / gross) * 100 : 0,
      takeHome: gross - total,
      perMonth: (gross - total) / 12,
      usingStandard: deduction === standard,
    };
  }, [v]);

  useReportSummary(`${currency(model.takeHome)} take-home`);

  return (
    <PanelShell
      inputs={
        <>
          <Segmented
            label="Filing status"
            value={v.status}
            onChange={(status) => set('status', status)}
            options={[
              { value: 'single', label: 'Single' },
              { value: 'mfj', label: 'Married' },
              { value: 'hoh', label: 'Head of house' },
            ]}
          />
          <NumberField
            label="W-2 wages"
            value={v.wages}
            prefix="$"
            min={0}
            step={1000}
            onChange={(wages) => set('wages', wages)}
          />
          <NumberField
            label="Other income"
            value={v.other}
            prefix="$"
            min={0}
            step={500}
            onChange={(other) => set('other', other)}
            hint="Interest, dividends, business income"
          />
          <NumberField
            label="Pre-tax retirement contributions"
            value={v.retirement}
            prefix="$"
            min={0}
            step={500}
            onChange={(retirement) => set('retirement', retirement)}
          />
          <NumberField
            label="Itemised deductions"
            value={v.itemized}
            prefix="$"
            min={0}
            step={1000}
            onChange={(itemized) => set('itemized', itemized)}
            hint={`Standard deduction: ${currency(STANDARD_DEDUCTION[v.status])}`}
          />
          <NumberField
            label="State income tax rate"
            value={v.stateRate}
            suffix="%"
            min={0}
            max={14}
            onChange={(stateRate) => set('stateRate', stateRate)}
          />
        </>
      }
      results={
        <>
          <div className="stat-grid">
            <Stat
              label="Total tax"
              value={currency(model.total)}
              sub={`${percent(model.effective, 1)} effective rate on ${currency(model.gross)}`}
              tone="warn"
              emphasis
              icon="receipt"
            />
            <Stat
              label="Take-home"
              value={currency(model.takeHome)}
              sub={`${currency(model.perMonth)} per month`}
              tone="accent"
            />
            <Stat
              label="Marginal rate"
              value={percent(model.marginal, 0)}
              sub="On your next dollar of income"
              tone="sky"
            />
            <Stat
              label="Taxable income"
              value={currency(model.taxable)}
              sub={`${model.usingStandard ? 'Standard' : 'Itemised'} deduction ${currency(
                model.deduction
              )}`}
            />
          </div>

          <div className="tp__breakdown">
            <div className="tp__row">
              <span>Federal income tax</span>
              <strong>{currency(model.federal)}</strong>
            </div>
            <div className="tp__row">
              <span>FICA (Social Security &amp; Medicare)</span>
              <strong>{currency(model.fica)}</strong>
            </div>
            <div className="tp__row">
              <span>State income tax</span>
              <strong>{currency(model.state)}</strong>
            </div>
            <div className="tp__row tp__row--total">
              <span>Total withheld</span>
              <strong>{currency(model.total)}</strong>
            </div>
          </div>

          <div className="dtable__wrap">
            <table className="dtable">
              <thead>
                <tr>
                  <th>Bracket</th>
                  <th>Rate</th>
                  <th>Income taxed</th>
                  <th>Tax</th>
                </tr>
              </thead>
              <tbody>
                {model.rows.map((row) => (
                  <tr key={row.rate}>
                    <td>
                      <strong>
                        {currency(row.from)}
                        {Number.isFinite(row.to) ? ` – ${currency(row.to)}` : '+'}
                      </strong>
                    </td>
                    <td>{percent(row.rate, 0)}</td>
                    <td>{currency(row.amount)}</td>
                    <td>{currency(row.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      }
      chart={
        <Donut
          centerLabel="Effective rate"
          centerValue={percent(model.effective, 1)}
          formatValue={(value) => currency(value)}
          segments={[
            { label: 'Take-home pay', value: Math.max(0, model.takeHome), color: '#34d399' },
            { label: 'Federal income tax', value: model.federal, color: '#fb7185' },
            { label: 'FICA', value: model.fica, color: '#f4b942' },
            { label: 'State income tax', value: model.state, color: '#a78bfa' },
          ]}
        />
      }
      footnote="2024 federal brackets and standard deductions. FICA uses the current Social Security wage base with the additional Medicare tax above $200K / $250K. Credits, AMT and phase-outs are not included."
    />
  );
}
