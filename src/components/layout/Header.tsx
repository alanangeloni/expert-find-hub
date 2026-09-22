import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserMenu from "@/components/auth/UserMenu";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header
      className={`header ${scrolled ? "header--scrolled" : ""} ${menuOpen ? "header--open" : ""}`}
    >
      <div className="header__inner dcontainer-wide">
        <Link to="/" className="header__logo" aria-label="Financial Professional home">
          <img
            src="https://wqtvpeuhjgqcjbdozzuv.supabase.co/storage/v1/object/public/website-wide-images//630a5745c93c976e2ba4b72d_Fin%20Pro%20Logo%20with%20words.png"
            alt="Financial Professional logo"
            className="h-8 md:h-9 w-auto"
          />
        </Link>

        <nav className="header__nav" aria-label="Primary">
          <Link
            to="/advisors"
            className={`header__link ${isActive("/advisors") ? "is-active" : ""}`}
          >
            Find Advisors
          </Link>
          <Link to="/firms" className={`header__link ${isActive("/firms") ? "is-active" : ""}`}>
            Browse Firms
          </Link>
          <Link to="/blog" className={`header__link ${isActive("/blog") ? "is-active" : ""}`}>
            Blog
          </Link>
          <a
            className="header__link"
            href="/#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              if (location.pathname !== "/") {
                navigate("/");
                setTimeout(
                  () => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }),
                  120
                );
              } else {
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            How it works
          </a>
        </nav>

        <div className="header__actions">
          <div className="header__user hidden md:block">
            <UserMenu />
          </div>
          <button
            type="button"
            className="btn btn--primary btn--sm header__cta"
            onClick={() => navigate("/advisors")}
          >
            Search advisors
          </button>
          <button
            className="header__burger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="header__mobile">
          <Link className="header__mobile-link" to="/advisors">
            Find Advisors
          </Link>
          <Link className="header__mobile-link" to="/firms">
            Browse Firms
          </Link>
          <Link className="header__mobile-link" to="/blog">
            Blog
          </Link>
          <Link className="header__mobile-link" to="/#how-it-works">
            How it works
          </Link>
          <div className="header__mobile-cta">
            <UserMenu />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
