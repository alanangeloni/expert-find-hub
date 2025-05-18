
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // If no user is logged in, show login/signup buttons
  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link to="/auth/signin">
          <Button variant="outline">Sign in</Button>
        </Link>
        <Link to="/auth/signup">
          <Button>Sign up</Button>
        </Link>
      </div>
    );
  }

  // If user is logged in, show user menu
  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 rounded-full bg-gray-100 p-2 hover:bg-gray-200 focus:outline-none"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue text-white">
          <User className="h-5 w-5" />
        </div>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
            <div className="border-b px-4 py-2">
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
            </div>
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Your Profile
            </Link>
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                signOut();
                setIsMenuOpen(false);
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
