import type { CalculatorMeta } from './catalog';

export type CalculatorHandoff = {
  slug: string;
  name: string;
  goal: string;
  summary: string;
};

const KEY = 'fp.calculator.handoff';

export function saveHandoff(meta: CalculatorMeta, summary: string) {
  const payload: CalculatorHandoff = {
    slug: meta.slug,
    name: meta.name,
    goal: meta.goal,
    summary: summary || meta.tagline,
  };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
  return payload;
}

export function readHandoff(): CalculatorHandoff | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CalculatorHandoff;
    if (!parsed?.name || !parsed?.goal) return null;
    return parsed;
  } catch {
    return null;
  }
}
