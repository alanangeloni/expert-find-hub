import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, User, Phone } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { EmailVerificationBanner } from "@/components/auth/EmailVerificationBanner";
import {
  isEmailVerified,
  setPendingVerifyEmail,
} from "@/lib/authHelpers";
import {
  ACCOUNTANT_PROFESSIONAL_TYPES,
  ACCOUNTANT_REGISTRATION_PATH,
  ADVISOR_REGISTRATION_PATH,
  resolveRegistrationPath,
  setStoredRegistrationPath,
} from "@/lib/registrationPaths";

const professionalTypes = [
  "Financial Advisor",
  "Wealth Manager",
  "Investment Advisor",
  "Financial Planner",
  "Tax Professional",
  "Retirement Specialist",
  "Insurance Agent",
  ...ACCOUNTANT_PROFESSIONAL_TYPES,
];

const SignUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const intent = searchParams.get("intent");
  const redirectParam = searchParams.get("redirect");

  const defaultProfessionalType =
    intent === "accountant" ? ACCOUNTANT_PROFESSIONAL_TYPES[0] : professionalTypes[0];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    professionalType: defaultProfessionalType,
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [termsError, setTermsError] = useState(false);

  const registrationPath = useMemo(
    () =>
      resolveRegistrationPath({
        redirect: redirectParam,
        intent,
        professionalType: formData.professionalType,
      }),
    [redirectParam, intent, formData.professionalType]
  );

  const isAccountantPath = registrationPath === ACCOUNTANT_REGISTRATION_PATH;

  useEffect(() => {
    setStoredRegistrationPath(registrationPath);
  }, [registrationPath]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    const next = checked === true;
    setFormData((prev) => ({ ...prev, agreeToTerms: next }));
    if (next) setTermsError(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      setTermsError(true);
      toast({
        title: "Agreement required",
        description: "Please agree to the Terms of Service and Privacy Policy to continue.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both password fields match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const destination = resolveRegistrationPath({
      redirect: redirectParam,
      intent,
      professionalType: formData.professionalType,
    });
    setStoredRegistrationPath(destination);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}${destination}`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone_number: formData.phoneNumber,
            professional_type: formData.professionalType,
          },
        },
      });

      if (error) throw error;

      // Supabase returns a user with empty identities when the email already exists
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        toast({
          title: "Account already exists",
          description: "Please sign in, or use forgot password if you need access.",
          variant: "destructive",
        });
        return;
      }

      setPendingVerifyEmail(formData.email);

      const verified = isEmailVerified(data.user);
      if (verified && data.session) {
        toast({
          title: "Welcome aboard",
          description: isAccountantPath
            ? "Your account is ready. Continue to your accountant profile."
            : "Your account is ready. Continue to your advisor profile.",
        });
        navigate(destination);
        return;
      }

      setPendingEmail(formData.email);
      toast({
        title: "Check your email",
        description: "Verify your address to finish listing your profile.",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An error occurred during signup";
      toast({
        title: "Error creating account",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInHref = `/auth/signin?redirect=${encodeURIComponent(registrationPath)}`;
  const profileNoun = isAccountantPath ? "accountant" : "advisor";

  if (pendingEmail) {
    return (
      <div className="auth-page page-enter">
        <Seo
          title="Verify your email | Financial Professional"
          description={`Verify your Financial Professional account email to continue ${profileNoun} registration.`}
          noIndex
        />
        <div className="auth-page__bg" aria-hidden="true">
          <div className="auth-page__orb auth-page__orb--1" />
          <div className="auth-page__orb auth-page__orb--2" />
        </div>
        <div className="auth-shell auth-shell--wide">
          <div className="auth-brand">
            <span className="keyline" />
            <p className="auth-eyebrow">Almost there</p>
            <h1>
              Verify your
              <br />
              <em>email address</em>
            </h1>
            <p>
              Your account was created. Confirm your email, then continue to list your public{" "}
              {profileNoun} profile.
            </p>
          </div>
          <div className="auth-panel">
            <EmailVerificationBanner email={pendingEmail} />
            <div className="auth-actions">
              <button
                type="button"
                className="btn btn--green btn--lg btn--full"
                onClick={() => navigate(registrationPath)}
              >
                Continue to {profileNoun} registration
              </button>
              <p className="auth-switch" style={{ textAlign: "center" }}>
                Already verified? <Link to={signInHref}>Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page page-enter">
      <Seo
        title="Create an Account | Financial Professional"
        description="Create a Financial Professional account to list your advisor or accountant profile and connect with clients."
        noIndex
      />
      <div className="auth-page__bg" aria-hidden="true">
        <div className="auth-page__orb auth-page__orb--1" />
        <div className="auth-page__orb auth-page__orb--2" />
      </div>

      <div className="auth-shell auth-shell--wide">
        <div className="auth-brand">
          <span className="keyline" />
          <p className="auth-eyebrow">
            {isAccountantPath ? "For accountants" : "For advisors"}
          </p>
          <h1>
            List your
            <br />
            <em>profile</em>
          </h1>
          <p className="auth-switch">
            Already have an account? <Link to={signInHref}>Sign in</Link>
          </p>
          {!isAccountantPath && (
            <p className="auth-switch" style={{ marginTop: "0.75rem" }}>
              Are you an accountant?{" "}
              <Link
                to={`/auth/signup?intent=accountant&redirect=${encodeURIComponent(ACCOUNTANT_REGISTRATION_PATH)}`}
              >
                Create an accountant profile
              </Link>
            </p>
          )}
          {isAccountantPath && (
            <p className="auth-switch" style={{ marginTop: "0.75rem" }}>
              Are you an advisor?{" "}
              <Link
                to={`/auth/signup?intent=advisor&redirect=${encodeURIComponent(ADVISOR_REGISTRATION_PATH)}`}
              >
                Create an advisor profile
              </Link>
            </p>
          )}
        </div>

        <div className="auth-panel">
          <form onSubmit={handleSignUp} className="auth-form" noValidate={false}>
            <div className="auth-form__grid auth-form__grid--2">
              <div className="auth-field">
                <label htmlFor="firstName">First name *</label>
                <div className="auth-input-wrap">
                  <User className="h-4 w-4" aria-hidden="true" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="auth-input"
                    required
                    aria-required="true"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Jordan"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="lastName">Last name *</label>
                <div className="auth-input-wrap">
                  <User className="h-4 w-4" aria-hidden="true" />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="auth-input"
                    required
                    aria-required="true"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Lee"
                  />
                </div>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="phoneNumber">Phone number</label>
              <div className="auth-input-wrap">
                <Phone className="h-4 w-4" aria-hidden="true" />
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  className="auth-input"
                  autoComplete="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="professionalType">I am a… *</label>
              <select
                id="professionalType"
                name="professionalType"
                className="auth-select"
                required
                aria-required="true"
                value={formData.professionalType}
                onChange={handleChange}
              >
                {professionalTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@firm.com"
                />
              </div>
            </div>

            <div className="auth-form__grid auth-form__grid--2">
              <div className="auth-field">
                <label htmlFor="password">Password *</label>
                <div className="auth-input-wrap auth-input-wrap--password">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="auth-input"
                    autoComplete="new-password"
                    required
                    aria-required="true"
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
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
                <label htmlFor="confirmPassword">Confirm password *</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  className="auth-input"
                  autoComplete="new-password"
                  required
                  aria-required="true"
                  minLength={8}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="auth-check">
              <Checkbox
                id="termsAndConditions"
                className="auth-check__control"
                checked={formData.agreeToTerms}
                onCheckedChange={handleCheckboxChange}
                required
                aria-required="true"
                aria-invalid={termsError || undefined}
                aria-describedby="terms-help"
              />
              <div className="auth-check__body">
                <label htmlFor="termsAndConditions" className="auth-check__label">
                  I agree to the Terms of Service and Privacy Policy *
                </label>
                <p id="terms-help">
                  Please review our{" "}
                  <Link to="/terms" target="_blank" rel="noopener noreferrer">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </Link>
                  .
                </p>
                {termsError && (
                  <p role="alert" style={{ color: "var(--orange-dark)", fontSize: "0.8125rem" }}>
                    You must agree before creating an account.
                  </p>
                )}
              </div>
            </div>

            <div className="auth-actions">
              <button
                type="submit"
                className="btn btn--green btn--lg btn--full"
                disabled={isLoading}
              >
                {isLoading ? "Creating account…" : "Create account"}
              </button>
            </div>
          </form>
          <p className="auth-trust">
            Free to create. Trusted directory of fiduciary professionals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
