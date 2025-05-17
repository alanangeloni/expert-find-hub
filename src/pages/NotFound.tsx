
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-brand-blue">404</h1>
        <p className="text-lg md:text-xl text-brand-blue text-opacity-80 mb-6">Oops! The page you're looking for doesn't exist</p>
        <p className="text-sm text-gray-600 mb-8">The page you are trying to access is not available or may have been moved.</p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-brand-blue hover:bg-opacity-90 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
