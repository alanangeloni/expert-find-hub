import { supabase } from "@/integrations/supabase/client";
import { getAdvisors } from "@/services/advisorsService";
import { getAllAccountants } from "@/services/accountantsService";
import type { QuizAnswers, QuizLeadPayload, QuizMatchCard, QuizPath } from "./types";
import { PHASE_STEP } from "./types";
import { defaultSliderLabel } from "./content";

// Table is added via migration; generated Database types may lag until regen.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const quizTable = () => (supabase.from as any)("quiz_leads");

export function buildLeadPayload(
  answers: QuizAnswers,
  sessionId: string,
  phase: string,
  status: string
): QuizLeadPayload {
  return {
    session_id: sessionId,
    source: "matching_quiz_v1",
    status,
    path: answers.path,
    services: answers.services.length ? answers.services : null,
    additional_needs: answers.additionalNeeds.length ? answers.additionalNeeds : null,
    tax_filing_type: answers.taxFilingType || null,
    industry: answers.industry || null,
    industry_other: answers.industryOther || null,
    persona_tags: answers.personaTags.length ? answers.personaTags : null,
    intent_reason: answers.intentReason || null,
    financial_size: answers.financialSize || null,
    investable_assets: answers.investableAssets || null,
    annual_income: answers.annualIncome || null,
    age_range: answers.ageRange || null,
    timing: answers.timing || null,
    state: answers.state || null,
    outside_us: !!answers.outsideUs,
    first_name: answers.firstName || null,
    last_name: answers.lastName || null,
    email: answers.email || null,
    phone: answers.phone || null,
    notes: answers.notes || null,
    current_step: PHASE_STEP[phase as keyof typeof PHASE_STEP] ?? 1,
    last_phase: phase,
    submitted_at: new Date().toISOString(),
  };
}

export async function saveQuizLead(payload: QuizLeadPayload): Promise<{ error?: string }> {
  try {
    const { error } = await quizTable().upsert(payload, { onConflict: "session_id" });
    if (error) {
      console.error("quiz_leads upsert failed", error);
      return { error: error.message };
    }
    return {};
  } catch (err) {
    console.error("quiz_leads upsert threw", err);
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

/** Option A: no scoring — take first 5 directory profiles for the selected branch. */
export async function fetchDirectoryMatches(
  path: QuizPath | null,
  state?: string
): Promise<QuizMatchCard[]> {
  if (path === "tax") {
    let accountants = await getAllAccountants();
    if (state) {
      const filtered = accountants.filter(
        (a) =>
          a.state_hq === state ||
          (a.states_served || []).includes(state) ||
          (a.states_served || []).some((s) => s.toLowerCase() === state.toLowerCase())
      );
      if (filtered.length >= 3) accountants = filtered;
    }
    return accountants.slice(0, 5).map((a) => ({
      id: a.id,
      name: a.name,
      slug: a.slug,
      firmName: a.firm_name,
      city: a.city,
      state: a.state_hq,
      headshotUrl: a.headshot_url,
      href: `/accountants/${a.slug}`,
      subtitle: [a.credentials?.[0], a.firm_name].filter(Boolean).join(" · "),
    }));
  }

  const { data } = await getAdvisors({
    page: 1,
    pageSize: 12,
    state: state || undefined,
  });
  let advisors = data;
  if (advisors.length < 5 && state) {
    const fallback = await getAdvisors({ page: 1, pageSize: 12 });
    advisors = fallback.data;
  }
  return advisors.slice(0, 5).map((a) => ({
    id: a.id,
    name: a.name,
    slug: a.slug,
    firmName: a.firm_name,
    city: a.city,
    state: a.state_hq,
    headshotUrl: a.headshot_url,
    href: `/advisors/${a.slug}`,
    subtitle: [a.position, a.firm_name].filter(Boolean).join(" · "),
  }));
}

export function ensureSliderDefaults(answers: QuizAnswers): QuizAnswers {
  const next = { ...answers };
  const def = defaultSliderLabel();
  if (next.path === "tax" && !next.financialSize) next.financialSize = def;
  if (next.path === "wealth") {
    if (!next.investableAssets) next.investableAssets = def;
    if (!next.annualIncome) next.annualIncome = def;
  }
  return next;
}
