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
          <Link 
            to="/app" 
            className="text-gray-600 hover:text-brand-blue transition-colors"
          >
            App
          </Link>
        </nav>

        {/* Desktop User Menu */}
        <div className="hidden md:block">
          <UserMenu />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="p-2 hover:bg-gray-100"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg z-40">
          <nav className="px-4 py-6 space-y-1">
            <Link 
              to="/advisors" 
              className="block py-3 px-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-md transition-colors font-medium"
              onClick={closeMobileMenu}
            >
              Financial Advisors
            </Link>
            <Link 
              to="/firms" 
              className="block py-3 px-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-md transition-colors font-medium"
              onClick={closeMobileMenu}
            >
              Investment Firms
            </Link>
            <Link 
              to="/blog" 
              className="block py-3 px-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-md transition-colors font-medium"
              onClick={closeMobileMenu}
            >
              Blog
            </Link>
            <Link 
              to="/app" 
              className="block py-3 px-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-md transition-colors font-medium"
              onClick={closeMobileMenu}
            >
              App
            </Link>
            <div className="pt-4 mt-4 border-t border-gray-100">
              <UserMenu />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
