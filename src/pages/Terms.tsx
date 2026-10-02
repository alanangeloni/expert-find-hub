import { Link } from "react-router-dom";
import { Seo } from "@/components/seo/Seo";

const Terms = () => {
  return (
    <div className="legal-page page-enter">
      <Seo
        title="Terms of Service | Financial Professional"
        description="Terms of Service for Financial Professional, the fiduciary advisor marketplace."
        canonicalUrl="https://financialprofessional.com/terms"
      />

      <div className="advisor-search__hero">
        <div className="dcontainer">
          <div className="advisor-search__hero-copy">
            <span className="keyline" />
            <p className="advisor-search__eyebrow">Legal</p>
            <h1>
              Terms of
              <br />
              <em>Service</em>
            </h1>
            <p className="advisor-search__sub">
              These terms govern your use of Financial Professional, including advisor and accountant
              signup, directory listings, and related services.
            </p>
            <p className="legal-updated">Last updated: October 2, 2026</p>
          </div>
        </div>
      </div>

      <div className="dcontainer">
        <article className="legal-body">
          <section>
            <h2>1. Acceptance of terms</h2>
            <p>
              By creating an account, listing a profile, or otherwise using Financial Professional
              (&quot;the Service&quot;), you agree to these Terms of Service and our{" "}
              <Link to="/privacy">Privacy Policy</Link>. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2>2. Who we are</h2>
            <p>
              Financial Professional is a marketplace and directory that helps people discover and
              connect with financial advisors and related professionals. We do not provide investment,
              tax, or legal advice, and we are not a registered investment adviser, broker-dealer, or
              law firm.
            </p>
          </section>

          <section>
            <h2>3. Accounts and eligibility</h2>
            <p>
              You must provide accurate registration information and keep your credentials secure.
              You are responsible for activity under your account. Advisor and firm listings must be
              submitted by an authorized representative of the practice being listed.
            </p>
          </section>

          <section>
            <h2>4. Advisor profiles and listings</h2>
            <p>
              When you submit a profile, you represent that the information is accurate, current, and
              not misleading. Profiles may be reviewed before publication and may be edited, suspended,
              or removed if they violate these terms, applicable law, or our quality standards.
              Listing on the Service does not constitute an endorsement of your advice, products, or
              performance.
            </p>
          </section>

          <section>
            <h2>5. Professional responsibilities</h2>
            <p>
              Advisors remain solely responsible for their regulatory registrations, disclosures,
              fiduciary or suitability obligations, advertising rules, and client relationships.
              Consumers should independently verify credentials (including via the SEC IAPD and other
              official sources) before engaging any professional.
            </p>
          </section>

          <section>
            <h2>6. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Misrepresent your identity, credentials, firm affiliation, or fee arrangements</li>
              <li>Upload unlawful, defamatory, or infringing content</li>
              <li>Scrape, spam, or interfere with the Service or other users</li>
              <li>Use the Service to solicit in ways prohibited by law or regulation</li>
            </ul>
          </section>

          <section>
            <h2>7. Intellectual property</h2>
            <p>
              The Service, branding, and platform content are owned by Financial Professional or its
              licensors. You retain ownership of content you submit, and grant us a non-exclusive
              license to host, display, and distribute that content as needed to operate the directory
              and related features.
            </p>
          </section>

          <section>
            <h2>8. Disclaimers</h2>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as available.&quot; We do not
              guarantee uninterrupted access, ranking outcomes, lead volume, or that any advisor match
              will meet your needs. To the fullest extent permitted by law, we disclaim warranties of
              merchantability, fitness for a particular purpose, and non-infringement.
            </p>
          </section>

          <section>
            <h2>9. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, Financial Professional and its affiliates will
              not be liable for indirect, incidental, special, consequential, or punitive damages, or
              for lost profits, data, or business opportunities arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2>10. Termination</h2>
            <p>
              We may suspend or terminate access for violations of these terms or to protect the
              Service and its users. You may stop using the Service at any time. Provisions that by
              their nature should survive will survive termination.
            </p>
          </section>

          <section>
            <h2>11. Changes</h2>
            <p>
              We may update these terms from time to time. Material changes will be reflected by an
              updated date on this page. Continued use after changes constitutes acceptance of the
              revised terms.
            </p>
          </section>

          <section>
            <h2>12. Contact</h2>
            <p>
              Questions about these terms can be directed through the contact options published on
              Financial Professional. For privacy-related requests, see our{" "}
              <Link to="/privacy">Privacy Policy</Link>.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
};

export default Terms;
