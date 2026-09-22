
/** Pure financial math helpers shared by every calculator. */

export type AmortRow = {
  period: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
};

/** Classic amortising payment (monthly). */
export function monthlyPayment(principal: number, annualRatePct: number, years: number): number {
  const periods = Math.round(years * 12);
  if (principal <= 0 || periods <= 0) return 0;
  const rate = annualRatePct / 100 / 12;
  if (rate === 0) return principal / periods;
  return (principal * rate) / (1 - Math.pow(1 + rate, -periods));
}

export function amortization(
  principal: number,
  annualRatePct: number,
  years: number,
  extraMonthly = 0
): AmortRow[] {
  const monthlyRate = annualRatePct / 100 / 12;
  const base = monthlyPayment(principal, annualRatePct, years);
  const payment = base + extraMonthly;
  const rows: AmortRow[] = [];
  let balance = principal;

  for (let period = 1; period <= 720 && balance > 0.005; period += 1) {
    const interest = balance * monthlyRate;
    let principalPart = payment - interest;
    if (principalPart <= 0) break;
    if (principalPart > balance) principalPart = balance;
    balance -= principalPart;
    rows.push({
      period,
      payment: principalPart + interest,
      interest,
      principal: principalPart,
      balance: Math.max(balance, 0),
    });
  }

  return rows;
}

export type GrowthPoint = { year: number; value: number; contributed: number };

export type GrowthResult = {
  value: number;
  contributed: number;
  interest: number;
  series: GrowthPoint[];
};

/** Future value with monthly contributions compounded monthly. */
export function futureValueSeries(opts: {
  initial: number;
  monthly: number;
  annualRatePct: number;
  years: number;
}): GrowthResult {
  const { initial, monthly, annualRatePct } = opts;
  const months = Math.max(0, Math.round(opts.years * 12));
  const rate = annualRatePct / 100 / 12;
  let balance = initial;
  let contributed = initial;
  const series: GrowthPoint[] = [{ year: 0, value: balance, contributed }];

  for (let month = 1; month <= months; month += 1) {
    balance = balance * (1 + rate) + monthly;
    contributed += monthly;
    if (month % 12 === 0) series.push({ year: month / 12, value: balance, contributed });
  }

  if (months % 12 !== 0) {
    series.push({ year: months / 12, value: balance, contributed });
  }

  return { value: balance, contributed, interest: balance - contributed, series };
}

/** Monthly contribution required to reach a target balance. */
export function requiredMonthly(opts: {
  initial: number;
  annualRatePct: number;
  years: number;
  target: number;
}): number {
  const { initial, annualRatePct, target } = opts;
  const months = Math.max(0, Math.round(opts.years * 12));
  if (months <= 0) return 0;
  const rate = annualRatePct / 100 / 12;
  if (rate === 0) return Math.max(0, (target - initial) / months);
  const grownInitial = initial * Math.pow(1 + rate, months);
  const needed = target - grownInitial;
  if (needed <= 0) return 0;
  return (needed * rate) / (Math.pow(1 + rate, months) - 1);
}

/** Months until a savings balance reaches a target (capped at 100 years). */
export function monthsToGoal(opts: {
  current: number;
  monthly: number;
  annualRatePct: number;
  target: number;
}): { months: number; reached: boolean } {
  const { current, monthly, annualRatePct, target } = opts;
  if (current >= target) return { months: 0, reached: true };
  const rate = annualRatePct / 100 / 12;
  let balance = current;
  for (let month = 1; month <= 1200; month += 1) {
    balance = balance * (1 + rate) + monthly;
    if (balance >= target) return { months: month, reached: true };
    if (rate === 0 && monthly <= 0) break;
  }
  return { months: 1200, reached: false };
}

/* ------------------------------- debt payoff ------------------------------ */

export type Debt = {
  id: string;
  name: string;
  balance: number;
  apr: number;
  min: number;
};

export type PayoffResult = {
  months: number;
  totalInterest: number;
  totalPaid: number;
  order: { id: string; name: string; month: number }[];
  balanceSeries: number[];
  cleared: boolean;
};

