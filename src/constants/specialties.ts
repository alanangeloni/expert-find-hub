// Public-facing specialty taxonomy (matches the design system) mapped to the
// underlying "Advisor Services" values stored in the database.
export const SPECIALTY_GROUPS: { label: string; values: string[] }[] = [
  { label: 'Retirement Planning', values: ['Retirement Planning', 'Retirement Income Management'] },
  { label: 'Estate Planning', values: ['Estate Planning', 'Estate/Trust Planning', 'Inheritance'] },
  { label: 'Tax Strategy', values: ['Tax Strategy', 'Tax Planning'] },
  { label: 'Investment Management', values: ['Investment Management', 'Portfolio Construction'] },
  { label: 'College Savings', values: ['College Savings', 'Education Planning'] },
  { label: 'Insurance Planning', values: ['Insurance Planning', 'Long-term Care'] },
  {
    label: 'Business Owners',
    values: ['Business Owners', 'Small Business Planning', 'Business Succession Planning', 'Succession Planning'],
  },
  { label: 'Tech Equity', values: ['Tech Equity', 'Employee/Employer Benefits'] },
  { label: 'Divorce Planning', values: ['Divorce Planning'] },
  {
    label: 'Sustainable Investing',
    values: ['Sustainable Investing', 'Socially Responsible Investing', 'Environment, Social, and Governance'],
  },
  { label: 'High Net Worth', values: ['High Net Worth', 'Wealth Management', 'Alternative Investments'] },
  {
    label: 'Young Professionals',
    values: ['Young Professionals', 'Early Career Planning', 'Debt Management', 'Budgeting'],
  },
];

export const SPECIALTY_LABELS = SPECIALTY_GROUPS.map((g) => g.label);

export const valuesForSpecialty = (label: string): string[] => {
  const group = SPECIALTY_GROUPS.find((g) => g.label === label);
  return group ? group.values : [label];
};

export const FEE_STRUCTURE_OPTIONS = [
  'Fee-Only',
  'Fee-Based',
  'Assets Under Management',
  'Flat Fee',
  'Hourly',
  'Commission',
];
