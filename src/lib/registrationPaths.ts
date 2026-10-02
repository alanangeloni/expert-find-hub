/** Shared helpers for advisor vs accountant create-profile destinations. */

export const ADVISOR_REGISTRATION_PATH = "/advisor-registration";
export const ACCOUNTANT_REGISTRATION_PATH = "/accountant-registration";

export const REGISTRATION_PATH_KEY = "fp_registration_path";

export const ACCOUNTANT_PROFESSIONAL_TYPES = [
  "Accountant",
  "CPA",
  "Enrolled Agent (EA)",
] as const;

export type AccountantProfessionalType =
  (typeof ACCOUNTANT_PROFESSIONAL_TYPES)[number];

export const isAccountantProfessionalType = (value: string | null | undefined) =>
  Boolean(
    value &&
      ACCOUNTANT_PROFESSIONAL_TYPES.includes(
        value as AccountantProfessionalType
      )
  );

export const isSafeInternalPath = (path: string | null | undefined): path is string =>
  Boolean(path && path.startsWith("/") && !path.startsWith("//"));

export const getStoredRegistrationPath = (): string => {
  if (typeof window === "undefined") return ADVISOR_REGISTRATION_PATH;
  try {
    const stored = sessionStorage.getItem(REGISTRATION_PATH_KEY);
    if (isSafeInternalPath(stored)) return stored;
  } catch {
    // ignore storage errors
  }
  return ADVISOR_REGISTRATION_PATH;
};

export const setStoredRegistrationPath = (path: string) => {
  if (typeof window === "undefined") return;
  if (!isSafeInternalPath(path)) return;
  try {
    sessionStorage.setItem(REGISTRATION_PATH_KEY, path);
  } catch {
    // ignore storage errors
  }
};

export const clearStoredRegistrationPath = () => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(REGISTRATION_PATH_KEY);
  } catch {
    // ignore storage errors
  }
};

/** Resolve create-profile destination from signup intent / type / redirect. */
export const resolveRegistrationPath = (opts: {
  redirect?: string | null;
  intent?: string | null;
  professionalType?: string | null;
}): string => {
  if (isSafeInternalPath(opts.redirect)) {
    if (opts.redirect.includes("accountant")) return ACCOUNTANT_REGISTRATION_PATH;
    if (opts.redirect.includes("advisor")) return ADVISOR_REGISTRATION_PATH;
    return opts.redirect;
  }
  if (opts.intent === "accountant") return ACCOUNTANT_REGISTRATION_PATH;
  if (opts.intent === "advisor") return ADVISOR_REGISTRATION_PATH;
  if (isAccountantProfessionalType(opts.professionalType)) {
    return ACCOUNTANT_REGISTRATION_PATH;
  }
  return ADVISOR_REGISTRATION_PATH;
};
