import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/auth/UserMenu";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
          <img 
            src="https://wqtvpeuhjgqcjbdozzuv.supabase.co/storage/v1/object/public/website-wide-images//630a5745c93c976e2ba4b72d_Fin%20Pro%20Logo%20with%20words.png" 
            alt="Financial Pro Logo" 
            className="h-8 md:h-10" 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/advisors" 
            className="text-gray-600 hover:text-brand-blue transition-colors"
          >
            Financial Advisors
          </Link>
          <Link 
            to="/firms" 
            className="text-gray-600 hover:text-brand-blue transition-colors"
          >
            Investment Firms
          </Link>
          <Link 
            to="/blog" 
            className="text-gray-600 hover:text-brand-blue transition-colors"
          >
            Blog
          </Link>
        </nav>

        {/* Desktop User Menu */}
        <div className="hidden md:block">
          <UserMenu />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <UserMenu />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="p-2"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <nav className="px-4 py-4 space-y-2">
            <Link 
              to="/advisors" 
              className="block py-2 text-gray-600 hover:text-brand-blue transition-colors"
              onClick={closeMobileMenu}
            >
              Financial Advisors
            </Link>
            <Link 
              to="/firms" 
              className="block py-2 text-gray-600 hover:text-brand-blue transition-colors"
              onClick={closeMobileMenu}
            >
              Investment Firms
            </Link>
            <Link 
              to="/blog" 
              className="block py-2 text-gray-600 hover:text-brand-blue transition-colors"
              onClick={closeMobileMenu}
            >
              Blog
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
