import type { QuizPath } from "./types";

/** Verbatim question/option copy adapted from owner build tree (Sam's List–aligned). */

export const PRIMARY_OPTIONS = [
  {
    path: "tax" as QuizPath,
    title: "Taxes & accounting",
    subtitle: "CPA, tax strategy, tax prep",
  },
  {
    path: "wealth" as QuizPath,
    title: "Wealth & financial planning",
    subtitle: "Financial advisor, investing, retirement",
  },
];

export const PRIMARY_QUESTION = "What's your biggest financial priority right now?";
export const PRIMARY_SUBTEXT = "Pick the one that's most pressing.";

export const SERVICES_BY_PATH: Record<QuizPath, string[]> = {
  tax: [
    "Tax prep & filing",
    "Tax strategy & planning",
    "IRS audit help",
    "Bookkeeping",
    "Payroll",
    "R&D tax credits",
    "Sales tax compliance",
    "International tax",
  ],
  wealth: [
    "Financial planning",
    "Investment management",
    "Retirement planning",
    "401(k) & IRA management",
    "Wealth transfer & inheritance",
    "Tax strategy",
    "Exit planning",
    "Estate planning",
    "Insurance & risk management",
    "Equity compensation",
  ],
};

export const SERVICES_QUESTION = "What do you need help with?";
export const SERVICES_SUBTEXT = "Select all that apply.";

/** Upsell is additive only — does not switch branch. */
export const CROSS_SELL_BY_PATH: Record<
  QuizPath,
  { options: string[]; exclusive: string }
> = {
  tax: {
    options: [
      "Wealth management or investing",
      "Fractional CFO support",
      "Just taxes for now",
    ],
    exclusive: "Just taxes for now",
  },
  wealth: {
    options: [
      "Tax prep or tax strategy",
      "Bookkeeping",
      "Fractional CFO support",
      "Just wealth management for now",
    ],
    exclusive: "Just wealth management for now",
  },
};

export const CROSS_SELL_QUESTION = "Do you also need help with anything else?";
export const CROSS_SELL_SUBTEXT =
  "We'll include matching professionals for any additional needs.";

export const TAX_FORK_OPTIONS = ["My business", "Personal finances", "Both"];
export const TAX_FORK_QUESTION =
  "Is this for your business, personal finances, or both?";
export const TAX_FORK_SUBTEXT = "Select one to continue.";

export const INDUSTRIES = [
  "Construction & trades",
  "Consulting",
  "Creator & media",
  "Dental",
  "E-commerce",
  "Education",
  "Finance & fintech",
  "Food & beverage",
  "Healthcare",
  "Legal",
  "Logistics & transportation",
  "Manufacturing",
  "Nonprofit",
  "Other",
  "Professional services",
  "Real estate",
  "Restaurant & hospitality",
  "Retail",
  "SaaS / Software",
  "Technology",
].sort((a, b) => a.localeCompare(b));

export const INDUSTRY_QUESTION = "What industry are you in?";
export const INDUSTRY_SUBTEXT =
  "Helps us match you with professionals who know your space.";

export const PERSONAS_BY_PATH: Record<QuizPath, string[]> = {
  tax: [
    "W2 income",
    "Real estate investor",
    "Crypto investor",
    "QSBS holder",
    "International / expat",
    "High net worth ($1M+)",
    "Ultra high net worth ($10M+)",
    "Startup equity or stock options",
    "Solopreneur / freelancer",
    "None of the above",
  ],
  wealth: [
    "Equity comp (RSUs, options)",
    "Entrepreneur / founder",
    "FIRE (Financially Independent, Retire Early)",
    "Retirees",
    "Recent windfall or inheritance",
    "Young professional",
    "HENRY (High Earner, Not Rich Yet)",
    "High Net Worth Individual",
    "Ultra High Net Worth Individual",
    "None of the above",
  ],
};

export const PERSONA_NONE = "None of the above";
export const PERSONA_QUESTION = "Which of these describe you?";
export const PERSONA_SUBTEXT = "Select all that apply.";

export const INTENT_OPTIONS = [
  "I don't have anyone yet",
  "I'm unhappy with who I'm currently working with",
  "My situation has changed and I need a new specialist",
  "I want a second opinion on my current setup",
  "I'm looking for a more affordable option",
  "Just exploring for now",
];
export const INTENT_EXCLUSIVE = "Just exploring for now";
export const INTENT_QUESTION = "What's bringing you here today?";
export const INTENT_SUBTEXT = "Select one.";

/** Shared slider value ladder (pre-fills so Continue is never blocked on slider-only steps). */
export const SLIDER_VALUES = [
  100_000, 250_000, 500_000, 750_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000,
  5_000_000, 7_500_000, 10_000_000, 15_000_000,
];
export const SLIDER_DEFAULT_INDEX = 2; // $500,000

/** Open decision: neutral label for accountant Step 4 (not "business revenue" on personal). */
export const ACCOUNTANT_REVENUE_QUESTION = "What's your annual revenue?";

export const WEALTH_ASSETS_QUESTION =
  "How much do you have invested or available to invest?";
export const WEALTH_INCOME_QUESTION = "What is your annual household income?";
export const AGE_RANGE_OPTIONS = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
export const AGE_RANGE_QUESTION = "What's your age range?";
export const AGE_RANGE_SUBTEXT = "Helps the advisor tailor their recommendation.";

export const TIMING_OPTIONS = [
  "Within 1–2 weeks",
  "Within a month",
  "Within 2–3 months",
  "Just exploring",
].sort((a, b) => a.localeCompare(b));

export const LOGISTICS_QUESTION = "A few last things";
export const LOGISTICS_SUBTEXT = "Location and timing.";
export const TIMING_LABEL = "When are you looking to get started?";
export const STATE_LABEL = "Where are you located?";

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
  "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
  "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

/** Privacy copy — VERBATIM from build spec. */
export const PRIVACY_COPY =
  "Your information stays private. We only share your details with professionals you personally select — never automatically, and never without your say-so.";

export const CONTACT_EYEBROW = "Almost there";
export const CONTACT_HEADING_WITH_PREVIEW = "Your matches are ready";
export const CONTACT_HEADING = "Where should we send your matches?";
export const CONTACT_SUB_WITH_PREVIEW =
  "Enter your details below to reveal your personalized matches.";
export const CONTACT_SUB = "We'll show you 5 vetted professionals right after.";

export const MATCHES_FOUND_LABEL = "5 matches found";
export const MATCHES_UNLOCK_HINT = "Enter your details to unlock";

export function formatCurrency(value: number, plusLast = false, isLast = false): string {
  if (value === 0) return "$0";
  const base = "$" + value.toLocaleString("en-US");
  return isLast && plusLast ? `${base}+` : base;
}

export function defaultSliderLabel(): string {
  return formatCurrency(SLIDER_VALUES[SLIDER_DEFAULT_INDEX], true, false);
}
