
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-8 md:space-y-0 md:flex-row md:justify-between">
          {/* Logo and Description */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <img 
              src="https://wqtvpeuhjgqcjbdozzuv.supabase.co/storage/v1/object/public/website-wide-images//Group%203%20(1).png" 
              alt="Expert Find Hub Logo" 
              className="h-8 md:h-10 mb-2 mx-auto md:mx-0" 
            />
            <p className="mt-2 text-gray-300 text-sm max-w-xs mx-auto md:mx-0">
              Connecting you with financial experts
            </p>
          </div>
          
          {/* Links Grid - Mobile Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-center md:text-left">
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3 md:mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/about" 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/blog" 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3 md:mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/firms" 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Investment Firms
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/faq" 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="sm:col-span-2 lg:col-span-1 hidden">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3 md:mb-4">
                Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/privacy" 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms" 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center md:flex md:items-center md:justify-between">
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Financial Adviser. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
