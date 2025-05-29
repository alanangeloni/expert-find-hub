import { Link } from "react-router-dom";
import UserMenu from "@/components/auth/UserMenu";

const Header = () => {
  return (
    <header className="bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="https://wqtvpeuhjgqcjbdozzuv.supabase.co/storage/v1/object/public/website-wide-images//630a5745c93c976e2ba4b72d_Fin%20Pro%20Logo%20with%20words.png" 
            alt="Financial Pro Logo" 
            className="h-10" 
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/advisors"
            className="text-gray-600 hover:text-brand-blue"
          >
            Financial Advisors
          </Link>
          <Link 
            to="/investment-firms"
            className="text-gray-600 hover:text-brand-blue"
          >
            Investment Firms
          </Link>
          <Link 
            to="/accounting-firms"
            className="text-gray-600 hover:text-brand-blue"
          >
            Accounting Firms
          </Link>
          <Link 
            to="/blog"
            className="text-gray-600 hover:text-brand-blue"
          >
            Blog
          </Link>
        </nav>

        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
