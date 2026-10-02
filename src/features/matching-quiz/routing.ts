import type { QuizAnswers, QuizPath, QuizPhase } from "./types";

/**
 * Routing table (build spec §8), Accountants + Advisors only.
 * Upsell (crossSell) is additive — never switches branch.
 *
 * Accountants (tax):
 *   primary → services → crossSell → taxFork
 *     Personal finances → persona → intent → financial → logistics → contact
 *     My business       → industry → financial → logistics → contact
 *     Both              → industry → persona → intent → financial → logistics → contact
 *
 * Advisors (wealth):
 *   primary → services → crossSell → persona → intent → financial → logistics → contact
 *   (skips business/personal fork)
 */
export function nextPhase(phase: QuizPhase, answers: QuizAnswers): QuizPhase | null {
  const path = answers.path;
  if (!path) return phase === "primary" ? null : "primary";

  switch (phase) {
    case "primary":
      return "services";
    case "services":
      return "crossSell";
    case "crossSell":
      return path === "tax" ? "taxFork" : "persona";
    case "taxFork":
      return answers.taxFilingType === "Personal finances" ? "persona" : "industry";
    case "industry":
      if (path === "tax" && answers.taxFilingType === "My business") return "financial";
      return "persona";
    case "persona":
      return "intent";
    case "intent":
      return "financial";
    case "financial":
      return "logistics";
    case "logistics":
      return "contact";
    case "contact":
      return "results";
    case "results":
      return "confirmation";
    default:
      return null;
  }
}

export function prevPhase(phase: QuizPhase, answers: QuizAnswers): QuizPhase | null {
  const path = answers.path;

  switch (phase) {
    case "services":
      return "primary";
    case "crossSell":
      return "services";
    case "taxFork":
      return "crossSell";
    case "industry":
      return path === "tax" ? "taxFork" : "crossSell";
    case "persona":
      if (path === "tax") {
        if (answers.taxFilingType === "Personal finances") return "taxFork";
        if (answers.taxFilingType === "Both") return "industry";
        return "crossSell";
      }
      return "crossSell";
    case "intent":
      return "persona";
    case "financial":
      if (path === "tax" && answers.taxFilingType === "My business") return "industry";
      return "intent";
    case "logistics":
      return "financial";
    case "contact":
      return "logistics";
    case "results":
      return "contact";
    case "confirmation":
      return "results";
    default:
      return null;
  }
}

export function phaseAfterBranchSelect(path: QuizPath): QuizPhase {
  return "services";
}
