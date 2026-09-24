import type { CalculatorId } from './catalog';

export type ArticleBlock = { heading: string; paragraphs: string[] };

export type CalculatorArticle = {
  lede: string;
  sections: ArticleBlock[];
};

export const ARTICLES: Record<CalculatorId, CalculatorArticle> = {
  mortgage: {
    lede: 'A mortgage payment is the number that decides whether a house fits the rest of your life. The loan quote is only part of it. Taxes, insurance, and the way interest is charged in the early years change what you actually send each month, and what you still owe a decade later.',
    sections: [
      {
        heading: 'The payment you feel is bigger than the loan payment',
        paragraphs: [
          'Lenders amortize the amount you borrow over the term at a fixed monthly rate. Each payment covers that month’s interest first. Whatever is left reduces the principal. On a 30-year loan the payment stays manageable because the interest is stretched across hundreds of months.',
          'The bill you live with is larger. Property tax and homeowners insurance are usually collected with the loan payment, and an HOA dues line sits on top of that. A quote that shows only principal and interest will feel too low the first month the escrow payment hits.',
        ],
      },
      {
        heading: 'Why the balance barely moves at first',
        paragraphs: [
          'Interest is charged on whatever you still owe. At the start, that balance is the whole loan, so most of the payment is interest. You can pay on time for years and still owe something close to the original amount. That is the schedule working as designed, not a sign the payment was misapplied.',
          'Later, the same payment retires principal faster because the balance, and therefore the interest, is smaller. Extra principal payments skip the interest that would have been charged on that amount for the rest of the term. They do more when you make them early.',
        ],
      },
      {
        heading: 'How to read a quote before you fall in love with a house',
        paragraphs: [
          'Run the full payment at the rate on your loan estimate, not the rate in a listing. Then ask what happens if taxes or insurance rise. This calculator holds both flat. In real life they tend to climb, and the payment climbs with them.',
          'A 15-year term costs less in interest if the higher payment does not crowd out saving, an emergency fund, or the rest of the household. A payment you cannot keep is more expensive than the interest you were trying to avoid. Private mortgage insurance is not in this tool. Add it if the down payment is under 20 percent.',
        ],
      },
    ],
  },
  affordability: {
    lede: 'Affordability is not the highest price a lender will approve. It is the price whose monthly cost still fits your income after the debts you already have. Two ratios do that work, and the tighter one sets the limit.',
    sections: [
      {
        heading: 'Two caps, and the smaller one wins',
        paragraphs: [
          'The front-end ratio limits the housing payment to a share of gross monthly income. The default here is 28 percent. The back-end ratio limits housing plus the other debts you already pay, such as a car loan or card minimums. The default is 36 percent. The calculator uses whichever budget is smaller.',
          'Gross income is the right input, because that is what lenders use. Take-home pay is what you feel. If the result looks comfortable on gross income and tight on the paycheck, trust the paycheck. A pre-approval can also use a looser ratio than the one you would choose for yourself.',
        ],
      },
      {
        heading: 'From a monthly budget back to a price',
        paragraphs: [
          'The tool solves the mortgage formula in reverse. Part of the monthly budget has to cover property tax and insurance, estimated here at 1.45 percent of the price per year. The rest can support a loan. Add the cash you can put down and you get a home price.',
          'The rate does as much work as your salary. The same monthly budget buys less house when more of each payment is interest. The rate scenarios next to the result show that swing without changing your income. Closing costs, HOA dues, maintenance, and mortgage insurance are not in the price. Keep cash for them.',
        ],
      },
      {
        heading: 'A maximum is not a target',
        paragraphs: [
          'Buying at the top of the range leaves no room for a repair, a parental leave, or a tax bill that comes in higher than the estimate. Try the calculator again at a lower ratio if the payment would make every other goal wait.',
          'Paying down a car loan before you apply can raise the price the back-end ratio allows. Spending the down payment on closing costs does the opposite. The down payment field is the cash that reduces the loan, not your entire checking account.',
        ],
      },
    ],
  },
  auto: {
    lede: 'A car payment is easy to negotiate and easy to misunderstand. Stretch the term and the monthly number drops. The amount you pay for the privilege of borrowing usually rises, and you can owe more than the car is worth while you are still driving it.',
    sections: [
      {
        heading: 'What actually gets financed',
        paragraphs: [
          'The amount financed is the price, plus sales tax and fees, minus cash down and the trade-in. This calculator taxes the price after the trade-in, which is how many states handle a vehicle purchase. A payment quoted before tax, fees, and the trade-in are settled is not the payment you will sign.',
          'The APR is the cost of borrowing. A rate that looks ordinary on a large balance still produces thousands of dollars of interest over five or six years. Total interest is every payment combined, minus the amount you borrowed. That is the number to put next to the monthly payment before you say yes.',
        ],
      },
      {
        heading: 'Term is a price, not a comfort setting',
        paragraphs: [
          'A longer term lowers the payment by keeping you in debt after the car has lost much of its value. Cars depreciate quickly. A long loan pays down slowly. The gap between those two is how people end up upside down, owing more than the car would sell for.',
          'A larger down payment lowers both the payment and that risk. So does a shorter term, if the payment still fits. Insurance, fuel, and maintenance are not in this loan. Add them before you decide the payment is affordable.',
        ],
      },
      {
        heading: 'Get the price before you talk about the payment',
        paragraphs: [
          'Dealers can hit almost any monthly number by changing the term, the rate, or the add-ons. Ask for the out-the-door price first. Then bring a rate from a credit union or bank so the financing is a separate decision from the car.',
          'Warranties, gap coverage, and protection packages belong in the fees field if you are actually buying them. Leaving them out of the calculator and then signing them at the desk is how a payment you checked becomes a payment you did not.',
        ],
      },
    ],
  },
  refinance: {
    lede: 'A lower rate is not automatically a cheaper mortgage. Refinancing costs money up front, and restarting the term can add interest even while the payment falls. The useful question is when the savings have paid for the fees, and whether you will still have the loan then.',
    sections: [
      {
        heading: 'Break-even is the only date that matters at first',
        paragraphs: [
          'The calculator prices your current balance at the old rate for the years you have left, then prices the same balance at the new rate and term. The difference in principal and interest is the monthly savings. Divide the closing costs by that savings and you get the month the refinance has paid for itself.',
          'Closing costs are paid in cash here. They are not added to the new loan. If you roll them in, the balance is higher and break-even moves further out. If the new payment is not lower, there is no break-even. You would be paying fees to raise the bill.',
        ],
      },
      {
        heading: 'A smaller payment can still cost more',
        paragraphs: [
          'Resetting a loan that had 27 years left into a new 30-year term lowers the payment partly because the debt is stretched, not only because the rate fell. Compare total interest, then subtract the fees. That net number is the real savings if you keep the loan to the end.',
          'If you might move or refinance again before break-even, the fees are hard to justify. Ask for a quote that matches the term you have left, not only a new 30-year term. The annual percentage rate reflects the fees. The interest rate alone does not.',
        ],
      },
      {
        heading: 'What this comparison leaves on the table',
        paragraphs: [
          'Taxes and insurance do not change just because you refinance, so they are left out of both payments. Cash-out is left out too. The new loan is the same balance you entered. Taking cash out is a different decision, because you are borrowing more, not only borrowing cheaper.',
          'A small rate drop on a small balance often fails this test. A larger drop, or a large balance you will keep for years, often passes. Run your loan estimate, not a rate you saw in an ad.',
        ],
      },
    ],
  },
  rentbuy: {
    lede: 'Rent versus buy is a wealth question, not a monthly-payment contest. Buying builds equity. Renting keeps the down payment invested and can invest the gap whenever rent is cheaper than owning. After selling costs, one of those paths is ahead. Which one depends on how long you stay and what the money you did not spend would have earned.',
    sections: [
      {
        heading: 'Owning costs more than the mortgage',
        paragraphs: [
          'Each month the owner pays principal and interest, property tax, insurance, maintenance, and HOA. Insurance is fixed in this model at $1,900 a year and HOA is zero. Tax and maintenance scale with the home value, so they rise if the house appreciates.',
          'The monthly owning cost on the result is that full stack, not the loan payment alone. A house can look cheaper than rent on principal and interest and still cost more once tax, insurance, and upkeep are in the bill.',
        ],
      },
      {
        heading: 'The renter’s hidden asset',
        paragraphs: [
          'The renter starts with the buyer’s down payment and closing costs invested. Each month, whoever pays less invests the difference at the return you set. Rent rises once a year. If you would not actually invest that difference, lower the return. The renter’s advantage shrinks when the money would have been spent.',
          'At the end, the buyer’s wealth is the invested surplus plus the home value, minus the remaining mortgage and 6 percent selling costs. Selling costs keep a paper gain from looking like cash. A short stay often favors renting because those costs hit before appreciation has had time to work.',
        ],
      },
      {
        heading: 'The comparison is a model, not a forecast',
        paragraphs: [
          'Home prices, rents, and investment returns will not arrive in a smooth line. The chart is a way to see which assumptions the decision depends on. Stretch the stay, change appreciation, or change the investment return and watch which path finishes ahead.',
          'The mortgage interest deduction is not included. Many owners take the standard deduction and get no extra benefit. A payment you can keep, in a place you want to live, can be worth more than a small wealth gap. The calculator will not measure that. It will measure the money.',
        ],
      },
    ],
  },
  loan: {
    lede: 'Paying off debt is a sequencing problem. You already owe the minimums. The extra money you can add each month has to go somewhere, and the order changes how much interest you pay and how fast an account disappears.',
    sections: [
      {
        heading: 'Avalanche spends the extra dollar where it hurts most',
        paragraphs: [
          'Both methods pay the minimum on every debt, then send every extra dollar to one focus debt. Avalanche focuses on the highest interest rate. That usually costs less, because interest is the price of the balance and the highest price gets cut first.',
          'When a debt is gone, its minimum joins the extra payment on the next debt. That roll-forward is why a plan that feels slow at the start speeds up. The payoff date and the interest total are the two numbers to compare.',
        ],
      },
      {
        heading: 'Snowball buys a finished account',
        paragraphs: [
          'Snowball focuses on the smallest balance. It does not minimize interest. It removes a bill, which some people stick with longer. Use it when a quick win is what keeps the plan alive, and check how much extra interest that choice costs.',
          'With a large extra payment, both methods can finish in the same month. The interest totals can still differ. If the gap is small, pick the method you will follow. If the gap is large, the math is asking you to start with the expensive debt.',
        ],
      },
      {
        heading: 'The plan breaks if the balance keeps growing',
        paragraphs: [
          'New charges on a card you are trying to pay off are not in this schedule. The dates assume the balances only fall. Stop adding to the focus account, or the chart is a wish.',
          'Minimums alone can leave a high-rate card in debt for many years. Any amount above the minimums shortens that. A mortgage often should not outrank a card, because the card’s rate is usually much higher. Leave the low-rate mortgage out if attacking it would slow down the expensive debt.',
        ],
      },
    ],
  },
  savings: {
    lede: 'A savings goal has a date hiding inside it. The date depends on what you have, what you add, and the rate the account actually pays. Using a stock-market return for cash you cannot afford to lose makes the date look closer than it is.',
    sections: [
      {
        heading: 'Deposits do the early work',
        paragraphs: [
          'Each month the balance earns one-twelfth of the annual rate, then your contribution is added. Early on, the balance is mostly what you put in. Later, growth matters more because it is earned on a larger base. For a goal a few years away, the contribution is the lever. The rate is not.',
          'The three-year figure is the monthly deposit that hits the same target sooner at the same rate. It is a pace, not a requirement. If you are already saving more than that, you are ahead of a three-year plan.',
        ],
      },
      {
        heading: 'Match the rate to the account',
        paragraphs: [
          'An emergency fund and a house fund that you will spend soon belong in savings, not in a portfolio you might have to sell at a loss. Use the yield on the account where the money will sit. A high-yield savings rate is much lower than a long-run stock return, and the money is there when you need it.',
          'Interest in a taxable account is income. This date is slightly optimistic if the account is not tax-advantaged. That gap is small next to the gap created by skipping a month of contributions.',
        ],
      },
      {
        heading: 'Name the target',
        paragraphs: [
          'A vague “savings” number hides two goals that should not share one pile. An emergency fund is a number of months of expenses. A down payment is a date and a price. Split them, then automate the transfer on payday so the monthly amount is not a decision you remake every month.',
          'If you already have more than the target, the time to the goal is zero. Raise the target, or use the investment growth calculator for a longer horizon where compounding is the point.',
        ],
      },
    ],
  },
  budget: {
    lede: 'A budget is a way to see where take-home pay goes before the month spends it for you. The 50/30/20 guide is a checkpoint: about half for needs, 30 percent for wants, and 20 percent for savings and extra debt payments. Your life will not match those lines exactly. The gaps are the useful part.',
    sections: [
      {
        heading: 'Start with the money that hits the account',
        paragraphs: [
          'Use take-home pay, not your gross salary. Taxes are not a spending choice. Needs are the bills required to stay housed, fed, insured, and getting to work. A car payment far above a reliable used car is partly a want, even though transportation is a need.',
          'Wants are the choices: dining out, travel, hobbies, and most subscriptions. The 30 percent line is a ceiling to notice, not a target to spend up to. Minimum debt payments are needs. Anything above the minimum belongs with savings, because it builds net worth.',
        ],
      },
      {
        heading: 'The leftover is a decision',
        paragraphs: [
          'Unassigned money tends to become spending. If the result shows a surplus, give it a job: the emergency fund, the retirement contribution, or the highest-rate debt. If the result is negative, the plan spends more than the paycheck. Cut a bucket before you wait for a raise.',
          'Count the retirement contribution that already comes out of the paycheck, or you will think you save less than you do. If you also list that amount as spending, you have counted it twice.',
        ],
      },
      {
        heading: 'The ratios are a diagnostic',
        paragraphs: [
          'High-cost cities rarely hit 50 percent needs, because housing takes more. Use the ratio to see that, then build a version you can keep. A perfect ratio you abandon is worse than a smaller savings rate you automate.',
          'If needs are far above half of pay, housing is usually the reason. A raise helps less than a lower housing cost. If savings are under 20 percent, start with something and raise it when a debt is gone. The guide is information, not a grade.',
        ],
      },
    ],
  },
  invest: {
    lede: 'Investment growth is mostly time and contributions. The ending balance is what you deposited plus what compounding added. On a long horizon the growth line pulls away from the deposits. On a short horizon it does not, and a high assumed return is the wrong way to make it look like it does.',
    sections: [
      {
        heading: 'The gap between the two lines is the point',
        paragraphs: [
          'The balance grows by one-twelfth of the annual rate each month, then the contribution is added. Contributions can step up once a year if you set an increase. The default increase is zero, so the monthly amount stays flat, which understates what happens if you raise savings with your income.',
          'The lower line on the chart is only the cash you put in. The gap is the compound return. Growth eventually exceeds a year of deposits because each year’s return applies to everything already saved. That takes a long time. It is not visible in year three.',
        ],
      },
      {
        heading: 'A smooth 7 percent is a planning average',
        paragraphs: [
          'Markets do not pay a steady rate. Seven percent is a common long-run assumption for a diversified stock portfolio, and this tool treats the rate you enter as the return before a separate 2.5 percent inflation view. The real-value figure is what the ending balance buys in today’s dollars. A large future number is smaller than it looks.',
          'Fees come straight out of the return. A 1 percent advisory fee or a expensive fund is not a rounding error over 25 years. The investment fee calculator isolates that cost. Taxes in a taxable account reduce the result further. Neither is in this projection.',
        ],
      },
      {
        heading: 'Use the rate you can defend',
        paragraphs: [
          'Money you need within a few years does not belong in a stock-market assumption. A lower rate is the right stress test when the date is mandatory, such as a tuition bill or a down payment. Raise the contribution before you raise the assumed return. The contribution is the input you control.',
          'This tool projects a balance. The retirement planner compares that kind of projection with an age and a target nest egg. Use this page to see the mechanics. Use the planner when the question is whether you are on track.',
        ],
      },
    ],
  },
  retirement: {
    lede: 'Retirement readiness is a comparison, not a balance. You need a target, a date, and a savings rate. On track means the projection reaches the target by the age you chose. Short means the monthly contribution that would close the gap is higher than what you save now.',
    sections: [
      {
        heading: 'The projection is a smooth path on purpose',
        paragraphs: [
          'Savings compound monthly from your current age to the retirement age. The return does not vary, which makes the path easy to read and too smooth to be a promise. Include the employer match in the monthly amount. It is part of what gets invested.',
          'The required contribution is the deposit that grows today’s balance to the target in the years you have left. Compare it with what you save now. If the required number is unrealistic, delay retirement a few years or lower the target before you assume a higher return.',
        ],
      },
      {
        heading: 'A target needs a reason',
        paragraphs: [
          'A round number is a weak goal. A clearer one is about 25 times the annual spending the portfolio must cover, after Social Security or a pension. That is the same idea as a 4 percent withdrawal. The income field helps you see whether your target is in that neighborhood.',
          'Social Security is not added for you. If it will cover part of your spending, the portfolio can be smaller. Do not type that future income in as if it were already saved. The 4 percent figure on the result is a rough monthly withdrawal from the projected balance, not a guarantee the money lasts.',
        ],
      },
      {
        heading: 'Ahead is not the same as finished',
        paragraphs: [
          'A projection that beats the target assumes you keep contributing and that the return arrives smoothly. Stopping because you are ahead is riskier than it looks, especially if retirement is still decades away. Markets will not follow the line.',
          'Saving enough and spending a sustainable amount are different questions. When you are close, run the drawdown calculator. It asks whether the balance survives the withdrawals, which this planner does not try to answer.',
        ],
      },
    ],
  },
  withdrawal: {
    lede: 'The hard part of retirement is not the balance on the last day of work. It is whether that balance can pay a rising bill for as long as you need it. A withdrawal rate is the first year’s spending divided by the portfolio. Around 4 percent is a checkpoint for a long retirement, not a rule that fits every household.',
    sections: [
      {
        heading: 'Spending rises even if your lifestyle does not',
        paragraphs: [
          'Once a year the portfolio earns the return you entered, then that year’s spending comes out. Next year’s spending is higher by the inflation rate, so the withdrawal keeps its buying power. A portfolio can grow in the early years and still fail later if inflation lifts the withdrawal faster than the investments replace it.',
          'Subtract Social Security and pensions from spending before you enter the withdrawal. The portfolio should not be asked to cover income it does not have to cover. Taxes can apply to withdrawals from traditional accounts. The spending figure should be what leaves the portfolio, including the tax.',
        ],
      },
      {
        heading: 'A steady return hides the real risk',
        paragraphs: [
          'This tool uses one return every year. Real retirements get good and bad years in an unknown order. Poor years early, while you are withdrawing, do more damage than the average suggests. A plan that barely lasts on a smooth line is fragile.',
          'The 4 percent idea comes from historical studies of diversified portfolios over about 30 years. A higher starting rate, a longer horizon, or heavy fees makes it less reliable. A pension or a shorter horizon can make a higher rate reasonable. The calculator will not know which one you have unless you put it in the spending number.',
        ],
      },
      {
        heading: 'If the line hits zero, change the spending',
        paragraphs: [
          'If the plan runs out, cut the first-year spending or delay retirement. Do not fix it only by typing a higher return. Run the expected return, then run a lower one. The second result tells you how much cushion you have.',
          'Home equity is not a monthly withdrawal unless you have a real plan to use it. A plan that ends with a large balance may support more spending, or it may be the cushion that survives a worse market. Treat that leftover as information, not as money you failed to enjoy.',
        ],
      },
    ],
  },
  match401k: {
    lede: 'An employer match is pay you only receive if you contribute. The formula is usually a percent of what you put in, up to a percent of your salary. Contribute less than that cap and the missing match is gone for the year. It does not come back.',
    sections: [
      {
        heading: 'How “50 percent up to 6 percent” actually works',
        paragraphs: [
          'The default formula adds fifty cents for each dollar you contribute, until your contribution reaches 6 percent of pay. Contribute 6 percent and the employer adds 3 percent of salary. Contribute 3 percent and the employer adds 1.5 percent. Contribute 10 percent and the match still stops at 3 percent of pay.',
          'The “left on the table” figure is the match you miss this year by sitting below that cap. On a $95,000 salary, dropping from 6 percent to 3 percent cuts the employer’s addition from $2,850 to $1,425. That is the cost of the lower deferral, before any investment return.',
        ],
      },
      {
        heading: 'The employee cap is not the match',
        paragraphs: [
          'This calculator uses the 2024 employee deferral limit of $23,000. Catch-up contributions after age 50 are not included. Employer money does not count toward that employee cap. At ordinary salaries the overall limit on employer plus employee contributions is not what stops the match.',
          'If your plan matches a flat dollar amount rather than a percent of pay, set the match percent and the “up to” percent so this year’s employer dollar amount matches your plan statement. The formula here is a percent of pay.',
        ],
      },
      {
        heading: 'The full match is the minimum, not the plan',
        paragraphs: [
          'Collect the match before you send extra money to a taxable account. It is an immediate return that the market does not have to deliver. Whether the match alone is enough for retirement is a different question. The retirement planner is the place to test that.',
          'A Roth 401(k) option changes the tax treatment of your deferral, not the match math. The match itself is usually pre-tax. Salary growth raises both your contribution and the match if you keep the same percent of pay. A flat dollar deferral falls behind as pay rises.',
        ],
      },
    ],
  },
  fees: {
    lede: 'A fee is a slice of the return you do not get to keep. One percent a year does not cost one percent of today’s balance. It costs a share of every future year’s growth, because the fee is charged on a larger balance each year and the money it removed never compounds.',
    sections: [
      {
        heading: 'Compare the all-in percent',
        paragraphs: [
          'Each fee is subtracted from the return before the balance compounds. If the portfolio earns 7 percent before fees and the fee is 1 percent, the calculator compounds at 6 percent. That is a close description of a fee taken from the balance, and it is clear enough to show the long-run cost.',
          'Compare fund expense ratios plus any advisory fee. A quoted advice fee can leave the funds out. The defaults compare a 0.08 percent cost with a 1 percent cost because that gap is a common one to ask about. Both sides receive the same contributions and the same return before fees.',
        ],
      },
      {
        heading: 'The dollar gap is the question, not the verdict',
        paragraphs: [
          'A higher fee can be a fair price for advice that raises your savings rate, lowers your taxes, or stops a costly mistake. This page shows the price. It cannot see the advice. Use the gap as the question you ask, not as an automatic no.',
          'A low fee does not fix a savings rate that is too small. Fees on a new account look harmless in year one. Stretch the years. That is when a small annual gap becomes a large share of the ending balance.',
        ],
      },
      {
        heading: 'What the comparison isolates',
        paragraphs: [
          'Taxes, turnover, and account type can matter as much as the headline fee. They are not in this chart. The point of holding them out is to see the fee by itself. If two options also differ in taxes, this gap is only part of the decision.',
          'Ask for the all-in annual percent in writing. Then run it here next to a simpler portfolio you could actually hold. The difference is what the more expensive option has to earn back in better behavior, better taxes, or better planning.',
        ],
      },
    ],
  },
  tax: {
    lede: 'A tax bracket is a layer, not a label for your whole income. Moving into a higher bracket taxes only the dollars inside that layer. The marginal rate is the rate on the next dollar. The effective rate is the blend, and it is lower. Confusing the two is how a raise gets described as if it disappeared.',
    sections: [
      {
        heading: 'How ordinary income is stacked',
        paragraphs: [
          'Taxable income is what remains after pre-tax retirement contributions and after the larger of the standard deduction or your itemized deductions. The 2024 standard deduction used here is $14,600 for single filers, $29,200 for married filing jointly, and $21,900 for head of household. Itemizing helps only when your deductions beat that amount.',
          'The table on the calculator shows how much income landed in each layer. Dollars in the 10 percent and 12 percent layers stay there even if your last dollar is taxed at 22 percent. A raise is taxed in the top bracket only for the part that crosses the threshold.',
        ],
      },
      {
        heading: 'Paycheck taxes are not all income tax',
        paragraphs: [
          'Employees also pay Social Security tax on wages up to the annual wage base and Medicare tax on all wages, plus an extra Medicare tax above a high threshold. A traditional 401(k) contribution reduces income tax in this tool. It does not reduce FICA.',
          'Take-home pay here is gross income minus federal income tax, FICA, and a flat state rate. It is not a paycheck stub. Benefits, health insurance, and a state with its own brackets will make the real paycheck different. The state line is a flat percent of taxable income, which is an estimate, not your state’s form.',
        ],
      },
      {
        heading: 'What this estimate is for',
        paragraphs: [
          'Use it to see the shape of the bill: which bracket you are in, what a pre-tax contribution saves, and how much of the total is payroll tax rather than income tax. Credits, such as the child tax credit, are not applied. They can lower the bill after the bracket math.',
          'The brackets, standard deduction, and Social Security wage base are the 2024 figures, matching the rest of these tools. Long-term capital gains and qualified dividends are taxed as ordinary income here, which overstates the bill if a large share of your income is in those categories. Check a current-year source before you file.',
        ],
      },
    ],
  },
  'self-employed': {
    lede: 'Self-employment tax is the Social Security and Medicare tax that an employer would have split with you. When you work for yourself, you pay both halves. Income tax is a second bill, calculated after a deduction for half of that payroll tax. Nobody withholds either one during the year unless you do.',
    sections: [
      {
        heading: 'The tax base is not the full profit',
        paragraphs: [
          'Self-employment tax is calculated on 92.35 percent of net profit. That factor stands in for the deduction of the employer half. Social Security tax is 12.4 percent of that base, up to the wage base. Medicare tax is 2.9 percent, with an extra 0.9 percent above a high income threshold.',
          'Enter profit after ordinary business expenses and before the self-employment tax deduction. Do not subtract your estimated taxes first, or you will understate the bill. If you also have W-2 wages, enter them. They use up part of the Social Security wage base.',
        ],
      },
      {
        heading: 'Why you deduct half, and why that does not erase the tax',
        paragraphs: [
          'Half of the self-employment tax is subtracted before income tax is estimated. That keeps the same earnings from being fully taxed twice. The deduction does not reduce the self-employment tax itself. You can owe both, and most people with a real profit do.',
          'A pre-tax retirement plan for the self-employed can lower the income tax. It does not erase the payroll tax. State tax is not in this tool. Add your state’s rate on top of the quarterly number.',
        ],
      },
      {
        heading: 'Set the money aside when you get paid',
        paragraphs: [
          'Dividing the annual federal estimate by four is a simple way to set cash aside. Actual estimated-tax rules also look at last year’s tax and can include a penalty if you underpay. This page does not file the vouchers. It tells you a federal amount to move.',
          'The habit that works is moving the set-aside to a separate account when the client pays you, not in March. A profitable year feels like spending money until the quarterly date arrives. The calculator is there so that date is not a surprise.',
        ],
      },
    ],
  },
  roth: {
    lede: 'Roth and traditional accounts tax the same dollars at different times. A traditional account invests the full amount and pays tax when you withdraw. A Roth account invests only what is left after today’s tax, then the withdrawal is tax-free. If the rate now and the rate later match, the spendable results tie. The decision is about which rate is higher.',
    sections: [
      {
        heading: 'The tie is the lesson',
        paragraphs: [
          'Paying tax now shrinks what gets invested. Paying tax later shrinks what you can spend. When the rate is the same and the return is the same, those two effects cancel. A long time until retirement does not, by itself, make Roth better. A lower rate today than the rate you expect later does.',
          'Use your marginal rate, the rate on the dollars you are deciding about, not your overall effective rate. The federal tax estimator shows the marginal bracket. If you expect to be in a lower bracket in retirement, traditional usually leaves more to spend. If you expect a higher bracket later, Roth usually wins.',
        ],
      },
      {
        heading: 'What can tip a close call',
        paragraphs: [
          'This comparison ignores income limits, required distributions, and the chance that a traditional contribution drops you into a cheaper bracket today. Those can matter more than a small difference in the chart. A match is a separate decision: take the full match first. Match dollars are usually pre-tax even when your own deferral is Roth.',
          'If you do not know the future rate, split contributions. The hedge is allowed. When the two rates you type are equal, this tool will show a tie, which is the honest answer under these assumptions.',
        ],
      },
      {
        heading: 'The dollar amount is the decision, not a limit',
        paragraphs: [
          'The default annual amount is close to a recent IRA contribution limit. The math is the same for a 401(k) deferral. Enter the pre-tax dollars you are actually choosing how to classify. Traditional receives the full amount. Roth receives it after today’s tax.',
          'The result assumes the money stays invested for the full period and is then withdrawn under retirement rules. Early-withdrawal penalties are not included. Neither are saver’s credits. Use the spendable balances, not the pre-tax traditional balance, when you compare the two.',
        ],
      },
    ],
  },
  networth: {
    lede: 'Net worth is what you own minus what you owe. It is one number, and it is easy to misread, because a house raises both sides and a high income does not appear in it at all. The trend, updated a couple of times a year, tells you more than any single snapshot.',
    sections: [
      {
        heading: 'Put the house on both sides',
        paragraphs: [
          'Use a value you would actually accept for a home or a car, not a hopeful sale price. The mortgage belongs with the debts, at the payoff balance, not the monthly payment. Leaving the house out hides both the asset and the loan. Home equity is wealth, and it is not cash.',
          'Cash and taxable investments are the liquid part. Retirement accounts count even though taxes and penalties may apply if you spend them early. This tool does not haircut them for a future tax. For a retirement that is years away, the account balance is a fair snapshot. For money you will spend this year, a tax haircut is more honest.',
        ],
      },
      {
        heading: 'Not every debt deserves the same urgency',
        paragraphs: [
          'A mortgage is often the largest debt and the lowest rate. Card balances are usually the opposite. They reduce net worth one dollar for one dollar, and the interest is high enough that paying them down can beat chasing a higher investment return. The debt payoff calculator is the next page if cards are a meaningful share of what you owe.',
          'A negative net worth means debts exceed assets. Recent graduates with student loans are often there. The path out is the same: add assets and retire the expensive debt. The checkpoint labels under the number are sentences, not a score, and they do not know your age or your cost of living.',
        ],
      },
      {
        heading: 'Income is a different question',
        paragraphs: [
          'Income is a flow. Net worth is a stock. A high income with no savings and large debts can sit next to a low net worth. Updating the same fields twice a year keeps market noise from looking like a new financial life.',
          'Leave out personal property you would not sell. A guessed number for furniture makes the total look precise and does not help the decision. The number that matters is the one you can explain line by line.',
        ],
      },
    ],
  },
  college: {
    lede: 'College savings is a race against a price that rises while you save. Today’s tuition is not the bill. The bill is that tuition inflated through the year school starts, and then inflated again for each year after that. The monthly amount that covers it is usually higher than a back-of-the-envelope guess.',
    sections: [
      {
        heading: 'Inflate every year, not just the first',
        paragraphs: [
          'College costs have often risen faster than general prices. The inflation rate you enter compounds from today through the last year of school. The first year in the future is not the same number as the fourth, because the fourth has had more time to rise.',
          'Enter the cost you expect to pay, including housing if you will pay it. Use a net price after aid if you have a grounded estimate. The sticker price is the conservative input when aid is unknown. Scholarships, grants, and a student’s earnings are not assumed unless you lower the annual cost.',
        ],
      },
      {
        heading: 'The savings have to arrive before the bill',
        paragraphs: [
          'Current savings and new monthly deposits compound until school starts. The required deposit is the amount that lands on the inflated total. Your actual deposit produces the projected balance beside it. The gap is the future dollars still uncovered.',
          'The tool assumes the whole sum is available when school starts. It does not keep earning while you pay tuition. That makes the target a little higher than a plan that invests the leftover during the college years. If school is only a few years away, use a savings return, not a stock-market return.',
        ],
      },
      {
        heading: 'A 529 changes the taxes, not the need',
        paragraphs: [
          'The growth math is the same inside or outside a 529. A 529 can make qualified growth tax-free, which this pre-tax projection does not add on top. A state tax benefit for contributions is also left out. Both can close part of a gap. They do not remove the need to save.',
          'Starting earlier does more than picking a slightly higher return. If the gap is large and the start date is close, the monthly number will jump. At that point, cash flow during school and a lower net price matter as much as new savings.',
        ],
      },
    ],
  },
  inflation: {
    lede: 'Inflation is the reason a future expense and a pile of cash are not the numbers they look like today. Prices compound. A 3 percent rate for 20 years does not add 60 percent. It lifts prices by more than that, because each year’s increase applies to the new price, not the original one.',
    sections: [
      {
        heading: 'Two questions, one formula',
        paragraphs: [
          'Future cost grows an amount by inflation. Use it when you want to know what an expense will cost later: a year of college, a retirement budget, a car. Buying power shrinks an amount. Use it when you want to know what money you hold today will purchase after prices rise.',
          'The rule of 72 is a shortcut shown beside the result. Divide 72 by the inflation rate and you get a rough count of the years prices take to double. The chart uses the compound formula, which is the number to put in a plan. The shortcut is for checking your intuition.',
        ],
      },
      {
        heading: 'Pick a rate for the expense, not for the headline',
        paragraphs: [
          'Around 2 to 3 percent is a common long-run planning range for general prices in the United States. College and health care have often run hotter. A one-year spike is a poor 30-year assumption unless you have a reason to think it persists.',
          'This tool does not pay you a return. Cash loses buying power. Money that has to sit for decades needs a return that can clear inflation, which is what the investment and retirement calculators are for. Use this page to move a price level. Use those pages to see whether savings can keep up.',
        ],
      },
      {
        heading: 'A plan that ignores inflation gets quieter every year',
        paragraphs: [
          'A retirement income that never rises buys less every year. The drawdown calculator raises spending for that reason. A college target set in today’s dollars will be short if you save exactly that target and costs rise.',
          'The rate is an assumption you choose, applied steadily. Actual inflation jumps around. The value of the page is seeing how sensitive a long plan is to a rate that sounds small.',
        ],
      },
    ],
  },
  insurance: {
    lede: 'Life insurance is a pile of money that shows up when income does not. The useful estimate starts from the years of income the household would need to replace, adds the debts and goals you would not want left behind, and subtracts what you already have. A rule of thumb such as ten times income skips that arithmetic.',
    sections: [
      {
        heading: 'Replace income for a specific stretch of years',
        paragraphs: [
          'Multiplying income by years funds the household for a fixed period, such as until children are grown or until retirement savings can take over. This version does not assume the death benefit is invested. If the proceeds were invested, the need could be lower. Leaving that return out keeps the estimate conservative.',
          'Count a stay-at-home parent’s work. Replacing childcare and household labor has a cost even when wages are zero. Raise the income or the goals field. Social Security survivor benefits are not included. If your household would receive them, you can reduce the income field by a cautious estimate.',
        ],
      },
      {
        heading: 'Do not count the mortgage twice',
        paragraphs: [
          'A mortgage, student loans, and a college fund are lump sums. They belong in the total once. If the income you are replacing was already meant to cover the mortgage payment, do not also add the whole mortgage balance, or you will insure the same need two ways.',
          'Savings, investments, and existing policies reduce the new coverage. Group life insurance from a job counts only while you would still have it. It often ends when the job ends, so some people leave it out of the existing-coverage field on purpose.',
        ],
      },
      {
        heading: 'The result is a benefit, not a premium',
        paragraphs: [
          'This page estimates additional coverage. It does not price a policy, and it does not choose term or permanent insurance. Term insurance is the usual fit for a need that ends, such as income during working years. Permanent insurance is a different product with a different cost.',
          'Price the premium separately and make sure it fits the budget. An unaffordable policy gets cancelled. Review the number after a child, a mortgage, or a divorce. The old policy does not know about the new life. If the result is zero, current resources cover this particular list. It can still be short if you left out unpaid work or a longer horizon.',
        ],
      },
    ],
  },
};

export function articleFor(id: CalculatorId): CalculatorArticle {
  return ARTICLES[id];
}
