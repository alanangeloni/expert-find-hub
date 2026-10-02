import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, RefreshCw } from "lucide-react";
import { clearPendingVerifyEmail, isEmailVerified } from "@/lib/authHelpers";
import {
  ACCOUNTANT_REGISTRATION_PATH,
  getStoredRegistrationPath,
} from "@/lib/registrationPaths";

interface EmailVerificationBannerProps {
  email: string;
  compact?: boolean;
  onResent?: () => void;
  onVerified?: () => void;
  /** Override destination after verification (defaults to stored registration path). */
  redirectTo?: string;
}

export const EmailVerificationBanner = ({
  email,
  compact = false,
  onResent,
  onVerified,
  redirectTo,
}: EmailVerificationBannerProps) => {
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const destination = redirectTo || getStoredRegistrationPath();
  const profileNoun =
    destination === ACCOUNTANT_REGISTRATION_PATH ? "accountant" : "advisor";

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}${destination}`,
        },
      });
      if (error) throw error;
      toast({
        title: "Verification email sent",
        description: `Check ${email} for a link to verify your account.`,
      });
      onResent?.();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unable to resend verification email";
      toast({
        title: "Could not resend email",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerified = async () => {
    setIsChecking(true);
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (data.user && isEmailVerified(data.user)) {
        clearPendingVerifyEmail();
        toast({
          title: "Email verified",
          description: "You’re cleared to continue registration.",
        });
        onVerified?.();
        window.location.assign(destination);
        return;
      }
      toast({
        title: "Not verified yet",
        description: "Open the link in your email, then try again.",
        variant: "destructive",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unable to check verification status";
      toast({
        title: "Could not check status",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div
      className={`verify-banner${compact ? " verify-banner--compact" : ""}`}
      role="status"
      aria-live="polite"
    >
      <div className="verify-banner__icon" aria-hidden="true">
        <Mail className="h-5 w-5" />
      </div>
      <div className="verify-banner__copy">
        <p className="verify-banner__title">Verify your email to continue</p>
        <p className="verify-banner__text">
          We sent a verification link to <strong>{email || "your inbox"}</strong>. Open that email
          and confirm your address before you can submit your {profileNoun} profile.
        </p>
      </div>
      <div className="verify-banner__actions">
        <button
          type="button"
          className="btn btn--outline btn--sm verify-banner__action"
          onClick={handleResend}
          disabled={isResending || !email}
          aria-busy={isResending}
        >
          <RefreshCw className={`h-4 w-4${isResending ? " animate-spin" : ""}`} aria-hidden="true" />
          {isResending ? "Sending…" : "Resend verification email"}
        </button>
        <button
          type="button"
          className="btn btn--green btn--sm verify-banner__action"
          onClick={handleCheckVerified}
          disabled={isChecking}
          aria-busy={isChecking}
        >
          {isChecking ? "Checking…" : "I’ve verified — refresh"}
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
