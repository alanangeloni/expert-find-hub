import React, { useMemo } from 'react';
import PanelShell from './PanelShell';
import { useReportSummary } from '../summary';
import NumberField from '../NumberField';
import AreaChart from '../charts/AreaChart';
import { usePersistentState } from '../usePersistentState';
import { calcKey } from '../storage';
import { rentVsBuy } from '../finance';
import { currency, compactCurrency } from '../format';
import Stat from '../Stat';

type Inputs = {
  price: number;
  downPct: number;
  rate: number;
  termYears: number;
  horizonYears: number;
  taxPct: number;
  insurance: number;
  maintenancePct: number;
  hoa: number;
  appreciation: number;
  rent: number;
  rentGrowth: number;
  investReturn: number;
  closingPct: number;
  sellPct: number;
};

const DEFAULTS: Inputs = {
  price: 520000,
  downPct: 20,
  rate: 6.35,
  termYears: 30,
  horizonYears: 7,
  taxPct: 1.15,
  insurance: 1900,
  maintenancePct: 1,
  hoa: 0,
  appreciation: 3,
  rent: 2800,
  rentGrowth: 3,
  investReturn: 6,
  closingPct: 2,
  sellPct: 6,
};

export default function RentBuyPanel() {
  const [v, setV] = usePersistentState<Inputs>(calcKey('rentbuy'), DEFAULTS);
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const model = useMemo(() => rentVsBuy(v), [v]);
  const buyingWins = model.advantage >= 0;

  useReportSummary(
    buyingWins
      ? `Buying ahead by ${currency(model.advantage)} in ${v.horizonYears} years`
      : `Renting ahead by ${currency(Math.abs(model.advantage))} in ${v.horizonYears} years`
  );

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
              max={80}
              onChange={(downPct) => set('downPct', downPct)}
            />
            <NumberField
              label="Mortgage rate"
              value={v.rate}
              suffix="%"
              min={0}
              max={12}
              step={0.05}
              onChange={(rate) => set('rate', rate)}
            />
          </div>
          <div className="field-row">
            <NumberField
              label="Monthly rent"
              value={v.rent}
              prefix="$"
              min={0}
              step={50}
              onChange={(rent) => set('rent', rent)}
            />
            <NumberField
              label="Stay for"
              value={v.horizonYears}
              suffix="yr"
              min={1}
              max={40}
              onChange={(horizonYears) => set('horizonYears', horizonYears)}
            />
          </div>
          <div className="field-row">
            <NumberField
              label="Mortgage term"
              value={v.termYears}
              suffix="yr"
              min={5}
              max={40}
              onChange={(termYears) => set('termYears', termYears)}
            />
            <NumberField
              label="Property tax"
              value={v.taxPct}
              suffix="%"
              min={0}
              max={4}
              step={0.05}
              onChange={(taxPct) => set('taxPct', taxPct)}
            />
          </div>
          <div className="field-row">
            <NumberField
              label="Home appreciation"
              value={v.appreciation}
              suffix="%"
              min={-5}
              max={10}
              step={0.1}
              onChange={(appreciation) => set('appreciation', appreciation)}
            />
            <NumberField
              label="Rent growth"
              value={v.rentGrowth}
              suffix="%"
              min={0}
              max={10}
              step={0.1}
              onChange={(rentGrowth) => set('rentGrowth', rentGrowth)}
            />
          </div>
          <NumberField
            label="Maintenance"
            value={v.maintenancePct}
            suffix="% of value"
            min={0}
            max={3}
            step={0.1}
            onChange={(maintenancePct) => set('maintenancePct', maintenancePct)}
          />
          <NumberField
            label="Return if you invest the difference"
            value={v.investReturn}
            suffix="%"
            min={0}
            max={12}
            step={0.1}
            onChange={(investReturn) => set('investReturn', investReturn)}
            hint="Applied to the down payment if you rent, and to whichever option costs less each month."
          />
        </>
      }
      results={
        <div className="stat-grid">
          <Stat
            label={buyingWins ? 'Buying finishes ahead' : 'Renting finishes ahead'}
            value={currency(Math.abs(model.advantage))}
            sub={`After ${v.horizonYears} years, including selling costs`}
            tone={buyingWins ? 'accent' : 'sky'}
            emphasis
            icon="home"
          />
          <Stat
            label="Monthly cost to own"
            value={currency(model.monthlyOwner)}
            sub={`Rent starts at ${currency(v.rent)}`}
          />
          <Stat
            label="Home equity at the end"
            value={currency(model.equity)}
            tone="sky"
            sub={`Home worth about ${currency(model.homeValue)}`}
          />
          <Stat
            label="Renter's invested cash"
            value={currency(model.renterWealth)}
            sub="Down payment, closing costs, and monthly savings"
          />
        </div>
      }
      chart={
        <AreaChart
          ariaLabel="Wealth from buying versus renting"
          labels={model.series.map((point) => point.year)}
          series={[
            { label: 'Buying', color: '#17b26a', values: model.series.map((point) => point.buyer) },
            { label: 'Renting', color: '#2f6fed', values: model.series.map((point) => point.renter) },
          ]}
          height={220}
          formatX={(value) => `${value.toFixed(0)}y`}
          formatY={(value) => compactCurrency(value)}
        />
      }
      footnote="Insurance is $1,900 a year, HOA is $0, closing costs are 2% of the price, and selling costs are 6%. The renter invests the down payment and closing costs, and whoever pays less each month invests the difference. This is a planning model, not a prediction of your market."
    />
  );
}
