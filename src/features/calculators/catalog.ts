
import type { IconName } from './Icon';

export type CalculatorId =
  | 'mortgage'
  | 'affordability'
  | 'auto'
  | 'refinance'
  | 'rentbuy'
  | 'loan'
  | 'savings'
  | 'invest'
  | 'retirement'
  | 'withdrawal'
  | 'match401k'
  | 'fees'
  | 'tax'
  | 'self-employed'
  | 'roth'
  | 'budget'
  | 'networth'
  | 'college'
  | 'inflation'
  | 'insurance';

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
    id: 'refinance',
    slug: 'refinance-break-even',
    goal: 'Wealth Management',
    name: 'Refinance break-even',
    tagline: 'When a lower rate pays for itself',
    blurb: 'Compare your current mortgage with a new rate and see the month the closing costs are covered.',
    category: 'Home & auto',
    icon: 'bank',
    accent: '#2f6fed',
    keywords: 'refinance mortgage rate closing costs break even',
  },
  {
    id: 'rentbuy',
    slug: 'rent-vs-buy',
    goal: 'Wealth Management',
    name: 'Rent vs buy',
    tagline: 'Which one leaves you ahead',
    blurb: 'Compare the wealth from buying a home with the wealth from renting and investing the difference.',
    category: 'Home & auto',
    icon: 'home',
    accent: '#17b26a',
    keywords: 'rent buy house mortgage opportunity cost',
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
    id: 'match401k',
    slug: '401k-match',
    goal: 'Retirement Planning',
    name: '401(k) match',
    tagline: 'Your contribution plus the employer match',
    blurb: 'See the balance a salary deferral and employer match can reach, and whether match dollars are left behind.',
    category: 'Investing',
    icon: 'trending',
    accent: '#0f9b8e',
    keywords: '401k employer match contribution retirement deferral',
  },
  {
    id: 'fees',
    slug: 'investment-fees',
    goal: 'Wealth Management',
    name: 'Investment fees',
    tagline: 'What a higher fee costs over time',
    blurb: 'Compare the same portfolio at two annual fees and see the dollars the higher fee keeps.',
    category: 'Investing',
    icon: 'percent',
    accent: '#dc5468',
    keywords: 'expense ratio advisory fee aum cost drag',
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
    id: 'roth',
    slug: 'roth-vs-traditional',
    goal: 'Tax Planning',
    name: 'Roth vs traditional',
    tagline: 'Which account leaves more after tax',
    blurb: 'Put the same pre-tax dollars in a Roth or a traditional account and compare the spendable balance.',
    category: 'Taxes',
    icon: 'receipt',
    accent: '#7c5cf0',
    keywords: 'roth ira traditional 401k tax bracket retirement',
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
  {
    id: 'college',
    slug: 'college-savings',
    goal: 'Education Planning',
    name: 'College savings',
    tagline: 'Monthly savings for a future tuition bill',
    blurb: "Inflate today's college cost across the years in school and find the monthly savings that covers it.",
    category: 'Planning',
    icon: 'bookmark',
    accent: '#7c5cf0',
    keywords: '529 college tuition education savings inflation',
  },
  {
    id: 'inflation',
    slug: 'inflation',
    goal: 'Wealth Management',
    name: 'Inflation',
    tagline: 'Future cost and buying power',
    blurb: "See what today's dollars cost later, or what a sum you hold today will buy after inflation.",
    category: 'Planning',
    icon: 'percent',
    accent: '#d98324',
    keywords: 'inflation purchasing power cost of living cpi',
  },
  {
    id: 'insurance',
    slug: 'life-insurance',
    goal: 'Insurance Planning',
    name: 'Life insurance needs',
    tagline: 'Income replacement after what you already have',
    blurb: 'Estimate coverage from years of income, debts, and goals, then subtract savings and policies you already own.',
    category: 'Planning',
    icon: 'shield',
    accent: '#2f6fed',
    keywords: 'life insurance income replacement term coverage',
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
