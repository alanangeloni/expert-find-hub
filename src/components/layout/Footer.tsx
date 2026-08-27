import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__top dcontainer">
        <div className="footer__brand">
          <div className="footer__logo">
            <img
              src="https://wqtvpeuhjgqcjbdozzuv.supabase.co/storage/v1/object/public/website-wide-images//Group%203%20(1).png"
              alt="Financial Professional logo"
              className="h-9 w-auto"
            />
          </div>
          <p className="footer__tagline">
            The modern way to find a fiduciary financial advisor who truly fits your life.
          </p>
        </div>

        <div className="footer__cols">
          <div className="footer__col">
            <h4>Explore</h4>
            <Link to="/advisors">Find advisors</Link>
            <Link to="/firms">Browse firms</Link>
            <Link to="/financial-professionals">Browse by state</Link>
            <Link to="/services">Browse by specialty</Link>
            <Link to="/#match">Matching quiz</Link>
            <Link to="/services/retirement-planning">Retirement specialists</Link>
          </div>
          <div className="footer__col">
            <h4>Specialties</h4>
            <Link to="/services/tax-planning">Tax planning</Link>
            <Link to="/services/small-business-planning">Business owners</Link>
            <Link to="/services/wealth-management">High net worth</Link>
            <Link to="/services/estate-trust-planning">Estate planning</Link>
          </div>
          <div className="footer__col">
            <h4>Company</h4>
            <Link to="/blog">Blog</Link>
            <Link to="/advisor-registration">For advisors</Link>
            <Link to="/auth/signin">Log in</Link>
          </div>
        </div>
      </div>

      <div className="footer__bottom dcontainer">
        <p>&copy; {new Date().getFullYear()} Financial Professional. All rights reserved.</p>
        <div className="footer__legal">
          <span>Connecting you with financial experts</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
