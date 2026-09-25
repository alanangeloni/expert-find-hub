import React, { useMemo } from 'react';
import PanelShell from './PanelShell';
import { useReportSummary } from '../summary';
import NumberField from '../NumberField';
import Stat from '../Stat';
import BarChart from '../charts/BarChart';
import { usePersistentState } from '../usePersistentState';
import { calcKey } from '../storage';
import { rothVsTraditional } from '../finance';
import { currency, compactCurrency } from '../format';

type Inputs = {
  annual: number;
  currentRate: number;
  retirementRate: number;
  returnPct: number;
  years: number;
};

const DEFAULTS: Inputs = {
  annual: 7000,
  currentRate: 22,
  retirementRate: 12,
  returnPct: 7,
  years: 30,
};

export default function RothPanel() {
  const [v, setV] = usePersistentState<Inputs>(calcKey('roth'), DEFAULTS);
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const model = useMemo(() => rothVsTraditional(v), [v]);
  const winner = model.tie ? 'About the same' : model.rothWins ? 'Roth' : 'Traditional';

  useReportSummary(
    model.tie
      ? 'Roth and traditional finish about even'
      : `${winner} ahead by ${currency(Math.abs(model.advantage))} after tax`
  );

  return (
    <PanelShell
      inputs={
        <>
          <NumberField
            label="Pre-tax amount each year"
            value={v.annual}
            prefix="$"
            min={0}
            step={500}
            onChange={(annual) => set('annual', annual)}
            hint="Traditional receives this full amount. Roth receives it after today's tax."
          />
          <div className="field-row">
            <NumberField
              label="Tax rate today"
              value={v.currentRate}
              suffix="%"
              min={0}
              max={37}
              step={1}
              onChange={(currentRate) => set('currentRate', currentRate)}
            />
            <NumberField
              label="Tax rate in retirement"
              value={v.retirementRate}
              suffix="%"
              min={0}
              max={37}
              step={1}
              onChange={(retirementRate) => set('retirementRate', retirementRate)}
            />
          </div>
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
              label="Years invested"
              value={v.years}
              min={1}
              max={50}
              onChange={(years) => set('years', years)}
            />
          </div>
        </>
      }
      results={
        <div className="stat-grid">
          <Stat
            label="Ahead after tax"
            value={winner}
            sub={
              model.tie
                ? 'The two rates are close enough to tie'
                : `${currency(Math.abs(model.advantage))} more spendable money`
            }
            tone="accent"
            emphasis
            icon="receipt"
          />
          <Stat
            label="Roth, spendable"
            value={compactCurrency(model.rothBalance)}
            tone={model.rothWins ? 'accent' : 'default'}
            sub={`${currency(model.taxPaidNow)} of tax paid along the way`}
          />
          <Stat
            label="Traditional, spendable"
            value={compactCurrency(model.traditionalAfterTax)}
            tone={!model.rothWins && !model.tie ? 'accent' : 'default'}
            sub={`${compactCurrency(model.traditionalBalance)} before the retirement tax`}
          />
          <Stat
            label="Tax due later on traditional"
            value={compactCurrency(model.taxPaidLater)}
            tone="warn"
            sub="Taken from the balance at the retirement rate"
          />
        </div>
      }
      chart={
        <BarChart
          ariaLabel="Spendable balance of Roth versus traditional"
          bars={[
            { label: 'Roth', value: model.rothBalance, color: '#17b26a', emphasis: model.rothWins },
            {
              label: 'Traditional',
              value: model.traditionalAfterTax,
              color: '#2f6fed',
              emphasis: !model.rothWins && !model.tie,
            },
          ]}
          formatValue={(value) => compactCurrency(value)}
        />
      }
      footnote="This compares the same pre-tax dollars. It ignores income limits, required distributions, and the chance that a traditional contribution lowers you into a cheaper bracket. If the retirement rate equals today's rate, the two choices finish even."
    />
  );
}
