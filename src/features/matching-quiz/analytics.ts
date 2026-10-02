type AnalyticsPayload = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    fpQuizAnalytics?: Array<{ event: string; payload: AnalyticsPayload; at: string }>;
  }
}

function emit(event: string, payload: AnalyticsPayload = {}) {
  const entry = { event, payload, at: new Date().toISOString() };
  try {
    window.fpQuizAnalytics = window.fpQuizAnalytics || [];
    window.fpQuizAnalytics.push(entry);
  } catch {
    /* ignore */
  }
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...payload });
  } catch {
    /* ignore */
  }
  if (import.meta.env.DEV) {
    console.info("[quiz analytics]", event, payload);
  }
}

export const quizAnalytics = {
  started: (sessionId: string) =>
    emit("quiz_started", { session_id: sessionId }),
  branchSelected: (sessionId: string, path: string) =>
    emit("quiz_branch_selected", { session_id: sessionId, path }),
  stepCompleted: (sessionId: string, phase: string, step: number) =>
    emit("quiz_step_completed", { session_id: sessionId, phase, step }),
  completed: (sessionId: string, path: string | null) =>
    emit("quiz_completed", { session_id: sessionId, path }),
};
