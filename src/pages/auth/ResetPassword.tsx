import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { Seo } from "@/components/seo/Seo";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast({
          title: "Invalid or expired link",
          description: "Please request a new password reset link",
          variant: "destructive",
        });
        navigate("/auth/forgot-password");
        return;
      }
      setHasSession(true);
    };

    checkSession();
  }, [navigate, toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been successfully reset",
      });

      navigate("/auth/signin");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred during password reset";
      toast({
        title: "Error resetting password",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasSession) {
    return (
      <div className="auth-page page-enter">
        <div className="onboard-loading">Checking reset link…</div>
      </div>
    );
  }

  return (
    <div className="auth-page page-enter">
      <Seo
        title="Set a New Password | Financial Professional"
        description="Choose a new password for your Financial Professional account."
        noIndex
      />
      <div className="auth-page__bg" aria-hidden="true">
        <div className="auth-page__orb auth-page__orb--1" />
        <div className="auth-page__orb auth-page__orb--2" />
      </div>

      <div className="auth-shell">
        <div className="auth-brand">
          <span className="keyline" />
          <p className="auth-eyebrow">Security</p>
          <h1>
            Choose a
            <br />
            <em>new password</em>
          </h1>
          <p>Use a strong password you haven’t used elsewhere.</p>
        </div>

        <div className="auth-panel">
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="auth-field">
              <label htmlFor="password">New password *</label>
              <div className="auth-input-wrap auth-input-wrap--password">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="auth-input"
                  required
                  aria-required="true"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="auth-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirm new password *</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                className="auth-input"
                required
                aria-required="true"
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="auth-actions">
              <button
                type="submit"
                className="btn btn--green btn--lg btn--full"
                disabled={isLoading}
              >
                {isLoading ? "Updating password…" : "Reset password"}
              </button>
              <p className="auth-switch" style={{ textAlign: "center" }}>
                <Link to="/auth/signin">Back to sign in</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
