import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AdvisorForm } from "@/components/advisor-registration/AdvisorRegistrationForm";
import { EmailVerificationBanner } from "@/components/auth/EmailVerificationBanner";
import { Seo } from "@/components/seo/Seo";
import {
  clearPendingVerifyEmail,
  getPendingVerifyEmail,
  getUserPrefill,
  isEmailVerified,
} from "@/lib/authHelpers";

const AdvisorRegistration = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setPendingEmail(getPendingVerifyEmail());
  }, []);

  useEffect(() => {
    if (user && isEmailVerified(user)) {
      clearPendingVerifyEmail();
      setPendingEmail("");
    }
  }, [user]);

  // When returning from email link, refresh user so email_confirmed_at is current
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    const maybeVerified =
      params.has("code") ||
      hash.includes("access_token") ||
      hash.includes("type=signup") ||
      hash.includes("type=email");

    if (!maybeVerified) return;

    let cancelled = false;
    (async () => {
      setRefreshing(true);
      await supabase.auth.getSession();
      const { data } = await supabase.auth.getUser();
      if (!cancelled && data.user && isEmailVerified(data.user)) {
        clearPendingVerifyEmail();
        setPendingEmail("");
      }
      if (!cancelled) setRefreshing(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const verified = isEmailVerified(user);
  const prefill = getUserPrefill(user);
  const bannerEmail = user?.email || pendingEmail || prefill.email;

  if (isLoading || refreshing) {
    return (
      <div className="onboard-page page-enter">
        <Seo
          title="Join as a Financial Advisor | Financial Professional"
          description="Register your advisory practice and get listed in the Financial Professional directory of vetted advisors."
          canonicalUrl="https://financialprofessional.com/advisor-registration"
        />
        <div className="onboard-loading">Loading your account…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="onboard-page page-enter">
        <Seo
          title="Join as a Financial Advisor | Financial Professional"
          description="Register your advisory practice and get listed in the Financial Professional directory of vetted advisors."
          canonicalUrl="https://financialprofessional.com/advisor-registration"
        />
        <section className="onboard-hero">
          <div className="onboard-hero__bg" aria-hidden="true">
            <div className="onboard-hero__orb onboard-hero__orb--1" />
            <div className="onboard-hero__orb onboard-hero__orb--2" />
          </div>
          <div className="dcontainer onboard-hero__content">
            <span className="keyline" />
            <p className="auth-eyebrow">For advisors</p>
            <h1>
              List your profile on
              <br />
              <em>Financial Professional</em>
            </h1>
            <p>
              Create an account, verify your email, and publish a transparent public profile clients
              can trust.
            </p>
          </div>
        </section>

        <div className="onboard-shell">
          <div className="onboard-panel">
            {pendingEmail ? (
              <>
                <EmailVerificationBanner email={pendingEmail} />
                <div className="onboard-gate">
                  <h2>Verify, then sign in</h2>
                  <p>
                    After you confirm <strong>{pendingEmail}</strong>, sign in to continue your
                    advisor registration.
                  </p>
                  <div className="onboard-gate__actions">
                    <Link
                      className="btn btn--green btn--lg"
                      to={`/auth/signin?redirect=${encodeURIComponent("/advisor-registration")}`}
                    >
                      Sign in
                    </Link>
                    <Link className="btn btn--outline btn--lg" to="/auth/signup">
                      Back to signup
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="onboard-gate">
                <h2>Sign in to continue</h2>
                <p>
                  You need an account before you can submit an advisor profile for review.
                </p>
                <div className="onboard-gate__actions">
                  <Link
                    className="btn btn--green btn--lg"
                    to={`/auth/signin?redirect=${encodeURIComponent("/advisor-registration")}`}
                  >
                    Sign in
                  </Link>
                  <Link className="btn btn--outline btn--lg" to="/auth/signup">
                    Create account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="onboard-page page-enter">
        <Seo
          title="Registration Submitted | Financial Professional"
          description="Your advisor profile has been submitted for review."
          noIndex
        />
        <section className="onboard-hero">
          <div className="onboard-hero__bg" aria-hidden="true">
            <div className="onboard-hero__orb onboard-hero__orb--1" />
            <div className="onboard-hero__orb onboard-hero__orb--2" />
          </div>
          <div className="dcontainer onboard-hero__content">
            <span className="keyline" />
            <p className="auth-eyebrow">Submitted</p>
            <h1>
              You’re in
              <br />
              <em>review</em>
            </h1>
            <p>
              Our team will review your information and typically follow up within 2–3 business
              days. You’ll be able to manage your public profile once approved.
            </p>
          </div>
        </section>
        <div className="onboard-shell">
          <div className="onboard-panel onboard-gate">
            <div className="onboard-gate__actions">
              <button type="button" className="btn btn--green btn--lg" onClick={() => navigate("/")}>
                Return home
              </button>
              <Link className="btn btn--outline btn--lg" to="/advisor-profile">
                View account profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="onboard-page page-enter">
      <Seo
        title="Join as a Financial Advisor | Financial Professional"
        description="Register your advisory practice and get listed in the Financial Professional directory of vetted advisors."
        canonicalUrl="https://financialprofessional.com/advisor-registration"
      />
      <section className="onboard-hero">
        <div className="onboard-hero__bg" aria-hidden="true">
          <div className="onboard-hero__orb onboard-hero__orb--1" />
          <div className="onboard-hero__orb onboard-hero__orb--2" />
        </div>
        <div className="dcontainer onboard-hero__content">
          <span className="keyline" />
          <p className="auth-eyebrow">Advisor onboarding</p>
          <h1>
            Build a profile clients
            <br />
            <em>can trust</em>
          </h1>
          <p>
            Transparent fees, credentials, and specialties — listed in a directory designed for
            serious matches, not lead spam.
          </p>
        </div>
      </section>

      <div className="onboard-shell">
        {!verified && (
          <EmailVerificationBanner
            email={bannerEmail}
            onResent={() => {
              if (bannerEmail) setPendingEmail(bannerEmail);
            }}
          />
        )}

        <div className={`onboard-panel${!verified ? " onboard-panel--blocked" : ""}`}>
          <div className="onboard-steps" aria-hidden="true">
            <div className="onboard-step-pill">
              <span>1</span> About you
            </div>
            <div className="onboard-step-pill">
              <span>2</span> Practice
            </div>
            <div className="onboard-step-pill">
              <span>3</span> Credentials
            </div>
            <div className="onboard-step-pill">
              <span>4</span> Review
            </div>
          </div>

          <div className="onboard-form-wrap" aria-disabled={!verified}>
            <AdvisorForm
              onSuccess={() => setIsSubmitted(true)}
              disabled={!verified}
              initialValues={{
                firstName: prefill.firstName,
                lastName: prefill.lastName,
                email: prefill.email,
                phoneNumber: prefill.phoneNumber,
                position: prefill.professionalType,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorRegistration;
