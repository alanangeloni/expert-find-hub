
import { Link } from "react-router-dom";
import UserMenu from "@/components/auth/UserMenu";

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-brand-blue">Financial Adviser</span>
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full hidden md:inline-block">Development</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-brand-blue">
            Home
          </Link>
          <Link to="/investment-firms" className="text-gray-600 hover:text-brand-blue">
            Investment Firms
          </Link>
          <Link to="/blog" className="text-gray-600 hover:text-brand-blue">
            Blog
          </Link>
        </nav>

        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
