
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

/* ---------------------------- refinance --------------------------------- */

export type RefinanceResult = {
  currentPayment: number;
  newPayment: number;
  monthlySavings: number;
  breakEvenMonths: number | null;
  currentInterest: number;
  newInterest: number;
  interestSaved: number;
  netOfClosing: number;
  currentMonths: number;
  newMonths: number;
};

/** Compare the remaining loan with a new rate. Closing costs are paid up front, not rolled in. */
export function refinanceComparison(opts: {
  balance: number;
  currentRate: number;
  yearsLeft: number;
  newRate: number;
  newYears: number;
  closingCosts: number;
}): RefinanceResult {
  const balance = Math.max(0, opts.balance);
  const currentSchedule = amortization(balance, opts.currentRate, opts.yearsLeft);
  const newSchedule = amortization(balance, opts.newRate, opts.newYears);
  const currentPayment = monthlyPayment(balance, opts.currentRate, opts.yearsLeft);
  const newPayment = monthlyPayment(balance, opts.newRate, opts.newYears);
  const monthlySavings = currentPayment - newPayment;
  const closing = Math.max(0, opts.closingCosts);
  const breakEvenMonths = monthlySavings > 1 ? Math.ceil(closing / monthlySavings) : null;
  const currentInterest = currentSchedule.reduce((sum, row) => sum + row.interest, 0);
  const newInterest = newSchedule.reduce((sum, row) => sum + row.interest, 0);
  const interestSaved = currentInterest - newInterest;

  return {
    currentPayment,
    newPayment,
    monthlySavings,
    breakEvenMonths,
    currentInterest,
    newInterest,
    interestSaved,
    netOfClosing: interestSaved - closing,
    currentMonths: currentSchedule.length,
    newMonths: newSchedule.length,
  };
}

/* ----------------------------- rent vs buy ------------------------------ */

export type RentBuyPoint = { year: number; buyer: number; renter: number };

export type RentBuyResult = {
  downPayment: number;
  closingCosts: number;
  monthlyOwner: number;
  loan: number;
  buyerWealth: number;
  renterWealth: number;
  equity: number;
  homeValue: number;
  balance: number;
  ownerSpent: number;
  rentSpent: number;
  advantage: number;
  series: RentBuyPoint[];
};

/**
 * Compare buying and renting over a horizon.
 * Whoever spends less each month invests the difference.
 * The renter also invests the cash the buyer used for the down payment and closing costs.
 */
export function rentVsBuy(opts: {
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
}): RentBuyResult {
  const price = Math.max(0, opts.price);
  const downPayment = price * (Math.max(0, opts.downPct) / 100);
  const closingCosts = price * (Math.max(0, opts.closingPct) / 100);
  const loan0 = Math.max(0, price - downPayment);
  const monthlyRate = opts.rate / 100 / 12;
  const payment = monthlyPayment(loan0, opts.rate, opts.termYears);
  const investRate = opts.investReturn / 100 / 12;
  const months = Math.max(0, Math.round(opts.horizonYears * 12));

  let value = price;
  let balance = loan0;
  let rentNow = Math.max(0, opts.rent);
  let buyerPort = 0;
  let renterPort = downPayment + closingCosts;
  let ownerSpent = downPayment + closingCosts;
  let rentSpent = 0;
  const ownerMonth = (home: number, mortgage: number) => {
    const tax = (home * Math.max(0, opts.taxPct)) / 100 / 12;
    const ins = Math.max(0, opts.insurance) / 12;
    const maint = (home * Math.max(0, opts.maintenancePct)) / 100 / 12;
    return mortgage + tax + ins + maint + Math.max(0, opts.hoa);
  };
  const monthlyOwner = ownerMonth(price, loan0 > 0 ? payment : 0);
  const openingEquity = Math.max(0, price * (1 - opts.sellPct / 100) - loan0);
  const series: RentBuyPoint[] = [{ year: 0, buyer: openingEquity, renter: renterPort }];

  for (let month = 1; month <= months; month += 1) {
    let mortgage = 0;
    if (balance > 0.5) {
      const interest = balance * monthlyRate;
      let principal = payment - interest;
      if (principal <= 0) break;
      if (principal > balance) principal = balance;
      balance -= principal;
      mortgage = principal + interest;
    }

    const owner = ownerMonth(value, mortgage);
    const budget = Math.max(owner, rentNow);
    buyerPort = buyerPort * (1 + investRate) + (budget - owner);
    renterPort = renterPort * (1 + investRate) + (budget - rentNow);
    ownerSpent += owner;
    rentSpent += rentNow;

    if (month % 12 === 0) {
      value *= 1 + opts.appreciation / 100;
      rentNow *= 1 + opts.rentGrowth / 100;
      const equity = Math.max(0, value * (1 - opts.sellPct / 100) - balance);
      series.push({ year: month / 12, buyer: buyerPort + equity, renter: renterPort });
    }
  }

  const equity = Math.max(0, value * (1 - opts.sellPct / 100) - balance);
  const buyerWealth = buyerPort + equity;

  return {
    downPayment,
    closingCosts,
    monthlyOwner,
    loan: loan0,
    buyerWealth,
    renterWealth: renterPort,
    equity,
    homeValue: value,
    balance,
    ownerSpent,
    rentSpent,
    advantage: buyerWealth - renterPort,
    series,
  };
}

