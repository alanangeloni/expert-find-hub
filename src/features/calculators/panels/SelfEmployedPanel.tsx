
import React, { useMemo } from 'react';
import PanelShell from './PanelShell';
import { useReportSummary } from '../summary';
import NumberField from '../NumberField';
import Segmented from '../Segmented';
import Stat from '../Stat';
import Donut from '../charts/Donut';
import { usePersistentState } from '../usePersistentState';
import { calcKey } from '../storage';
import { FilingStatus, STANDARD_DEDUCTION, federalTax } from '../finance';
import { currency, percent } from '../format';

type Inputs = {
  profit: number;
  wages: number;
  status: FilingStatus;
  expenses: number;
};

const DEFAULTS: Inputs = { profit: 120000, wages: 0, status: 'single', expenses: 18000 };

const SS_BASE = 168600;
const SS_RATE = 0.124;
const MEDICARE_RATE = 0.029;

export default function SelfEmployedPanel() {
  const [v, setV] = usePersistentState<Inputs>(calcKey('self-employed'), DEFAULTS);
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const model = useMemo(() => {
    const netEarnings = Math.max(0, v.profit * 0.9235);
    const remainingSsBase = Math.max(0, SS_BASE - Math.max(0, v.wages));
    const ss = Math.min(netEarnings, remainingSsBase) * SS_RATE;
    const threshold = v.status === 'mfj' ? 250000 : 200000;
    const totalEarningsForMedicare = netEarnings + Math.max(0, v.wages);
    const medicare =
      netEarnings * MEDICARE_RATE +
      Math.max(0, totalEarningsForMedicare - threshold) * 0.009;
    const seTax = ss + medicare;
    const deduction = seTax / 2;

    const agi = Math.max(0, v.profit - deduction + v.wages);
    const taxable = Math.max(0, agi - STANDARD_DEDUCTION[v.status]);
    const federal = federalTax(v.status, taxable).tax;
    const totalTax = seTax + federal;
    const quarterly = totalTax / 4;
    const setAsidePct = v.profit > 0 ? (totalTax / v.profit) * 100 : 0;

    return {
      netEarnings,
      ss,
      medicare,
      seTax,
      deduction,
      agi,
      taxable,
      federal,
      totalTax,
      quarterly,
      setAsidePct,
      takeHome: v.profit - totalTax,
      effective: v.profit > 0 ? (totalTax / v.profit) * 100 : 0,
    };
  }, [v]);

  const monthly = model.quarterly / 3;

  useReportSummary(`${currency(model.quarterly)} set aside each quarter`);

  return (
    <PanelShell
      inputs={
        <>
          <NumberField
            label="Net self-employment profit"
            value={v.profit}
            prefix="$"
            suffix="/yr"
            min={0}
            step={1000}
            onChange={(profit) => set('profit', profit)}
            hint="Revenue minus ordinary business expenses"
          />
          <NumberField
            label="W-2 wages (if any)"
            value={v.wages}
            prefix="$"
            min={0}
            step={1000}
            onChange={(wages) => set('wages', wages)}
            hint="Used to check the Social Security wage base"
          />
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
            label="Business expenses (for reference)"
            value={v.expenses}
            prefix="$"
            suffix="/yr"
            min={0}
            step={500}
            onChange={(expenses) => set('expenses', expenses)}
          />
        </>
      }
      results={
        <>
          <div className="stat-grid">
            <Stat
              label="Set aside each quarter"
              value={currency(model.quarterly)}
              sub={`${currency(monthly)} per month`}
              tone="accent"
              emphasis
              icon="briefcase"
            />
            <Stat
              label="Self-employment tax"
              value={currency(model.seTax)}
              sub={`${percent((model.seTax / Math.max(1, v.profit)) * 100, 1)} of profit`}
              tone="warn"
            />
            <Stat
              label="Effective total rate"
              value={percent(model.effective, 1)}
              sub={`${currency(model.totalTax)} of ${currency(v.profit)}`}
              tone="sky"
            />
            <Stat
              label="Half SE tax deduction"
              value={currency(model.deduction)}
              sub="Above-the-line, reduces AGI"
              tone="accent"
            />
          </div>

          <div className="se__split">
            <div>
              <span>Social Security portion</span>
              <strong>{currency(model.ss)}</strong>
              <em>12.4% up to {currency(SS_BASE)}</em>
            </div>
            <div>
              <span>Medicare portion</span>
              <strong>{currency(model.medicare)}</strong>
              <em>2.9% + 0.9% above thresholds</em>
            </div>
            <div>
              <span>Federal income tax</span>
              <strong>{currency(model.federal)}</strong>
              <em>On {currency(model.taxable)} taxable</em>
            </div>
          </div>

          <div className="se__callout">
            <strong>{percent(model.setAsidePct, 0)}</strong>
            <p>
              of every dollar you earn should be parked for taxes. Sweep{' '}
              {currency(model.setAsidePct * 100)} per $10,000 of profit into a separate savings
              account as it arrives.
            </p>
          </div>
        </>
      }
      chart={
        <Donut
          centerLabel="Keep vs set aside"
          centerValue={currency(model.takeHome)}
          formatValue={(value) => currency(value)}
          segments={[
            { label: 'Take-home', value: Math.max(0, model.takeHome), color: '#34d399' },
            { label: 'Self-employment tax', value: model.seTax, color: '#fda4af' },
            { label: 'Federal income tax', value: model.federal, color: '#f4b942' },
          ]}
        />
      }
      footnote="Self-employment tax is 15.3% on 92.35% of net profit — you effectively split it with the deduction you are allowed to take. State tax and credits are excluded."
    />
  );
}