export function simulatePayoff(
  debts: Debt[],
  extraMonthly: number,
  strategy: 'avalanche' | 'snowball'
): PayoffResult {
  const working = debts
    .filter((debt) => debt.balance > 0.01)
    .map((debt) => ({ ...debt }));
  const budget =
    working.reduce((sum, debt) => sum + Math.max(0, debt.min), 0) + Math.max(0, extraMonthly);

  const order: PayoffResult['order'] = [];
  const balanceSeries: number[] = [];
  let totalInterest = 0;
  let totalPaid = 0;
  let months = 0;

  for (let month = 1; month <= 600; month += 1) {
    if (!working.some((debt) => debt.balance > 0.005)) break;
    months = month;

    for (const debt of working) {
      if (debt.balance <= 0) continue;
      const interest = debt.balance * (debt.apr / 100 / 12);
      debt.balance += interest;
      totalInterest += interest;
    }

    let pool = budget;
    for (const debt of working) {
      if (debt.balance <= 0) continue;
      const pay = Math.min(debt.min, debt.balance);
      debt.balance -= pay;
      pool -= pay;
      totalPaid += pay;
    }

    const active = working
      .filter((debt) => debt.balance > 0.005)
      .sort((a, b) =>
        strategy === 'avalanche' ? b.apr - a.apr : a.balance - b.balance
      );

    for (const debt of active) {
      if (pool <= 0.005) break;
      const pay = Math.min(pool, debt.balance);
      debt.balance -= pay;
      pool -= pay;
      totalPaid += pay;
    }

    for (const debt of working) {
      if (debt.balance <= 0.005 && !order.some((entry) => entry.id === debt.id)) {
        order.push({ id: debt.id, name: debt.name || 'Debt', month });
        debt.balance = 0;
      }
    }

    balanceSeries.push(working.reduce((sum, debt) => sum + Math.max(debt.balance, 0), 0));
  }

  const cleared = working.every((debt) => debt.balance <= 0.005);
  return { months, totalInterest, totalPaid, order, balanceSeries, cleared };
}

/* --------------------------------- taxes --------------------------------- */

export type FilingStatus = 'single' | 'mfj' | 'hoh';

export const STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 14600,
  mfj: 29200,
  hoh: 21900,
};

export const FILING_LABEL: Record<FilingStatus, string> = {
  single: 'Single',
  mfj: 'Married filing jointly',
  hoh: 'Head of household',
};

/** [start of bracket, rate %] — 2024 federal rates. */
const BRACKETS: Record<FilingStatus, [number, number][]> = {
  single: [
    [0, 10],
    [11600, 12],
    [47150, 22],
    [100525, 24],
    [191950, 32],
    [243725, 35],
    [609350, 37],
  ],
  mfj: [
    [0, 10],
    [23200, 12],
    [94300, 22],
    [201050, 24],
    [383900, 32],
    [487450, 35],
    [731200, 37],
  ],
  hoh: [
    [0, 10],
    [16550, 12],
    [63100, 22],
    [100500, 24],
    [191950, 32],
    [243700, 35],
    [609350, 37],
  ],
};

export type BracketRow = { rate: number; from: number; to: number; amount: number; tax: number };

export function federalTax(
  status: FilingStatus,
  taxableIncome: number
): { tax: number; marginal: number; rows: BracketRow[] } {
  const income = Math.max(0, taxableIncome);
  const table = BRACKETS[status];
  const rows: BracketRow[] = [];
  let tax = 0;
  let marginal = table[0][1];

  table.forEach(([start, rate], index) => {
    const next = index + 1 < table.length ? table[index + 1][0] : Infinity;
    const amount = Math.max(0, Math.min(income, next) - start);
    const sliceTax = (amount * rate) / 100;
    tax += sliceTax;
    if (amount > 0) marginal = rate;
    rows.push({ rate, from: start, to: next, amount, tax: sliceTax });
  });

  return { tax, marginal, rows };
}

export function ficaTax(status: FilingStatus, wages: number): number {
  const income = Math.max(0, wages);
  const socialSecurity = Math.min(income, 168600) * 0.062;
  const medicare = income * 0.0145;
  const threshold = status === 'mfj' ? 250000 : 200000;
  const additional = Math.max(0, income - threshold) * 0.009;
  return socialSecurity + medicare + additional;
}
