import type { CalculatorId } from './catalog';

export type GuideSection = { heading: string; body: string };
export type GuideTerm = { term: string; definition: string };
export type GuideFaq = { q: string; a: string };

export type CalculatorGuide = {
  howTo: string[];
  result: string;
  howItWorks: GuideSection[];
  example: { title: string; setup: string; result: string };
  terms: GuideTerm[];
  tips: string[];
  faqs: GuideFaq[];
  assumptions: string[];
};

const GUIDES: Record<CalculatorId, CalculatorGuide> = {
  mortgage: {
    howTo: [
      'Enter the price, down payment, and the rate you were quoted.',
      'Add property tax, homeowners insurance, and any HOA dues. Those are part of the real monthly bill.',
      'Read the full monthly payment first, then the principal-and-interest piece underneath it.',
      'Use the payoff chart to see how slowly the balance falls in the early years.',
    ],
    result:
      'The headline number is PITI: principal, interest, taxes, and insurance, plus HOA if you entered one. The loan payment alone is smaller. In the first years most of that loan payment is interest, so the balance drops slowly even when you pay on time.',
    howItWorks: [
      {
        heading: 'The loan payment',
        body: 'The calculator amortizes the amount you borrow over the term at a fixed monthly rate. Each payment covers that month’s interest first. Whatever is left reduces the principal. A 30-year loan keeps the payment lower by stretching the interest over more months.',
      },
      {
        heading: 'Taxes and insurance',
        body: 'Property tax is the home price times your tax rate, divided by 12. Insurance is the annual premium divided by 12. Lenders usually collect both in escrow, so the amount you send each month is larger than the loan payment.',
      },
      {
        heading: 'Why the balance lingers',
        body: 'Interest is charged on the remaining balance. Early on, the balance is large, so interest takes most of the payment. Later, the same payment retires principal faster. Extra principal payments skip the interest that would have been charged on that amount.',
      },
    ],
    example: {
      title: 'A $520,000 home with 20% down',
      setup:
        'The defaults use a $520,000 price, a 20% down payment, a 6.35% rate, a 30-year term, property tax of 1.15%, and $1,900 of insurance a year.',
      result:
        'You borrow $416,000. Principal and interest are about $2,589 a month. With tax and insurance the housing payment is about $3,245. Over the full term the interest adds up to about $516,000.',
    },
    terms: [
      { term: 'PITI', definition: 'Principal, interest, taxes, and insurance. The monthly housing cost lenders look at.' },
      { term: 'Amortization', definition: 'The schedule that splits each payment into interest and principal until the balance is zero.' },
      { term: 'Down payment', definition: 'Cash paid at purchase. It reduces the amount you borrow and your loan-to-value ratio.' },
      { term: 'Escrow', definition: 'The portion of the payment the lender holds to pay property tax and insurance for you.' },
    ],
    tips: [
      'Compare homes on the full payment, not the principal-and-interest line.',
      'A shorter term raises the payment and cuts total interest.',
      'Quotes change. Re-run the calculator with the rate from your loan estimate.',
      'Private mortgage insurance is not included. It applies on many loans with less than 20% down.',
    ],
    faqs: [
      {
        q: 'Does this include private mortgage insurance?',
        a: 'No. The payment includes principal, interest, property tax, homeowners insurance, and HOA dues. Add PMI separately if your down payment is under 20%.',
      },
      {
        q: 'Why is so much of the first payment interest?',
        a: 'Interest is calculated on the full remaining balance. At the start, that balance is the entire loan, so interest is the largest slice of the payment.',
      },
      {
        q: 'Should I use the purchase price or the appraised value for tax?',
        a: 'Use the price as a starting estimate. Local assessments can differ, and tax rates change. Your loan estimate is the better source once you have one.',
      },
      {
        q: 'Is a 15-year loan always better?',
        a: 'It costs less in interest if you can afford the higher payment without skipping other goals. A payment that strains the rest of the budget can cost more than the interest you save.',
      },
    ],
    assumptions: [
      'The rate stays fixed for the whole term.',
      'Tax and insurance stay flat. In practice both tend to rise.',
      'Payments are made every month, with no extra principal.',
      'PMI, closing costs, and repairs are not in the monthly total.',
    ],
  },
  affordability: {
    howTo: [
      'Enter gross annual income, not take-home pay.',
      'Add the monthly debt payments you already have: car, student loans, and card minimums.',
      'Enter the cash you can put down.',
      'Read the maximum price, then check which debt-to-income limit set it.',
    ],
    result:
      'The price is the most expensive home whose monthly housing cost still fits both a front-end limit (housing versus income) and a back-end limit (housing plus other debts versus income). The tighter of the two limits wins. A higher rate or a higher tax and insurance allowance lowers the price even when your income stays the same.',
    howItWorks: [
      {
        heading: 'Two debt-to-income caps',
        body: 'The front-end ratio limits the housing payment to a share of gross monthly income. The default is 28%. The back-end ratio limits housing plus your other monthly debts. The default is 36%. The calculator uses whichever budget is smaller.',
      },
      {
        heading: 'From a payment to a price',
        body: 'It solves the mortgage formula backward. Part of the monthly budget has to cover property tax and insurance, estimated here at 1.45% of the price per year. The rest can support a loan. Adding your down payment produces the home price.',
      },
      {
        heading: 'Why the rate matters so much',
        body: 'The same monthly budget buys less house when the rate is higher, because more of each payment is interest. The rate scenarios next to the result show that swing without changing your income.',
      },
    ],
    example: {
      title: 'Income of $132,000 and $60,000 down',
      setup:
        'The defaults use $132,000 of gross income, $650 of other monthly debt, $60,000 down, a 6.35% rate, and a 30-year term. The front-end cap is 28% and the back-end cap is 36%.',
      result:
        'The housing budget is about $3,080 a month, set by the 28% front-end limit. That supports a home price of about $465,000.',
    },
    terms: [
      { term: 'Front-end ratio', definition: 'Housing payment divided by gross monthly income.' },
      { term: 'Back-end ratio', definition: 'Housing plus other debt payments, divided by gross monthly income.' },
      { term: 'Gross income', definition: 'Income before taxes and other paycheck deductions.' },
      { term: 'DTI', definition: 'Debt-to-income. Lenders use it to decide how large a payment you can carry.' },
    ],
    tips: [
      'A lender’s maximum is not the same as a comfortable payment. Try a lower ratio if the result feels tight.',
      'Paying down a car loan before you apply can raise the price the back-end ratio allows.',
      'Keep cash for closing costs and a reserve. The down payment field is not your entire cash need.',
      'Re-run the tool when a lender quotes a different rate.',
    ],
    faqs: [
      {
        q: 'Why is this lower than what a lender pre-approved?',
        a: 'Lenders can use higher ratios, and this estimate holds back 1.45% of the price for tax and insurance. A pre-approval also depends on credit, assets, and the specific loan program.',
      },
      {
        q: 'Does the down payment include closing costs?',
        a: 'No. Closing costs are separate cash. If you spend part of your savings on them, reduce the down payment in the calculator.',
      },
      {
        q: 'What debts should I include?',
        a: 'Include monthly payments that will still exist when you buy: auto loans, student loans, personal loans, and credit card minimums. Do not include the new mortgage. Utilities and groceries are not debts.',
      },
      {
        q: 'Can I afford more if I choose a 15-year loan?',
        a: 'Usually the opposite. A shorter term raises the payment, so the same income supports a smaller loan.',
      },
    ],
    assumptions: [
      'Tax and insurance together are estimated at 1.45% of the price per year.',
      'The rate is fixed and the term is the one you entered.',
      'Income is gross, before taxes.',
      'HOA dues, PMI, and maintenance are not in the housing budget.',
    ],
  },
  auto: {
    howTo: [
      'Enter the vehicle price before tax.',
      'Subtract the down payment and the trade-in. Add sales tax and fees so the amount financed is the real loan.',
      'Set the APR and the number of months.',
      'Compare the monthly payment with the total interest. A low payment can hide a long, expensive loan.',
    ],
    result:
      'The payment is the amount financed, spread over the term at the APR. The amount financed is the price, plus sales tax on the price after the trade-in, plus fees, minus cash down and the trade-in. Total interest is every payment combined, minus the amount you borrowed.',
    howItWorks: [
      {
        heading: 'What actually gets financed',
        body: 'Dealers often quote a payment before tax, fees, and the trade-in are settled. This calculator rolls those in first. Sales tax is charged on the price minus the trade-in, which is how many states tax a vehicle purchase.',
      },
      {
        heading: 'Term versus total cost',
        body: 'A longer term lowers the payment and raises the interest, and it keeps you upside down longer because the car depreciates faster than a long loan pays down.',
      },
      {
        heading: 'APR is the cost of borrowing',
        body: 'The APR includes interest. It is not the same as a promotional “payment.” A rate that looks ordinary on a large balance still produces thousands of dollars of interest over five or six years.',
      },
    ],
    example: {
      title: 'A $42,000 car financed for five years',
      setup:
        'The defaults use a $42,000 price, $4,000 down, a $6,500 trade-in, 6.5% sales tax, $650 of fees, and a 7.2% APR for 60 months.',
      result:
        'Sales tax is about $2,308. The amount financed is about $34,458. The payment is about $686 a month, and the interest over the loan is about $6,676.',
    },
    terms: [
      { term: 'APR', definition: 'Annual percentage rate. The yearly cost of borrowing, used here as the loan interest rate.' },
      { term: 'Amount financed', definition: 'Price plus tax and fees, minus the down payment and trade-in.' },
      { term: 'Trade-in', definition: 'The value the dealer credits for your current car. It reduces both the price that is taxed and the loan.' },
      { term: 'Upside down', definition: 'Owing more than the car is worth. Long terms make this more likely in the early years.' },
    ],
    tips: [
      'Get the out-the-door price before you negotiate the monthly payment.',
      'A larger down payment lowers the payment and the chance of owing more than the car is worth.',
      'Check the rate from a credit union or bank before you sit down at the dealer.',
      'Add insurance to your budget. It is not part of this loan payment.',
    ],
    faqs: [
      {
        q: 'Is the trade-in the same as a down payment?',
        a: 'Both reduce what you finance. The trade-in also reduces the amount many states charge sales tax on. Cash down does not.',
      },
      {
        q: 'Why is tax charged on less than the sticker price?',
        a: 'The calculator taxes the price minus the trade-in. Rules vary by state. If your state taxes the full price, raise the tax amount by editing the price or the tax rate until the tax line matches the quote.',
      },
      {
        q: 'Does a longer loan save money?',
        a: 'It lowers the monthly payment. You pay more interest, and you are in debt after the car has lost much of its value.',
      },
      {
        q: 'Are dealer add-ons included?',
        a: 'Only if you put them in the fees field. Warranties, gap insurance, and protection packages should be added there or left out of the deal.',
      },
    ],
    assumptions: [
      'The APR is fixed and interest compounds monthly.',
      'Sales tax applies to the price minus the trade-in.',
      'There is no balloon payment at the end.',
      'Insurance, fuel, and maintenance are not in the payment.',
    ],
  },
  refinance: {
    howTo: [
      'Enter the balance you still owe, not the original loan amount.',
      'Enter the rate and the years left on that loan. Your statement has both.',
      'Enter the new rate, the new term, and the closing costs from the loan estimate.',
      'Read the break-even time first. Then check whether total interest actually falls.',
    ],
    result:
      'Break-even is how long the monthly savings take to repay the closing costs. If you move or refinance again before that month, the new loan costs more than it saves. A lower payment is not the same as a cheaper loan: stretching the term back to 30 years can raise the interest you pay even when the payment drops.',
    howItWorks: [
      {
        heading: 'Monthly savings',
        body: 'The calculator prices your current balance at the old rate for the years you have left, then prices the same balance at the new rate and term. The difference in principal-and-interest payments is the monthly savings. Closing costs are paid in cash. They are not added to the new balance.',
      },
      {
        heading: 'Break-even',
        body: 'Divide the closing costs by the monthly savings. That is the number of months until the refinance has paid for itself. There is no break-even if the new payment is not lower.',
      },
      {
        heading: 'Total interest',
        body: 'Interest saved compares the interest left on the current loan with the interest on the new loan. Subtract the closing costs to see the net. A longer new term can erase the benefit of a lower rate.',
      },
    ],
    example: {
      title: 'A $340,000 balance, from 7.1% to 6.1%',
      setup:
        'The defaults keep 27 years on the current loan and refinance into a 30-year loan at 6.1%, with $6,500 of closing costs.',
      result:
        'The payment falls from about $2,361 to about $2,060, a savings of about $300 a month. Closing costs are covered in about 22 months. Interest over the life of the loans falls by about $23,000, or about $17,000 after the fees.',
    },
    terms: [
      { term: 'Break-even', definition: 'The month when payment savings have repaid the closing costs.' },
      { term: 'Closing costs', definition: 'Lender and third-party fees to open the new loan. Paid up front in this calculator.' },
      { term: 'Term', definition: 'How many years the new loan lasts. Resetting to 30 years lowers the payment and can raise total interest.' },
      { term: 'Rate-and-term refinance', definition: 'A refinance that changes the rate or the length of the loan, without taking cash out.' },
    ],
    tips: [
      'Ask for a quote that matches the term you have left, not only a new 30-year term.',
      'If you might move before the break-even month, the fees are hard to justify.',
      'Rolling closing costs into the loan raises the balance and pushes break-even further out. This tool assumes you pay them in cash.',
      'Compare the annual percentage rate, not only the interest rate. The APR reflects the fees.',
    ],
    faqs: [
      {
        q: 'Should I refinance for a small rate drop?',
        a: 'Only if you will keep the loan past the break-even month and the total interest, after fees, still falls. A quarter-point drop on a small balance often does not.',
      },
      {
        q: 'Why can a lower payment still cost more?',
        a: 'Restarting the clock at 30 years means more months of interest. The payment drops because the same debt is stretched, not only because the rate fell.',
      },
      {
        q: 'Does this include cash-out?',
        a: 'No. The new loan is the same balance you entered. A cash-out refinance increases the balance and should be judged separately.',
      },
      {
        q: 'Are taxes and insurance in the payment?',
        a: 'No. Both loans are compared on principal and interest only, because tax and insurance do not change just because you refinance.',
      },
    ],
    assumptions: [
      'Closing costs are paid in cash and are not financed.',
      'Both rates are fixed.',
      'You do not add extra principal payments.',
      'Points, escrow, and mortgage insurance are only included if you put them in closing costs.',
    ],
  },
  rentbuy: {
    howTo: [
      'Enter the home price, down payment, mortgage rate, and how long you expect to stay.',
      'Enter the rent you would pay instead, and how fast you think rent and home prices rise.',
      'Set the return you could earn by investing money you do not spend on the house.',
      'Read which path has more wealth at the end of the stay, not only which one has the lower monthly bill.',
    ],
    result:
      'Buying builds home equity. Renting keeps the down payment and closing costs invested, and invests the monthly gap whenever rent is cheaper than owning. The result is the difference in wealth after you sell the home and pay selling costs. A cheaper monthly rent can still lose if the home appreciates enough, and buying can lose if you sell soon or the investments you skipped would have grown faster.',
    howItWorks: [
      {
        heading: 'The cost of owning',
        body: 'Each month the owner pays principal and interest, property tax, insurance, maintenance, and HOA. Insurance is fixed at $1,900 a year and HOA is $0. Tax and maintenance scale with the home value.',
      },
      {
        heading: 'The renter’s invested cash',
        body: 'The renter starts with the buyer’s down payment and closing costs invested. Each month, whoever pays less invests the difference at the return you set. Rent rises once a year at the growth rate.',
      },
      {
        heading: 'Selling at the end',
        body: 'The buyer’s wealth is the invested monthly surplus plus the home value, minus the remaining mortgage and 6% selling costs. That keeps a paper gain from looking like cash you can spend.',
      },
    ],
    example: {
      title: 'A $520,000 home versus $2,800 rent, for 7 years',
      setup:
        'The defaults use 20% down, a 6.35% mortgage, 3% appreciation, 3% rent growth, and a 6% return on invested cash. Closing costs are 2% of the price.',
      result:
        'Owning starts near $3,679 a month, above the $2,800 rent. After 7 years the renter’s invested cash is about $248,000 and the buyer’s wealth after selling costs is about $226,000. Renting finishes ahead by about $22,000 on these assumptions.',
    },
    terms: [
      { term: 'Opportunity cost', definition: 'The return you give up by putting cash into a down payment instead of an investment.' },
      { term: 'Equity', definition: 'Home value minus the mortgage you still owe. Selling costs reduce what you keep.' },
      { term: 'Appreciation', definition: 'The annual rise in the home’s value. It is an assumption you can change, not a forecast.' },
      { term: 'Maintenance', definition: 'A percent of the home value set aside each year for repairs and upkeep.' },
    ],
    tips: [
      'Stretch the stay. Buying looks worse when selling costs hit after only a few years.',
      'If you would not actually invest the difference, lower the investment return. The renter’s advantage shrinks.',
      'A stable housing payment can still be worth more to you than a small wealth gap. The chart does not measure that.',
      'Property tax and maintenance are editable because they change the result as much as the mortgage rate.',
    ],
    faqs: [
      {
        q: 'Why can renting win even if the home is worth more later?',
        a: 'The renter invested the down payment the whole time, and invested the monthly savings whenever rent was lower. Selling costs also take a slice of the home’s value.',
      },
      {
        q: 'Does this include the tax deduction for mortgage interest?',
        a: 'No. Many owners take the standard deduction and get no extra benefit. If you itemize, the advantage of buying is a bit better than this shows.',
      },
      {
        q: 'What if I never sell?',
        a: 'The comparison assumes a sale so both choices are measured as wealth you could use. If you stay forever, ignore the selling-cost haircut and focus on the equity line.',
      },
      {
        q: 'Is the monthly owning cost the same as the mortgage payment?',
        a: 'It is higher. It adds property tax, insurance, maintenance, and HOA on top of principal and interest.',
      },
    ],
    assumptions: [
      'Homeowners insurance is $1,900 a year and HOA dues are $0.',
      'Closing costs are 2% of the price. Selling costs are 6%.',
      'The mortgage rate is fixed. Extra principal payments are not included.',
      'Investment returns are steady. Real markets are not.',
    ],
  },
  loan: {
    howTo: [
      'List each card and loan with its balance, APR, and minimum payment.',
      'Add the extra cash you can put toward debt each month, beyond those minimums.',
      'Switch between avalanche and snowball to see the interest and the payoff order.',
      'Watch the debt-free date. That is the number the extra payment is buying.',
    ],
    result:
      'Both methods pay the minimum on every debt, then send every extra dollar to one focus debt. Avalanche focuses on the highest APR, which usually costs less in interest. Snowball focuses on the smallest balance, which clears an account sooner. When a debt is gone, its minimum joins the extra payment on the next debt.',
    howItWorks: [
      {
        heading: 'Avalanche',
        body: 'Interest is the price of the balance. Attacking the highest rate first cuts that price fastest. The payoff date and the interest total are the two numbers to compare.',
      },
      {
        heading: 'Snowball',
        body: 'Paying the smallest balance first does not minimize interest. It removes a bill, which some people stick with longer. Use it if a quick win is what keeps the plan alive, and check how much extra interest it costs.',
      },
      {
        heading: 'The extra payment',
        body: 'Minimums alone can leave high-rate cards in debt for many years. The extra amount is applied after minimums, and it rolls forward as each account is paid off.',
      },
    ],
    example: {
      title: 'Four debts and $250 extra',
      setup:
        'The defaults include a $8,400 card at 23.9%, a $3,200 card at 19.2%, a $14,200 auto loan at 6.4%, and a $19,600 student loan at 5.1%, plus $250 a month beyond the minimums.',
      result:
        'Either method is debt-free in about 49 months. Avalanche charges about $7,950 of interest. Snowball charges about $8,225. The interest gap is about $275 on this mix because the extra payment is already large.',
    },
    terms: [
      { term: 'Avalanche', definition: 'Pay minimums, then put extra money toward the highest interest rate.' },
      { term: 'Snowball', definition: 'Pay minimums, then put extra money toward the smallest balance.' },
      { term: 'Minimum payment', definition: 'The amount the lender requires. Paying only that keeps the debt around much longer.' },
      { term: 'APR', definition: 'The yearly interest rate on that debt. Cards are usually much higher than auto and student loans.' },
    ],
    tips: [
      'Stop adding new charges to a card you are trying to pay off. Otherwise the balance does not follow this schedule.',
      'If two methods finish in the same month, pick the one with less interest.',
      'A 0% balance-transfer offer can beat both methods if you clear the balance before the promotional rate ends. The fee matters.',
      'Put windfalls on the focus debt. The chart assumes the extra payment never changes.',
    ],
    faqs: [
      {
        q: 'Which method should I use?',
        a: 'Avalanche costs less in interest when the rates differ. Snowball can be reasonable when the extra interest is small and clearing an account helps you stay with the plan.',
      },
      {
        q: 'What if I can only pay the minimums?',
        a: 'Set the extra payment to zero. The date will move out. Any amount above the minimums, even $50, shortens it.',
      },
      {
        q: 'Do I include the mortgage?',
        a: 'You can, but a low-rate mortgage often should not outrank high-rate cards. Many people leave the mortgage out and attack consumer debt first.',
      },
      {
        q: 'Why did both methods take the same number of months?',
        a: 'With a large extra payment, the order changes which debt dies first more than it changes the final month. Compare the interest totals. They still differ.',
      },
    ],
    assumptions: [
      'Rates stay fixed. New purchases are not added.',
      'Minimums stay at the dollar amount you entered, even as balances fall.',
      'Extra money arrives every month.',
      'The projection stops at 50 years if the minimums cannot cover the interest.',
    ],
  },
  savings: {
    howTo: [
      'Enter what you have saved, what you add each month, and the target.',
      'Set a return that matches the account. A savings account is not a stock-market return.',
      'Read the time to the goal, then the monthly amount that would finish it in three years.',
      'If the date is too far off, raise the monthly amount before you raise the assumed return.',
    ],
    result:
      'The date is how long the balance takes to reach the target when you contribute every month and the return compounds monthly. The three-year figure is the contribution that hits the same target sooner. If you are already saving more than that, you are ahead of a three-year pace.',
    howItWorks: [
      {
        heading: 'Compounding',
        body: 'Each month the balance earns one-twelfth of the annual rate, then your contribution is added. Early months are mostly your deposits. Later months earn more because the balance is larger.',
      },
      {
        heading: 'The three-year shortcut',
        body: 'The calculator solves for the monthly deposit that grows today’s balance to the target in 36 months at the same rate. That is a pace, not a requirement.',
      },
      {
        heading: 'Choosing a rate',
        body: 'Use a rate close to the account you will actually use. A high-yield savings rate is much lower than a long-run stock return, and the money is safer. Using a stock return for an emergency fund makes the date look too soon.',
      },
    ],
    example: {
      title: 'From $12,000 to $50,000',
      setup: 'The defaults start at $12,000, add $600 a month, and earn 4.2% a year.',
      result:
        'The goal is about 54 months away, or 4 years and 6 months. Reaching it in 3 years would take about $950 a month.',
    },
    terms: [
      { term: 'Compound interest', definition: 'Interest earned on prior interest, not only on what you deposited.' },
      { term: 'Contribution', definition: 'The new money you add. It is separate from the growth.' },
      { term: 'Target', definition: 'The balance you want. The clock stops when the projection crosses it.' },
      { term: 'Annual return', definition: 'The yearly rate, applied here as a monthly compound rate.' },
    ],
    tips: [
      'Name the goal. A house fund and an emergency fund should not share one vague target.',
      'Automate the transfer on payday so the monthly amount is not optional.',
      'If the goal is less than three years away, prefer a savings yield over a market return.',
      'Raise the contribution when income rises. The rate is the part you do not control.',
    ],
    faqs: [
      {
        q: 'What return should I use for an emergency fund?',
        a: 'Use the yield on the savings account where the money will sit. Do not use a stock-market average for cash you cannot afford to lose.',
      },
      {
        q: 'Why is the three-year payment higher than my current one?',
        a: 'A shorter deadline means less time for growth, so more of the target has to come from deposits.',
      },
      {
        q: 'Does this include taxes on the interest?',
        a: 'No. Interest in a taxable savings account is income. The date is slightly optimistic if the account is not a retirement or other tax-advantaged account.',
      },
      {
        q: 'What if I already have more than the target?',
        a: 'The time to the goal is zero. Raise the target or use the investment growth calculator for a longer horizon.',
      },
    ],
    assumptions: [
      'The return is constant and compounds monthly.',
      'Contributions are made at the end of every month.',
      'No money is withdrawn along the way.',
      'Taxes on interest are not subtracted.',
    ],
  },
  budget: {
    howTo: [
      'Start with monthly take-home pay, the amount that actually hits your account.',
      'Enter what you spend on needs, wants, and savings or extra debt payments.',
      'Compare each bucket with the 50/30/20 targets.',
      'If the leftover is negative, the plan spends more than the paycheck. Cut a bucket before you look for a raise.',
    ],
    result:
      'The 50/30/20 guide sends about half of take-home pay to needs, 30% to wants, and 20% to savings and extra debt payments. Your percentages will not match those lines exactly. The useful result is the gap: which bucket is over, which is under, and whether anything is left unassigned.',
    howItWorks: [
      {
        heading: 'Needs',
        body: 'Needs are the bills you have to pay to keep housed, fed, insured, and getting to work. Housing, utilities, groceries, insurance, minimum debt payments, and basic transport belong here. A need that has a luxury version, such as a car payment far above a reliable used car, is partly a want.',
      },
      {
        heading: 'Wants',
        body: 'Wants are the choices: dining out, travel, hobbies, and most subscriptions. They are allowed in the guide. The 30% line is a ceiling to notice, not a goal to spend up to.',
      },
      {
        heading: 'Savings',
        body: 'This bucket is future you. Emergency savings, retirement contributions, and extra payments on high-rate debt all count. Employer retirement contributions are a bonus on top. Do not rely on them to fill the whole 20% if you can save from the paycheck too.',
      },
    ],
    example: {
      title: 'Take-home pay of $6,800',
      setup: 'The defaults put $3,200 toward needs, $1,450 toward wants, and $1,200 toward savings.',
      result:
        'About $950 is still unassigned. Needs are about 47% of pay, under the 50% line. Savings are about 18%, a little under the 20% line. Wants are about 21%, under the 30% line. The unassigned $950 is the easiest place to close the savings gap.',
    },
    terms: [
      { term: '50/30/20', definition: 'A budgeting guide: 50% needs, 30% wants, 20% savings and extra debt paydown.' },
      { term: 'Take-home pay', definition: 'Income after taxes and paycheck deductions. Use this, not your gross salary.' },
      { term: 'Needs', definition: 'Expenses required to live and work. Housing and groceries are the core.' },
      { term: 'Savings rate', definition: 'The share of take-home pay that goes to saving or extra debt payments.' },
    ],
    tips: [
      'Assign the leftover on purpose. An unallocated surplus tends to become spending.',
      'If needs are far above 50%, housing is usually the reason. A raise helps less than a lower housing cost.',
      'Count the retirement contribution that already comes out of your paycheck, or you will think you save less than you do.',
      'High-cost cities rarely hit 50% needs. Use the ratio as a diagnostic, then build a version you can keep.',
    ],
    faqs: [
      {
        q: 'Should I use gross pay or take-home pay?',
        a: 'Take-home pay. The guide is about the money you can actually assign. Taxes are not a spending choice.',
      },
      {
        q: 'Where do debt payments go?',
        a: 'Minimum payments are needs. Anything above the minimum is savings and debt paydown, because it builds your net worth.',
      },
      {
        q: 'What if I cannot hit 20% yet?',
        a: 'Save something and raise it when a debt is gone or income rises. A perfect ratio that you abandon is worse than a smaller one you automate.',
      },
      {
        q: 'Is 50/30/20 a rule I have to follow?',
        a: 'It is a checkpoint. If needs are 60% and savings are 15% and the rest of life works, you have information, not a failing grade.',
      },
    ],
    assumptions: [
      'The targets are 50% needs, 30% wants, and 20% savings.',
      'Figures are monthly.',
      'Take-home pay is after taxes and payroll deductions you do not also list as spending.',
      'Irregular bills are easier to handle if you enter a monthly average.',
    ],
  },
  invest: {
    howTo: [
      'Enter the starting balance and the amount you add each month.',
      'Pick a return you can defend. Seven percent is a common long-run planning rate for a diversified stock portfolio, not a promise.',
      'Set the number of years, and a yearly increase in the contribution if your savings will rise.',
      'Separate the ending balance into money you deposited and money the market added.',
    ],
    result:
      'The ending balance is your deposits plus growth. Growth is doing the work when it is larger than what you put in, which usually takes a long horizon. The chart’s lower line is only the cash you contributed, so the gap is the compound return.',
    howItWorks: [
      {
        heading: 'Monthly compounding',
        body: 'The balance grows by one-twelfth of the annual rate each month, then the contribution is added. Contributions can step up once a year by the increase you set. The default increase is zero, so the monthly amount stays flat.',
      },
      {
        heading: 'A real, after-inflation view',
        body: 'The tool also shows the ending balance in today’s buying power, using 2.5% inflation. A large future number buys less than it looks like. Use that figure when you are comparing the result with today’s expenses.',
      },
      {
        heading: 'Why the rate is a guess',
        body: 'Markets do not pay a smooth 7% every year. The smooth line is a planning average. A lower rate is the right stress test if the goal is mandatory, such as a house down payment on a date.',
      },
    ],
    example: {
      title: '$25,000 plus $900 a month for 25 years',
      setup: 'The defaults earn 7% a year and do not raise the contribution over time.',
      result:
        'The balance grows to about $872,000. You contributed about $295,000, including the starting balance. About $577,000 is growth.',
    },
    terms: [
      { term: 'Compound return', definition: 'Growth earned on earlier growth, as well as on new contributions.' },
      { term: 'Contribution', definition: 'New cash you add. It is not a return.' },
      { term: 'Real value', definition: 'The future balance restated in today’s dollars after inflation.' },
      { term: 'Horizon', definition: 'How long the money stays invested. Time is what makes compounding visible.' },
    ],
    tips: [
      'Raise the contribution before you raise the assumed return. The contribution is the input you control.',
      'Fees come straight out of the return. Run the investment fee calculator if an advisor or fund charges about 1%.',
      'Money you need within a few years does not belong in a 7% assumption.',
      'Revisit the plan yearly. A flat contribution ignores raises.',
    ],
    faqs: [
      {
        q: 'Is 7% a reasonable return?',
        a: 'It is a common long-run planning assumption for a diversified stock portfolio. This calculator treats the rate you enter as the return before the separate 2.5% inflation view. It is not a forecast, and a lower rate is the better stress test.',
      },
      {
        q: 'Does this include fees and taxes?',
        a: 'No. Subtract an expense ratio or advisory fee from the return, or use the investment fee calculator. Taxes on a taxable account reduce the ending balance further.',
      },
      {
        q: 'What is the difference between this and the retirement planner?',
        a: 'This tool projects a balance. The retirement planner compares that kind of projection with a target nest egg and a retirement age.',
      },
      {
        q: 'Why does growth eventually exceed contributions?',
        a: 'Each year’s return applies to everything already saved. After a long time, that base is large enough that one year of growth beats one year of deposits.',
      },
    ],
    assumptions: [
      'The return is constant and compounds monthly.',
      'Contributions are added every month.',
      'The inflation view uses 2.5% a year.',
      'Fees, taxes, and losing years are not modeled.',
    ],
  },
  retirement: {
    howTo: [
      'Enter your age, the age you want to stop working, and what you have saved.',
      'Add the monthly amount you invest and a return you can live with for decades.',
      'Set a target nest egg, or think about the income you want and whether the target could support it.',
      'If you are short, the calculator shows the monthly contribution that closes the gap.',
    ],
    result:
      'On track means the projected balance reaches the target by your retirement age. The gap is the target minus the projection. The required monthly amount is what you would need to save, at the same return, to land on the target. A 4% figure on the result is a rough annual withdrawal, divided by 12, not a guarantee that the money lasts.',
    howItWorks: [
      {
        heading: 'The projection',
        body: 'Savings compound monthly from your current age to the retirement age. The return does not vary. That makes the path easy to read and too smooth to be a promise.',
      },
      {
        heading: 'The required contribution',
        body: 'The calculator solves for the deposit that grows today’s balance to the target in the years you have left. Compare it with what you save now. The difference is the raise in savings that closes the gap, before any change in the return or the retirement date.',
      },
      {
        heading: 'Income versus a nest egg',
        body: 'A common checkpoint is 25 times the annual income you want to withdraw, which is the same idea as a 4% withdrawal. The income field helps you see whether the target is in that neighborhood. Social Security, pensions, and part-time work reduce what the portfolio has to cover.',
      },
    ],
    example: {
      title: 'Age 34, retiring at 65, with a $1.5 million target',
      setup: 'The defaults start at $88,000 and add $1,200 a month at 6.5% a year, with a desired income of $70,000.',
      result:
        'Over 31 years the projection reaches about $2.09 million, above the $1.5 million target. The contribution that would have been enough for the target is about $707 a month, so the current $1,200 is ahead of that pace.',
    },
    terms: [
      { term: 'Nest egg', definition: 'The invested balance you plan to draw from in retirement.' },
      { term: 'On track', definition: 'The projection meets or beats the target at your chosen retirement age.' },
      { term: '4% rule', definition: 'A planning shortcut: withdrawing about 4% of the portfolio in the first year, then adjusting for inflation.' },
      { term: 'Gap', definition: 'How far the projected balance sits below the target. A negative gap means you are ahead.' },
    ],
    tips: [
      'Include the employer match in the monthly contribution. It is part of what gets invested.',
      'If the required contribution is unrealistic, delay retirement a few years or lower the target before you assume a higher return.',
      'A target of 25 times the spending you need from the portfolio is a clearer goal than a round number.',
      'Run the drawdown calculator once you are close. Saving enough and spending a sustainable amount are different questions.',
    ],
    faqs: [
      {
        q: 'How big should the target be?',
        a: 'Start from the annual spending the portfolio must cover, after Social Security or a pension, and multiply by about 25. Then test that balance in the drawdown calculator.',
      },
      {
        q: 'What return should I use?',
        a: 'A rate below a stock-market average, such as 5% to 7% before fees, is a common planning range for a mixed portfolio. The right stress test is a lower rate, not a higher one.',
      },
      {
        q: 'Does this include Social Security?',
        a: 'No. If Social Security will cover part of your spending, the portfolio target can be lower. Do not enter that income as if it were already saved.',
      },
      {
        q: 'I am ahead of the target. Can I stop saving?',
        a: 'The projection assumes you keep contributing and that the return arrives smoothly. Staying ahead is safer than stopping, especially if retirement is still decades away.',
      },
    ],
    assumptions: [
      'Contributions continue every month until the retirement age.',
      'The return is constant and compounds monthly.',
      'The 4% figure is a checkpoint, not a personalized spending plan.',
      'Social Security, taxes, and fees are not included.',
    ],
  },
  withdrawal: {
    howTo: [
      'Enter the portfolio you will have when withdrawals start.',
      'Enter the spending you need in the first year, before Social Security or other income reduces it.',
      'Set a return and an inflation rate. Spending rises with inflation each year.',
      'See whether the balance lasts the full horizon or the year it hits zero.',
    ],
    result:
      'The withdrawal rate is the first year’s spending divided by the portfolio. Around 4% is a common planning checkpoint for a 30-year retirement, not a rule that fits every mix of investments. The chart shows the balance after growth and after each year’s rising withdrawal. If the line hits zero, that year is when the plan runs out under these assumptions.',
    howItWorks: [
      {
        heading: 'Growth, then spending',
        body: 'Once a year the portfolio earns the return you entered, then that year’s spending comes out. Next year’s spending is higher by the inflation rate. A portfolio can grow in the early years and still fail later if inflation lifts the withdrawal.',
      },
      {
        heading: 'The 4% checkpoint',
        body: 'The idea, from historical studies of diversified portfolios, is that a starting withdrawal near 4%, raised with inflation, often lasted 30 years. It can fail in a long period of poor returns, and it can be too cautious if you have a pension or a shorter horizon.',
      },
      {
        heading: 'Sequence of returns',
        body: 'This tool uses one steady return. Real retirements get good and bad years in an unknown order. Bad years early, while you are withdrawing, do more damage than the average suggests. Treat a plan that barely lasts as fragile.',
      },
    ],
    example: {
      title: '$1.2 million and $48,000 a year',
      setup: 'The defaults withdraw $48,000 in year one, earn 6%, raise spending 2.5% a year, and look out 30 years.',
      result:
        'The first withdrawal is 4% of the portfolio. Under a steady 6% return the money lasts the full 30 years and the ending balance is still about $1.89 million. That cushion would shrink quickly if the return were lower or the first bad years arrived early.',
    },
    terms: [
      { term: 'Withdrawal rate', definition: 'First-year spending divided by the starting portfolio.' },
      { term: 'Inflation adjustment', definition: 'Spending rises each year so the withdrawal keeps its buying power.' },
      { term: 'Depletion', definition: 'The year the balance hits zero and the plan can no longer pay the withdrawal.' },
      { term: 'Sequence risk', definition: 'The extra damage from poor investment returns early in retirement, which this steady-return model does not show.' },
    ],
    tips: [
      'Subtract Social Security and pensions from spending before you enter the withdrawal. The portfolio should not be asked to cover income it does not have to cover.',
      'If the plan runs out, cut the first-year spending or delay retirement. Do not fix it only by raising the return.',
      'A plan that ends with a huge balance may support more spending, or it may be the cushion that survives a worse market.',
      'Taxes can apply to withdrawals from traditional accounts. The spending figure should be what leaves the portfolio, including the tax.',
    ],
    faqs: [
      {
        q: 'Is 4% always safe?',
        a: 'No. It is a historical checkpoint for a long retirement in a diversified portfolio. A higher starting rate, a longer horizon, or heavy fees makes it less reliable.',
      },
      {
        q: 'Why does the balance rise if I am spending?',
        a: 'If the return is higher than the withdrawal, the portfolio grows even while you take money out. Inflation may close that gap later.',
      },
      {
        q: 'Should I include my house?',
        a: 'Only the money you can sell or draw from. Home equity is not a monthly withdrawal unless you have a real plan to use it.',
      },
      {
        q: 'What return should I test?',
        a: 'Run your expected return, then run a lower one. The second result tells you how fragile the spending plan is.',
      },
    ],
    assumptions: [
      'The return is the same every year. Sequence of returns is not modeled.',
      'Spending rises once a year with inflation and is taken after that year’s growth.',
      'Taxes, fees, and one-time expenses are not included.',
      'Social Security is not added unless you have already reduced the withdrawal by that income.',
    ],
  },
  match401k: {
    howTo: [
      'Enter your salary and the percent you defer into the 401(k).',
      'Enter the match the way the plan states it: a percent of your contribution, up to a percent of pay.',
      'Add the current balance, a return, and how long you will keep contributing.',
      'Check the match left on the table before you look at the 25-year balance.',
    ],
    result:
      'The employer match is part of your pay. The “left on the table” figure is the match you miss this year by contributing less than the percent the plan will match. The projected balance includes your deferrals, the match, and growth, with salary rising each year. Employee deferrals stop at the annual cap even if the percent of pay would be higher.',
    howItWorks: [
      {
        heading: 'How a match is calculated',
        body: 'A typical formula, and the default here, is 50% of what you contribute, on the first 6% of salary. Contribute 6% and the employer adds 3% of pay. Contribute 3% and the employer adds 1.5%. Contribute 10% and the match still stops at 3% of pay.',
      },
      {
        heading: 'The employee cap',
        body: 'The calculator uses the 2024 employee deferral limit of $23,000. Catch-up contributions after age 50 are not included. Employer money does not count toward that employee cap.',
      },
      {
        heading: 'Growth',
        body: 'Both your contribution and the match are invested monthly. Salary, and therefore both contributions, rise by the growth rate you set. The return compounds monthly.',
      },
    ],
    example: {
      title: 'A $95,000 salary and a 50% match up to 6%',
      setup:
        'The defaults defer 6% of pay, start from a $42,000 balance, earn 7%, and grow the salary 3% a year for 25 years.',
      result:
        'This year you put in $5,700 and your employer adds $2,850. Nothing is left on the table. Over 25 years you contribute about $208,000, your employer adds about $104,000, and the balance grows to about $999,000.',
    },
    terms: [
      { term: 'Elective deferral', definition: 'The part of your paycheck you choose to put in the 401(k).' },
      { term: 'Match', definition: 'Money the employer adds, usually based on how much you defer.' },
      { term: 'Left on the table', definition: 'Match dollars available this year that you do not receive because your deferral is below the matched percent.' },
      { term: 'Deferral limit', definition: 'The annual cap on employee contributions. This tool uses $23,000 for 2024.' },
    ],
    tips: [
      'Contribute at least enough to get the full match before you send extra money to a taxable account.',
      'If you drop from 6% to 3% on the default salary, the employer adds $1,425 instead of $2,850. That $1,425 is gone for the year.',
      'Raise the deferral when you get a raise so the dollar amount does not stall.',
      'A Roth 401(k) option changes the tax treatment, not the match math. The match itself is usually pre-tax.',
    ],
    faqs: [
      {
        q: 'What does “50% up to 6%” mean?',
        a: 'The employer adds fifty cents for each dollar you contribute, until your contribution reaches 6% of pay. The maximum match is 3% of your salary.',
      },
      {
        q: 'Does the employer match count toward the $23,000 cap?',
        a: 'No. That cap is on your own deferrals. Employer contributions have a separate, higher overall limit that this calculator does not hit at ordinary salaries.',
      },
      {
        q: 'What if my plan matches a flat dollar amount?',
        a: 'Set the “up to” percent and the match percent so this year’s employer dollar amount matches your plan statement. The formula is a percent of pay, not a flat bonus.',
      },
      {
        q: 'Should I contribute more than the match?',
        a: 'Often yes, if the rest of the budget can take it. The match is the minimum that captures free money. The retirement planner is the place to test whether that minimum is enough.',
      },
    ],
    assumptions: [
      'The 2024 employee deferral limit is $23,000. Catch-up contributions are not included.',
      'The match formula is a percent of your contribution, capped at a percent of salary.',
      'Salary rises once a year at a constant rate.',
      'The return is constant, and the money stays invested for the full period.',
    ],
  },
  fees: {
    howTo: [
      'Enter the balance and the monthly amount you add.',
      'Enter the return before fees, then the two annual fees you want to compare.',
      'Set the number of years. Fee gaps are small in year one and large after decades.',
      'Read the dollar gap, then ask what you get for the higher fee.',
    ],
    result:
      'Each fee is subtracted from the return before the balance compounds. The gap is the ending balance at the lower fee minus the ending balance at the higher fee. A 1% difference does not cost 1% of today’s balance. It costs a share of every future year’s growth. A higher fee can still be reasonable if advice raises your savings rate, lowers your taxes, or stops a costly mistake. The calculator shows the price, not the verdict.',
    howItWorks: [
      {
        heading: 'Net return',
        body: 'If the portfolio earns 7% before fees and the fee is 1%, the calculator compounds at 6%. That is a simplification of a fee taken from the balance, and it is close enough to show the long-run cost.',
      },
      {
        heading: 'Why the gap grows',
        body: 'The fee applies to a larger balance every year, and the money the fee removed does not get to compound. Contributions keep coming in, so the higher fee is charged on new money too.',
      },
      {
        heading: 'What to compare',
        body: 'Compare an all-in cost: fund expense ratios plus any advisory fee. A 0.08% fund and a 1% advisory relationship are the defaults because that gap is a common one to ask about.',
      },
    ],
    example: {
      title: '$100,000 plus $500 a month, for 30 years',
      setup: 'The defaults earn 7% before fees and compare a 0.08% fee with a 1% fee.',
      result:
        'The lower fee grows to about $1.39 million. The higher fee grows to about $1.10 million. The difference is about $288,000, roughly a fifth of the lower-fee balance.',
    },
    terms: [
      { term: 'Expense ratio', definition: 'The annual fund fee, as a percent of assets. It is taken inside the fund.' },
      { term: 'Advisory fee', definition: 'A fee paid to an advisor, often a percent of the assets they manage.' },
      { term: 'All-in fee', definition: 'Expense ratios plus the advisory fee. Compare that total, not one line of it.' },
      { term: 'Fee drag', definition: 'The compound wealth you do not get because fees reduced the return.' },
    ],
    tips: [
      'Ask an advisor for the all-in annual percent, including the funds. A quoted advice fee can leave out the funds.',
      'A low fee does not fix a savings rate that is too small. Run the retirement planner for that question.',
      'If the higher fee comes with planning you will actually use, judge the gap against that help. The chart cannot see tax savings or a behavior change.',
      'Fees on a small new account look harmless. Stretch the years. That is when they show up.',
    ],
    faqs: [
      {
        q: 'Is a 1% fee too high?',
        a: 'It is expensive relative to a simple index portfolio, and this tool shows how expensive over time. It can be a fair price for advice that changes your outcome. The number is the cost to weigh, not an automatic no.',
      },
      {
        q: 'Do I enter the fund fee, the advisor fee, or both?',
        a: 'Enter the all-in annual percent on each side. If one option is a 0.05% fund and the other is a 0.08% fund plus a 1% advisor, those are the two fees to compare.',
      },
      {
        q: 'Why is the dollar gap so much larger than 1% of my balance?',
        a: 'The fee is charged every year on a growing balance, and the unpaid fee would itself have earned a return. The cost compounds.',
      },
      {
        q: 'Are taxes included?',
        a: 'No. Turnover and account type can matter as much as the fee. This comparison isolates the fee.',
      },
    ],
    assumptions: [
      'The fee is a constant annual percent subtracted from the return.',
      'Both portfolios earn the same return before fees and receive the same contributions.',
      'The return does not vary from year to year.',
      'Taxes and trading costs beyond the fee you entered are not included.',
    ],
  },
  tax: {
    howTo: [
      'Choose a filing status. The brackets and the standard deduction change with it.',
      'Enter wages, other income, and pre-tax retirement contributions.',
      'Enter itemized deductions only if they are higher than the standard deduction. Otherwise leave them at zero.',
      'Read taxable income, the marginal bracket, and take-home pay after federal tax, FICA, and the state rate you entered.',
    ],
    result:
      'Taxable income is income after the retirement contribution and after the larger of the standard deduction or your itemized deductions. Ordinary income is taxed in layers. The marginal rate is the rate on the last dollar. The effective rate is total tax divided by gross income, and it is lower than the marginal rate because earlier dollars are taxed in cheaper brackets. Take-home pay here is gross income minus federal income tax, FICA, and a flat state rate. It is not a paycheck stub.',
    howItWorks: [
      {
        heading: 'Brackets are layers',
        body: 'Moving into the 22% bracket does not tax your entire income at 22%. Only the dollars inside that bracket are taxed at 22%. Earlier dollars stay in the 10% and 12% layers. The table on the calculator shows how much income landed in each layer.',
      },
      {
        heading: 'The standard deduction',
        body: 'The 2024 standard deduction used here is $14,600 for single filers, $29,200 for married filing jointly, and $21,900 for head of household. Itemizing helps only when your deductions exceed that amount.',
      },
      {
        heading: 'FICA is separate',
        body: 'Employees pay 6.2% Social Security tax on wages up to the annual wage base and 1.45% Medicare tax on all wages, plus an extra 0.9% Medicare tax above a high threshold. Retirement contributions entered here reduce income tax. They do not reduce FICA.',
      },
    ],
    example: {
      title: 'Single filer, $95,000 of wages',
      setup:
        'The defaults add $4,000 of other income, a $6,000 pre-tax retirement contribution, no itemized deductions, and a 5% state rate.',
      result:
        'Federal income tax is about $12,300. The marginal bracket is 22%. FICA is about $7,300. With the state estimate, total tax is about $23,500. Take-home pay is about $75,500, an effective rate near 24% of gross income.',
    },
    terms: [
      { term: 'Marginal rate', definition: 'The tax rate on your next dollar of ordinary income.' },
      { term: 'Effective rate', definition: 'Total tax divided by gross income. It blends every bracket and payroll tax.' },
      { term: 'Standard deduction', definition: 'A fixed amount subtracted from income if you do not itemize.' },
      { term: 'FICA', definition: 'Social Security and Medicare taxes on wages.' },
    ],
    tips: [
      'A pre-tax 401(k) contribution reduces taxable income. Use it to see the tax savings, not only the retirement balance.',
      'Do not itemize in this tool unless your deductions beat the standard deduction. Otherwise you will overstate the deduction.',
      'The state line is a flat percent of taxable income. It will not match a state with its own brackets.',
      'Credits, such as the child tax credit, are not in the result. They can lower the bill after the bracket math.',
    ],
    faqs: [
      {
        q: 'Which tax year is this?',
        a: '2024 federal brackets, the 2024 standard deduction, and the 2024 Social Security wage base. Use it to understand the shape of the bill, then check a current-year source before you file.',
      },
      {
        q: 'Will a raise get taxed entirely in my top bracket?',
        a: 'Only the part of the raise that sits in that bracket. Dollars below the bracket threshold keep their lower rates.',
      },
      {
        q: 'Why is take-home different from my paycheck?',
        a: 'Paychecks also withhold benefits, health insurance, and sometimes a different state calculation. This tool is an annual estimate of federal tax, FICA, and a flat state rate.',
      },
      {
        q: 'Does the retirement contribution save FICA?',
        a: 'A traditional 401(k) deferral reduces income tax. Employee FICA is still calculated on wages in this tool. A traditional IRA deduction works the same way for income tax and does not reduce FICA.',
      },
    ],
    assumptions: [
      'Federal brackets, the standard deduction, and the Social Security wage base are the 2024 figures.',
      'Income is ordinary income. Long-term capital gains and qualified dividends are not given their lower rates.',
      'The state tax is a flat percent of federal taxable income.',
      'Credits, the alternative minimum tax, and additional Medicare details beyond the extra 0.9% are not included.',
    ],
  },
  'self-employed': {
    howTo: [
      'Enter net profit from the work: revenue minus ordinary business expenses.',
      'Add W-2 wages if you also have a job. They count toward the Social Security wage base.',
      'Choose a filing status so the income-tax estimate uses the right standard deduction.',
      'Read the self-employment tax, the federal income tax, and the quarterly set-aside.',
    ],
    result:
      'Self-employment tax is both the employee and employer share of Social Security and Medicare, because no employer withholds them. You then deduct half of that tax when estimating income tax. The quarterly figure is the combined self-employment tax and federal income tax, divided by four. It is a planning set-aside, not the exact voucher the IRS will compute.',
    howItWorks: [
      {
        heading: 'The 92.35% base',
        body: 'Self-employment tax is calculated on 92.35% of net profit, which approximates the deduction for the employer half. Social Security tax is 12.4% of that base, up to the wage base. Medicare tax is 2.9%, with an extra 0.9% above a high income threshold.',
      },
      {
        heading: 'The half deduction',
        body: 'Half of the self-employment tax is subtracted before income tax is estimated. That keeps the same earnings from being fully taxed twice. The deduction does not reduce the self-employment tax itself.',
      },
      {
        heading: 'Quarterly payments',
        body: 'Nobody withholds this tax during the year. Dividing the annual estimate by four is a simple way to set cash aside. Actual estimated-tax rules also look at last year’s tax and can include a penalty if you underpay.',
      },
    ],
    example: {
      title: '$120,000 of net profit, single filer',
      setup: 'The defaults have no W-2 wages and use the single standard deduction.',
      result:
        'Self-employment tax is about $16,955. Federal income tax on the remaining taxable income is about $16,376. Setting aside about $8,333 each quarter covers that combined federal bill. Take-home profit after those federal taxes is about $86,700.',
    },
    terms: [
      { term: 'Net profit', definition: 'Self-employment revenue minus ordinary and necessary business expenses.' },
      { term: 'Self-employment tax', definition: 'Social Security and Medicare tax paid by someone who does not have an employer withholding both halves.' },
      { term: 'Quarterly estimate', definition: 'A payment during the year so the full tax is not due every April.' },
      { term: 'Wage base', definition: 'The earnings level where Social Security tax stops. W-2 wages use up part of it.' },
    ],
    tips: [
      'Move the set-aside to a separate account when you get paid, not in March.',
      'A pre-tax retirement plan for the self-employed can lower the income tax. It does not erase self-employment tax.',
      'If you also have W-2 wages, enter them. Otherwise Social Security tax may be overstated once you pass the wage base.',
      'State tax is not in this tool. Add your state’s rate on top of the quarterly number.',
    ],
    faqs: [
      {
        q: 'Is self-employment tax the same as income tax?',
        a: 'No. Self-employment tax is Social Security and Medicare. Income tax is calculated after that, on taxable income. You can owe both.',
      },
      {
        q: 'What profit do I enter?',
        a: 'Revenue minus business expenses, before the self-employment tax deduction. Do not subtract your estimated taxes first.',
      },
      {
        q: 'Why is the tax base 92.35% of profit?',
        a: 'The tax code lets you reduce the base by an amount that stands in for the employer share of payroll tax. The calculator applies that factor for you.',
      },
      {
        q: 'Does this file my quarterly vouchers?',
        a: 'No. It tells you a federal amount to set aside. Forms, safe-harbor rules, and state estimates are separate.',
      },
    ],
    assumptions: [
      'Social Security tax uses a 12.4% rate and the 2024 wage base of $168,600.',
      'Medicare tax is 2.9%, plus 0.9% above the additional Medicare threshold.',
      'Income tax uses 2024 federal brackets and the standard deduction. Itemizing is not included.',
      'State tax, credits, and the qualified business income deduction are not included.',
    ],
  },
  roth: {
    howTo: [
      'Enter the pre-tax dollars you could contribute each year.',
      'Enter your marginal tax rate today and the rate you expect to pay on withdrawals in retirement.',
      'Set the return and the years the money will stay invested.',
      'Compare the spendable balances. Traditional is reduced by the retirement tax. Roth is not.',
    ],
    result:
      'The comparison uses the same pre-tax money. A traditional account invests the full amount and pays tax on the withdrawal. A Roth account invests only what is left after today’s tax, then withdrawals are tax-free. If you expect a lower rate in retirement, traditional usually leaves more to spend. If you expect a higher rate later, Roth usually wins. If the two rates match, the results tie.',
    howItWorks: [
      {
        heading: 'Same dollars, different timing',
        body: 'Paying tax now on a Roth shrinks what gets invested. Paying tax later on a traditional account shrinks what you can spend. When the rate is the same and the return is the same, those two effects cancel. The interesting case is when the rates differ.',
      },
      {
        heading: 'Marginal rate, not effective rate',
        body: 'Use the rate on the dollars you are deciding about. That is your marginal bracket, not your overall effective tax rate. The federal tax estimator shows the marginal bracket.',
      },
      {
        heading: 'What this leaves out',
        body: 'Required distributions, income limits, a match, and the chance that a traditional contribution drops you into a lower bracket today are not in the math. Those can tip a close call.',
      },
    ],
    example: {
      title: '$7,000 a year, 22% today and 12% in retirement',
      setup: 'The defaults invest for 30 years at 7%. The traditional account receives the full $7,000. The Roth receives $7,000 after 22% tax.',
      result:
        'The Roth grows to about $555,000, all of it spendable. The traditional account grows to about $712,000 and is worth about $626,000 after a 12% tax. Traditional finishes ahead by about $71,000 because the retirement rate is lower.',
    },
    terms: [
      { term: 'Traditional', definition: 'Contributions may be pre-tax. Withdrawals in retirement are taxed as ordinary income.' },
      { term: 'Roth', definition: 'Contributions are after tax. Qualified withdrawals, including the growth, are tax-free.' },
      { term: 'Marginal rate', definition: 'The tax rate on the next dollar. Use it for this decision, not your average rate.' },
      { term: 'Spendable balance', definition: 'What is left after the retirement tax. For a Roth, that is the whole balance.' },
    ],
    tips: [
      'If you do not know the future rate, split contributions. The hedge is allowed, and this tool will show a tie when the rates you enter are equal.',
      'A long time until retirement does not, by itself, make Roth better. The rates do that.',
      'Take the full employer match first. Match dollars are usually pre-tax even when your deferral is Roth.',
      'High earners who cannot deduct a traditional IRA, or who expect required distributions they do not need, have extra reasons to look at Roth.',
    ],
    faqs: [
      {
        q: 'Why do the accounts tie when the tax rates match?',
        a: 'The Roth invests less because tax is paid up front. The traditional account invests more and gives a slice back at the same rate. With the same return, the spendable results match.',
      },
      {
        q: 'Should young people always choose Roth?',
        a: 'Youth matters only if it means your rate today is lower than the rate you will pay later. A high earner early in a career can be in the opposite spot.',
      },
      {
        q: 'Is the $7,000 figure an IRA limit?',
        a: 'It is a round annual amount close to a recent IRA contribution limit. The math works the same for a 401(k) deferral. Enter the amount you are actually deciding about.',
      },
      {
        q: 'Does this include a penalty for early withdrawal?',
        a: 'No. It assumes the money stays invested for the full period and is then withdrawn under the retirement tax rules.',
      },
    ],
    assumptions: [
      'The same pre-tax dollars are available each year, with no starting balance.',
      'Traditional withdrawals are taxed at one flat retirement rate.',
      'Roth withdrawals are tax-free.',
      'Contribution limits, income limits, required distributions, and saver’s credits are not applied.',
    ],
  },
  networth: {
    howTo: [
      'Add what you own: cash, investments, retirement accounts, property, and other assets. Use today’s values.',
      'Add what you owe: mortgage, loans, cards, and student debt.',
      'Net worth is assets minus debts. The label under the number is a checkpoint, not a grade.',
      'Come back and update the same fields. The trend matters more than one snapshot.',
    ],
    result:
      'Net worth is the gap between what you own and what you owe. A house raises both sides: the value is an asset and the mortgage is a debt. Cash and investments are the liquid part you could use without selling a house. High-rate card debt reduces net worth one dollar for one dollar and usually deserves attention before chasing a higher investment return.',
    howItWorks: [
      {
        heading: 'Assets',
        body: 'Use amounts you could reasonably realize: account balances, and a conservative value for a home or car. Retirement accounts count even though taxes and penalties may apply if you spend them early. The calculator does not reduce them for a future tax.',
      },
      {
        heading: 'Debts',
        body: 'Enter the payoff balances, not the monthly payments. The mortgage is usually the largest debt and the lowest rate. Cards are usually the opposite.',
      },
      {
        heading: 'The checkpoint labels',
        body: 'The labels, from rebuilding through established, are there so the number has a sentence attached. They are not a score and they do not know your age or your cost of living.',
      },
    ],
    example: {
      title: 'A household with a home and a mortgage',
      setup:
        'The defaults include $18,000 cash, $96,000 of investments, $74,000 in retirement accounts, $420,000 of property, $9,000 of other assets, a $312,000 mortgage, $22,000 of loans, and $6,400 on cards.',
      result:
        'Assets are $617,000. Debts are about $340,000. Net worth is about $277,000. A large share of that net worth is home equity, not cash.',
    },
    terms: [
      { term: 'Net worth', definition: 'Assets minus liabilities. The single number that summarizes a balance sheet.' },
      { term: 'Liquid assets', definition: 'Cash and investments you can reach without selling a house. Retirement accounts are less liquid.' },
      { term: 'Liability', definition: 'A debt: mortgage, loans, cards, or student balances.' },
      { term: 'Home equity', definition: 'Property value minus the mortgage. It is wealth, and it is not the same as cash in the bank.' },
    ],
    tips: [
      'Update it once or twice a year. Monthly market noise is not a new financial life.',
      'If cards are a meaningful share of the debts, the debt payoff calculator is the next step.',
      'Do not inflate the house to a hopeful sale price. Use a value you would actually accept.',
      'Track retirement accounts even when you cannot spend them. Ignoring them understates the progress.',
    ],
    faqs: [
      {
        q: 'Should my house be in the total?',
        a: 'Yes, at a realistic value, with the mortgage on the debt side. Leaving the house out hides both the asset and the loan.',
      },
      {
        q: 'Do I subtract taxes I would pay to cash out retirement accounts?',
        a: 'This tool does not. For a retirement that is still years away, using the account balance is a fair snapshot. For money you will spend this year, a tax haircut is more honest.',
      },
      {
        q: 'Is a negative net worth a crisis?',
        a: 'It means debts exceed assets. Recent graduates with student loans are often there. The path out is the same: add assets and retire the expensive debt.',
      },
      {
        q: 'How is this different from income?',
        a: 'Income is a flow. Net worth is a stock. A high income with no savings and large debts can sit next to a low net worth.',
      },
    ],
    assumptions: [
      'Values are whatever you enter. The tool does not look up home prices or account balances.',
      'Retirement balances are not reduced for future taxes.',
      'Personal property you would not sell is better left out than guessed.',
      'The checkpoint labels are descriptive ranges, not advice.',
    ],
  },
  college: {
    howTo: [
      'Enter today’s annual cost for the kind of school you have in mind, including housing if you will pay it.',
      'Enter what you have saved, what you add each month, and how many years you have.',
      'Set college inflation and the return on the savings.',
      'Compare the monthly amount that would cover the future bill with what you save now.',
    ],
    result:
      'The future cost inflates today’s sticker for every year of school, including the years you are still waiting. The monthly figure is the savings rate that reaches that total by the first year. If your projected savings are short, the gap is the future dollars still uncovered. The tool assumes the whole sum is available when school starts. It does not keep earning while you pay tuition.',
    howItWorks: [
      {
        heading: 'Inflating the sticker',
        body: 'College costs have often risen faster than general inflation. The inflation rate you enter compounds from today through the last year of school. Year one in the future is not the same number as year four.',
      },
      {
        heading: 'The savings path',
        body: 'Current savings and new monthly deposits compound monthly until school starts. The required deposit is the amount that lands exactly on the inflated total. Your actual deposit produces the projected balance next to it.',
      },
      {
        heading: 'What the gap means',
        body: 'A gap can be closed by saving more, starting sooner, using a lower-cost school, or planning on income during the college years. The calculator does not assume scholarships, grants, or a student’s summer earnings unless you lower the annual cost.',
      },
    ],
    example: {
      title: '$28,000 a year, 12 years from now',
      setup:
        'The defaults save $15,000 already, add $400 a month, plan on 4 years of school, inflate costs 4% a year, and earn 6% on the savings.',
      result:
        'The four years cost about $190,000 in future dollars. The first year alone is about $45,000. Covering the total would take about $759 a month. At $400 a month the savings grow to about $115,000, about $76,000 short.',
    },
    terms: [
      { term: 'Sticker price', definition: 'The published annual cost before aid. You can enter a net cost instead if you have a better estimate.' },
      { term: 'College inflation', definition: 'How fast that annual cost rises. It can be higher than everyday inflation.' },
      { term: '529 plan', definition: 'A tax-advantaged account used for education. This calculator models the savings math, not the tax rules.' },
      { term: 'Gap', definition: 'Future cost minus the balance your current savings rate is projected to reach.' },
    ],
    tips: [
      'Enter the cost you expect to pay, not the most expensive school in the country, unless that is the real plan.',
      'Starting earlier does more than picking a slightly higher return.',
      'Aid, a 529 state tax benefit, and grandparents’ gifts can close a gap this tool will not invent for you.',
      'If college is only a few years away, use a savings return, not a stock-market return.',
    ],
    faqs: [
      {
        q: 'Should I enter the sticker price or the price after aid?',
        a: 'After aid, if you have a grounded estimate. The sticker price is the conservative input when aid is unknown.',
      },
      {
        q: 'Does a 529 change the math?',
        a: 'The growth math is the same. A 529 can make the growth tax-free when used for qualified education costs, which this pre-tax projection does not add on top.',
      },
      {
        q: 'Why is the future cost so much higher than four times today’s price?',
        a: 'Each year of school is inflated, and the later years inflate for longer. Twelve years at 4% raises the first year by itself by more than 60%.',
      },
      {
        q: 'What if my child is already in high school?',
        a: 'Shorten the years until college. The required monthly amount will jump. At that point, cash flow during school and a lower net price matter as much as new savings.',
      },
    ],
    assumptions: [
      'Costs rise at a constant annual rate through the last year of school.',
      'Savings compound monthly until the first year and are then available in full.',
      'The balance does not keep earning while tuition is being paid.',
      'Scholarships, grants, loans, and tax benefits are not included.',
    ],
  },
  inflation: {
    howTo: [
      'Choose future cost if you want to know what something will cost later.',
      'Choose buying power if you want to know what money you hold today will purchase later.',
      'Enter the amount, an inflation rate, and the years.',
      'Use the multiple as a check. At 3% for 20 years, prices rise by more than one and a half times.',
    ],
    result:
      'Future cost grows the amount by inflation. Buying power shrinks it. They are the same math in opposite directions. The rule of 72, shown beside the result, estimates how many years prices take to double. Divide 72 by the inflation rate. The chart uses the compound formula, which is more precise than that shortcut.',
    howItWorks: [
      {
        heading: 'Compound inflation',
        body: 'A 3% rate does not add 3% of the original amount every year. It adds 3% of the newest price. That is why 3% for 20 years lifts a price by about 81%, not 60%.',
      },
      {
        heading: 'Two questions',
        body: 'Future cost answers “what will this expense be?” Buying power answers “what will this savings be worth?” Retirement targets and college costs need the first. A pile of cash that is not invested needs the second.',
      },
      {
        heading: 'A planning rate, not a forecast',
        body: 'Long-run consumer inflation in the United States has often been discussed around 2% to 3%. Some costs, including college and health care, have run hotter. Change the rate to match the expense you are actually planning.',
      },
    ],
    example: {
      title: '$100,000 and 3% inflation for 20 years',
      setup: 'The default question is future cost.',
      result:
        'Something that costs $100,000 today costs about $181,000 in 20 years. The same $100,000 of cash would buy about $55,000 of today’s goods. The price level is about 1.81 times today’s prices. The rule of 72 says prices double in about 24 years at 3%.',
    },
    terms: [
      { term: 'Inflation', definition: 'The rise in prices over time, which reduces what a dollar buys.' },
      { term: 'Buying power', definition: 'The amount of today’s goods that a future or current sum can purchase.' },
      { term: 'Rule of 72', definition: 'A shortcut: 72 divided by the annual rate approximates the years required to double.' },
      { term: 'Real dollars', definition: 'An amount with inflation removed, so it can be compared with today’s prices.' },
    ],
    tips: [
      'Use a higher rate for college and medical costs than for a general household budget.',
      'Cash loses buying power. Money that has to sit for decades needs a return that can clear inflation.',
      'A retirement income that never rises will buy less every year. The drawdown calculator raises spending for that reason.',
      'Do not use a scary one-year inflation spike as a 30-year assumption without a reason.',
    ],
    faqs: [
      {
        q: 'What inflation rate should I use?',
        a: 'Around 2% to 3% is a common long-run planning range for general prices. Use a higher rate for costs you already know rise faster.',
      },
      {
        q: 'Is the rule of 72 exact?',
        a: 'No. It is a mental shortcut. At 3%, it says about 24 years to double. The compound chart is the number to use in a plan.',
      },
      {
        q: 'Does this predict next year’s prices?',
        a: 'No. It applies a rate you choose, steadily, for the whole period. Actual inflation jumps around.',
      },
      {
        q: 'How is this different from investment growth?',
        a: 'Investment growth adds a return and new contributions. This tool only moves a price level. Use both when a future expense will be paid with invested savings.',
      },
    ],
    assumptions: [
      'Inflation compounds once a year at a constant rate.',
      'The rule of 72 is displayed as a shortcut and is not the chart.',
      'No investment return is applied.',
      'The rate is an assumption you choose, not a forecast.',
    ],
  },
  insurance: {
    howTo: [
      'Enter the annual income the household would need to replace, and for how many years.',
      'Add debts you would want paid off, and extra goals such as college or final expenses.',
      'Subtract savings and the life insurance you already have, including coverage at work.',
      'The result is additional coverage, not the price of a policy.',
    ],
    result:
      'The estimate adds years of income, debts, and goals, then subtracts assets and existing coverage. That is an income-replacement approach. A rule of thumb such as “ten times income” ignores debts you have and assets you already own. If the result is zero, current resources cover this particular list. It can still be short if you left out unpaid work or a longer time horizon.',
    howItWorks: [
      {
        heading: 'Income replacement',
        body: 'Multiplying income by years is a plain way to fund the household for a fixed period, such as until children are grown or until retirement accounts can be used. It does not invest the death benefit. If the proceeds were invested, the need could be lower. This version stays conservative and does not assume a return.',
      },
      {
        heading: 'Debts and goals',
        body: 'A mortgage, student loans, and a college fund are lump sums. They belong in the total once, not inside the annual income, unless the income figure was already meant to cover those payments. Avoid counting the mortgage both as a debt and inside the income you replace.',
      },
      {
        heading: 'What you already have',
        body: 'Savings, investments, and existing policies reduce the new coverage. Group life insurance from a job counts only if you would still have it. It often ends when the job ends, so some people leave it out of the “existing” field on purpose.',
      },
    ],
    example: {
      title: '$90,000 of income for 15 years',
      setup:
        'The defaults add $280,000 of debts and $80,000 of extra goals, then subtract $120,000 of savings and $250,000 of coverage already in place.',
      result:
        'Income replacement is $1.35 million. Debts and goals bring the gross need to $1.71 million. After savings and current coverage, additional insurance of about $1.34 million covers the list.',
    },
    terms: [
      { term: 'Income replacement', definition: 'Coverage meant to stand in for earnings the household loses.' },
      { term: 'Term life', definition: 'Insurance that lasts for a set number of years. It matches a temporary need such as a mortgage or child-rearing years.' },
      { term: 'Group life', definition: 'Coverage through an employer. It is useful, and it may disappear if you leave the job.' },
      { term: 'Death benefit', definition: 'The amount the policy pays. This calculator estimates a benefit. It does not price the premium.' },
    ],
    tips: [
      'Insure the years you are actually covering. A 15-year need does not require a permanent policy by default.',
      'Count a stay-at-home parent’s work. Replacing childcare and household labor has a real cost even when wages are zero. Raise the income or the goals field.',
      'Review the number after a child, a mortgage, or a divorce. The old policy does not know about the new life.',
      'Price the premium separately and make sure it fits the budget. An unaffordable policy gets cancelled.',
    ],
    faqs: [
      {
        q: 'Is this the amount of insurance I should buy?',
        a: 'It is a starting estimate of the gap. A policy also has a cost, and your household may need a different number of years than the default. Use it to walk into the decision with a figure, not as a quote.',
      },
      {
        q: 'Should I use ten times my income instead?',
        a: 'Ten times income ignores the mortgage, the savings, and the years you actually need to cover. Use it only as a rough cross-check.',
      },
      {
        q: 'Do Social Security survivor benefits count?',
        a: 'Not in this tool. If your household would receive them, the need is lower. You can reduce the income field by a cautious estimate of that benefit.',
      },
      {
        q: 'Does this tell me term or permanent insurance?',
        a: 'No. It estimates a death benefit. Term insurance is the usual fit for a need that ends, such as income during working years. Permanent insurance is a different product with a different cost.',
      },
    ],
    assumptions: [
      'The death benefit is not assumed to be invested.',
      'Income is replaced in full for the number of years you enter, with no inflation adjustment.',
      'Social Security survivor benefits are not included.',
      'The result is a coverage estimate, not a premium and not an offer of insurance.',
    ],
  },
};

export function guideFor(id: CalculatorId): CalculatorGuide {
  return GUIDES[id];
}