/* -------------------------------- 401(k) -------------------------------- */

/** 2024 employee elective deferral limit, matching the tax estimator's tax year. */
export const EMPLOYEE_DEFERRAL_LIMIT = 23000;

export type MatchResult = {
  balance: number;
  employee: number;
  employer: number;
  thisYearEmployee: number;
  thisYearEmployer: number;
  leftOnTable: number;
  capped: boolean;
  series: GrowthPoint[];
};

export function match401k(opts: {
  salary: number;
  contribPct: number;
  matchRatePct: number;
  matchUpToPct: number;
  balance: number;
  returnPct: number;
  years: number;
  salaryGrowth: number;
}): MatchResult {
  const years = Math.max(0, Math.round(opts.years));
  const monthlyRate = opts.returnPct / 100 / 12;
  let balance = Math.max(0, opts.balance);
  let salary = Math.max(0, opts.salary);
  let employee = 0;
  let employer = 0;
  let thisYearEmployee = 0;
  let thisYearEmployer = 0;
  let leftOnTable = 0;
  let capped = false;
  const series: GrowthPoint[] = [{ year: 0, value: balance, contributed: opts.balance }];

  for (let year = 1; year <= years; year += 1) {
    const wanted = salary * (Math.max(0, opts.contribPct) / 100);
    const employeeAnnual = Math.min(wanted, EMPLOYEE_DEFERRAL_LIMIT);
    if (wanted > EMPLOYEE_DEFERRAL_LIMIT) capped = true;
    const matchedPct = Math.min(Math.max(0, opts.contribPct), Math.max(0, opts.matchUpToPct));
    const employerAnnual = salary * (Math.max(0, opts.matchRatePct) / 100) * (matchedPct / 100);
    const fullMatch = salary * (Math.max(0, opts.matchRatePct) / 100) * (Math.max(0, opts.matchUpToPct) / 100);

    if (year === 1) {
      thisYearEmployee = employeeAnnual;
      thisYearEmployer = employerAnnual;
      leftOnTable = Math.max(0, fullMatch - employerAnnual);
    }

    const monthlyEmployee = employeeAnnual / 12;
    const monthlyEmployer = employerAnnual / 12;
    for (let month = 0; month < 12; month += 1) {
      balance = balance * (1 + monthlyRate) + monthlyEmployee + monthlyEmployer;
    }
    employee += employeeAnnual;
    employer += employerAnnual;
    series.push({ year, value: balance, contributed: opts.balance + employee + employer });
    salary *= 1 + opts.salaryGrowth / 100;
  }

  return {
    balance,
    employee,
    employer,
    thisYearEmployee,
    thisYearEmployer,
    leftOnTable,
    capped,
    series,
  };
}

/* -------------------------- Roth vs traditional ------------------------- */

