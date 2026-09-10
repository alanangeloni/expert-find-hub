ALTER TABLE public.accountants
  ADD COLUMN IF NOT EXISTS tagline text,
  ADD COLUMN IF NOT EXISTS profile_url text,
  ADD COLUMN IF NOT EXISTS role_badges text[],
  ADD COLUMN IF NOT EXISTS team_size text,
  ADD COLUMN IF NOT EXISTS founded integer,
  ADD COLUMN IF NOT EXISTS serves_clients text,
  ADD COLUMN IF NOT EXISTS dedicated_staff boolean,
  ADD COLUMN IF NOT EXISTS tech_stack text[],
  ADD COLUMN IF NOT EXISTS pricing_packages text,
  ADD COLUMN IF NOT EXISTS industries_served text[],
  ADD COLUMN IF NOT EXISTS min_revenue text;

ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS '401(k) & IRA Management';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Asset Allocation';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Bank Reconciliation';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Board & Investor Relations';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Budgeting & Forecasting';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Business Succession Planning';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Business Valuations';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Capital Structure Planning';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Cash Flow Management';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Cash Flow Planning';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Charitable Giving';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Debt Management';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Education Planning';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Estate Planning';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Executive Compensation';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Exit Planning';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Family Office Services';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Family Wealth Transfer';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Financial Advice & Coaching';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Financial Modeling';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Financial Planning';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Financial Reporting';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Financial Strategy Development';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Financial Systems Implementation';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Fundraising Support';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Individual Tax Preparation';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Insurance Planning';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Investment Management';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Investor Pitch Development';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Life Transition Planning';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Pension Planning';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Philanthropic Planning';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Portfolio Management';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Portfolio Rebalancing';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Process Optimization';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'R&D Tax Credits';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Real Estate Advisory';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Retirement Planning';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Risk Management';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Social Security Planning';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Stock Option Planning';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Tax Loss Harvesting';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Wealth Management';