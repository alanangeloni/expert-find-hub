import { Link } from "react-router-dom";
import { Seo } from "@/components/seo/Seo";

const Privacy = () => {
  return (
    <div className="advisor-search page-enter">
      <Seo
        title="Privacy Policy | Financial Professional"
        description="Privacy Policy explaining how Financial Professional collects, uses, and protects personal information."
        canonicalUrl="https://financialprofessional.com/privacy"
      />

      <div className="advisor-search__hero">
        <div className="dcontainer advisor-search__hero-row">
          <div className="advisor-search__hero-copy">
            <span className="keyline" />
            <p className="advisor-search__eyebrow">Legal</p>
            <h1>
              Privacy
              <br />
              <em>Policy</em>
            </h1>
            <p className="advisor-search__sub">
              This policy explains how Financial Professional collects, uses, and shares information
              when you use our advisor marketplace and related services.
            </p>
            <p className="legal-updated">Last updated: October 2, 2026</p>
          </div>
          <div className="advisor-search__hero-cta">
            <Link to="/terms" className="btn btn--outline btn--lg">
              Terms of Service
            </Link>
            <Link to="/advisors" className="btn btn--primary btn--lg">
              Browse advisors
            </Link>
          </div>
        </div>
      </div>

      <article className="dcontainer advisor-search__body legal-body">
        <section>
          <h2>1. Scope</h2>
          <p>
            This Privacy Policy applies to financialprofessional.com and related experiences we
            operate. By using the Service, you acknowledge the practices described here. Our{" "}
            <Link to="/terms">Terms of Service</Link> govern use of the platform.
          </p>
        </section>

        <section>
          <h2>2. Information we collect</h2>
          <p>We may collect:</p>
          <ul>
            <li>
              <strong>Account details</strong> — name, email, phone number, professional type, and
              authentication data
            </li>
            <li>
              <strong>Advisor profile content</strong> — firm information, bios, credentials,
              services, compensation details, and related listing data you submit
            </li>
            <li>
              <strong>Usage data</strong> — pages viewed, search queries, device/browser information,
              and approximate location derived from IP address
            </li>
            <li>
              <strong>Communications</strong> — messages you send us, newsletter preferences, and
              support requests
            </li>
          </ul>
        </section>

        <section>
          <h2>3. How we use information</h2>
          <p>We use information to:</p>
          <ul>
            <li>Create and secure accounts, including email verification</li>
            <li>Publish and operate advisor and firm directory listings</li>
            <li>Match consumers with professionals and improve search quality</li>
            <li>Send transactional messages (verification, password reset, listing status)</li>
            <li>Detect abuse, enforce policies, and comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>4. How we share information</h2>
          <p>
            Profile information you choose to publish is visible to visitors of the directory.
            We may share limited data with service providers who help us host, authenticate, email,
            analyze, or support the Service, under appropriate confidentiality obligations. We may
            disclose information if required by law or to protect the rights, safety, and integrity
            of Financial Professional and its users. We do not sell personal information.
          </p>
        </section>

        <section>
          <h2>5. Cookies and similar technologies</h2>
          <p>
            We use cookies and similar technologies for authentication, preferences, security, and
            analytics. You can control cookies through your browser settings; some features may not
            work if cookies are disabled.
          </p>
        </section>

        <section>
          <h2>6. Data retention</h2>
          <p>
            We retain account and listing information for as long as needed to provide the Service,
            meet legal requirements, resolve disputes, and enforce agreements. You may request
            deletion of your account subject to residual backup and legal retention needs.
          </p>
        </section>

        <section>
          <h2>7. Security</h2>
          <p>
            We use administrative, technical, and organizational safeguards designed to protect
            personal information. No method of transmission or storage is completely secure, and we
            cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>8. Your choices</h2>
          <p>
            Depending on your location, you may have rights to access, correct, delete, or restrict
            certain processing of your personal information, or to opt out of marketing emails.
            Account holders can update profile details through the Service where available.
          </p>
        </section>

        <section>
          <h2>9. Children</h2>
          <p>
            The Service is not directed to children under 16, and we do not knowingly collect
            personal information from them.
          </p>
        </section>

        <section>
          <h2>10. Changes</h2>
          <p>
            We may update this Privacy Policy periodically. The &quot;Last updated&quot; date at the
            top of this page reflects the latest revision. Continued use of the Service after changes
            means you acknowledge the updated policy.
          </p>
        </section>

        <section>
          <h2>11. Contact</h2>
          <p>
            For privacy questions or requests, contact Financial Professional through the channels
            published on our website.
          </p>
        </section>
      </article>
    </div>
  );
};

export default Privacy;
