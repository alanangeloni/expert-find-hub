import type { User } from "@supabase/supabase-js";

export const PENDING_VERIFY_EMAIL_KEY = "fp_pending_verify_email";

export const isEmailVerified = (user: User | null | undefined): boolean => {
  if (!user) return false;
  return Boolean(user.email_confirmed_at);
};

export const getPendingVerifyEmail = (): string => {
  if (typeof window === "undefined") return "";
  try {
    return sessionStorage.getItem(PENDING_VERIFY_EMAIL_KEY) || "";
  } catch {
    return "";
  }
};

export const setPendingVerifyEmail = (email: string) => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PENDING_VERIFY_EMAIL_KEY, email);
  } catch {
    // ignore storage errors
  }
};

export const clearPendingVerifyEmail = () => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(PENDING_VERIFY_EMAIL_KEY);
  } catch {
    // ignore storage errors
  }
};

export type ProfilePrefill = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  professionalType: string;
};

export const getUserPrefill = (user: User | null | undefined): ProfilePrefill => {
  const meta = user?.user_metadata ?? {};
  return {
    firstName: String(meta.first_name || meta.firstName || "").trim(),
    lastName: String(meta.last_name || meta.lastName || "").trim(),
    email: String(user?.email || meta.email || "").trim(),
    phoneNumber: String(meta.phone_number || meta.phoneNumber || "").trim(),
    professionalType: String(meta.professional_type || meta.professionalType || "").trim(),
  };
};
