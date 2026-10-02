import { INITIAL_ANSWERS, type QuizAnswers, type QuizPhase } from "./types";

const SESSION_KEY = "fp_quiz_session_id";
const STATE_KEY = "fp_quiz_state_v1";

export interface PersistedQuizState {
  answers: QuizAnswers;
  phase: QuizPhase;
  updatedAt: string;
}

export function getOrCreateSessionId(): string {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function rotateSessionId(): string {
  try {
    const id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function loadQuizState(): PersistedQuizState | null {
  try {
    const raw = sessionStorage.getItem(STATE_KEY) || localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedQuizState;
    if (!parsed?.answers || !parsed?.phase) return null;
    return {
      answers: { ...INITIAL_ANSWERS, ...parsed.answers },
      phase: parsed.phase,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveQuizState(answers: QuizAnswers, phase: QuizPhase): void {
  const payload: PersistedQuizState = {
    answers,
    phase,
    updatedAt: new Date().toISOString(),
  };
  try {
    const raw = JSON.stringify(payload);
    sessionStorage.setItem(STATE_KEY, raw);
    localStorage.setItem(STATE_KEY, raw);
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearQuizState(): void {
  try {
    sessionStorage.removeItem(STATE_KEY);
    localStorage.removeItem(STATE_KEY);
  } catch {
    /* ignore */
  }
}
