
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User, Settings, FileText, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching admin status:', error);
          return;
        }

        setIsAdmin(data?.is_admin || false);
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdminStatus();
  }, [user]);

  // If no user is logged in, show login/signup buttons
  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link to="/auth/signin">
          <Button variant="outline">Sign in</Button>
        </Link>
        <Link to="/auth/signup">
          <Button className="bg-mint-500 hover:bg-mint-600">Sign up</Button>
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
              to="/advisor-profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Your Profile
            </Link>
            {isAdmin && (
              <>
                <div className="border-t border-gray-100 my-1"></div>
                <Link
                  to="/admin/blog"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Blog Admin
                </Link>
                <Link
                  to="/admin/entities"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Entities Admin
                </Link>
              </>
            )}
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
