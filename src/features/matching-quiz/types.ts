export type QuizPath = "tax" | "wealth";

export type QuizPhase =
  | "primary"
  | "services"
  | "crossSell"
  | "taxFork"
  | "industry"
  | "persona"
  | "intent"
  | "financial"
  | "logistics"
  | "contact"
  | "results"
  | "confirmation";

export interface QuizAnswers {
  path: QuizPath | null;
  services: string[];
  additionalNeeds: string[];
  taxFilingType: string;
  industry: string;
  industryOther: string;
  personaTags: string[];
  intentReason: string;
  financialSize: string;
  investableAssets: string;
  annualIncome: string;
  ageRange: string;
  timing: string;
  state: string;
  outsideUs: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
}

export interface QuizMatchCard {
  id: string;
  name: string;
  slug: string;
  firmName?: string;
  city?: string;
  state?: string;
  headshotUrl?: string;
  href: string;
  subtitle?: string;
}

/** Snake_case payload posted on submit (build spec §10). */
export interface QuizLeadPayload {
  session_id: string;
  source: string;
  status: string;
  path: QuizPath | null;
  services: string[] | null;
  additional_needs: string[] | null;
  tax_filing_type: string | null;
  industry: string | null;
  industry_other: string | null;
  persona_tags: string[] | null;
  intent_reason: string | null;
  financial_size: string | null;
  investable_assets: string | null;
  annual_income: string | null;
  age_range: string | null;
  timing: string | null;
  state: string | null;
  outside_us: boolean;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  current_step: number;
  last_phase: string;
  submitted_at: string;
}

export const INITIAL_ANSWERS: QuizAnswers = {
  path: null,
  services: [],
  additionalNeeds: [],
  taxFilingType: "",
  industry: "",
  industryOther: "",
  personaTags: [],
  intentReason: "",
  financialSize: "",
  investableAssets: "",
  annualIncome: "",
  ageRange: "",
  timing: "Within 1–2 weeks",
  state: "",
  outsideUs: false,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  notes: "",
};

/** Progress bar step numbers (1–6). Intermediate screens share a step. */
export const PHASE_STEP: Record<QuizPhase, number> = {
  primary: 1,
  services: 2,
  crossSell: 2,
  taxFork: 2,
  industry: 3,
  persona: 3,
  intent: 3,
  financial: 4,
  logistics: 5,
  contact: 6,
  results: 6,
  confirmation: 6,
};

export const TOTAL_STEPS = 6;
