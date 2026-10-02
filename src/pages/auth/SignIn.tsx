import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { clearPendingVerifyEmail, isEmailVerified } from "@/lib/authHelpers";

const SignIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/";

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user && isEmailVerified(data.user)) {
        clearPendingVerifyEmail();
      }

      toast({
        title: "Welcome back",
        description: "You have successfully signed in.",
      });

      navigate(redirectTo.startsWith("/") ? redirectTo : "/");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Please check your credentials and try again";
      toast({
        title: "Error signing in",
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
        title="Sign In | Financial Professional"
        description="Sign in to your Financial Professional account."
        noIndex
      />
      <div className="auth-page__bg" aria-hidden="true">
        <div className="auth-page__orb auth-page__orb--1" />
        <div className="auth-page__orb auth-page__orb--2" />
      </div>

      <div className="auth-shell">
        <div className="auth-brand">
          <span className="keyline" />
          <p className="auth-eyebrow">Welcome back</p>
          <h1>
            Sign in to
            <br />
            <em>your account</em>
          </h1>
          <p className="auth-switch">
            New here?{" "}
            <Link to="/auth/signup">Create an account</Link>
          </p>
        </div>

        <div className="auth-panel">
          <form onSubmit={handleSignIn} className="auth-form">
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

            <div className="auth-field">
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                <label htmlFor="password">Password *</label>
                <Link to="/auth/forgot-password" className="auth-link" style={{ fontSize: "0.875rem" }}>
                  Forgot password?
                </Link>
              </div>
              <div className="auth-input-wrap auth-input-wrap--password">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="auth-input"
                  autoComplete="current-password"
                  required
                  aria-required="true"
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

            <div className="auth-actions">
              <button
                type="submit"
                className="btn btn--green btn--lg btn--full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in…" : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
