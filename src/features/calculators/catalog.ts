
import type { IconName } from './Icon';

export type CalculatorId =
  | 'mortgage'
  | 'affordability'
  | 'auto'
  | 'loan'
  | 'savings'
  | 'invest'
  | 'retirement'
  | 'withdrawal'
  | 'tax'
  | 'self-employed'
  | 'budget'
  | 'networth';

export type CalculatorMeta = {
  id: CalculatorId;
  slug: string;
  goal: string;
  name: string;
  tagline: string;
  blurb: string;
  category: string;
  icon: IconName;
  accent: string;
  keywords: string;
};

export const CATEGORIES = [
  'All',
  'Home & auto',
  'Debt',
  'Saving',
  'Investing',
  'Taxes',
  'Planning',
] as const;

export const CATALOG: CalculatorMeta[] = [
  {
    id: 'mortgage',
    slug: 'mortgage-payment',
    goal: 'Wealth Management',
    name: 'Mortgage payment',
    tagline: 'Payment, interest and amortisation',
    blurb: 'Full PITI payment with taxes, insurance and a year-by-year payoff schedule.',
    category: 'Home & auto',
    icon: 'home',
    accent: '#17b26a',
    keywords: 'home loan house rent buy piti amortisation',
  },
  {
    id: 'affordability',
    slug: 'home-affordability',
    goal: 'Wealth Management',
    name: 'Home affordability',
    tagline: 'How much house your income supports',
    blurb: 'Solve for the maximum price using debt-to-income limits and live rate scenarios.',
    category: 'Home & auto',
    icon: 'bank',
    accent: '#2f6fed',
    keywords: 'afford budget income dti down payment house',
  },
  {
    id: 'auto',
    slug: 'auto-loan',
    goal: 'Early Career Planning',
    name: 'Auto loan',
    tagline: 'Car payment, tax and total cost',
    blurb: 'Roll in trade-in, down payment and sales tax to see the true cost of the car.',
    category: 'Home & auto',
    icon: 'car',
    accent: '#0f9b8e',
    keywords: 'car vehicle finance lease trade in',
  },
  {
    id: 'loan',
    slug: 'debt-payoff',
    goal: 'Early Career Planning',
    name: 'Debt payoff planner',
    tagline: 'Avalanche vs snowball with an end date',
    blurb: 'Add every card and loan, add extra monthly cash and watch the debt-free date move.',
    category: 'Debt',
    icon: 'card',
    accent: '#dc5468',
    keywords: 'credit card debt snowball avalanche minimum payment',
  },
  {
    id: 'savings',
    slug: 'savings-goal',
    goal: 'Early Career Planning',
    name: 'Savings goal',
    tagline: 'How long until you hit the number',
    blurb: 'Time to reach any target at a given rate, plus the monthly amount to get there faster.',
    category: 'Saving',
    icon: 'target',
    accent: '#d98324',
    keywords: 'goal save emergency fund deposit down payment',
  },
  {
    id: 'budget',
    slug: 'budget-builder',
    goal: 'Early Career Planning',
    name: 'Budget builder',
    tagline: '50/30/20 check against reality',
    blurb: 'Split take-home pay into needs, wants and savings and see the gap instantly.',
    category: 'Saving',
    icon: 'pie',
    accent: '#7c5cf0',
    keywords: 'spending monthly cash flow 50/30/20 essentials',
  },
  {
    id: 'invest',
    slug: 'investment-growth',
    goal: 'Wealth Management',
    name: 'Investment growth',
    tagline: 'Compound returns with contributions',
    blurb: 'See what your starting balance plus monthly contributions becomes over any horizon.',
    category: 'Investing',
    icon: 'trending',
    accent: '#17b26a',
    keywords: 'compound index fund etf portfolio brokerage returns',
  },
  {
    id: 'retirement',
    slug: 'retirement-planner',
    goal: 'Retirement Planning',
    name: 'Retirement planner',
    tagline: 'On track, or short by how much?',
    blurb: 'Project to your retirement age and find the monthly amount that closes the gap.',
    category: 'Investing',
    icon: 'clock',
    accent: '#0f9b8e',
    keywords: '401k ira pension nest egg age retire fire',
  },
  {
    id: 'withdrawal',
    slug: 'retirement-drawdown',
    goal: 'Retirement Planning',
    name: 'Retirement drawdown',
    tagline: 'Will the money last?',
    blurb: 'Model withdrawals against returns and inflation to find your safe spending rate.',
    category: 'Investing',
    icon: 'wallet',
    accent: '#2f6fed',
    keywords: '4% rule withdrawal sequence inflation drawdown annuity',
  },
  {
    id: 'tax',
    slug: 'federal-tax-estimator',
    goal: 'Tax Planning',
    name: 'Federal tax estimator',
    tagline: 'Brackets, marginal rate and take-home',
    blurb: '2024 brackets, standard deduction, FICA and effective rate on your income.',
    category: 'Taxes',
    icon: 'receipt',
    accent: '#d98324',
    keywords: 'income tax refund brackets fica withholding filing status',
  },
  {
    id: 'self-employed',
    slug: 'self-employment-tax',
    goal: 'Small Business Planning',
    name: 'Self-employment tax',
    tagline: 'SE tax and quarterly set-aside',
    blurb: 'Compute self-employment tax, the half deduction and what to set aside each quarter.',
    category: 'Taxes',
    icon: 'briefcase',
    accent: '#dc5468',
    keywords: '1099 freelancer contractor quarterly estimated se tax',
  },
  {
    id: 'networth',
    slug: 'net-worth',
    goal: 'High Net Worth',
    name: 'Net worth tracker',
    tagline: 'Assets minus liabilities, at a glance',
    blurb: 'Total up everything you own and owe to see the number that actually matters.',
    category: 'Planning',
    icon: 'shield',
    accent: '#7c5cf0',
    keywords: 'balance sheet assets liabilities wealth progress',
  },
];

export function calculatorById(id: CalculatorId | null): CalculatorMeta | null {
  if (!id) return null;
  return CATALOG.find((entry) => entry.id === id) ?? null;
}

export function calculatorBySlug(slug: string | undefined): CalculatorMeta | null {
  if (!slug) return null;
  return CATALOG.find((entry) => entry.slug === slug) ?? null;
}
