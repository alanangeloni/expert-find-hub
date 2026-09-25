import { useState, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import './calculators.css';
import Icon from './Icon';
import { CalculatorId, calculatorById } from './catalog';
import { calcKey } from './storage';
import { persistence } from './persistence';
import { saveHandoff } from './handoff';
import { SummaryContext } from './summary';
import MortgagePanel from './panels/MortgagePanel';
import AffordabilityPanel from './panels/AffordabilityPanel';
import AutoPanel from './panels/AutoPanel';
import LoanPanel from './panels/LoanPanel';
import SavingsPanel from './panels/SavingsPanel';
import BudgetPanel from './panels/BudgetPanel';
import InvestPanel from './panels/InvestPanel';
import RetirementPanel from './panels/RetirementPanel';
import WithdrawalPanel from './panels/WithdrawalPanel';
import TaxPanel from './panels/TaxPanel';
import SelfEmployedPanel from './panels/SelfEmployedPanel';
import NetWorthPanel from './panels/NetWorthPanel';
import RefinancePanel from './panels/RefinancePanel';
import RentBuyPanel from './panels/RentBuyPanel';
import Match401kPanel from './panels/Match401kPanel';
import RothPanel from './panels/RothPanel';
import CollegePanel from './panels/CollegePanel';
import InflationPanel from './panels/InflationPanel';
import InsurancePanel from './panels/InsurancePanel';
import FeesPanel from './panels/FeesPanel';

const PANELS: Record<CalculatorId, ComponentType> = {
  mortgage: MortgagePanel,
  affordability: AffordabilityPanel,
  auto: AutoPanel,
  loan: LoanPanel,
  savings: SavingsPanel,
  budget: BudgetPanel,
  invest: InvestPanel,
  retirement: RetirementPanel,
  withdrawal: WithdrawalPanel,
  tax: TaxPanel,
  'self-employed': SelfEmployedPanel,
  networth: NetWorthPanel,
  refinance: RefinancePanel,
  rentbuy: RentBuyPanel,
  match401k: Match401kPanel,
  roth: RothPanel,
  college: CollegePanel,
  inflation: InflationPanel,
  insurance: InsurancePanel,
  fees: FeesPanel,
};

type Props = {
  id: CalculatorId;
  embed?: boolean;
  showHeader?: boolean;
};

export default function CalculatorTool({ id, embed = false, showHeader = true }: Props) {
  const meta = calculatorById(id);
  const [summary, setSummary] = useState('');
  const [resetToken, setResetToken] = useState(0);

  if (!meta) return null;
  const Panel = PANELS[id];

  const reset = async () => {
    await persistence.removeItem(calcKey(id));
    setResetToken((token) => token + 1);
  };

  return (
    <SummaryContext.Provider value={setSummary}>
      <div className={embed ? "fp-calc fp-calc--embed" : "calc-tool"}>
        <div className={embed ? "fp-tool" : "fp-calc fp-calc--page"}>
          <div className="fp-tool">
            {showHeader && (
              <header className="fp-tool__head">
                <span className="fp-tool__icon" style={{ color: meta.accent, borderColor: `${meta.accent}44` }}>
                  <Icon name={meta.icon} size={20} />
                </span>
                <div>
                  <span className="fp-tool__cat">{meta.category}</span>
                  <h2 className="fp-tool__title">{meta.name}</h2>
                  <p className="fp-tool__tagline">{meta.tagline}</p>
                </div>
              </header>
            )}
            <Panel key={`${id}-${resetToken}`} />
          </div>
        </div>
        <footer className={embed ? "fp-tool__foot" : "calc-tool__foot"}>
          <button type="button" className="btn btn--outline btn--md" onClick={reset}>
            Reset
          </button>
          <Link
            to={`/?calculator=${meta.slug}#match`}
            className="btn btn--green btn--md"
            onClick={() => saveHandoff(meta, summary)}
          >
            Use these numbers
          </Link>
        </footer>
      </div>
    </SummaryContext.Provider>
  );
}
