import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { Seo } from "@/components/seo/Seo";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setResetSent(true);
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for a link to reset your password",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred sending the password reset email";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page page-enter">
      <Seo
        title="Reset Your Password | Financial Professional"
        description="Request a password reset link for your Financial Professional account."
        noIndex
      />
      <div className="auth-page__bg" aria-hidden="true">
        <div className="auth-page__orb auth-page__orb--1" />
        <div className="auth-page__orb auth-page__orb--2" />
      </div>

      <div className="auth-shell">
        <div className="auth-brand">
          <span className="keyline" />
          <p className="auth-eyebrow">Account recovery</p>
          <h1>
            {resetSent ? (
              <>
                Check your
                <br />
                <em>email</em>
              </>
            ) : (
              <>
                Reset your
                <br />
                <em>password</em>
              </>
            )}
          </h1>
          <p>
            {resetSent
              ? `We sent a reset link to ${email}.`
              : "Enter your email and we’ll send a secure reset link."}
          </p>
        </div>

        <div className="auth-panel">
          {resetSent ? (
            <div className="auth-actions">
              <button
                type="button"
                className="btn btn--outline btn--lg btn--full"
                onClick={() => setResetSent(false)}
              >
                Try a different email
              </button>
              <p className="auth-switch" style={{ textAlign: "center" }}>
                <Link to="/auth/signin">Back to sign in</Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="auth-field">
                <label htmlFor="email">Email address *</label>
                <div className="auth-input-wrap">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="auth-input"
                    autoComplete="email"
                    required
                    aria-required="true"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@firm.com"
                  />
                </div>
              </div>

              <div className="auth-actions">
                <button
                  type="submit"
                  className="btn btn--green btn--lg btn--full"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending…" : "Send reset link"}
                </button>
                <p className="auth-switch" style={{ textAlign: "center" }}>
                  <Link to="/auth/signin">Back to sign in</Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
