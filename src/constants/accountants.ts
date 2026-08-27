// Accountant directory constants: services, client specialties, and helpers.
// Values must match the `accounting_service_type` and `client_specialty_type`
// database enums exactly.

export const ACCOUNTANT_SERVICES = [
  "Tax Preparation",
  "Business Tax Preparation",
  "Tax Planning & Strategy",
  "IRS Representation & Tax Resolution",
  "Estate & Trust Tax",
  "Bookkeeping",
  "Accounts Payable/Receivable",
  "Payroll Services",
  "Sales Tax",
  "Advisory Services",
  "Business & Entity Formation",
  "Business Formation",
  "Business Valuation",
  "Fractional CFO Services",
  "Controller Services",
  "Cash Flow Forecasting",
  "Cost Accounting",
  "Audit Services",
  "Forensic Accounting",
  "International Tax Services",
  "Mergers and Acquisitions",
  "QuickBooks Setup & Cleanup",
  "Back-Office Support",
] as const;

export const ACCOUNTANT_SPECIALTIES = [
  "Athletes & Entertainers",
  "Bootstrapped Companies",
  "Business Executives",
  "Business Owners/Entrepreneurs",
  "Content Creators",
  "Cryptocurrency Investors",
  "Crypto Investors",
  "Digital Nomads",
  "Divorced Individuals",
  "E-commerce Businesses",
  "Enterprise Companies ($50M+)",
  "Equity Compensation (RSUs, Stock Options)",
  "Generational Wealth Transfer",
  "Growing Companies ($1M-$10M)",
  "HENRY (High Earners Not Rich Yet)",
  "High Net Worth Individuals",
  "International/Expats",
  "K1 Partnership Income",
  "Mid-Market Companies ($10M-$50M)",
  "Multi-generational Families",
  "Multi-state Returns",
  "Pre-Retirees (5-10 years out)",
  "Pre-revenue Startups",
  "Private Equity-Backed Companies",
  "Professors & Educators",
  "QSBS Holders",
  "Real Estate Investors",
  "Retirees",
  "SMB Owner",
  "SMB Owners",
  "Solopreneurs",
  "Ultra High Net Worth Individuals",
  "VC Backed",
  "VC Backed Startups",
  "Young Professionals",
] as const;

export const ACCOUNTANT_CREDENTIALS = [
  "CPA",
  "EA",
  "CMA",
  "CFP",
  "CFA",
  "CIA",
  "CFE",
  "CGMA",
  "JD",
  "MBA",
  "MST",
  "QuickBooks ProAdvisor",
  "Xero Certified",
] as const;

export const accountantSpecialtySlug = (specialty: string) =>
  specialty
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const accountantSpecialtyFromSlug = (slug: string): string | undefined =>
  ACCOUNTANT_SPECIALTIES.find((s) => accountantSpecialtySlug(s) === slug.toLowerCase());

const SPECIALTY_DEFINITIONS: Record<string, string> = {
  "Athletes & Entertainers": "Handles variable income, multi-state filings, and contracts for athletes, artists, and performers.",
  "Bootstrapped Companies": "Supports self-funded startups with lean accounting, cash management, and tax compliance.",
  "Business Executives": "Manages complex personal taxes, deferred compensation, and stock plans for executives.",
  "Business Owners/Entrepreneurs": "Combines business and personal tax strategy for founders and owners.",
  "Content Creators": "Helps creators with self-employment taxes, deductions, and multi-platform income.",
  "Cryptocurrency Investors": "Tracks cost basis and handles tax reporting for digital asset transactions.",
  "Crypto Investors": "Tracks cost basis and handles tax reporting for digital asset transactions.",
  "Digital Nomads": "Advises on residency, foreign income exclusions, and multi-jurisdiction tax for location-independent workers.",
  "Divorced Individuals": "Guides clients through the tax and financial implications of divorce and asset division.",
  "E-commerce Businesses": "Handles sales tax nexus, inventory accounting, and marketplace income for online sellers.",
  "Enterprise Companies ($50M+)": "Provides audit, tax, and advisory for large enterprises with complex structures.",
  "Equity Compensation (RSUs, Stock Options)": "Plans taxes around RSUs, ISOs, NSOs, and ESPPs to minimize surprises at vesting and sale.",
  "Generational Wealth Transfer": "Coordinates estate, gift, and trust tax planning across generations.",
  "Growing Companies ($1M-$10M)": "Scales bookkeeping, reporting, and tax strategy for companies in growth mode.",
  "HENRY (High Earners Not Rich Yet)": "Tax planning for high-income professionals still building wealth.",
  "High Net Worth Individuals": "Advanced tax, estate, and entity planning for significant wealth.",
  "International/Expats": "Cross-border tax compliance, foreign accounts, and expat filings.",
  "K1 Partnership Income": "Handles partnership allocations, basis tracking, and K-1 reporting.",
  "Mid-Market Companies ($10M-$50M)": "Full-service accounting and advisory for established mid-market businesses.",
  "Multi-generational Families": "Long-term tax and estate coordination for family wealth.",
  "Multi-state Returns": "Files and plans across multiple state tax jurisdictions.",
  "Pre-Retirees (5-10 years out)": "Tax-efficient planning in the final years before retirement.",
  "Pre-revenue Startups": "Entity setup, R&D credits, and early-stage compliance before revenue.",
  "Private Equity-Backed Companies": "Meets the reporting, audit, and tax demands of PE ownership.",
  "Professors & Educators": "Taxes for academics, including grants, sabbaticals, and retirement plans.",
  "QSBS Holders": "Maximizes Qualified Small Business Stock exclusions under Section 1202.",
  "Real Estate Investors": "Cost segregation, 1031 exchanges, and passive income rules for property investors.",
  "Retirees": "Retirement income, RMD, and tax planning for retirees.",
  "SMB Owner": "Bookkeeping, payroll, and tax for small and mid-sized business owners.",
  "SMB Owners": "Bookkeeping, payroll, and tax for small and mid-sized business owners.",
  "Solopreneurs": "Simple, efficient accounting and taxes for one-person businesses.",
  "Ultra High Net Worth Individuals": "Family office level tax, estate, and entity coordination.",
  "VC Backed": "GAAP reporting, 409A coordination, and board-ready financials for venture-backed startups.",
  "VC Backed Startups": "GAAP reporting, 409A coordination, and board-ready financials for venture-backed startups.",
  "Young Professionals": "Getting finances and taxes right early in a career.",
};

export const accountantSpecialtyDefinition = (specialty: string): string =>
  SPECIALTY_DEFINITIONS[specialty] ||
  `Accountants who specialize in working with ${specialty.toLowerCase()}.`;