export type RothResult = {
  traditionalBalance: number;
  traditionalAfterTax: number;
  rothBalance: number;
  taxPaidNow: number;
  taxPaidLater: number;
  advantage: number;
  rothWins: boolean;
  tie: boolean;
  seriesTraditional: number[];
  seriesRoth: number[];
};

/** Same pre-tax dollars. Roth is funded with the after-tax remainder and is not taxed later. */
export function rothVsTraditional(opts: {
  annual: number;
  currentRate: number;
  retirementRate: number;
  returnPct: number;
  years: number;
}): RothResult {
  const annual = Math.max(0, opts.annual);
  const current = Math.min(60, Math.max(0, opts.currentRate)) / 100;
  const later = Math.min(60, Math.max(0, opts.retirementRate)) / 100;
  const years = Math.max(0, Math.round(opts.years));
  const rothAnnual = annual * (1 - current);
  const traditional = futureValueSeries({
    initial: 0,
    monthly: annual / 12,
    annualRatePct: opts.returnPct,
    years,
  });
  const roth = futureValueSeries({
    initial: 0,
    monthly: rothAnnual / 12,
    annualRatePct: opts.returnPct,
    years,
  });
  const traditionalAfterTax = traditional.value * (1 - later);
  const advantage = roth.value - traditionalAfterTax;

  return {
    traditionalBalance: traditional.value,
    traditionalAfterTax,
    rothBalance: roth.value,
    taxPaidNow: annual * current * years,
    taxPaidLater: traditional.value * later,
    advantage,
    rothWins: advantage > 1,
    tie: Math.abs(advantage) <= 1,
    seriesTraditional: traditional.series.map((point) => point.value * (1 - later)),
    seriesRoth: roth.series.map((point) => point.value),
  };
}

/* ------------------------------ college --------------------------------- */

export function collegeCosts(opts: {
  annualCost: number;
  yearsUntil: number;
  yearsInSchool: number;
  inflation: number;
}): { total: number; firstYear: number; years: number[] } {
  const count = Math.max(0, Math.round(opts.yearsInSchool));
  const years: number[] = [];
  for (let year = 0; year < count; year += 1) {
    years.push(Math.max(0, opts.annualCost) * Math.pow(1 + opts.inflation / 100, opts.yearsUntil + year));
  }
  return {
    total: years.reduce((sum, cost) => sum + cost, 0),
    firstYear: years[0] ?? 0,
    years,
  };
}

/* ------------------------------ inflation ------------------------------- */

export function inflate(amount: number, ratePct: number, years: number): {
  futureCost: number;
  purchasingPower: number;
  factor: number;
} {
  const factor = Math.pow(1 + ratePct / 100, Math.max(0, years));
  const safe = Math.max(0, amount);
  return {
    futureCost: safe * factor,
    purchasingPower: factor === 0 ? safe : safe / factor,
    factor,
  };
}

/* --------------------------- life insurance ----------------------------- */

export function insuranceNeed(opts: {
  income: number;
  years: number;
  debts: number;
  goals: number;
  assets: number;
  existing: number;
}): { incomeNeed: number; gross: number; offsets: number; need: number } {
  const incomeNeed = Math.max(0, opts.income) * Math.max(0, opts.years);
  const debts = Math.max(0, opts.debts);
  const goals = Math.max(0, opts.goals);
  const offsets = Math.max(0, opts.assets) + Math.max(0, opts.existing);
  const gross = incomeNeed + debts + goals;
  return { incomeNeed, gross, offsets, need: Math.max(0, gross - offsets) };
}

/* ------------------------------ fee drag -------------------------------- */

export function feeDrag(opts: {
  initial: number;
  monthly: number;
  grossReturn: number;
  lowFee: number;
  highFee: number;
  years: number;
}): { low: GrowthResult; high: GrowthResult; gap: number } {
  const low = futureValueSeries({
    initial: opts.initial,
    monthly: opts.monthly,
    annualRatePct: opts.grossReturn - opts.lowFee,
    years: opts.years,
  });
  const high = futureValueSeries({
    initial: opts.initial,
    monthly: opts.monthly,
    annualRatePct: opts.grossReturn - opts.highFee,
    years: opts.years,
  });
  return { low, high, gap: low.value - high.value };
}
